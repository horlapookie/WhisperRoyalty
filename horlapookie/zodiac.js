
export const command = {
    name: 'zodiac',
    aliases: ['sign', 'astrology'],
    description: 'Get detailed zodiac sign information',
    usage: 'zodiac <sign> | zodiac aries',
    category: 'fun',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const zodiacSigns = {
            aries: {
                name: 'Aries',
                symbol: '♈',
                element: 'Fire',
                dates: 'March 21 - April 19',
                traits: ['Bold', 'Ambitious', 'Confident', 'Independent'],
                weaknesses: ['Impatient', 'Impulsive', 'Short-tempered'],
                compatible: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
                description: 'Natural born leaders with endless energy and enthusiasm.'
            },
            taurus: {
                name: 'Taurus',
                symbol: '♉',
                element: 'Earth',
                dates: 'April 20 - May 20',
                traits: ['Reliable', 'Patient', 'Practical', 'Devoted'],
                weaknesses: ['Stubborn', 'Possessive', 'Uncompromising'],
                compatible: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
                description: 'Grounded and stable, with a love for beauty and comfort.'
            },
            gemini: {
                name: 'Gemini',
                symbol: '♊',
                element: 'Air',
                dates: 'May 21 - June 20',
                traits: ['Curious', 'Adaptable', 'Witty', 'Communicative'],
                weaknesses: ['Indecisive', 'Inconsistent', 'Nervous'],
                compatible: ['Libra', 'Aquarius', 'Aries', 'Leo'],
                description: 'Quick-witted and versatile, always seeking new experiences.'
            },
            cancer: {
                name: 'Cancer',
                symbol: '♋',
                element: 'Water',
                dates: 'June 21 - July 22',
                traits: ['Emotional', 'Intuitive', 'Protective', 'Caring'],
                weaknesses: ['Moody', 'Oversensitive', 'Pessimistic'],
                compatible: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
                description: 'Deeply intuitive and sentimental, home and family oriented.'
            },
            leo: {
                name: 'Leo',
                symbol: '♌',
                element: 'Fire',
                dates: 'July 23 - August 22',
                traits: ['Generous', 'Warmhearted', 'Creative', 'Confident'],
                weaknesses: ['Arrogant', 'Stubborn', 'Self-centered'],
                compatible: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
                description: 'Natural performers who love being in the spotlight.'
            },
            virgo: {
                name: 'Virgo',
                symbol: '♍',
                element: 'Earth',
                dates: 'August 23 - September 22',
                traits: ['Analytical', 'Practical', 'Reliable', 'Modest'],
                weaknesses: ['Overly critical', 'Worrier', 'Perfectionist'],
                compatible: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
                description: 'Detail-oriented perfectionists with analytical minds.'
            },
            libra: {
                name: 'Libra',
                symbol: '♎',
                element: 'Air',
                dates: 'September 23 - October 22',
                traits: ['Diplomatic', 'Fair-minded', 'Social', 'Gracious'],
                weaknesses: ['Indecisive', 'Avoids confrontation', 'Self-pity'],
                compatible: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
                description: 'Peaceful and fair, always seeking balance and harmony.'
            },
            scorpio: {
                name: 'Scorpio',
                symbol: '♏',
                element: 'Water',
                dates: 'October 23 - November 21',
                traits: ['Passionate', 'Determined', 'Brave', 'Loyal'],
                weaknesses: ['Jealous', 'Secretive', 'Resentful'],
                compatible: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
                description: 'Intense and mysterious, with incredible emotional depth.'
            },
            sagittarius: {
                name: 'Sagittarius',
                symbol: '♐',
                element: 'Fire',
                dates: 'November 22 - December 21',
                traits: ['Adventurous', 'Optimistic', 'Honest', 'Philosophical'],
                weaknesses: ['Impatient', 'Tactless', 'Restless'],
                compatible: ['Aries', 'Leo', 'Libra', 'Aquarius'],
                description: 'Freedom-loving adventurers with a philosophical nature.'
            },
            capricorn: {
                name: 'Capricorn',
                symbol: '♑',
                element: 'Earth',
                dates: 'December 22 - January 19',
                traits: ['Ambitious', 'Disciplined', 'Patient', 'Responsible'],
                weaknesses: ['Pessimistic', 'Stubborn', 'Unforgiving'],
                compatible: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
                description: 'Ambitious achievers who value tradition and hard work.'
            },
            aquarius: {
                name: 'Aquarius',
                symbol: '♒',
                element: 'Air',
                dates: 'January 20 - February 18',
                traits: ['Independent', 'Original', 'Humanitarian', 'Inventive'],
                weaknesses: ['Unpredictable', 'Detached', 'Stubborn'],
                compatible: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
                description: 'Unique and independent thinkers who value freedom.'
            },
            pisces: {
                name: 'Pisces',
                symbol: '♓',
                element: 'Water',
                dates: 'February 19 - March 20',
                traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle'],
                weaknesses: ['Overly trusting', 'Escapist', 'Idealistic'],
                compatible: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
                description: 'Dreamy and compassionate souls with rich imaginations.'
            }
        };
        
        if (!args.trim()) {
            const signsList = Object.keys(zodiacSigns).map(sign => 
                `${zodiacSigns[sign].symbol} ${zodiacSigns[sign].name}`
            ).join('\n');
            
            await sock.sendMessage(from, {
                text: `🔮 **Zodiac Signs** 🔮\n\n${signsList}\n\n💫 Use .zodiac <sign> for detailed information\nExample: .zodiac aries`
            });
            return;
        }
        
        const sign = args.trim().toLowerCase();
        const zodiac = zodiacSigns[sign];
        
        if (!zodiac) {
            await sock.sendMessage(from, {
                text: '❌ Invalid zodiac sign! Use .zodiac to see all available signs.'
            });
            return;
        }
        
        await sock.sendMessage(from, {
            text: `🔮 **${zodiac.symbol} ${zodiac.name} ${zodiac.symbol}**\n\n📅 **Dates:** ${zodiac.dates}\n🌟 **Element:** ${zodiac.element}\n\n✨ **Positive Traits:**\n• ${zodiac.traits.join('\n• ')}\n\n⚠️ **Weaknesses:**\n• ${zodiac.weaknesses.join('\n• ')}\n\n💕 **Compatible With:**\n• ${zodiac.compatible.join('\n• ')}\n\n📖 **Description:**\n${zodiac.description}\n\n🔮 *The stars have spoken!*`,
            contextInfo: {
                externalAdReply: {
                    title: `${zodiac.symbol} ${zodiac.name}`,
                    body: `${zodiac.dates} • ${zodiac.element} Sign`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=523',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
