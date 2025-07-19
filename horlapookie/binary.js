
export const command = {
    name: 'binary',
    aliases: ['bin'],
    description: 'Convert text to binary or binary to text',
    usage: 'binary <text>',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide text to convert!\n\nExample: .binary Hello'
            });
            return;
        }
        
        const input = args.trim();
        let result = '';
        
        // Check if input is binary
        if (/^[01\s]+$/.test(input)) {
            // Binary to text
            const binaryArray = input.replace(/\s/g, '').match(/.{1,8}/g);
            if (binaryArray) {
                result = binaryArray.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
                await sock.sendMessage(from, {
                    text: `🔢 **Binary to Text**\n\nInput: ${input}\nResult: ${result}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Binary Converter',
                            body: 'Binary to Text',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=106',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        } else {
            // Text to binary
            result = input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
            await sock.sendMessage(from, {
                text: `🔢 **Text to Binary**\n\nInput: ${input}\nResult: ${result}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Binary Converter',
                        body: 'Text to Binary',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=107',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
