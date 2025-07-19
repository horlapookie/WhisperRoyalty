
import { settings } from '../settings.js';

function extractPhoneNumber(jid) {
    if (!jid) return null;
    return jid.split('@')[0];
}

export const command = {
    name: 'welcome',
    aliases: ['wel'],
    description: 'Configure welcome messages for new group members (Owner only)',
    usage: 'welcome on/off | welcome set <message> | welcome test',
    category: 'owner',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if user is owner
        const senderPhoneNumber = extractPhoneNumber(sender);
        const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
        const isOwner = ownerNumbers.some(num => {
            const ownerPhone = extractPhoneNumber(num);
            return senderPhoneNumber === ownerPhone || sender === num;
        });

        if (!isOwner) {
            await sock.sendMessage(from, {
                text: '❌ **Access Denied**\n\n🔒 This command is restricted to bot owners only.\n\n👑 **Owner Commands:**\n• Welcome message configuration\n• Advanced bot settings\n• System management',
                contextInfo: {
                    externalAdReply: {
                        title: 'Owner Only Command',
                        body: 'Restricted access',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=701',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups!'
            });
            return;
        }

        const action = args.trim().toLowerCase();
        
        // Initialize group settings if not exists
        if (!global.groupSettings) global.groupSettings = new Map();
        const groupId = from;
        let groupConfig = global.groupSettings.get(groupId) || {};

        try {
            if (action === 'on') {
                groupConfig.welcomeEnabled = true;
                global.groupSettings.set(groupId, groupConfig);
                
                await sock.sendMessage(from, {
                    text: '✅ **Welcome Messages Enabled**\n\n🎉 New members will now receive welcome messages!\n\n💡 **Next Steps:**\n• Use `.welcome set <message>` to customize\n• Use `.welcome test` to preview\n• Use `.welcome off` to disable',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Welcome Messages ON',
                            body: 'New members will be welcomed',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=702',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                
            } else if (action === 'off') {
                groupConfig.welcomeEnabled = false;
                global.groupSettings.set(groupId, groupConfig);
                
                await sock.sendMessage(from, {
                    text: '🔕 **Welcome Messages Disabled**\n\n❌ New members will no longer receive welcome messages.\n\n💡 Use `.welcome on` to re-enable anytime.'
                });
                
            } else if (action.startsWith('set ')) {
                const customMessage = args.slice(4).trim();
                if (!customMessage) {
                    await sock.sendMessage(from, {
                        text: '❌ Please provide a welcome message!\n\n📝 **Example:** `.welcome set Welcome to our group! Please read the rules.`'
                    });
                    return;
                }
                
                groupConfig.welcomeMessage = customMessage;
                global.groupSettings.set(groupId, groupConfig);
                
                await sock.sendMessage(from, {
                    text: `✅ **Welcome Message Updated**\n\n📝 **New Message:**\n"${customMessage}"\n\n💡 **Variables you can use:**\n• @user - Mentions the new member\n• {name} - Shows member's name\n• {group} - Shows group name`
                });
                
            } else if (action === 'test') {
                const welcomeMsg = groupConfig.welcomeMessage || `🎉 **Welcome to the group!**\n\nHi @user, welcome to {group}!\n\n📋 Please:\n• Read the group rules\n• Introduce yourself\n• Be respectful to everyone\n\n🤖 Enjoy your stay!`;
                
                const groupMetadata = await sock.groupMetadata(from);
                const testMessage = welcomeMsg
                    .replace('{group}', groupMetadata.subject)
                    .replace('{name}', 'Test User');
                
                await sock.sendMessage(from, {
                    text: `🧪 **Welcome Message Preview**\n\n${testMessage.replace('@user', '@' + sender.split('@')[0])}\n\n💡 This is how new members will be welcomed!`,
                    mentions: [sender]
                });
                
            } else {
                await sock.sendMessage(from, {
                    text: `🎉 **Welcome Message Commands**\n\n**👑 Owner Commands:**\n• \`.welcome on\` - Enable welcome messages\n• \`.welcome off\` - Disable welcome messages\n• \`.welcome set <message>\` - Set custom message\n• \`.welcome test\` - Preview current message\n\n**📝 Message Variables:**\n• \`@user\` - Mentions new member\n• \`{name}\` - Member's display name\n• \`{group}\` - Group name\n\n**📊 Current Status:**\n• **Enabled:** ${groupConfig.welcomeEnabled ? '✅ Yes' : '❌ No'}\n• **Custom Message:** ${groupConfig.welcomeMessage ? '✅ Set' : '❌ Default'}`
                });
            }
            
        } catch (error) {
            console.error('Welcome command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error managing welcome settings. Please try again.'
            });
        }
    }
};
