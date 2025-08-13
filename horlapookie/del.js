export const command = {
    name: 'del',
    aliases: ['delete'],
    description: 'Delete a replied message',
    usage: 'del (reply to a message)',
    category: 'misc',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;

        const { isGroup, isAdmin, isBotAdmin } = context;
        
        if (isGroup && !isAdmin && !context.isOwner) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins can delete messages!'
            });
            return;
        }

        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stanzaId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        const participant = msg.message?.extendedTextMessage?.contextInfo?.participant;

        if (!quotedMsg || !stanzaId) {
            await sock.sendMessage(from, {
                text: '❌ Reply to a message to delete it!'
            });
            return;
        }

        try {
            // For group messages, use the participant who sent the message
            const deleteKey = {
                remoteJid: from,
                fromMe: false,
                id: stanzaId
            };

            // Add participant for group messages
            if (isGroup && participant) {
                deleteKey.participant = participant;
            }

            await sock.sendMessage(from, {
                delete: deleteKey
            });

            await sock.sendMessage(from, {
                text: `✅ Message deleted successfully!`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420639943950@newsletter',
                        newsletterName: `${context.settings.botName} Updates`,
                        serverMessageId: Math.floor(Math.random() * 1000000)
                    },
                    externalAdReply: {
                        title: 'Message Deletion',
                        body: 'Admin action completed',
                        thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            console.error('Delete error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to delete the message! Make sure the message is not too old and bot has proper permissions.'
            });
        }
    }
};
