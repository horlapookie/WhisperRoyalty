
import crypto from 'crypto';

export const command = {
    name: 'hash',
    aliases: ['md5', 'sha'],
    description: 'Generate hash from text',
    usage: 'hash <text>',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide text to hash!\n\nExample: .hash Hello World'
            });
            return;
        }
        
        const text = args.trim();
        
        const md5 = crypto.createHash('md5').update(text).digest('hex');
        const sha1 = crypto.createHash('sha1').update(text).digest('hex');
        const sha256 = crypto.createHash('sha256').update(text).digest('hex');
        
        await sock.sendMessage(from, {
            text: `🔐 **Hash Generator**\n\nInput: ${text}\n\n**MD5:** ${md5}\n\n**SHA1:** ${sha1}\n\n**SHA256:** ${sha256}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Hash Generator',
                    body: 'Multiple hash algorithms',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=129',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
