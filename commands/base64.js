
export const command = {
    name: 'base64',
    aliases: ['b64'],
    description: 'Encode or decode base64 text',
    usage: 'base64 <encode|decode> <text>',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const parts = args.trim().split(' ');
        
        if (parts.length < 2) {
            await sock.sendMessage(from, {
                text: '🔤 Usage: .base64 <encode|decode> <text>\n\nExample: .base64 encode Hello World',
                quoted: msg
            });
            return;
        }
        
        const action = parts[0].toLowerCase();
        const text = parts.slice(1).join(' ');
        
        try {
            let result;
            
            if (action === 'encode') {
                result = Buffer.from(text, 'utf8').toString('base64');
                await sock.sendMessage(from, {
                    text: `🔤 **Base64 Encoded**\n\nOriginal: ${text}\nEncoded: ${result}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Base64 Encoder',
                            body: 'Text encoder',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=103',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else if (action === 'decode') {
                result = Buffer.from(text, 'base64').toString('utf8');
                await sock.sendMessage(from, {
                    text: `🔤 **Base64 Decoded**\n\nEncoded: ${text}\nDecoded: ${result}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Base64 Decoder',
                            body: 'Text decoder',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=104',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: '❌ Invalid action! Use "encode" or "decode".',
                    quoted: msg
                });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Invalid base64 string for decoding.',
                quoted: msg
            });
        }
    }
};
