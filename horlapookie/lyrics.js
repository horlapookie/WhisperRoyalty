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
                text: '🔍 Searching for lyrics... Please wait!'
            });

            const options = {
                apiKey: GENIUS_ACCESS_SECRET,
                title: query,
                optimizeQuery: true
            };

            const lyrics = await getLyrics(options);

            if (!lyrics || lyrics.trim() === '') {
                await sock.sendMessage(from, {
                    text: `❌ No lyrics found for "${query}"\n\n💡 **Tips:**\n• Check spelling\n• Try different keywords\n• Use artist name + song title\n• Use .lyricssearch for better results`
                });
                return;
            }

            // Truncate if too long
            let finalLyrics = lyrics.trim();
            if (finalLyrics.length > 2000) {
                finalLyrics = finalLyrics.substring(0, 1997) + '...';
            }

            await sock.sendMessage(from, {
                text: `🎵 **Lyrics Found** 🎵\n\n🎶 **Search Query:** ${query}\n\n📝 **Lyrics:**\n\n${finalLyrics}\n\n🔗 *Powered by Genius API*`,
                contextInfo: {
                    externalAdReply: {
                        title: `Lyrics: ${query}`,
                        body: 'Song lyrics from Genius',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=526',
                        sourceUrl: 'https://genius.com',
                        mediaType: 1
                    }
                }
            });

        } catch (error) {
            console.error('Search error:', error);
            await sock.sendMessage(from, { 
                text: "Error searching for lyrics. Please try again." 
            }, { quoted: msg });
        }
    }
};