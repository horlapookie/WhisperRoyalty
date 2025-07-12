
export const command = {
    name: '8ball',
    aliases: ['eightball', 'magic8'],
    description: 'Ask the magic 8-ball a question',
    usage: '8ball <question>',
    category: 'games',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🎱 Please ask a question!\n\nExample: .8ball Will it rain today?',
                quoted: msg
            });
            return;
        }
        
        const responses = [
            "It is certain",
            "Reply hazy, try again",
            "Don't count on it",
            "It is decidedly so",
            "Ask again later",
            "My reply is no",
            "Without a doubt",
            "Better not tell you now",
            "My sources say no",
            "Yes definitely",
            "Cannot predict now",
            "Outlook not so good",
            "You may rely on it",
            "Concentrate and ask again",
            "Very doubtful",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        await sock.sendMessage(from, {
            text: `🎱 **Magic 8-Ball**\n\nQuestion: ${args.trim()}\nAnswer: **${response}**`,
            contextInfo: {
                externalAdReply: {
                    title: 'Magic 8-Ball',
                    body: 'Fortune teller',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=100',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
