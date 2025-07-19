
export const command = {
    name: 'roll',
    aliases: ['diceroll', 'customdice'],
    description: 'Roll custom dice with different sides and quantities',
    usage: 'roll <number>d<sides> | roll 3d6 | roll 2d20',
    category: 'games',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🎲 **Custom Dice Roller**\n\n📝 **Usage Examples:**\n• .roll 1d6 - Roll one 6-sided die\n• .roll 3d6 - Roll three 6-sided dice\n• .roll 2d20 - Roll two 20-sided dice\n• .roll 4d8 - Roll four 8-sided dice\n\n🎯 Format: <number>d<sides>'
            });
            return;
        }
        
        const dicePattern = /^(\d+)d(\d+)$/i;
        const match = args.trim().match(dicePattern);
        
        if (!match) {
            await sock.sendMessage(from, {
                text: '❌ Invalid format! Use: <number>d<sides>\n\nExample: .roll 3d6'
            });
            return;
        }
        
        const numDice = parseInt(match[1]);
        const sides = parseInt(match[2]);
        
        if (numDice < 1 || numDice > 20) {
            await sock.sendMessage(from, {
                text: '❌ Number of dice must be between 1 and 20!'
            });
            return;
        }
        
        if (sides < 2 || sides > 100) {
            await sock.sendMessage(from, {
                text: '❌ Number of sides must be between 2 and 100!'
            });
            return;
        }
        
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        const rollsText = rolls.join(', ');
        const average = (total / numDice).toFixed(1);
        const maxPossible = numDice * sides;
        const percentage = ((total / maxPossible) * 100).toFixed(1);
        
        await sock.sendMessage(from, {
            text: `🎲 **Dice Roll Results** 🎲\n\n🎯 **Roll:** ${numDice}d${sides}\n\n📊 **Individual Rolls:**\n${rollsText}\n\n📈 **Statistics:**\n• **Total:** ${total}\n• **Average:** ${average}\n• **Max Possible:** ${maxPossible}\n• **Roll Percentage:** ${percentage}%\n\n🎮 Roll again with .roll <number>d<sides>!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Custom Dice Roll',
                    body: `${numDice}d${sides} = ${total}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=522',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
