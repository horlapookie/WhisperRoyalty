
export const command = {
    name: 'energy',
    aliases: ['mood', 'vibe'],
    description: 'Track and boost your energy levels',
    category: 'utility',
    usage: '.energy [level/boost/tips]',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        const action = args.trim().toLowerCase();
        
        if (action === 'boost' || action === 'tips') {
            const tips = [
                '☀️ Get some sunlight - 10-15 minutes can boost vitamin D',
                '💧 Drink water - dehydration causes fatigue',
                '🏃‍♂️ Take a quick walk - movement increases energy',
                '🎵 Listen to upbeat music - it can lift your mood',
                '🧘‍♀️ Try deep breathing - 4-7-8 technique works great',
                '🍎 Eat a healthy snack - avoid sugar crashes',
                '😴 Take a 10-20 minute power nap if possible',
                '🤸‍♀️ Do some stretches - release muscle tension',
                '📱 Take a social media break - reduce mental clutter',
                '🌿 Spend time in nature - even looking at plants helps'
            ];
            
            const tip = tips[Math.floor(Math.random() * tips.length)];
            
            await sock.sendMessage(from, {
                text: `⚡ **Energy Boost Tips**\n\n${tip}\n\n💪 **Quick Energy Boosters:**\n• Cold water on face\n• Gentle neck rolls\n• 10 jumping jacks\n• Laugh or smile\n• Call a friend\n\n🔋 Remember: Small actions = Big energy gains!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Energy Booster',
                        body: 'Natural ways to feel more energetic',
                        thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } else {
            const energyLevel = Math.floor(Math.random() * 100) + 1;
            let emoji = '🔋';
            let status = '';
            
            if (energyLevel >= 80) {
                emoji = '⚡';
                status = 'High Energy - Ready to conquer the world!';
            } else if (energyLevel >= 60) {
                emoji = '🔋';
                status = 'Good Energy - Feeling productive!';
            } else if (energyLevel >= 40) {
                emoji = '🟡';
                status = 'Moderate Energy - Could use a boost';
            } else if (energyLevel >= 20) {
                emoji = '🟠';
                status = 'Low Energy - Time for self-care';
            } else {
                emoji = '🔴';
                status = 'Very Low - Rest and recharge needed';
            }
            
            await sock.sendMessage(from, {
                text: `${emoji} **Energy Level Check**\n\n**Current Energy:** ${energyLevel}%\n**Status:** ${status}\n\n**Today's Mood:** ${getMoodEmoji()}\n**Energy Trend:** ${getTrend()}\n\n💡 Use .energy boost for energy tips!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Energy Tracker',
                        body: `${energyLevel}% energy level`,
                        thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        function getMoodEmoji() {
            const moods = ['😊', '😎', '🤗', '😴', '🤔', '😌', '🙂', '😄'];
            return moods[Math.floor(Math.random() * moods.length)];
        }
        
        function getTrend() {
            const trends = ['📈 Rising', '📊 Stable', '📉 Declining'];
            return trends[Math.floor(Math.random() * trends.length)];
        }
    }
};
