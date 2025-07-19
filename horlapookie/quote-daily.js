
export const command = {
    name: 'dailyquote',
    aliases: ['dquote', 'quote-daily'],
    description: 'Get inspirational daily quote',
    usage: 'dailyquote',
    category: 'fun',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const quotes = [
                {
                    text: "The only way to do great work is to love what you do.",
                    author: "Steve Jobs"
                },
                {
                    text: "Innovation distinguishes between a leader and a follower.",
                    author: "Steve Jobs"
                },
                {
                    text: "Life is what happens to you while you're busy making other plans.",
                    author: "John Lennon"
                },
                {
                    text: "The future belongs to those who believe in the beauty of their dreams.",
                    author: "Eleanor Roosevelt"
                },
                {
                    text: "It is during our darkest moments that we must focus to see the light.",
                    author: "Aristotle"
                }
            ];
            
            const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
            
            const dailyQuoteText = `📅 **Daily Quote**
${new Date().toLocaleDateString()}

💭 *"${todayQuote.text}"*

✍️ **— ${todayQuote.author}**

🌟 **Daily Reflection:**
Take a moment to think about how this quote applies to your life today. What small action can you take to embody its wisdom?

💡 **Tip:** Save quotes that resonate with you and revisit them when you need motivation.`;

            await sock.sendMessage(from, {
                text: dailyQuoteText
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get daily quote!'
            });
        }
    }
};
