
export const command = {
    name: 'darkjoke',
    description: 'Get random dark humor jokes',
    category: 'fun',
    usage: '.darkjoke',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const darkJokes = [
                "I told my wife she was drawing her eyebrows too high. She looked surprised.",
                "My therapist says I have a preoccupation with vengeance. We'll see about that.",
                "I bought the world's worst thesaurus yesterday. Not only is it terrible, it's terrible.",
                "Why don't scientists trust atoms? Because they make up everything!",
                "I used to hate facial hair, but then it grew on me.",
                "The early bird might get the worm, but the second mouse gets the cheese.",
                "I'm reading a book about anti-gravity. It's impossible to put down!",
                "Why did the scarecrow win an award? He was outstanding in his field!",
                "I told my cat a joke about dogs. He didn't find it a-mew-sing.",
                "What's the best thing about Switzerland? I don't know, but the flag is a big plus."
            ];
            
            const randomJoke = darkJokes[Math.floor(Math.random() * darkJokes.length)];
            
            await sock.sendMessage(from, {
                text: `😈 *Dark Humor*\n\n${randomJoke}\n\n⚠️ Warning: Dark humor ahead! 😄`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Dark Humor',
                        body: 'Adult jokes',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=116',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get dark joke!'
            });
        }
    }
};
