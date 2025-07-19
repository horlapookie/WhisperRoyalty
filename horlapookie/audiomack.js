
import axios from 'axios';

export const command = {
    name: 'audiomack',
    aliases: ['am', 'audiomackdl', 'audiomackdownload'],
    description: 'Download audio from Audiomack',
    usage: 'audiomack <url>',
    category: 'download',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args || args.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ Please provide an Audiomack URL!\n\n📝 **Usage:**\n• .audiomack <url>\n• .am <url>\n\n💡 **Example:**\n.audiomack https://audiomack.com/artist/song',
                contextInfo: {
                    externalAdReply: {
                        title: 'Audiomack Downloader',
                        body: 'Download audio from Audiomack',
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const url = args.join(' ').trim();
        
        // Validate Audiomack URL
        if (!url.includes('audiomack.com')) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a valid Audiomack URL!\n\n💡 **Valid formats:**\n• https://audiomack.com/artist/song\n• https://www.audiomack.com/artist/song'
            });
            return;
        }
        
        // Send processing message
        const processingMsg = await sock.sendMessage(from, {
            text: '🔄 Processing Audiomack URL... Please wait!',
            contextInfo: {
                externalAdReply: {
                    title: 'Processing...',
                    body: 'Fetching audio from Audiomack',
                    thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                    mediaType: 1
                }
            }
        });
        
        try {
            // Extract track ID from URL
            const urlParts = url.split('/');
            const trackId = urlParts[urlParts.length - 1];
            const artist = urlParts[urlParts.length - 2];
            
            if (!trackId || !artist) {
                throw new Error('Invalid Audiomack URL format');
            }
            
            // Use Audiomack API to get track info
            const apiUrl = `https://api.audiomack.com/v1/music/search?q=${encodeURIComponent(trackId)}&limit=1`;
            
            const response = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
            });
            
            if (response.data && response.data.results && response.data.results.length > 0) {
                const track = response.data.results[0];
                
                // Try to get download URL (Note: This might require additional API access)
                const downloadUrl = track.url_slug ? `https://audiomack.com/${track.artist}/${track.url_slug}` : url;
                
                // Delete processing message
                try {
                    await sock.sendMessage(from, { delete: processingMsg.key });
                } catch {}
                
                // Send track info with download option
                await sock.sendMessage(from, {
                    text: `🎵 **Audiomack Track Found**\n\n` +
                          `📛 **Title:** ${track.title || 'Unknown'}\n` +
                          `👤 **Artist:** ${track.artist || 'Unknown'}\n` +
                          `⏱️ **Duration:** ${track.duration ? Math.floor(track.duration / 60) + ':' + (track.duration % 60).toString().padStart(2, '0') : 'Unknown'}\n` +
                          `👀 **Plays:** ${track.plays_count || 'Unknown'}\n` +
                          `🔗 **URL:** ${downloadUrl}\n\n` +
                          `⚠️ **Note:** Due to Audiomack's terms of service, direct downloading may be limited. ` +
                          `Please use the official Audiomack app for the best experience.\n\n` +
                          `💡 **Alternative:** Try using our music search: .music ${track.title} ${track.artist}`,
                    contextInfo: {
                        externalAdReply: {
                            title: track.title || 'Audiomack Track',
                            body: `by ${track.artist || 'Unknown Artist'}`,
                            thumbnailUrl: track.image || 'https://files.catbox.moe/bh2fpj.jpg',
                            sourceUrl: downloadUrl,
                            mediaType: 1
                        }
                    }
                });
                
            } else {
                // Try alternative method - web scraping approach
                const webResponse = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                // Extract basic info from HTML
                const html = webResponse.data;
                const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                const title = titleMatch ? titleMatch[1].replace(' | Audiomack', '') : 'Unknown Track';
                
                // Delete processing message
                try {
                    await sock.sendMessage(from, { delete: processingMsg.key });
                } catch {}
                
                await sock.sendMessage(from, {
                    text: `🎵 **Audiomack Track Info**\n\n` +
                          `📛 **Title:** ${title}\n` +
                          `🔗 **URL:** ${url}\n\n` +
                          `⚠️ **Note:** This track was found on Audiomack. Due to platform restrictions, ` +
                          `direct downloading is not available. Please use the official Audiomack app or website.\n\n` +
                          `💡 **Alternative:** Try our music downloader: .music ${title.split(' - ')[0]}`,
                    contextInfo: {
                        externalAdReply: {
                            title: title,
                            body: 'Audiomack Track',
                            thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                            sourceUrl: url,
                            mediaType: 1
                        }
                    }
                });
            }
            
        } catch (error) {
            console.error('Audiomack error:', error);
            
            // Delete processing message
            try {
                await sock.sendMessage(from, { delete: processingMsg.key });
            } catch {}
            
            await sock.sendMessage(from, {
                text: '❌ Failed to process Audiomack URL.\n\n' +
                      '💡 **Possible solutions:**\n' +
                      '• Make sure the URL is correct and public\n' +
                      '• Try using our music downloader: .music <song name>\n' +
                      '• Use YouTube downloader: .yt <search>\n' +
                      '• Check if the track is available on other platforms\n\n' +
                      '⚠️ **Note:** Some Audiomack tracks may have download restrictions.',
                contextInfo: {
                    externalAdReply: {
                        title: 'Audiomack Error',
                        body: 'Failed to process track',
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
