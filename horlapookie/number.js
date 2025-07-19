
import axios from 'axios';

export const command = {
    name: 'number',
    aliases: ['numfact'],
    description: 'Get interesting facts about numbers',
    usage: 'number [number]',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            let number = args.trim();
            if (!number) {
                number = Math.floor(Math.random() * 1000);
            }
            
            const response = await axios.get(`http://numbersapi.com/${number}`);
            const fact = response.data;
            
            await sock.sendMessage(from, {
                text: `🔢 **Number Fact**\n\n**Number:** ${number}\n\n**Fact:** ${fact}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Number Facts',
                        body: 'Interesting number trivia',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=14',
                        sourceUrl: 'http://numbersapi.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get number fact!'
            });
        }
    }
};
