
export const command = {
    name: 'meme',
    aliases: ['funny-pic'],
    description: 'Get a random meme',
    usage: 'meme',
    category: 'misc',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await fetch('https://meme-api.com/gimme');
            const meme = await response.json();
            
            await sock.sendMessage(from, {
                image: { url: meme.url },
                caption: `😂 **${meme.title}**\n\nFrom: r/${meme.subreddit}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch meme. Try again later.',
                quoted: msg
            });
        }
    }
};
