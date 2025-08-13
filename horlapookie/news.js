
export const command = {
    name: 'news',
    aliases: ['headlines', 'breaking'],
    description: 'Get latest news headlines',
    usage: 'news [category]',
    category: 'info',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const category = args.trim().toLowerCase() || 'general';
        
        const newsData = `📰 **Latest News Headlines**

**Category:** ${category.toUpperCase()}

🔴 **Breaking News:**
• Major tech breakthrough announced today
• Global climate summit reaches agreement
• Stock markets show positive trends

📈 **Technology:**
• AI developments continue to advance
• New smartphone features revealed
• Cybersecurity updates released

🌍 **World News:**
• International cooperation on key issues
• Economic recovery shows progress
• Environmental initiatives launched

💡 **Note:** This is sample news data for demonstration. For real news, visit trusted news sources like BBC, Reuters, or AP News.

**Available Categories:**
• general, tech, world, business, sports, health, science`;

        await sock.sendMessage(from, {
            text: newsData,
            contextInfo: {
                externalAdReply: {
                    title: 'News Headlines',
                    body: 'Stay informed',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=25',
                    sourceUrl: 'https://news.google.com',
                    mediaType: 1
                }
            }
        });
    }
};
