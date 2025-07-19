
export const command = {
    name: 'hidetag',
    aliases: ['ht', 'hiddenannounce'],
    description: 'Send announcement to all group members without showing tag list',
    usage: 'hidetag <message>',
    category: 'group',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Hidetag Command',
                        body: 'Groups only feature',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=701',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (!isAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins can use hidetag!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Admin Required',
                        body: 'Insufficient permissions',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=702',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a message to announce!\n\n📝 **Example:** .hidetag Good morning everyone!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Hidetag Usage',
                        body: 'Provide announcement message',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=703',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const mentionList = participants.map(participant => participant.id);
            
            const announcementText = `📢 **Group Announcement**\n\n${args.trim()}\n\n👤 *Announced by:* @${sender.split('@')[0]}`;
            
            await sock.sendMessage(from, {
                text: announcementText,
                mentions: mentionList
            });
            
        } catch (error) {
            console.error('Hidetag error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error sending hidden announcement. Please try again.'
            });
        }
    }
};
