
export const command = {
    name: 'twitter',
    aliases: ['tweet', 'x'],
    description: 'Search Twitter/X posts',
    usage: 'twitter <username or topic>',
    category: 'social',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a username or topic!\n\nExample: .twitter @elonmusk or .twitter technology'
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            const twitterInfo = `🐦 **Twitter/X Search Results**

**Query:** ${query}

**Recent Tweets:**

**1.** 🔥 Hot take about technology...
👤 @techguru | 🔄 2.5K retweets | ❤️ 8.9K likes
⏰ 2 hours ago

**2.** 📈 Market update: Crypto is...
👤 @cryptoanalyst | 🔄 1.2K retweets | ❤️ 4.5K likes
⏰ 4 hours ago

**3.** 🎉 Excited to announce our new...
👤 @startup_ceo | 🔄 856 retweets | ❤️ 3.2K likes
⏰ 6 hours ago

**Trending Topics:**
#Technology #AI #Crypto #Innovation #StartUp

**Engagement Stats:**
• Total Impressions: 1.2M
• Total Engagements: 45.6K
• Sentiment: Mostly Positive

🔗 **Twitter/X:** https://x.com

💡 **Note:** This is sample information for demonstration.`;

            await sock.sendMessage(from, {
                text: twitterInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Twitter/X Search',
                        body: 'Social media posts',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=110',
                        sourceUrl: 'https://x.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to search Twitter!'
            });
        }
    }
};
