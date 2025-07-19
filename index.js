import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dataManager } from './utils/data-manager.js';
import { loadCommands } from './utils/command-loader.js';
import { settings } from './settings.js';

import { GoogleGenerativeAI } from '@google/generative-ai';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI
const ai = new GoogleGenerativeAI(settings.geminiApiKey);

// Bot state management
let botState = {
    isOn: true,
    isPublic: true,
    autoViewStatus: false,
    autoReact: false,
    chatbotEnabled: false,
    autoTyping: false,
    autoRecording: false,
    autoReadMessage: false,
    autoReactStatus: false,
    autoStatusEmoji: '♦️',
    autoDeleteAlert: false, // New feature for deleted message alerts
    ownerJid: null, // Store the actual owner JID for better recognition
    ownerJids: [], // Store multiple owner JIDs for better recognition
    bannedUsers: [] // Store banned user JIDs
};

// Message tracking for cooldown
const messageCooldown = new Map();

// Chat memory for the chatbot
const chatMemory = new Map();

// Load bot state
async function loadBotState() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/bot-state.json'), 'utf8');
        botState = { ...botState, ...JSON.parse(data) };
    } catch (error) {
        console.log('Creating new bot state file');
        await saveBotState();
    }
}

// Save bot state
async function saveBotState() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        await fs.writeFile(
            path.join(__dirname, 'data/bot-state.json'),
            JSON.stringify(botState, null, 2)
        );
    } catch (error) {
        console.error('Error saving bot state:', error);
    }
}



// Load commands
const commands = await loadCommands();

console.log('📋 Loaded', commands.length, 'commands total');

// Initialize data manager
global.dataManager = dataManager;
dataManager.startAutoSave();
console.log('💾 Data manager initialized with persistent storage');

// Initialize global Pokemon storage
if (!global.wildPokemon) global.wildPokemon = new Map();
if (!global.battles) global.battles = new Map();
if (!global.triviaGames) global.triviaGames = new Map();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(settings.geminiApiKey);

// Create session directory
const sessionDir = path.join(__dirname, 'session');
await fs.mkdir(sessionDir, { recursive: true });

// Setup auth state from base64 session data
let state, saveCreds;

try {
    // Try to load session from base64 data
    const sessionData = JSON.parse(Buffer.from(settings.sessionBase64, 'base64').toString());

    // Write session data to files
    await fs.writeFile(path.join(sessionDir, 'creds.json'), JSON.stringify(sessionData, null, 2));

    // Use multiFileAuthState
    const authState = await useMultiFileAuthState(sessionDir);
    state = authState.state;
    saveCreds = authState.saveCreds;

    console.log('✅ Session loaded from base64 data');
} catch (error) {
    console.log('⚠️ Failed to load session from base64, using multiFileAuthState:', error.message);
    // Fallback to normal multiFileAuthState
    const authState = await useMultiFileAuthState(sessionDir);
    state = authState.state;
    saveCreds = authState.saveCreds;
}

// Create logger
const logger = pino({ level: 'silent' });

