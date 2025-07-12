
import crypto from 'crypto';

export const command = {
    name: 'uuid',
    aliases: ['guid'],
    description: 'Generate UUID/GUID',
    usage: 'uuid',
    category: 'misc',
    cooldown: 1,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const uuid = crypto.randomUUID();
        
        await sock.sendMessage(from, {
            text: `🆔 **UUID Generated**\n\n${uuid}`,
            contextInfo: {
                externalAdReply: {
                    title: 'UUID Generator',
                    body: 'Unique identifier',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=6',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
