
export const command = {
    name: 'instagram',
    aliases: ['ig', 'insta'],
    description: 'Get Instagram profile info',
    usage: 'instagram <username>',
    category: 'social',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide an Instagram username!\n\nExample: .instagram cristiano'
            });
            return;
        }
        
        const username = args.trim().replace('@', '');
        
        try {
            const igInfo = `📸 **Instagram Profile**

**Username:** @${username}
**Display Name:** Sample User
**Bio:** Living life to the fullest ✨

**Stats:**
• Posts: 1,234
• Followers: 50.2M
• Following: 456

**Profile Type:** Public
**Verified:** ✅ Yes
**Business Account:** No

**Recent Activity:**
• Last Post: 2 hours ago
• Stories: 3 active

🔗 **Profile:** https://instagram.com/${username}

💡 **Note:** This is sample information for demonstration.`;

            await sock.sendMessage(from, {
                text: igInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `@${username}`,
                        body: 'Instagram Profile',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=50',
                        sourceUrl: `https://instagram.com/${username}`,
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch Instagram profile!'
            });
        }
    }
};
