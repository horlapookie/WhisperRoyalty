
export const command = {
    name: 'ascii',
    aliases: ['art'],
    description: 'Convert text to ASCII art',
    usage: 'ascii <text>',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide text to convert!\n\nExample: .ascii Hello'
            });
            return;
        }
        
        const text = args.trim().toUpperCase();
        let ascii = '';
        
        for (let char of text) {
            switch(char) {
                case 'A':
                    ascii += '  ██  \n ████ \n██  ██\n██████\n██  ██\n██  ██\n\n';
                    break;
                case 'B':
                    ascii += '██████\n██  ██\n██████\n██████\n██  ██\n██████\n\n';
                    break;
                case 'C':
                    ascii += ' █████\n██    \n██    \n██    \n██    \n █████\n\n';
                    break;
                case ' ':
                    ascii += '      \n      \n      \n      \n      \n      \n\n';
                    break;
                default:
                    ascii += '██████\n██  ██\n██████\n██████\n██  ██\n██████\n\n';
            }
        }
        
        await sock.sendMessage(from, {
            text: `🎨 **ASCII Art**\n\n\`\`\`\n${ascii}\`\`\``,
            contextInfo: {
                externalAdReply: {
                    title: 'ASCII Art Generator',
                    body: 'Text to ASCII',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=102',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
