
export const command = {
    name: 'steam',
    aliases: ['game', 'steam-game'],
    description: 'Search Steam games',
    usage: 'steam <game name>',
    category: 'gaming',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a game name!\n\nExample: .steam Counter Strike'
            });
            return;
        }
        
        const gameName = args.trim();
        
        try {
            const gameInfo = `🎮 **Steam Game Information**

**Game:** ${gameName}
**Developer:** Sample Studios
**Publisher:** Epic Games
**Release Date:** 2023

**Price:** $29.99
**Current Discount:** 50% OFF ($14.99)

**Rating:** ⭐ Very Positive (95% of 125,000 reviews)

**Features:**
• Single-player ✅
• Multi-player ✅
• Co-op ✅
• Steam Achievements ✅
• Trading Cards ✅

**System Requirements:**
• OS: Windows 10
• Processor: Intel i5-4590
• Memory: 8 GB RAM
• Graphics: GTX 1060

**Tags:** Action, Adventure, Multiplayer

🔗 **Steam Store:** https://store.steampowered.com

💡 **Note:** This is sample information for demonstration.`;

            await sock.sendMessage(from, {
                text: gameInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Steam Game',
                        body: gameName,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=60',
                        sourceUrl: 'https://store.steampowered.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to search Steam games!'
            });
        }
    }
};
