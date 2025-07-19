
export const command = {
    name: 'horoscope',
    aliases: ['zodiac', 'astro'],
    description: 'Get your daily horoscope',
    usage: 'horoscope <zodiac sign>',
    category: 'fun',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide your zodiac sign!\n\nExample: .horoscope leo\n\n♈ Aries ♉ Taurus ♊ Gemini ♋ Cancer\n♌ Leo ♍ Virgo ♎ Libra ♏ Scorpio\n♐ Sagittarius ♑ Capricorn ♒ Aquarius ♓ Pisces'
            });
            return;
        }
        
        const sign = args.trim().toLowerCase();
        
        const zodiacSigns = {
            aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
            leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
            sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
        };
        
        if (!zodiacSigns[sign]) {
            await sock.sendMessage(from, {
                text: '❌ Invalid zodiac sign! Please use one of the 12 zodiac signs.'
            });
            return;
        }
        
        try {
            const horoscopes = [
                "Today brings new opportunities your way. Stay open to unexpected possibilities.",
                "Focus on relationships today. A meaningful conversation could change your perspective.",
                "Your creativity is flowing. Use this energy to tackle that project you've been putting off.",
                "Financial matters need attention. Review your budget and make wise decisions.",
                "Adventure calls to you today. Step out of your comfort zone and explore.",
                "Health and wellness should be your priority. Take time for self-care.",
                "Communication is key today. Express your feelings honestly and openly.",
                "Trust your intuition. Your inner voice is guiding you in the right direction."
            ];
            
            const randomHoroscope = horoscopes[Math.floor(Math.random() * horoscopes.length)];
            
            const horoscopeText = `🔮 **Daily Horoscope**

${zodiacSigns[sign]} **${sign.charAt(0).toUpperCase() + sign.slice(1)}**
📅 ${new Date().toLocaleDateString()}

**Today's Reading:**
${randomHoroscope}

**Lucky Number:** ${Math.floor(Math.random() * 99) + 1}
**Lucky Color:** ${['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'][Math.floor(Math.random() * 6)]}

✨ **Mood:** ${['Optimistic', 'Energetic', 'Peaceful', 'Creative', 'Confident'][Math.floor(Math.random() * 5)]}

💡 **Note:** For entertainment purposes only.`;

            await sock.sendMessage(from, {
                text: horoscopeText,
                contextInfo: {
                    externalAdReply: {
                        title: 'Daily Horoscope',
                        body: 'Zodiac predictions',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=130',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get horoscope!'
            });
        }
    }
};
