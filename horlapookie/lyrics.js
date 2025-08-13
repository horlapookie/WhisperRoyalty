import { settings } from '../settings.js';

import Genius from "genius-lyrics";
import { getLyrics } from "genius-lyrics-api";

const GENIUS_ACCESS_SECRET = settings.geniusApiKey;
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const Client = new Genius.Client(GENIUS_ACCESS_SECRET);

export const command = {
    name: 'lyrics',
    aliases: ['lyric', 'song'],
    description: 'Get song lyrics using Genius API',
    usage: 'lyrics <song name>',
    category: 'media',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, args: query } = context;

        if (!GENIUS_ACCESS_SECRET || GENIUS_ACCESS_SECRET === "YOUR_GENIUS_API_KEY_HERE" || GENIUS_ACCESS_SECRET.trim() === "") {
            return await sock.sendMessage(from, {
                text: "❌ **Genius API Key Missing**\n\n🔑 The bot owner needs to configure the Genius API key in settings.js\n\n💡 Get your API key from: https://genius.com/api-clients"
            }, { quoted: msg });
        }

        if (!query || !query.trim || query.trim() === '') {
            return await sock.sendMessage(from, {
                text: "Enter the song name."
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(from, {
                text: '🎵 **Searching for lyrics...**\n⏳ Please wait while I find the song!',
                contextInfo: {
                    externalAdReply: {
                        title: '🎵 Lyrics Search',
                        body: 'Searching Genius database...',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=526',
                        sourceUrl: 'https://genius.com',
                        mediaType: 1
                    }
                }
            });

            // Try multiple search approaches
            let lyrics = null;
            let searchMethod = '';
            
            // Method 1: Direct search with getLyrics
            try {
                const options = {
                    apiKey: GENIUS_ACCESS_SECRET,
                    title: query,
                    optimizeQuery: true
                };
                lyrics = await getLyrics(options);
                searchMethod = 'Direct search';
            } catch (directError) {
                console.log('Direct search failed:', directError.message);
            }
            
            // Method 2: If direct search fails, try with Genius client
            if (!lyrics || lyrics.trim() === '') {
                try {
                    const searches = await Client.songs.search(query);
                    if (searches.length > 0) {
                        const song = searches[0];
                        lyrics = await song.lyrics();
                        searchMethod = 'Genius client search';
                    }
                } catch (clientError) {
                    console.log('Client search failed:', clientError.message);
                }
            }
            
            // Method 3: Try with cleaned query
            if (!lyrics || lyrics.trim() === '') {
                try {
                    const cleanQuery = query.replace(/[^\w\s]/gi, '').trim();
                    const options = {
                        apiKey: GENIUS_ACCESS_SECRET,
                        title: cleanQuery,
                        optimizeQuery: true
                    };
                    lyrics = await getLyrics(options);
                    searchMethod = 'Cleaned query search';
                } catch (cleanError) {
                    console.log('Clean search failed:', cleanError.message);
                }
            }

            if (!lyrics || lyrics.trim() === '') {
                await sock.sendMessage(from, {
                    text: `❌ **No lyrics found for "${query}"**\n\n💡 **Search Tips:**\n• Include artist name: "Ed Sheeran Perfect"\n• Check spelling carefully\n• Try shorter keywords\n• Use English song titles\n• Avoid special characters\n\n🔄 **Alternative:**\nTry: \`.lyricssearch ${query}\`\n\n📱 **Popular searches:**\n• "Bohemian Rhapsody Queen"\n• "Imagine Dragons Believer"\n• "Taylor Swift Anti Hero"`,
                    contextInfo: {
                        externalAdReply: {
                            title: '❌ Lyrics Not Found',
                            body: 'Try different search terms',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=527',
                            sourceUrl: 'https://genius.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }

            // Clean and format lyrics
            let finalLyrics = lyrics.trim();
            
            // Remove extra whitespace and format
            finalLyrics = finalLyrics.replace(/\n{3,}/g, '\n\n');
            finalLyrics = finalLyrics.replace(/\[.*?\]/g, (match) => `\n${match}\n`);
            
            // Truncate if too long for WhatsApp
            const maxLength = 3000;
            if (finalLyrics.length > maxLength) {
                finalLyrics = finalLyrics.substring(0, maxLength - 50);
                // Try to cut at a complete line
                const lastNewline = finalLyrics.lastIndexOf('\n');
                if (lastNewline > maxLength - 200) {
                    finalLyrics = finalLyrics.substring(0, lastNewline);
                }
                finalLyrics += '\n\n...[Lyrics truncated - Full lyrics available on Genius.com]';
            }
            
            // Count lines and estimate read time
            const lineCount = finalLyrics.split('\n').length;
            const wordCount = finalLyrics.split(' ').length;
            const readTime = Math.ceil(wordCount / 200); // Average reading speed

            await sock.sendMessage(from, {
                text: `🎵 **Lyrics Found!** 🎵\n\n🎶 **Song:** ${query}\n🔍 **Method:** ${searchMethod}\n📊 **Stats:** ${lineCount} lines • ${wordCount} words • ${readTime}min read\n\n📝 **Lyrics:**\n\n${finalLyrics}\n\n🎼 *Powered by Genius API*\n💫 *yourhïghness Bot*`,
                contextInfo: {
                    externalAdReply: {
                        title: `🎵 ${query}`,
                        body: `${lineCount} lines • Powered by Genius`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=526',
                        sourceUrl: 'https://genius.com',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });

        } catch (error) {
            console.error('Lyrics search error:', error);
            
            let errorMessage = `❌ **Lyrics Search Failed**\n\n🎯 Query: "${query}"\n💥 Error: ${error.message}\n\n`;
            
            if (error.message.includes('API')) {
                errorMessage += `🔑 **API Issue:**\n• Genius API might be down\n• Rate limit exceeded\n• Invalid API key\n\n`;
            } else if (error.message.includes('timeout')) {
                errorMessage += `⏰ **Timeout:**\n• Search took too long\n• Try a shorter query\n• Check internet connection\n\n`;
            } else if (error.message.includes('network')) {
                errorMessage += `🌐 **Network Issue:**\n• Connection problem\n• Try again in a moment\n• Check connectivity\n\n`;
            }
            
            errorMessage += `🔄 **What to try:**\n• Simplify search terms\n• Use: .lyricssearch ${query}\n• Try again in a few minutes\n• Check song title spelling\n\n💡 **Example searches:**\n• "Shape of You"\n• "Billie Eilish Bad Guy"\n• "The Weeknd Blinding Lights"`;

            await sock.sendMessage(from, { 
                text: errorMessage,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Lyrics Search Error',
                        body: 'Something went wrong',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=528',
                        sourceUrl: 'https://genius.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};