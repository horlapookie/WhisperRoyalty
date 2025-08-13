
export const command = {
    name: 'luckynumber',
    aliases: ['lucky', 'fortune'],
    description: 'Generate your lucky numbers',
    category: 'fun',
    usage: '.luckynumber [count]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const count = parseInt(args) || 6;
            const maxCount = 10;
            const finalCount = Math.min(count, maxCount);
            
            const luckyNumbers = [];
            const usedNumbers = new Set();
            
            while (luckyNumbers.length < finalCount) {
                const num = Math.floor(Math.random() * 100) + 1;
                if (!usedNumbers.has(num)) {
                    luckyNumbers.push(num);
                    usedNumbers.add(num);
                }
            }
            
            const fortune = [
                "Great fortune awaits you!",
                "Today is your lucky day!",
                "Positive energy surrounds you!",
                "Success is in your future!",
                "Good things are coming your way!",
                "Trust your instincts today!",
                "Your hard work will pay off!",
                "Opportunities are everywhere!"
            ];
            
            const randomFortune = fortune[Math.floor(Math.random() * fortune.length)];
            
            await sock.sendMessage(from, {
                text: `🍀 *Your Lucky Numbers*\n\n🎲 Numbers: ${luckyNumbers.join(', ')}\n\n✨ Fortune: ${randomFortune}\n\n🌟 May luck be with you today!`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate lucky numbers!'
            });
        }
    }
};
