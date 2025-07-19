
export const command = {
    name: 'compliment',
    description: 'Generate random compliments',
    category: 'fun',
    usage: '.compliment [@user]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const compliments = [
                "You're absolutely amazing!",
                "Your smile lights up the room!",
                "You have incredible potential!",
                "You're one of a kind!",
                "Your creativity knows no bounds!",
                "You make the world a better place!",
                "You're stronger than you know!",
                "Your kindness is infectious!",
                "You inspire others around you!",
                "You're absolutely brilliant!"
            ];
            
            const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            const target = args || 'You';
            
            await sock.sendMessage(from, {
                text: `💝 *Compliment Generator*\n\n${target}: ${randomCompliment}\n\n✨ Have a wonderful day! ✨`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Compliment Generator',
                        body: 'Spread positivity',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=113',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate compliment!'
            });
        }
    }
};
