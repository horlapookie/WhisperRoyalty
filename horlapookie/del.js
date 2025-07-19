export const command = {
    name: 'del',
    aliases: ['delete'],
    description: 'Delete a replied message',
    usage: 'del (reply to a message)',
    category: 'misc',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;

        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stanzaId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        const participant = msg.message?.extendedTextMessage?.contextInfo?.participant || from;

        if (!quotedMsg || !stanzaId) {
            await sock.sendMessage(from, {
                text: '❌ Reply to a message to delete it!'
            });
            return;
        }

        try {
            await sock.sendMessage(from, {
                delete: {
                    remoteJid: from,
                    fromMe: false,
                    id: stanzaId,
                    participant: participant
                }
            });

            await sock.sendMessage(from, {
                text: '✅ Message deleted!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Message Deletion',
                        body: 'Clean and simple WhatsApp bot',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=118',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to delete the message!'
            });
        }
    }
};
