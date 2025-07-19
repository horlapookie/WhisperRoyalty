
export const command = {
    name: 'setgroupdesc',
    aliases: ['setgroupdescription', 'changegroupdesc'],
    description: 'Set group description',
    usage: 'setgroupdesc <description> or reply to text',
    category: 'group',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin, isBotAdmin } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Description Setter',
                        body: 'Groups only feature',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=706',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (!isAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins can change the group description!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Admin Required',
                        body: 'Insufficient permissions',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=707',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (!isBotAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Bot needs admin privileges to change group settings!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Bot Admin Required',
                        body: 'Make bot an admin first',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=708',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        // Get description from args or quoted message
        let description = args.trim();
        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!description && quotedMessage) {
            // Check if replying to text
            if (quotedMessage.conversation) {
                description = quotedMessage.conversation;
            } else if (quotedMessage.extendedTextMessage?.text) {
                description = quotedMessage.extendedTextMessage.text;
            }
        }
        
        if (!description) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a description!\n\n📝 **Usage:**\n• .setgroupdesc Your new description here\n• Reply to a text message with .setgroupdesc\n\n💡 **Example:** .setgroupdesc Welcome to our awesome group! 🎉',
                contextInfo: {
                    externalAdReply: {
                        title: 'Set Group Description',
                        body: 'Description text required',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=709',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (description.length > 512) {
            await sock.sendMessage(from, {
                text: `❌ Description too long! (${description.length}/512 characters)\n\nPlease make it shorter.`
            });
            return;
        }
        
        try {
            await sock.sendMessage(from, {
                text: '🔄 Updating group description... Please wait!'
            });
            
            // Update group description
            await sock.groupUpdateDescription(from, description);
            
            await sock.sendMessage(from, {
                text: `✅ **Group Description Updated Successfully!**\n\n📝 **New Description:**\n${description}\n\n👤 **Changed by:** @${sender.split('@')[0]}\n⏰ **Time:** ${new Date().toLocaleString()}\n\n🎉 **Group description has been updated!**`,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Description Updated',
                        body: 'Successfully changed group description',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=710',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            console.error('Set group description error:', error);
            await sock.sendMessage(from, {
                text: `❌ Failed to update group description!\n\n**Possible reasons:**\n• Bot lacks sufficient permissions\n• Description contains invalid characters\n• Technical error occurred\n\n💡 Try again with simpler text.`
            });
        }
    }
};
