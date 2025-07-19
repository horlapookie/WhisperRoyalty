
import { settings } from '../settings.js';

function extractPhoneNumber(jid) {
    if (!jid) return null;
    return jid.split('@')[0];
}

export const command = {
    name: 'leave',
    aliases: ['goodbye', 'bye'],
    description: 'Configure leave messages for departed group members (Owner only)',
    usage: 'leave on/off | leave set <message> | leave test',
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
                text: '❌ **Access Denied**\n\n🔒 This command is restricted to bot owners only.\n\n👑 **Owner Commands:**\n• Leave message configuration\n• Advanced bot settings\n• System management',
                contextInfo: {
                    externalAdReply: {
                        title: 'Owner Only Command',
                        body: 'Restricted access',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=703',
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
                groupConfig.leaveEnabled = true;
                global.groupSettings.set(groupId, groupConfig);
                
                await sock.sendMessage(from, {
                    text: '✅ **Leave Messages Enabled**\n\n👋 Members who leave will now be acknowledged!\n\n💡 **Next Steps:**\n• Use `.leave set <message>` to customize\n• Use `.leave test` to preview\n• Use `.leave off` to disable',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Leave Messages ON',
                            body: 'Departed members will be acknowledged',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=704',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                
            } else if (action === 'off') {
                groupConfig.leaveEnabled = false;
                global.groupSettings.set(groupId, groupConfig);
                
                await sock.sendMessage(from, {
                    text: '🔕 **Leave Messages Disabled**\n\n❌ Departed members will no longer be acknowledged.\n\n💡 Use `.leave on` to re-enable anytime.'
                });
                
            } else if (action.startsWith('set ')) {
                const customMessage = args.slice(4).trim();
                if (!customMessage) {
                    await sock.sendMessage(from, {
                        text: '❌ Please provide a leave message!\n\n📝 **Example:** `.leave set Goodbye {name}, thanks for being part of our group!`'
                    });
                    return;
                }
                
                groupConfig.leaveMessage = customMessage;
                global.groupSettings.set(groupId, groupConfig);
                
                await sock.sendMessage(from, {
                    text: `✅ **Leave Message Updated**\n\n📝 **New Message:**\n"${customMessage}"\n\n💡 **Variables you can use:**\n• {name} - Shows departed member's name\n• {group} - Shows group name\n• {count} - Shows remaining member count`
                });
                
            } else if (action === 'test') {
                const leaveMsg = groupConfig.leaveMessage || `👋 **Member Left**\n\n{name} has left {group}.\n\n📊 Group now has {count} members.\n\n🤝 Thanks for being part of our community!`;
                
                const groupMetadata = await sock.groupMetadata(from);
                const testMessage = leaveMsg
                    .replace('{group}', groupMetadata.subject)
                    .replace('{name}', 'Test User')
                    .replace('{count}', groupMetadata.participants.length.toString());
                
                await sock.sendMessage(from, {
                    text: `🧪 **Leave Message Preview**\n\n${testMessage}\n\n💡 This is how departures will be acknowledged!`
                });
                
            } else {
                await sock.sendMessage(from, {
                    text: `👋 **Leave Message Commands**\n\n**👑 Owner Commands:**\n• \`.leave on\` - Enable leave messages\n• \`.leave off\` - Disable leave messages\n• \`.leave set <message>\` - Set custom message\n• \`.leave test\` - Preview current message\n\n**📝 Message Variables:**\n• \`{name}\` - Departed member's name\n• \`{group}\` - Group name\n• \`{count}\` - Remaining member count\n\n**📊 Current Status:**\n• **Enabled:** ${groupConfig.leaveEnabled ? '✅ Yes' : '❌ No'}\n• **Custom Message:** ${groupConfig.leaveMessage ? '✅ Set' : '❌ Default'}`
                });
            }
            
        } catch (error) {
            console.error('Leave command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error managing leave settings. Please try again.'
            });
        }
    }
};
