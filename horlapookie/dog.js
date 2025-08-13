
import axios from 'axios';

export const command = {
    name: 'dog',
    aliases: ['puppy'],
    description: 'Get random dog pictures',
    usage: 'dog',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await axios.get('https://dog.ceo/api/breeds/image/random');
            const dogUrl = response.data.message;
            
            await sock.sendMessage(from, {
                image: { url: dogUrl },
                caption: '🐶 **Random Dog**\n\nWoof! Here\'s your adorable dog picture!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Dog Pictures',
                        body: 'Cute dog images',
                        thumbnailUrl: dogUrl,
                        sourceUrl: 'https://dog.ceo',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get dog picture!'
            });
        }
    }
};
