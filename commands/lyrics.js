
import fetch from 'node-fetch';

export const command = {
    name: 'lyrics',
    aliases: ['lyric', 'song-lyrics'],
    description: 'Search for real song lyrics from multiple sources',
    usage: 'lyrics <artist> - <song> or lyrics <song name>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a song name or artist and song!\n\n📝 **Examples:**\n• .lyrics Adele - Hello\n• .lyrics Ed Sheeran - Perfect\n• .lyrics Asake - Lonely At The Top\n• .lyrics King Von - Revenge',
                contextInfo: {
                    externalAdReply: {
                        title: 'Lyrics Search',
                        body: 'Search for real song lyrics',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            // Send searching message
            await sock.sendMessage(from, {
                text: '🔍 Searching for lyrics... Please wait!'
            });
            
            // Parse artist and song
            let artist = '';
            let song = '';
            
            if (query.includes(' - ')) {
                [artist, song] = query.split(' - ').map(s => s.trim());
            } else {
                // Try to extract artist and song from natural text
                const words = query.split(' ');
                if (words.length >= 2) {
                    artist = words[0];
                    song = words.slice(1).join(' ');
                } else {
                    song = query;
                }
            }
            
            let lyricsData = null;
            
            // Try lyrics.ovh API first (free and reliable)
            if (artist && song) {
                try {
                    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.lyrics) {
                            lyricsData = data;
                        }
                    }
                } catch (error) {
                    console.log('Lyrics.ovh API failed:', error.message);
                }
            }
            
            // Try alternative API if first fails
            if (!lyricsData) {
                try {
                    const searchTerm = artist ? `${artist} ${song}` : song;
                    const response = await fetch(`https://lyrist.vercel.app/api/${encodeURIComponent(song)}/${encodeURIComponent(artist || 'unknown')}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.lyrics) {
                            lyricsData = { lyrics: data.lyrics, artist: data.artist, title: data.title };
                        }
                    }
                } catch (error) {
                    console.log('Lyrist API failed:', error.message);
                }
            }
            
            // Try another fallback API
            if (!lyricsData) {
                try {
                    const searchTerm = artist ? `${artist} ${song}` : song;
                    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(searchTerm)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.lyrics) {
                            lyricsData = data;
                        }
                    }
                } catch (error) {
                    console.log('Second lyrics API failed:', error.message);
                }
            }
            
            if (lyricsData && lyricsData.lyrics) {
                const lyrics = lyricsData.lyrics.trim();
                const displayArtist = lyricsData.artist || artist || 'Unknown';
                const displaySong = lyricsData.title || song || 'Unknown';
                const maxLength = 4000; // WhatsApp message limit
                
                if (lyrics.length > maxLength) {
                    // Split into multiple messages if too long
                    const parts = [];
                    for (let i = 0; i < lyrics.length; i += maxLength) {
                        parts.push(lyrics.substring(i, i + maxLength));
                    }
                    
                    for (let i = 0; i < parts.length; i++) {
                        const header = i === 0 ? `🎵 **${displayArtist} - ${displaySong}**\n\n` : `🎵 **Continued (${i + 1}/${parts.length})**\n\n`;
                        await sock.sendMessage(from, {
                            text: header + parts[i] + (i === parts.length - 1 ? '\n\n🎼 *Lyrics found successfully!*' : ''),
                            contextInfo: i === 0 ? {
                                externalAdReply: {
                                    title: `${displaySong} - ${displayArtist}`,
                                    body: 'Song lyrics found',
                                    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1
                                }
                            } : undefined
                        });
                        
                        // Small delay between messages
                        if (i < parts.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                } else {
                    await sock.sendMessage(from, {
                        text: `🎵 **${displayArtist} - ${displaySong}**\n\n${lyrics}\n\n🎼 *Lyrics found successfully!*`,
                        contextInfo: {
                            externalAdReply: {
                                title: `${displaySong} - ${displayArtist}`,
                                body: 'Song lyrics found',
                                thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                }
            } else {
                await sock.sendMessage(from, {
                    text: `🎵 **${query}**\n\n❌ **Lyrics not found**\n\n🔍 **Searched for:** ${query}\n\n💡 **Try these tips:**\n• Check spelling of artist and song\n• Use format: Artist - Song\n• Try popular/mainstream songs\n• Make sure the song exists\n\n**Working examples:**\n• .lyrics Adele - Hello\n• .lyrics Ed Sheeran - Perfect\n• .lyrics Drake - God's Plan\n• .lyrics Taylor Swift - Shake It Off`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Lyrics Not Found',
                            body: 'Try different search terms or check spelling',
                            thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
            
        } catch (error) {
            console.error('Lyrics command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to search for lyrics. Please try again later.\n\n🔄 **Try again with:**\n• Artist - Song format\n• Check your internet connection\n• Try a different song'
            });
        }
    }
};
