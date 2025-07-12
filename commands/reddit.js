
export const command = {
    name: 'reddit',
    aliases: ['rd', 'subreddit'],
    description: 'Search Reddit posts',
    usage: 'reddit <subreddit>',
    category: 'social',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a subreddit name!\n\nExample: .reddit funny'
            });
            return;
        }
        
        const subreddit = args.trim().replace('r/', '');
        
        try {
            const redditInfo = `📱 **Reddit Posts from r/${subreddit}**

**Top Posts Today:**

**1.** Funny cat does backflip
👍 12.5k upvotes | 💬 234 comments
Posted by u/funnyuser123

**2.** TIL something amazing
👍 8.9k upvotes | 💬 156 comments  
Posted by u/todayilearned

**3.** Check out this cool project
👍 5.2k upvotes | 💬 89 comments
Posted by u/cooldev456

**Subreddit Info:**
• Members: 2.1M
• Online Now: 15.3k
• Created: 2008

🔗 **Visit:** https://reddit.com/r/${subreddit}

💡 **Note:** This is sample data for demonstration.`;

            await sock.sendMessage(from, {
                text: redditInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `r/${subreddit}`,
                        body: 'Reddit Community',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=40',
                        sourceUrl: `https://reddit.com/r/${subreddit}`,
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch Reddit posts!'
            });
        }
    }
};
