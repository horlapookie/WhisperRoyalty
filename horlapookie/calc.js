
export const command = {
    name: 'calc',
    aliases: ['calculate', 'math'],
    description: 'Calculate mathematical expressions',
    usage: 'calc <expression>',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🧮 Please provide a mathematical expression!\n\nExample: .calc 2 + 2 * 3',
                quoted: msg
            });
            return;
        }
        
        try {
            const expression = args.trim();
            
            // Basic safety check - only allow numbers and basic operators
            if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
                await sock.sendMessage(from, {
                    text: '❌ Invalid expression. Only use numbers and operators (+, -, *, /, parentheses).',
                    quoted: msg
                });
                return;
            }
            
            const result = eval(expression);
            
            await sock.sendMessage(from, {
                text: `🧮 **Calculator**\n\n${expression} = ${result}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Calculator',
                        body: 'Math calculator',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=109',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Invalid mathematical expression. Please check your input.',
                quoted: msg
            });
        }
    }
};
