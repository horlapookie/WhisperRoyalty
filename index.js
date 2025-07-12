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
    chatbotEnabled: false
};

// Message tracking for cooldown
const messageCooldown = new Map();

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
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger,
        defaultQueryTimeoutMs: 60000,
    });

    // Save credentials on update
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);

            if (shouldReconnect) {
                await startBot();
            }
        } else if (connection === 'open') {
            console.log('✅ Bot connected successfully!');

            // Send connection notification to owner
            try {
                await sock.sendMessage(settings.ownerNumber, {
                    text: `🤖 *yourhïghness v0.0.1* is now online!\n\n✨ Bot Status: ${botState.isOn ? 'ON' : 'OFF'}\n🌐 Mode: ${botState.isPublic ? 'Public' : 'Private'}\n🔄 Auto View Status: ${botState.autoViewStatus ? 'ON' : 'OFF'}\n💬 Chatbot: ${botState.chatbotEnabled ? 'ON' : 'OFF'}\n\nReady to serve! 🚀`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'yourhïghness Bot',
                            body: 'Bot is now online',
                            thumbnailUrl: getRandomProfilePic(),
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            } catch (error) {
                console.error('Error sending connection notification:', error);
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

        // Extract real phone number from JID
        const extractPhoneNumber = (jid) => {
            if (!jid) return null;
            let cleanJid = jid;
            
            // Handle different JID formats
            if (jid.includes('@lid')) {
                const match = jid.match(/^(\d+):/);
                if (match) {
                    cleanJid = `${match[1]}@s.whatsapp.net`;
                } else {
                    const directMatch = jid.match(/^(\d+)@/);
                    cleanJid = directMatch ? `${directMatch[1]}@s.whatsapp.net` : jid;
                }
            } else if (jid.includes('@s.whatsapp.net')) {
                cleanJid = jid;
            } else {
                const match = jid.match(/^(\d+)@/);
                cleanJid = match ? `${match[1]}@s.whatsapp.net` : jid;
            }
            
            return cleanJid;
        };

        const sender = extractPhoneNumber(senderJid);
        const isOwner = sender === settings.ownerNumber;
        const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

        // Log received messages for debugging
        const getPhoneNumber = (jid) => {
            if (!jid) return 'Unknown';
            
            // Handle @lid format
            if (jid.includes('@lid')) {
                const match = jid.match(/^(\d+):/);
                return match ? match[1] : jid.replace(/@.*/, '');
            }
            
            // Handle standard format
            const match = jid.match(/^(\d+)@/);
            return match ? match[1] : jid.replace(/@.*/, '');
        };
        const senderDisplay = getPhoneNumber(senderJid || sender);
        console.log(`📨 Message from +${senderDisplay}: ${messageText}`);

        // Check if bot is off (but always allow owner commands)
        if (!botState.isOn && !isOwner) return;

        // Check private mode (but always allow owner commands and self-messages)  
        if (!botState.isPublic && !isOwner && isGroup) return;



        // Auto react feature  
        if (botState.autoReact) {
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

        // Handle commands
        if (messageText.startsWith(settings.prefix)) {
            const commandName = messageText.slice(settings.prefix.length).split(' ')[0].toLowerCase();
            const args = messageText.slice(settings.prefix.length + commandName.length).trim();

            // Owner-only hardcoded commands
            if (isOwner) {
                switch (commandName) {
                    case 'on':
                        botState.isOn = true;
                        await saveBotState();
                        await sock.sendMessage(from, {
                            text: '✅ Bot is now ON',
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Bot Status',
                                    body: 'Bot activated',
                                    thumbnailUrl: getRandomProfilePic(),
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1,
                                    renderLargerThumbnail: false
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
                        } else {
                            await sock.sendMessage(from, {
                                text: '❓ Usage: chatbot on/off',
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
                    const context = {
                        from: from,
                        sender: sender,
                        senderJid: senderJid,
                        isOwner: isOwner,
                        isGroup: isGroup,
                        isAdmin: false, // You can implement admin logic later
                        settings: settings,
                        botState: botState
                    };
                    await command.execute(sock, msg, args, context);
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
                            body: 'Command not found',
                            thumbnailUrl: getRandomProfilePic(),
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            }
        } else if (botState.chatbotEnabled && !isGroup && !isOwner && messageText.trim() !== '') {
            // Chatbot feature for DMs only - with cooldown and error handling

            // Check for cooldown to prevent spam
            if (isOnCooldown(sender, 15000)) { // 15 seconds cooldown
                return; // Silently ignore if on cooldown
            }

            // Only respond to messages longer than 2 characters to avoid spam
            if (messageText.length < 3) {
                return;
            }

            try {
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
                const response = await model.generateContent(
                    `You are yourhïghness, a helpful WhatsApp bot assistant. Keep responses brief and helpful. Respond to: ${messageText}`
                );

                const reply = response.response?.text() || "I'm sorry, I couldn't process that message.";

                await sock.sendMessage(from, {
                    text: `🤖 *yourhïghness AI*\n\n${reply}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'AI Chatbot',
                            body: 'Powered by Gemini',
                            thumbnailUrl: getRandomProfilePic(),
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            } catch (error) {
                console.error('Chatbot error:', error);
                // Only send error message once, then disable chatbot temporarily
                if (!messageCooldown.has(`${sender}_error`)) {
                    messageCooldown.set(`${sender}_error`, Date.now());
                    await sock.sendMessage(from, {
                        text: '🤖 Sorry, I encountered an error. Chatbot will be temporarily disabled for you.',
                        contextInfo: {
                            externalAdReply: {
                                title: 'AI Chatbot Error',
                                body: 'Temporarily disabled',
                                thumbnailUrl: getRandomProfilePic(),
                                sourceUrl: 'https://github.com',
                                mediaType: 1,
                                renderLargerThumbnail: false
                            }
                        }
                    });

                    // Clear error flag after 5 minutes
                    setTimeout(() => {
                        messageCooldown.delete(`${sender}_error`);
                    }, 300000);
                }
                return; // Don't continue processing
            }
        }
    });

    // Handle status updates for auto view
    sock.ev.on('messages.upsert', async (m) => {
        if (botState.autoViewStatus) {
            const msg = m.messages[0];
            if (msg.key.remoteJid === 'status@broadcast') {
                try {
                    await sock.readMessages([msg.key]);
                } catch (error) {
                    console.error('Error viewing status:', error);
                }
            }
        }
    });

    return sock;
}

// Get random profile picture
function getRandomProfilePic() {
    const pics = settings.profilePics;
    return pics[Math.floor(Math.random() * pics.length)];
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

// Start the bot
init().catch(console.error);