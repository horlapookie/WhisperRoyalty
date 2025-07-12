
export const command = {
    name: 'quote',
    aliases: ['inspire'],
    description: 'Get an inspirational quote',
    usage: 'quote',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await fetch('https://api.quotegarden.io/api/v3/quotes/random');
            const data = await response.json();
            const quote = data.data;
            
            await sock.sendMessage(from, {
                text: `💭 **Inspirational Quote**\n\n"${quote.quoteText}"\n\n— ${quote.quoteAuthor}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch quote. Try again later.',
                quoted: msg
            });
        }
    }
};
