
export const command = {
    name: 'joke',
    aliases: ['funny'],
    description: 'Get a random joke',
    usage: 'joke',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            const joke = await response.json();
            
            await sock.sendMessage(from, {
                text: `😄 **Random Joke**\n\n${joke.setup}\n\n${joke.punchline}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch joke. Try again later.',
                quoted: msg
            });
        }
    }
};
