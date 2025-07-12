
export const command = {
    name: 'dream',
    aliases: ['dreams'],
    description: 'Dream interpretation and analysis',
    category: 'fun',
    usage: '.dream <description>',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '💭 **Dream Interpreter**\n\nDescribe your dream and I\'ll help interpret it!\n\nExample: .dream I was flying over mountains\n\n✨ Dreams are the windows to our subconscious!'
            });
            return;
        }
        
        const dream = args.trim().toLowerCase();
        const interpretations = {
            'flying': 'Freedom, ambition, desire to escape limitations',
            'water': 'Emotions, subconscious, cleansing or renewal',
            'animals': 'Instincts, natural behavior, untamed aspects',
            'death': 'Transformation, end of a phase, new beginnings',
            'falling': 'Loss of control, anxiety, fear of failure',
            'chased': 'Avoidance, running from problems or fears',
            'house': 'Self, psyche, different aspects of personality',
            'fire': 'Passion, anger, destruction or purification',
            'money': 'Value, self-worth, power or security concerns',
            'baby': 'New beginnings, innocence, potential for growth'
        };
        
        let interpretation = 'Your dream is unique and personal to you. ';
        
        for (const [symbol, meaning] of Object.entries(interpretations)) {
            if (dream.includes(symbol)) {
                interpretation += `The presence of ${symbol} suggests: ${meaning}. `;
            }
        }
        
        const generalAdvice = [
            'Consider what emotions you felt during the dream.',
            'Think about current life situations that might relate.',
            'Dreams often reflect our daily thoughts and concerns.',
            'Keep a dream journal to notice patterns.',
            'Your subconscious may be processing recent experiences.'
        ];
        
        const advice = generalAdvice[Math.floor(Math.random() * generalAdvice.length)];
        
        await sock.sendMessage(from, {
            text: `💭 **Dream Interpretation**\n\n🌙 **Your Dream:**\n"${args.trim()}"\n\n🔮 **Possible Meaning:**\n${interpretation}\n\n💡 **Insight:**\n${advice}\n\n✨ Remember: You are the best interpreter of your own dreams!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Dream Analysis',
                    body: 'Unlock your subconscious',
                    thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
