
import axios from 'axios';

export const command = {
    name: 'advice',
    aliases: ['tip'],
    description: 'Get random advice',
    usage: 'advice',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await axios.get('https://api.adviceslip.com/advice');
            const advice = response.data.slip.advice;
            
            await sock.sendMessage(from, {
                text: `💡 **Random Advice**\n\n${advice}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Life Advice',
                        body: 'Daily wisdom',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=15',
                        sourceUrl: 'https://api.adviceslip.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            const fallbackAdvice = [
                "Don't put off tomorrow what you can do today.",
                "The journey of a thousand miles begins with one step.",
                "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                "It is during our darkest moments that we must focus to see the light.",
                "The only impossible journey is the one you never begin."
            ];
            
            const randomAdvice = fallbackAdvice[Math.floor(Math.random() * fallbackAdvice.length)];
            
            await sock.sendMessage(from, {
                text: `💡 **Random Advice**\n\n${randomAdvice}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Life Advice',
                        body: 'Daily wisdom',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=15',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
