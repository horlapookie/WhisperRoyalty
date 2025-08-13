
import axios from 'axios';

export const command = {
    name: 'lyricssearch',
    aliases: ['searchlyrics', 'findlyrics'],
    description: 'Search for song lyrics by artist and title',
    usage: 'lyricssearch <artist> - <song>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🎵 **Lyrics Search**\n\n📝 **Usage:** .lyricssearch <artist> - <song>\n\n**Examples:**\n• .lyricssearch Ed Sheeran - Perfect\n• .lyricssearch Taylor Swift - Shake It Off\n• .lyricssearch The Beatles - Hey Jude'
            });
            return;
        }
        
        const query = args.trim();
        const parts = query.split(' - ');
        
        if (parts.length < 2) {
            await sock.sendMessage(from, {
                text: '❌ Please use format: artist - song\n\nExample: .lyricssearch Ed Sheeran - Perfect'
            });
            return;
        }
        
        const artist = parts[0].trim();
        const song = parts[1].trim();
        
        try {
            await sock.sendMessage(from, {
                text: '🔍 Searching for lyrics... Please wait!'
            });
            
            // Using lyrics.ovh API (free alternative)
            const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
            
            if (response.data && response.data.lyrics) {
                let lyrics = response.data.lyrics.trim();
                
                // Truncate if too long
                if (lyrics.length > 2000) {
                    lyrics = lyrics.substring(0, 1997) + '...';
                }
                
                await sock.sendMessage(from, {
                    text: `🎵 **Lyrics Found** 🎵\n\n🎤 **Artist:** ${artist}\n🎶 **Song:** ${song}\n\n📝 **Lyrics:**\n\n${lyrics}\n\n🔗 *Powered by lyrics.ovh*`,
                    contextInfo: {
                        externalAdReply: {
                            title: `${song} - ${artist}`,
                            body: 'Song lyrics',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=526',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: `❌ No lyrics found for "${song}" by ${artist}\n\n💡 **Tips:**\n• Check spelling\n• Try different song format\n• Some songs may not be available`
                });
            }
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Error searching for lyrics!\n\n🔍 **Search:** ${artist} - ${song}\n💡 **Try:**\n• Check spelling\n• Use different search terms\n• Try again later`
            });
        }
    }
};
