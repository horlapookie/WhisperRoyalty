export const command = {
    name: 'groupconfig',
    aliases: ['gconfig', 'groupsettings'],
    description: 'Configure group settings and automation features',
    usage: 'groupconfig <setting> <on/off>',
    category: 'group',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin, isBotAdmin, settings, isOwner } = context;
        const sender = msg.key.remoteJid;

        if (!isGroup && !from.includes('@newsletter')) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups and channels!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Configuration',
                        body: 'Groups and channels only',
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Enhanced owner detection including auto-detected owners and bot self
        let enhancedIsOwner = isOwner;
        
        // Check if sender is in auto-detected owners list
        if (!enhancedIsOwner && global.botState?.ownerJids) {
            const senderPhone = context.extractPhoneNumber ? context.extractPhoneNumber(sender) : null;
            enhancedIsOwner = global.botState.ownerJids.some(ownerJid => {
                const ownerPhone = context.extractPhoneNumber ? context.extractPhoneNumber(ownerJid) : null;
                return sender === ownerJid || (senderPhone && senderPhone === ownerPhone);
            });
        }

        // Check if sender is the bot itself
        if (!enhancedIsOwner && context.sock?.user?.id) {
            const botJid = context.sock.user.id;
            const botPhone = context.extractPhoneNumber ? context.extractPhoneNumber(botJid) : null;
            const senderPhone = context.extractPhoneNumber ? context.extractPhoneNumber(sender) : null;
            enhancedIsOwner = (sender === botJid) || (senderPhone && senderPhone === botPhone);
        }

        if (!enhancedIsOwner && !isAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins or bot owners can configure group settings!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Admin Required',
                        body: 'Insufficient permissions',
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        const argsArray = args.trim().split(' ');
        const setting = argsArray[0]?.toLowerCase();
        const value = argsArray[1]?.toLowerCase();

        // Initialize group config if not exists
        if (!global.groupConfigs) {
            global.groupConfigs = {};
        }

        if (!global.groupConfigs[from]) {
            global.groupConfigs[from] = {
                autoTyping: false,
                autoReacting: false,
                autoRecording: false,
                antiLink: false,
                antiLinkDelete: false,
                antiLinkRemove: false,
                welcomeMessage: false,
                leaveMessage: false,
                groupLocked: false
            };
        }

        const config = global.groupConfigs[from];

        try {
            switch (setting) {
                case 'autotyping':
                    config.autoTyping = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Auto typing is now ${value.toUpperCase()}\n\n${config.autoTyping ? '⌨️ Bot will show typing indicator for 10 minutes' : '🔇 Auto typing disabled'}`
                    });

                    if (config.autoTyping) {
                        startAutoTyping(sock, from);
                    }
                    break;

                case 'autoreacting':
                    config.autoReacting = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Auto reacting is now ${value.toUpperCase()}\n\n${config.autoReacting ? '😊 Bot will react to messages for 10 minutes' : '🔇 Auto reacting disabled'}`
                    });

                    if (config.autoReacting) {
                        startAutoReacting(sock, from);
                    }
                    break;

                case 'autorecording':
                    config.autoRecording = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Auto recording is now ${value.toUpperCase()}\n\n${config.autoRecording ? '🎤 Bot will show recording indicator for 10 minutes' : '🔇 Auto recording disabled'}`
                    });

                    if (config.autoRecording) {
                        startAutoRecording(sock, from);
                    }
                    break;

                case 'antilink':
                    config.antiLink = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Anti-link warning is now ${value.toUpperCase()}\n\n${config.antiLink ? '⚠️ Bot will warn users who send links' : '🔇 Anti-link warnings disabled'}`
                    });
                    break;

                case 'antilinkdelete':
                    config.antiLinkDelete = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Anti-link delete is now ${value.toUpperCase()}\n\n${config.antiLinkDelete ? '🗑️ Bot will delete messages with links' : '🔇 Anti-link delete disabled'}`
                    });
                    break;

                case 'antilinkremove':
                    config.antiLinkRemove = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Anti-link remove is now ${value.toUpperCase()}\n\n${config.antiLinkRemove ? '👋 Bot will remove users who send links' : '🔇 Anti-link remove disabled'}`
                    });
                    break;

                case 'welcome':
                    config.welcomeMessage = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Welcome message is now ${value.toUpperCase()}\n\n${config.welcomeMessage ? '👋 Bot will greet new members' : '🔇 Welcome messages disabled'}`
                    });
                    break;

                case 'leave':
                    config.leaveMessage = value === 'on';
                    await sock.sendMessage(from, {
                        text: `✅ Leave message is now ${value.toUpperCase()}\n\n${config.leaveMessage ? '👋 Bot will say goodbye to leaving members' : '🔇 Leave messages disabled'}`
                    });
                    break;

                case 'lock':
                    if (!isBotAdmin) {
                        await sock.sendMessage(from, {
                            text: '❌ Bot needs admin privileges to lock/unlock group!'
                        });
                        return;
                    }

                    config.groupLocked = value === 'on';
                    await sock.groupSettingUpdate(from, config.groupLocked ? 'announcement' : 'not_announcement');
                    await sock.sendMessage(from, {
                        text: `✅ Group is now ${config.groupLocked ? 'LOCKED 🔒' : 'UNLOCKED 🔓'}\n\n${config.groupLocked ? 'Only admins can send messages' : 'All members can send messages'}`
                    });
                    break;

                case 'link':
                    if (!isBotAdmin) {
                        await sock.sendMessage(from, {
                            text: '❌ Bot needs admin privileges to manage group link!'
                        });
                        return;
                    }

                    try {
                        const inviteCode = await sock.groupInviteCode(from);
                        await sock.sendMessage(from, {
                            text: `🔗 **Group Invite Link**\n\nhttps://chat.whatsapp.com/${inviteCode}\n\n⚠️ Share responsibly with trusted contacts only!`
                        });
                    } catch (error) {
                        await sock.sendMessage(from, {
                            text: '❌ Failed to get group link. Make sure bot is admin.'
                        });
                    }
                    break;

                default:
                    await showGroupConfigHelp(sock, from, settings);
                    break;
            }
        } catch (error) {
            console.error('Group config error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error updating group configuration. Please try again.'
            });
        }

        // Helper functions for auto features
        function startAutoTyping(sock, groupId) {
            const typingInterval = setInterval(() => {
                sock.sendPresenceUpdate('composing', groupId);
            }, 2000);

            setTimeout(() => {
                clearInterval(typingInterval);
                sock.sendPresenceUpdate('available', groupId);
            }, 600000); // 10 minutes
        }

        function startAutoReacting(sock, groupId) {
            const reactions = ['😊', '👍', '❤️', '🔥', '😂', '👏', '🎉', '💯'];

            const reactingTimeout = setTimeout(() => {
                global.groupConfigs[groupId].autoReacting = false;
            }, 600000); // 10 minutes
        }

        function startAutoRecording(sock, groupId) {
            const recordingInterval = setInterval(() => {
                sock.sendPresenceUpdate('recording', groupId);
            }, 3000);

            setTimeout(() => {
                clearInterval(recordingInterval);
                sock.sendPresenceUpdate('available', groupId);
            }, 600000); // 10 minutes
        }

        async function showGroupConfigHelp(sock, from, settings) {
            await sock.sendMessage(from, {
                text: `⚙️ **Group Configuration Help**\n\n**🤖 Automation Features:**\n• .groupconfig autotyping on/off - Auto typing (10 min)\n• .groupconfig autoreacting on/off - Auto reactions (10 min)\n• .groupconfig autorecording on/off - Auto recording (10 min)\n\n**🛡️ Security Features:**\n• .groupconfig antilink on/off - Warn for links\n• .groupconfig antilinkdelete on/off - Delete link messages\n• .groupconfig antilinkremove on/off - Remove link senders\n\n**👥 Member Management:**\n• .groupconfig welcome on/off - Welcome new members\n• .groupconfig leave on/off - Goodbye messages\n• .groupconfig lock on/off - Lock/unlock group\n\n**🔗 Group Tools:**\n• .groupconfig link - Get group invite link\n\n**💡 Example:** .groupconfig autotyping on`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Configuration',
                        body: 'Customize group behavior',
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
        }
    }
};