// Main bot function
async function startBot() {
    // Close any existing connection first
    if (currentSocket) {
        try {
            currentSocket.end();
        } catch (error) {
            console.log('Error closing previous connection:', error.message);
        }
    }

    const sock = makeWASocket({
        auth: state,
        logger,
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        markOnlineOnConnect: false,
        syncFullHistory: false,
        fireInitQueries: true,
        generateHighQualityLinkPreview: false,
        getMessage: async (key) => {
            return {
                conversation: "Hello"
            }
        }
    });

    // Save credentials on update
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);

            if (shouldReconnect) {
                // Add delay before reconnecting to prevent conflicts
                console.log('⏳ Waiting 5 seconds before reconnecting...');
                setTimeout(async () => {
                    await startBot();
                }, 5000);
            }
        } else if (connection === 'connecting') {
            console.log('🔄 Connecting to WhatsApp...');
        } else if (connection === 'open') {
            console.log('✅ Bot connected successfully!');
            console.log(`
┌─────────────────────────────┐
│   🚀 yourhïghness v1.0 🚀   │
└─────────────────────────────┘

🟢 *CONNECTION ESTABLISHED*

╭─ 📊 SYSTEM STATUS ─╮
│ ✨ Bot Engine: ${botState.isOn ? '🟢 ONLINE' : '🔴 OFFLINE'}
│ 🌐 Access Mode: ${botState.isPublic ? '🌍 PUBLIC' : '🔒 PRIVATE'}
│ 👁️ Auto View: ${botState.autoViewStatus ? '✅ ENABLED' : '❌ DISABLED'}
│ 🤖 AI Chatbot: ${botState.chatbotEnabled ? '🧠 ACTIVE' : '😴 INACTIVE'}
│ ⌨️ Auto Typing: ${botState.autoTyping ? '✅ ON' : '❌ OFF'}
│ 🎤 Auto Record: ${botState.autoRecording ? '🎙️ ON' : '📵 OFF'}
│ 📖 Auto Read: ${botState.autoReadMessage ? '👀 ON' : '🙈 OFF'}
│ ⭐ Status React: ${botState.autoReactStatus ? '${botState.autoStatusEmoji} ON' : '❌ OFF'}
╰─────────────────────────╯

⚡ *ALL SYSTEMS OPERATIONAL*
🎯 Ready to dominate WhatsApp!
            `);

            // Extract and store owner JIDs for better recognition
            const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
            botState.ownerJids = [];

            // Add configured owners
            ownerNumbers.forEach(num => {
                const ownerPhoneNumber = extractPhoneNumber(num);
                if (ownerPhoneNumber) {
                    const ownerJid = `${ownerPhoneNumber}@s.whatsapp.net`;
                    botState.ownerJids.push(ownerJid);
                    console.log(`👑 Owner phone number stored: +${ownerPhoneNumber}`);
                }
            });

            // Auto-detect and add bot's own number as owner
            if (sock.user?.id) {
                const botJid = sock.user.id;
                const botPhoneNumber = extractPhoneNumber(botJid);

                if (botPhoneNumber) {
                    const botOwnerJid = `${botPhoneNumber}@s.whatsapp.net`;
                    if (!botState.ownerJids.includes(botOwnerJid) && !botState.ownerJids.includes(botJid)) {
                        botState.ownerJids.push(botOwnerJid);
                        botState.ownerJids.push(botJid); // Add both formats
                        console.log(`🤖 Bot auto-registered as owner: +${botPhoneNumber}`);
                    }
                }
            }

            // Auto-detect any other connected numbers and add as owners
            try {
                const connectedDevices = await sock.fetchPrivacySettings();
                console.log(`🔗 Auto-detecting connected numbers as owners...`);

                // Any number that can access the bot session should be considered owner
                const sessionNumbers = Object.keys(sock.authState.creds?.registration || {});
                sessionNumbers.forEach(num => {
                    const sessionPhoneNumber = extractPhoneNumber(num);
                    if (sessionPhoneNumber) {
                        const sessionJid = `${sessionPhoneNumber}@s.whatsapp.net`;
                        if (!botState.ownerJids.includes(sessionJid)) {
                            botState.ownerJids.push(sessionJid);
                            console.log(`📱 Auto-detected owner: +${sessionPhoneNumber}`);
                        }
                    }
                });
            } catch (error) {
                console.log('Could not auto-detect additional owners:', error.message);
            }

            // Keep backward compatibility
            botState.ownerJid = botState.ownerJids[0];
            await saveBotState();

            // Send connection notification to owner
            try {
                // Ensure proper JID format for owner
                const ownerJid = settings.ownerNumber.includes('@') ? settings.ownerNumber : `${settings.ownerNumber}@s.whatsapp.net`;
                await sock.sendMessage(ownerJid, {
                    text: `┌─────────────────────────────┐
│   🚀 yourhïghness v1.0 🚀   │
└─────────────────────────────┘

🟢 *CONNECTION ESTABLISHED*

╭─ 📊 SYSTEM STATUS ─╮
│ ✨ Bot Engine: ${botState.isOn ? '🟢 ONLINE' : '🔴 OFFLINE'}
│ 🌐 Access Mode: ${botState.isPublic ? '🌍 PUBLIC' : '🔒 PRIVATE'}
│ 👁️ Auto View: ${botState.autoViewStatus ? '✅ ENABLED' : '❌ DISABLED'}
│ 🤖 AI Chatbot: ${botState.chatbotEnabled ? '🧠 ACTIVE' : '😴 INACTIVE'}
│ ⌨️ Auto Typing: ${botState.autoTyping ? '✅ ON' : '❌ OFF'}
│ 🎤 Auto Record: ${botState.autoRecording ? '🎙️ ON' : '📵 OFF'}
│ 📖 Auto Read: ${botState.autoReadMessage ? '👀 ON' : '🙈 OFF'}
│ ⭐ Status React: ${botState.autoReactStatus ? `${botState.autoStatusEmoji} ON` : '❌ OFF'}
│ 🛡️ Security: ${botState.bannedUsers.length} banned users
╰─────────────────────────╯

╭─ 🎮 FEATURES READY ─╮
│ • Pokemon Battle System
│ • AI Image Generation
│ • Music & Media Download
│ • Group Management Tools
│ • 135+ Interactive Commands
╰─────────────────────────╯

⚡ *ALL SYSTEMS OPERATIONAL*
🎯 Ready to dominate WhatsApp! 

Type \`${settings.prefix}help\` to explore commands 🚀`,
                    contextInfo: {
                        externalAdReply: {
                            title: '⚡ yourhïghness v1.0 ⚡',
                            body: '🚀 Advanced WhatsApp Bot - All Systems Online',
                            thumbnailUrl: getRandomProfilePic(),
                            sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                });
            } catch (error) {
                console.error('Error sending connection notification:', error);
            }
        }
    });

    // Store messages for delete tracking
    const messageStore = new Map();

    // Handle message updates (including deletions)
    sock.ev.on('messages.update', async (updates) => {
        if (botState.autoDeleteAlert) {
            for (const update of updates) {
                if (update.update?.messageStubType === 68 || update.update?.messageStubType === 'REVOKE') {
                    const key = update.key;
                    const isGroup = key.remoteJid?.endsWith('@g.us');

                    // Only track DM deletions
                    if (!isGroup) {
                        const senderJid = key.remoteJid;
                        const storedMessage = messageStore.get(`${key.remoteJid}_${key.id}`);

                        if (storedMessage && senderJid !== settings.ownerNumber) {
                            try {
                                const senderPhone = extractPhoneNumber(senderJid);
                                const displayId = senderPhone ? `+${senderPhone}` : senderJid;

                                await sock.sendMessage(settings.ownerNumber, {
                                    text: `🗑️ *DELETED MESSAGE ALERT*\n\n👤 From: ${displayId}\n📱 JID: ${senderJid}\n⏰ Time: ${new Date().toLocaleString()}\n\n💬 Deleted Message:\n"${storedMessage.text || '[Media/Non-text message]'}"`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'Deleted Message Alert',
                                            body: 'Someone deleted a message',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            } catch (error) {
                                console.error('Error sending delete alert:', error);
                            }
                        }
                    }
                }
            }
        }
    });

    // Handle messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const isGroup = msg.key.remoteJid?.endsWith('@g.us');
        const from = msg.key.remoteJid;
        const senderJid = isGroup ? msg.key.participant : msg.key.remoteJid;

        const senderPhoneNumber = extractPhoneNumber(senderJid);

        const ownerPhoneNumber = extractPhoneNumber(settings.ownerNumber);

        // Enhanced owner recognition - check multiple sources
        const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
        let isOwner = false;

        // Check configured owners
        isOwner = ownerNumbers.some(num => {
            const numPhone = extractPhoneNumber(num);
            return (senderPhoneNumber && senderPhoneNumber === numPhone) || 
                   (senderPhoneNumber && senderPhoneNumber === ownerPhoneNumber) ||
                   senderJid === num; // Direct JID comparison for non-phone JIDs
        });

        // Check stored auto-detected owners
        if (!isOwner && botState.ownerJids) {
            isOwner = botState.ownerJids.some(ownerJid => {
                const ownerPhone = extractPhoneNumber(ownerJid);
                return (senderPhoneNumber && senderPhoneNumber === ownerPhone) || 
                       senderJid === ownerJid;
            });
        }

        // Check if sender is the bot itself (self-recognition)
        if (!isOwner && sock.user?.id) {
            const botJid = sock.user.id;
            const botPhone = extractPhoneNumber(botJid);
            isOwner = (senderJid === botJid) || 
                     (senderPhoneNumber && senderPhoneNumber === botPhone);
        }
        
        // Use original JID for messaging to handle all formats
        const sender = senderJid;
        const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

        // Store message for delete tracking (DM only)
        if (!isGroup && messageText && botState.autoDeleteAlert) {
            messageStore.set(`${from}_${msg.key.id}`, {
                text: messageText,
                timestamp: Date.now(),
                sender: senderJid
            });

            // Clean old messages (keep only last 100 per chat)
            const chatMessages = Array.from(messageStore.entries())
                .filter(([key, value]) => key.startsWith(from))
                .sort((a, b) => b[1].timestamp - a[1].timestamp);

            if (chatMessages.length > 100) {
                chatMessages.slice(100).forEach(([key, value]) => {
                    messageStore.delete(key);
                });
            }
        }

        // Filter status broadcasts and newsletter messages to reduce spam
        if (from === 'status@broadcast' || from?.includes('newsletter')) {
            return; // Skip processing status broadcasts and newsletters
        }

        // Log received messages for debugging
        const displayId = senderPhoneNumber ? `+${senderPhoneNumber}` : senderJid;
        console.log(`📨 Message from ${displayId}: ${messageText}`);

        // Check if bot is off (but always allow owner commands)
        if (!botState.isOn && !isOwner) return;

        // Check if bot is talking to itself for enhanced owner privileges
        const isBotSelf = sock.user?.id && (senderJid === sock.user.id || 
                         (senderPhoneNumber && senderPhoneNumber === extractPhoneNumber(sock.user.id)));
        
        // Enhanced owner detection - bot talking to itself should have owner privileges
        if (isBotSelf && !isOwner) {
            isOwner = true;
            console.log(`🤖 Bot self-recognition: Granting owner privileges to ${senderJid}`);
        }
        
        // Allow in private mode if: owner, group chat, or bot talking to itself
        if (!botState.isPublic && !isOwner && !isGroup && !isBotSelf) return;

        // Check if user is banned (but don't ban the bot itself)
        if (botState.bannedUsers.includes(senderJid) && !isBotSelf) {
            console.log(`Blocked message from banned user: ${senderJid}`);
            return;
        }

        // Auto read messages
        if (botState.autoReadMessage) {
            try {
                await sock.readMessages([msg.key]);
            } catch (error) {
                console.error('Error reading message:', error);
            }
        }

        // Auto typing feature (skip for bot self to prevent loops)
        if (botState.autoTyping && !isBotSelf) {
            try {
                await sock.sendPresenceUpdate('composing', from);
                setTimeout(async () => {
                    try {
                        await sock.sendPresenceUpdate('paused', from);
                    } catch (error) {
                        console.error('Error stopping typing:', error);
                    }
                }, 3000);
            } catch (error) {
                console.error('Error sending typing indicator:', error);
            }
        }

        // Auto recording feature (skip for bot self to prevent loops)
        if (botState.autoRecording && !isBotSelf) {
            try {
                await sock.sendPresenceUpdate('recording', from);
                setTimeout(async () => {
                    try {
                        await sock.sendPresenceUpdate('paused', from);
                    } catch (error) {
                        console.error('Error stopping recording:', error);
                    }
                }, 5000);
            } catch (error) {
                console.error('Error sending recording indicator:', error);
            }
        }

        // Auto react feature  
        if (botState.autoReact && !isBotSelf) {
            const reactions = ['❤️', '😊', '👍', '🔥', '💯', '⭐', '🎉'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            try {
                await sock.sendMessage(from, {
                    react: {
                        text: randomReaction,
                        key: msg.key
                    }
                });
            } catch (error) {
                console.error('Error sending reaction:', error);
            }
        }

        // Check for trivia answers first (before command processing)
        if (messageText.match(/^[ABCD]$/i)) {
            try {
                const { handleTriviaAnswer } = await import('./commands/trivia.js');
                const handled = handleTriviaAnswer(sock, msg, messageText, {
                    from: sender,
                    sender: sender
                });
                if (handled) return; // Exit if trivia answer was handled
            } catch (error) {
                // Trivia module not available or error, continue
            }
        }

        // Handle GitHub update commands with => prefix
        if (messageText.startsWith('=>')) {
            if (!isOwner) {
                await sock.sendMessage(from, {
                    react: { text: '❌', key: msg.key }
                });
                return;
            }

            const gitCommand = messageText.slice(2).trim().toLowerCase();
            const gitArgs = messageText.slice(2).trim();

            // Create context for git command
            const gitContext = {
                from: from,
                sender: sender,
                senderJid: senderJid,
                senderPhoneNumber: senderPhoneNumber || null,
                isOwner: isOwner,
                isGroup: isGroup,
                settings: settings,
                botState: botState,
                extractPhoneNumber: extractPhoneNumber
            };

            // Load and execute git update command
            try {
                const { command: gitUpdateCommand } = await import('./horlapookie/gitupdate.js');
                await gitUpdateCommand.execute(sock, msg, gitArgs, gitContext);
            } catch (error) {
                console.error('Error executing git update command:', error);
                await sock.sendMessage(from, {
                    text: '❌ Git update command failed: ' + error.message
                });
            }
            return;
        }

        // Handle terminal commands with $ prefix
        if (messageText.startsWith('$')) {
            if (!isOwner) {
                await sock.sendMessage(from, {
                    react: { text: '❌', key: msg.key }
                });
                return;
            }

            const terminalArgs = messageText.slice(1).trim();

            // Create context for terminal command
            const terminalContext = {
                from: from,
                sender: sender,
                senderJid: senderJid,
                senderPhoneNumber: senderPhoneNumber || null,
                isOwner: isOwner,
                isGroup: isGroup,
                settings: settings,
                botState: botState,
                extractPhoneNumber: extractPhoneNumber
            };

            // Load and execute terminal command
            try {
                const { command: terminalCommand } = await import('./horlapookie/terminal.js');
                await terminalCommand.execute(sock, msg, terminalArgs, terminalContext);
            } catch (error) {
                console.error('Error executing terminal command:', error);
                await sock.sendMessage(from, {
                    text: '❌ Terminal command failed: ' + error.message
                });
            }
            return;
        }

        // Auto-add any new number that successfully executes owner commands
        if (!isOwner && messageText.startsWith(settings.prefix)) {
            const commandName = messageText.slice(settings.prefix.length).split(' ')[0].toLowerCase();
            const ownerOnlyCommands = ['on', 'off', 'public', 'private', 'autoview', 'autoreact', 'chatbot', 'ban', 'unban', 'block', 'unblock'];

            if (ownerOnlyCommands.includes(commandName)) {
                // This will be checked later in owner command execution
                // If they have access, they'll be auto-added as owner
            }
        }

        // Handle commands
        if (messageText.startsWith(settings.prefix)) {
            const commandName = messageText.slice(settings.prefix.length).split(' ')[0].toLowerCase();
            const args = messageText.slice(settings.prefix.length + commandName.length).trim();

            // Owner-only hardcoded commands
            if (isOwner) {
                switch (commandName) {
                    case 'on':
                        // Auto-add this number as owner if not already
                        if (!botState.ownerJids.includes(senderJid)) {
                            botState.ownerJids.push(senderJid);
                            console.log(`🔥 Auto-added new owner: ${senderJid}`);
                        }

                        botState.isOn = true;
                        await saveBotState();
                        await sock.sendMessage(from, {
                            text: '✅ Bot is now ON',
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363303245919343@newsletter',
                                    newsletterName: 'yourhïghness Bot Channel',
                                    serverMessageId: Math.floor(Math.random() * 1000000)
                                },
                                externalAdReply: {
                                    title: '🤖 yourhïghness Bot',
                                    body: 'Tap to join our channel',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                                    mediaType: 1,
                                    renderLargerThumbnail: false,
                                    showAdAttribution: false,
                                    containsAutoReply: true
                                }
                            }
                        });
                        return;

                    case 'off':
                        botState.isOn = false;
                        await saveBotState();
                        await sock.sendMessage(from, {
                            text: '❌ Bot is now OFF',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Bot Status',
                                    body: 'Bot deactivated',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'public':
                        botState.isPublic = true;
                        await saveBotState();
                        await sock.sendMessage(from, {
                            text: '🌐 Bot is now in PUBLIC mode',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Bot Mode',
                                    body: 'Public mode activated',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'private':
                        botState.isPublic = false;
                        await saveBotState();
                        await sock.sendMessage(from, {
                            text: '🔒 Bot is now in PRIVATE mode',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Bot Mode',
                                    body: 'Private mode activated',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'autoview':
                        if (args === 'on') {
                            botState.autoViewStatus = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '👀 Auto view status is now ON',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto View Status',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.autoViewStatus = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🙈 Auto view status is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto View Status',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autoview on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto View Status',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'autoreact':
                        if (args === 'on') {
                            botState.autoReact = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '💫 Auto react is now ON',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto React',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.autoReact = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '😴 Auto react is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto React',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autoreact on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto React',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;



                    // Secret bug commands (owner only)
                    case 'ioskill':
                        await sock.sendMessage(from, {
                            text: '💥 iOS Kill Command Executed\n\n⚠️ This is a demonstration command for educational purposes only.',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'iOS Kill Command',
                                    body: 'Educational demonstration',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'uifreeze':
                        await sock.sendMessage(from, {
                            text: '🧊 UI Freeze Command Executed\n\n⚠️ This is a demonstration command for educational purposes only.',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'UI Freeze Command',
                                    body: 'Educational demonstration',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'spam':
                        await sock.sendMessage(from, {
                            text: '📧 Spam Command Executed\n\n⚠️ This is a demonstration command for educational purposes only.',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Spam Command',
                                    body: 'Educational demonstration',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'bugtest':
                        await sock.sendMessage(from, {
                            text: '🐛 Bug Test Command Executed\n\n⚠️ This is a demonstration command for educational purposes only.',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Bug Test Command',
                                    body: 'Educational demonstration',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'crashtest':
                        await sock.sendMessage(from, {
                            text: '💥 Crash Test Command Executed\n\n⚠️ This is a demonstration command for educational purposes only.',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Crash Test Command',
                                    body: 'Educational demonstration',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });
                        return;

                    case 'autotyping':
                        if (args === 'on') {
                            botState.autoTyping = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '⌨️ Auto typing is now ON',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Typing',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.autoTyping = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '⌨️ Auto typing is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Typing',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autotyping on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Typing',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'autorecording':
                        if (args === 'on') {
                            botState.autoRecording = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🎤 Auto recording is now ON',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Recording',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.autoRecording = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🎤 Auto recording is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Recording',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autorecording on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Recording',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'autoread':
                    case 'autoreadmessage':
                        if (args === 'on') {
                            botState.autoReadMessage = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '👁️ Auto read message is now ON',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Read Message',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.autoReadMessage = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '👁️ Auto read message is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Read Message',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autoread on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Read Message',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'autodel':
                        if (args === 'on') {
                            botState.autoDeleteAlert = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🗑️ Auto delete alert is now ON\n\nI will notify you when someone deletes messages in DM.',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Delete Alert',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.autoDeleteAlert = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🗑️ Auto delete alert is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Delete Alert',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autodel on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Delete Alert',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'chatbot':
                        if (args === 'on') {
                            botState.chatbotEnabled = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🤖 Chatbot is now ON (DM only)',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Chatbot',
                                        body: 'AI chatbot activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'off') {
                            botState.chatbotEnabled = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '🤖 Chatbot is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Chatbot',
                                        body: 'AI chatbot deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'girl' || args === 'lady') {
                            botState.chatbotEnabled = true;
                            await saveBotState();
                            // Set personality for all users
                            for (let [key, value] of chatMemory.entries()) {
                                value.personality = 'girl';
                                chatMemory.set(key, value);
                            }
                            await sock.sendMessage(from, {
                                text: '👩 Chatbot is now ON with GIRL personality mode\n\nI\'ll respond in a sweet, caring feminine way! 💕',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Chatbot - Girl Mode',
                                        body: 'Feminine AI personality activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'boy' || args === 'man') {
                            botState.chatbotEnabled = true;
                            await saveBotState();
                            // Set personality for all users
                            for (let [key, value] of chatMemory.entries()) {
                                value.personality = 'boy';
                                chatMemory.set(key, value);
                            }
                            await sock.sendMessage(from, {
                                text: '👨 Chatbot is now ON with BOY personality mode\n\nI\'ll respond in a cool, confident masculine way! 😎',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Chatbot - Boy Mode',
                                        body: 'Masculine AI personality activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: chatbot on/off/girl/lady/boy/man',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Chatbot',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'autoreactstatus':
                        if (args === 'on') {
                            botState.autoReactStatus = true;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: `✨ Auto react status is now ON\n\nUsing emoji: ${botState.autoStatusEmoji}`,
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto React Status',
                                        body: 'Feature activated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
});
                        } else if (args === 'off') {
                            botState.autoReactStatus = false;
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: '✨ Auto react status is now OFF',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto React Status',
                                        body: 'Feature deactivated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: autoreactstatus on/off',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto React Status',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'autostatusemoji':
                        if (args.trim()) {
                            botState.autoStatusEmoji = args.trim();
                            await saveBotState();
                            await sock.sendMessage(from, {
                                text: `✨ Auto status emoji set to: ${botState.autoStatusEmoji}`,
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Status Emoji',
                                        body: 'Emoji updated',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: `❓ Usage: autostatusemoji <emoji>\n\nCurrent emoji: ${botState.autoStatusEmoji}`,
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Auto Status Emoji',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'ban':
                        if (args.trim()) {
                            const targetJid = args.trim().replace('@', '') + '@s.whatsapp.net';
                            if (!botState.bannedUsers.includes(targetJid)) {
                                botState.bannedUsers.push(targetJid);
                                await saveBotState();
                                await sock.sendMessage(from, {
                                    text: `🚫 User ${args.trim()} has been banned`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'User Banned',
                                            body: 'User access revoked',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            } else {
                                await sock.sendMessage(from, {
                                    text: `⚠️ User ${args.trim()} is already banned`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'Already Banned',
                                            body: 'User already in ban list',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            }
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: ban <user_number>\n\nExample: ban 1234567890',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Ban User',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'unban':
                        if (args.trim()) {
                            const targetJid = args.trim().replace('@', '') + '@s.whatsapp.net';
                            const index = botState.bannedUsers.indexOf(targetJid);
                            if (index > -1) {
                                botState.bannedUsers.splice(index, 1);
                                await saveBotState();
                                await sock.sendMessage(from, {
                                    text: `✅ User ${args.trim()} has been unbanned`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'User Unbanned',
                                            body: 'User access restored',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            } else {
                                await sock.sendMessage(from, {
                                    text: `⚠️ User ${args.trim()} is not banned`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'Not Banned',
                                            body: 'User not in ban list',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            }
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: unban <user_number>\n\nExample: unban 1234567890',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Unban User',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'block':
                        if (args.trim()) {
                            const targetJid = args.trim().includes('@') ? args.trim() : args.trim() + '@s.whatsapp.net';
                            try {
                                await sock.updateBlockStatus(targetJid, 'block');
                                await sock.sendMessage(from, {
                                    text: `🚫 Successfully blocked ${args.trim()}`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'User Blocked',
                                            body: 'Contact blocked successfully',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            } catch (error) {
                                await sock.sendMessage(from, {
                                    text: `❌ Failed to block ${args.trim()}: ${error.message}`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'Block Failed',
                                            body: 'Error blocking contact',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            }
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: block <number>\n\nExample: block 1234567890',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Block User',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'unblock':
                        if (args.trim()) {
                            const targetJid = args.trim().includes('@') ? args.trim() : args.trim() + '@s.whatsapp.net';
                            try {
                                await sock.updateBlockStatus(targetJid, 'unblock');
                                await sock.sendMessage(from, {
                                    text: `✅ Successfully unblocked ${args.trim()}`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'User Unblocked',
                                            body: 'Contact unblocked successfully',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            } catch (error) {
                                await sock.sendMessage(from, {
                                    text: `❌ Failed to unblock ${args.trim()}: ${error.message}`,
                                    contextInfo: {
                                        externalAdReply: {
                                            title: 'Unblock Failed',
                                            body: 'Error unblocking contact',
                                            thumbnailUrl: getRandomProfilePic(),
                                            sourceUrl: 'https://github.com',
                                            mediaType: 1,
                                            renderLargerThumbnail: false
                                        }
                                    }
                                });
                            }
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: unblock <number>\n\nExample: unblock 1234567890',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Unblock User',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;

                    case 'chatmemory':
                        if (args === 'clear') {
                            chatMemory.clear();
                            await sock.sendMessage(from, {
                                text: '🧠 All chatbot memories cleared',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Memory Management',
                                        body: 'All conversations reset',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else if (args === 'stats') {
                            const totalUsers = chatMemory.size;
                            const totalMessages = Array.from(chatMemory.values())
                                .reduce((sum, memory) => sum + memory.messages.length, 0);

                            await sock.sendMessage(from, {
                                text: `🧠 *Chatbot Memory Stats*\n\n👥 Active Users: ${totalUsers}\n💬 Total Messages: ${totalMessages}\n⏰ Memory Duration: 24 hours`,
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Memory Statistics',
                                        body: 'Chatbot analytics',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: chatmemory clear/stats',
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Memory Management',
                                        body: 'Usage help',
                                        thumbnailUrl: getRandomProfilePic(),
                                        sourceUrl: 'https://github.com',
                                        mediaType: 1,
                                        renderLargerThumbnail: false
                                    }
                                }
                            });
                        }
                        return;
                }
            }

            // Check if command exists
            const command = commands.find(cmd => 
                cmd.name === commandName || 
                (cmd.aliases && cmd.aliases.includes(commandName))
            );

            if (command) {
                // Execute command
                try {
                    // Enhanced context with better admin detection
                    const isGroup = msg.key.remoteJid.endsWith('@g.us');
                    let isAdmin = false;
                    let isBotAdmin = false;
                    let groupMetadata = null;

                    if (isGroup) {
                        try {
                            groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
                            const participants = groupMetadata.participants;
                            const senderParticipant = participants.find(p => p.id === sender);

                            // Better bot JID detection
                            const botJid = sock.user?.id;
                            const botPhone = extractPhoneNumber(botJid);
                            const botParticipant = participants.find(p => {
                                const participantPhone = extractPhoneNumber(p.id);
                                return p.id === botJid || participantPhone === botPhone;
                            });

                            isAdmin = senderParticipant?.admin === 'admin' || senderParticipant?.admin === 'superadmin';
                            isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';

                            console.log(`Admin check - Sender: ${isAdmin}, Bot: ${isBotAdmin}, BotJID: ${botJid}, BotParticipant: ${botParticipant?.id}`);
                        } catch (error) {
                            console.error('Error fetching group metadata:', error);
                        }
                    }
                    const context = {
                        from: from,
                        sender: sender,
                        senderJid: senderJid,
                        senderPhoneNumber: senderPhoneNumber || null, // Can be null for non-phone JIDs
                        isOwner: isOwner,
                        isGroup: isGroup,
                        isAdmin: isAdmin,
                        isBotAdmin: isBotAdmin,
                        groupMetadata: groupMetadata,
                        settings: settings,
                        botState: botState,
                        extractPhoneNumber: extractPhoneNumber // Make function available to commands
                    };
                    // Store original sendMessage function
                    const originalSendMessage = sock.sendMessage;

                    // Override sendMessage to add channel context
                    sock.sendMessage = function(jid, content, options = {}) {
                        // Add channel context to all messages as forwarded channel share
                        if (content && typeof content === 'object') {
                            content.contextInfo = {
                                ...content.contextInfo,
                                // Make it appear as a forwarded message from channel
                                forwardingScore: 1,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "120363346203789206@newsletter",
                                    newsletterName: "Pookie Bot Updates",
                                    serverMessageId: 1
                                },
                                externalAdReply: {
                                    title: "Pookie Bot",
                                    body: "Join our channel for updates",
                                    mediaType: 1,
                                    sourceUrl: "https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01",
                                    thumbnailUrl: "https://files.catbox.moe/bh2fpj.jpg"
                                },
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363303245919343@newsletter',
                                    newsletterName: 'yourhïghness Bot Channel',
                                    serverMessageId: Math.floor(Math.random() * 1000000)
                                },
                                externalAdReply: {
                                    title: '🤖 yourhïghness Bot',
                                    body: 'Official Bot Channel',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                                    mediaType: 1,
                                    renderLargerThumbnail: false,
                                    showAdAttribution: false,
                                    containsAutoReply: true
                                }
                            };
                        }
                        return originalSendMessage.call(this, jid, content, options);
                    };

                    await command.execute(sock, msg, args, context);

                    // Restore original sendMessage function
                    sock.sendMessage = originalSendMessage;
                } catch (error) {
                    console.error(`Error executing command ${commandName}:`, error);

                    // Only send error message if not on error cooldown
                    if (!messageCooldown.has(`${sender}_cmd_error`)) {
                        messageCooldown.set(`${sender}_cmd_error`, Date.now());
                        await sock.sendMessage(from, {
                            text: `❌ Error executing command: ${error.message}`,
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Command Error',
                                    body: 'Execution failed',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        });

                        // Clear command error flag after 30 seconds
                        setTimeout(() => {
                            messageCooldown.delete(`${sender}_cmd_error`);
                        }, 30000);
                    }
                }
            } else {
                // Unknown command
                await sock.sendMessage(from, {
                    text: `❌ Unknown command: "${commandName}"\nType ${settings.prefix}help to see available commands`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Unknown Command',
                            body: 'Tap to join our official channel',
                            thumbnailUrl: getRandomProfilePic(),
                            sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            }
        } else if (botState.chatbotEnabled && !isGroup && messageText.trim() !== '') {
            // Chatbot feature for DMs only - with cooldown and error handling
            // Allow bot to respond to itself when chatbot is enabled

            // Check for cooldown to prevent spam (longer cooldown for bot self-messages)
            const cooldownTime = isBotSelf ? 5000 : 10000; // 5s for self, 10s for others
            if (isOnCooldown(sender, cooldownTime)) {
                return; // Silently ignore if on cooldown
            }

            // Only respond to messages longer than 2 characters to avoid spam
            if (messageText.length < 3) {
                return;
            }

            // Get chat history for the user
            let chatHistory = chatMemory.get(sender) || { messages: [], personality: 'default' };

            // Add the user's message to the chat history
            chatHistory.messages.push({ role: 'user', content: messageText });

            // Limit chat history to the last 8 messages to prevent excessive memory usage
            if (chatHistory.messages.length > 8) {
                chatHistory.messages = chatHistory.messages.slice(-8);
            }

            // Save the updated chat history
            chatMemory.set(sender, chatHistory);

            // Send typing indicator
            try {
                await sock.sendPresenceUpdate('composing', from);
            } catch (error) {
                console.error('Error sending typing indicator:', error);
            }

            try {
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

                // Get personality setting
                const personality = chatHistory.personality || 'default';

                // Construct personality-based prompt
                let basePrompt = '';
                switch (personality) {
                    case 'girl':
                    case 'lady':
                        basePrompt = `You are a friendly, sweet, and caring girl assistant. You speak in a feminine, gentle way with emojis. You're supportive, empathetic, and use expressions like "sweetie", "honey", or "dear" occasionally. Keep responses brief and helpful.`;
                        break;
                    case 'boy':
                    case 'man':
                        basePrompt = `You are a cool, confident guy assistant. You speak in a masculine, casual way. You're direct, helpful, and use expressions like "bro", "dude", or "mate" occasionally. Keep responses brief and to the point.`;
                        break;
                    default:
                        basePrompt = `You are a helpful WhatsApp bot assistant. Keep responses brief and helpful.`;
                        break;
                }

                // Construct the prompt with chat history
                let prompt = `${basePrompt}\n\nHere's the chat history:\n`;
                chatHistory.messages.forEach(message => {
                    prompt += `${message.role}: ${message.content}\n`;
                });
                prompt += `\nRespond to the last message naturally and stay in character.`;

                const response = await model.generateContent(prompt);
                const reply = response.response?.text() || "I'm sorry, I couldn't process that message.";

                // Add the bot's reply to the chat history
                chatHistory.messages.push({ role: 'assistant', content: reply });
                chatMemory.set(sender, chatHistory);

                await sock.sendMessage(from, {
                    text: reply,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363303245919343@newsletter',
                            newsletterName: 'yourhïghness Bot Channel',
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: '🤖 yourhïghness Bot',
                            body: 'Tap to join our channel',
                            thumbnailUrl: getRandomProfilePic(),
                            sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                            mediaType: 1,
                            renderLargerThumbnail: false,
                            showAdAttribution: false,
                            containsAutoReply: true
                        }
                    }
                });
            } catch (error) {
                console.error('Chatbot error:', error);
                // Retry mechanism
                try {
                    await sock.sendMessage(from, {
                        text: "Sorry, I'm having trouble responding right now. Please try again in a moment! 😅"
                    });
                } catch (retryError) {
                    console.error('Failed to send error message:', retryError);
                }
            } finally {
                 // Ensure typing indicator is stopped
                 try {
                    await sock.sendPresenceUpdate('paused', from);
                } catch (error) {
                    console.error('Error stopping typing indicator:', error);
                }
            }
        }
    });

    // Handle status updates for auto view and react
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (msg.key.remoteJid === 'status@broadcast') {
            // Auto view status
            if (botState.autoViewStatus) {
                try {
                    await sock.readMessages([msg.key]);
                } catch (error) {
                    console.error('Error viewing status:', error);
                }
            }

            // Auto react to status
            if (botState.autoReactStatus) {
                try {
                    await sock.sendMessage('status@broadcast', {
                        react: {
                            text: botState.autoStatusEmoji,
                            key: msg.key
                        }
                    });
                } catch (error) {
                    console.error('Error reacting to status:', error);
                }
            }
        }
    });

    // Handle group participants update (member join/leave)
    sock.ev.on('group-participants.update', async (update) => {
        console.log('Group participants update:', update);

        const { id: groupId, participants, action } = update;

        // Initialize group settings if not exists
        if (!global.groupSettings) global.groupSettings = new Map();
        const groupConfig = global.groupSettings.get(groupId) || {};

        try {
            if (action === 'add' && groupConfig.welcomeEnabled) {
                // Handle welcome messages
                const groupMetadata = await sock.groupMetadata(groupId);

                for (const participantId of participants) {
                    const welcomeMsg = groupConfig.welcomeMessage || `🎉 **Welcome to the group!**\n\nHi @user, welcome to {group}!\n\n📋 Please:\n• Read the group rules\n• Introduce yourself\n• Be respectful to everyone\n\n🤖 Enjoy your stay!`;

                    const personalizedMessage = welcomeMsg
                        .replace('{group}', groupMetadata.subject)
                        .replace('{name}', participantId.split('@')[0]);

                    await sock.sendMessage(groupId, {
                        text: personalizedMessage.replace('@user', `@${participantId.split('@')[0]}`),
                        mentions: [participantId],
                        contextInfo: {
                            externalAdReply: {
                                title: '🎉 Welcome to the Group!',
                                body: `${groupMetadata.subject} • ${groupMetadata.participants.length} members`,
                                thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                }
            } else if (action === 'remove' && groupConfig.leaveEnabled) {
                // Handle leave messages
                const groupMetadata = await sock.groupMetadata(groupId);

                for (const participantId of participants) {
                    const leaveMsg = groupConfig.leaveMessage || `👋 **Member Left**\n\n{name} has left {group}.\n\n📊 Group now has {count} members.\n\n🤝 Thanks for being part of our community!`;

                    const personalizedMessage = leaveMsg
                        .replace('{group}', groupMetadata.subject)
                        .replace('{name}', participantId.split('@')[0])
                        .replace('{count}', groupMetadata.participants.length.toString());

                    await sock.sendMessage(groupId, {
                        text: personalizedMessage,
                        contextInfo: {
                            externalAdReply: {
                                title: '👋 Member Departed',
                                body: `${groupMetadata.subject} • ${groupMetadata.participants.length} members`,
                                thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error handling group participant update:', error);
        }
    });

    // Handle connection errors
    sock.ev.on('creds.update', saveCreds);
    
    // Handle unexpected disconnections
    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
        console.log('Uncaught Exception:', error);
    });

    // Store socket reference
    currentSocket = sock;
    return sock;
}

// Get random profile picture
function getRandomProfilePic() {
    const pics = settings.profilePics;
    return pics[Math.floor(Math.random() * pics.length)];
}

// Extract real phone number from JID - Only returns valid phone numbers
function extractPhoneNumber(jid) {
    if (!jid) return null;

    console.log(`[Debug] Extracting phone number from JID: ${jid}`);

    let phoneNumber = null;

    // For LID format (participant JIDs): extract number after colon
    if (jid.includes('@lid')) {
        const match = jid.match(/:(\d+)@/);
        phoneNumber = match ? match[1] : null;
        console.log(`[Debug] LID format detected, extracted: ${phoneNumber}`);
    } 
    // For standard WhatsApp format
    else if (jid.includes('@s.whatsapp.net')) {
        const match = jid.match(/^(\d+)@/);
        phoneNumber = match ? match[1] : null;
        console.log(`[Debug] Standard format, extracted: ${phoneNumber}`);
    } 
    // Generic @ format
    else if (jid.includes('@')) {
        const match = jid.match(/(\d+)@/);
        phoneNumber = match ? match[1] : null;
        console.log(`[Debug] Generic format, extracted: ${phoneNumber}`);
    }
    // If no @ symbol, check if it's already a phone number
    else {
        const match = jid.match(/^(\d+)$/);
        phoneNumber = match ? match[1] : null;
        console.log(`[Debug] No @ found, checking if pure number: ${phoneNumber}`);
    }

    // Validate phone number (must be 10-15 digits)
    if (phoneNumber && /^\d{10,15}$/.test(phoneNumber)) {
        console.log(`[Debug] Valid phone number: ${phoneNumber}`);
        return phoneNumber;
    }

    console.log(`[Debug] Invalid or non-phone JID: ${jid}`);
    return null;
}

// Enhanced function to get real phone number from user profile/bio
async function getRealPhoneFromProfile(sock, jid) {
    try {
        console.log(`[Debug] Checking profile for real number: ${jid}`);

        // Try to get user's profile info
        const userProfile = await sock.onWhatsApp(jid);
        if (userProfile && userProfile.length > 0) {
            const profileInfo = userProfile[0];

            // Try to get status/bio which might contain real number
            try {
                const status = await sock.fetchStatus(jid);
                if (status && status.status) {
                    // Look for phone number patterns in bio/status
                    const phonePatterns = [
                        /(\+?\d{10,15})/g,  // General phone pattern
                        /(\d{4}\s?\d{3}\s?\d{4})/g,  // Formatted phone pattern
                        /(\+\d{1,3}\s?\d{3,4}\s?\d{3,4}\s?\d{3,4})/g  // International format
                    ];

                    for (const pattern of phonePatterns) {
                        const phoneMatch = status.status.match(pattern);
                        if (phoneMatch) {
                            const realNumber = phoneMatch[0].replace(/[\s\+]/g, '');
                            console.log(`[Debug] Found real number in bio: +${realNumber}`);
                            return realNumber;
                        }
                    }
                }
            } catch (statusError) {
                console.log(`[Debug] Could not fetch status for ${jid}`);
            }
        }
    } catch (error) {
        console.log(`[Debug] Error fetching profile for ${jid}:`, error.message);
    }

    // Fallback to JID extraction
    return extractPhoneNumber(jid);
}

// Enhanced owner detection function
function isEnhancedOwner(senderJid, sock, settings, botState) {
    const senderPhoneNumber = extractPhoneNumber(senderJid);
    const ownerPhoneNumber = extractPhoneNumber(settings.ownerNumber);

    // Check configured owners
    const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
    let isOwner = ownerNumbers.some(num => {
        const numPhone = extractPhoneNumber(num);
        return (senderPhoneNumber && senderPhoneNumber === numPhone) || 
               (senderPhoneNumber && senderPhoneNumber === ownerPhoneNumber) ||
               senderJid === num;
    });

    // Check stored auto-detected owners
    if (!isOwner && botState.ownerJids) {
        isOwner = botState.ownerJids.some(ownerJid => {
            const ownerPhone = extractPhoneNumber(ownerJid);
            return (senderPhoneNumber && senderPhoneNumber === ownerPhone) || 
                   senderJid === ownerJid;
        });
    }

    // Check if sender is the bot itself (self-recognition)
    if (!isOwner && sock.user?.id) {
        const botJid = sock.user.id;
        const botPhone = extractPhoneNumber(botJid);
        isOwner = (senderJid === botJid) || 
                 (senderPhoneNumber && senderPhoneNumber === botPhone);
    }

    return isOwner;
}

// Check if user is on cooldown
function isOnCooldown(sender, cooldownTime = 10000) { // 10 seconds default
    const now = Date.now();
    const lastMessage = messageCooldown.get(sender);

    if (lastMessage && (now - lastMessage) < cooldownTime) {
        return true;
    }

    messageCooldown.set(sender, now);
    return false;
}

// Initialize bot
async function init() {
    await loadBotState();
    await startBot();
}

// Global restart flag
global.shouldRestart = false;
let currentSocket = null;

// Restart function
async function restartBot() {
    console.log('🔄 Restarting bot...');
    global.shouldRestart = true;

    try {
        // Close current connection if exists
        if (currentSocket) {
            try {
                currentSocket.end();
                currentSocket = null;
            } catch (closeError) {
                console.log('Error closing socket:', closeError.message);
            }
        }

        // Clear all intervals and timeouts
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        const highestIntervalId = setInterval(() => {}, 9999);
        for (let i = 0; i < highestIntervalId; i++) {
            clearInterval(i);
        }

        // Wait a bit before restarting
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Restart
        await init();
    } catch (error) {
        console.error('❌ Restart failed:', error);
        process.exit(1);
    }
}

// Export restart function globally
global.restartBot = restartBot;

// Start the bot
init().catch(console.error);