
export const command = {
    name: 'dice',
    aliases: ['roll'],
    description: 'Roll dice',
    usage: 'dice [number_of_dice]',
    category: 'games',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const numDice = parseInt(args.trim()) || 1;
        
        if (numDice < 1 || numDice > 10) {
            await sock.sendMessage(from, {
                text: '🎲 Number of dice must be between 1 and 10!\n\nExample: .dice 2',
                quoted: msg
            });
            return;
        }
        
        const results = [];
        let total = 0;
        
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            results.push(roll);
            total += roll;
        }
        
        let message = `🎲 **Dice Roll Results**\n\n`;
        message += `Dice: ${results.join(', ')}\n`;
        message += `Total: ${total}`;
        
        if (numDice > 1) {
            message += `\nAverage: ${(total / numDice).toFixed(2)}`;
        }
        
        await sock.sendMessage(from, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: 'Dice Roll',
                    body: 'Gaming command',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=119',
                    sourceUrl: 'https://github.com',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });
    }
};
