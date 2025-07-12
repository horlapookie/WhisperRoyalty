
import axios from 'axios';

export const command = {
    name: 'cat',
    aliases: ['kitty'],
    description: 'Get random cat pictures',
    usage: 'cat',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const catUrl = response.data[0].url;
            
            await sock.sendMessage(from, {
                image: { url: catUrl },
                caption: '🐱 **Random Cat**\n\nMeow! Here\'s your cute cat picture!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Cat Pictures',
                        body: 'Cute cat images',
                        thumbnailUrl: catUrl,
                        sourceUrl: 'https://thecatapi.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get cat picture!'
            });
        }
    }
};
