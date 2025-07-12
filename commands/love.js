
export const command = {
    name: 'love',
    aliases: ['compatibility', 'lovecalc'],
    description: 'Calculate love compatibility between two people',
    usage: 'love <name1> <name2>',
    category: 'fun',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const names = args.trim().split(' ').filter(name => name.length > 0);
        
        if (names.length < 2) {
            await sock.sendMessage(from, {
                text: '❌ Please provide two names!\n\nExample: .love Alice Bob'
            });
            return;
        }
        
        const name1 = names[0].toLowerCase();
        const name2 = names[1].toLowerCase();
        
        // Calculate "compatibility" based on name characters
        const combined = name1 + name2;
        let score = 0;
        for (let i = 0; i < combined.length; i++) {
            score += combined.charCodeAt(i);
        }
        const compatibility = (score % 101);
        
        let message = '';
        let emoji = '';
        
        if (compatibility >= 90) {
            message = 'Perfect match made in heaven! 💕';
            emoji = '💖💖💖💖💖';
        } else if (compatibility >= 80) {
            message = 'Excellent compatibility! Very promising! 💕';
            emoji = '💖💖💖💖';
        } else if (compatibility >= 70) {
            message = 'Great potential for a beautiful relationship! 💕';
            emoji = '💖💖💖';
        } else if (compatibility >= 60) {
            message = 'Good compatibility with some effort! 💕';
            emoji = '💖💖';
        } else if (compatibility >= 50) {
            message = 'Average compatibility, work together! 💕';
            emoji = '💖';
        } else if (compatibility >= 30) {
            message = 'Some challenges but not impossible! 💔';
            emoji = '💔';
        } else {
            message = 'Very challenging match, better as friends! 💔';
            emoji = '💔💔';
        }
        
        await sock.sendMessage(from, {
            text: `💕 **Love Compatibility Calculator** 💕\n\n👫 **${names[0]} ❤️ ${names[1]}**\n\n📊 **Compatibility Score:** ${compatibility}%\n${emoji}\n\n💭 **Verdict:** ${message}\n\n🔮 *Remember: Love is more than just calculations!*`,
            contextInfo: {
                externalAdReply: {
                    title: 'Love Compatibility',
                    body: `${compatibility}% compatibility`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=521',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
