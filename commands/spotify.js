
export const command = {
    name: 'spotify',
    aliases: ['spot', 'music-info'],
    description: 'Search Spotify tracks',
    usage: 'spotify <artist or song>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide an artist or song name!\n\nExample: .spotify Billie Eilish'
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            const spotifyInfo = `🎵 **Spotify Search Results**

**Query:** ${query}

**Top Tracks:**

**1.** ${query} - Hit Single
👤 Artist: Top Artist
💿 Album: Latest Album (2023)
⏱️ Duration: 3:45
🎧 Popularity: 95/100

**2.** ${query} (Acoustic Version)
👤 Artist: Same Artist
💿 Album: Acoustic Sessions
⏱️ Duration: 4:12
🎧 Popularity: 87/100

**3.** ${query} (Remix)
👤 Artist: DJ Remix Master
💿 Album: Remix Collection
⏱️ Duration: 5:28
🎧 Popularity: 79/100

🎧 **Listen on Spotify:** https://open.spotify.com
📱 **Available on:** Mobile, Desktop, Web Player

💡 **Note:** This is sample information for demonstration.`;

            await sock.sendMessage(from, {
                text: spotifyInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Spotify Search',
                        body: 'Music streaming results',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=70',
                        sourceUrl: 'https://open.spotify.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to search Spotify!'
            });
        }
    }
};
