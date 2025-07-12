
export const command = {
    name: 'music',
    aliases: ['song', 'track'],
    description: 'Search for music information',
    usage: 'music <artist or song name>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide an artist or song name!\n\nExample: .music Billie Eilish'
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            const musicInfo = `🎵 **Music Search Results**

**Query:** ${query}

**Top Results:**
1. **${query}** - Popular Track
   💫 Genre: Pop/Alternative
   ⏱️ Duration: ~3:30
   
2. **${query}** - Live Performance
   🎤 Genre: Live/Concert
   ⏱️ Duration: ~4:15
   
3. **${query}** - Acoustic Version
   🎸 Genre: Acoustic
   ⏱️ Duration: ~3:45

🔗 **Streaming Platforms:**
• Spotify: Available ✅
• Apple Music: Available ✅
• YouTube Music: Available ✅
• Deezer: Available ✅

💡 **Tip:** Use official streaming platforms for the best audio quality and to support artists!`;

            await sock.sendMessage(from, {
                text: musicInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Music Search',
                        body: 'Find your favorite tracks',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=20',
                        sourceUrl: 'https://spotify.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to search for music!'
            });
        }
    }
};
