
export const command = {
    name: 'tiktok',
    aliases: ['tt', 'tik'],
    description: 'Search TikTok videos',
    usage: 'tiktok <username or hashtag>',
    category: 'social',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a username or hashtag!\n\nExample: .tiktok @username or .tiktok #dance'
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            const tiktokInfo = `🎵 **TikTok Search Results**

**Query:** ${query}

**Top Videos:**

**1.** Amazing dance moves 💃
👤 @dancer123 | ❤️ 2.5M likes
📝 "Check out this sick move! #dance #viral"
⏱️ 15s | 🔄 156K shares

**2.** Funny pet compilation 🐕
👤 @petlover | ❤️ 1.8M likes  
📝 "My dog being dramatic again 😂 #pets #funny"
⏱️ 32s | 🔄 89K shares

**3.** Cooking tutorial 👨‍🍳
👤 @chef_master | ❤️ 1.2M likes
📝 "Easy 5-minute recipe! #cooking #food"
⏱️ 28s | 🔄 67K shares

**Trending Hashtags:**
#viral #foryou #trending #dance #funny

🔗 **TikTok:** https://tiktok.com

💡 **Note:** This is sample information for demonstration.`;

            await sock.sendMessage(from, {
                text: tiktokInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'TikTok Search',
                        body: 'Short video content',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=100',
                        sourceUrl: 'https://tiktok.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to search TikTok!'
            });
        }
    }
};
