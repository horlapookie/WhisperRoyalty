
import fetch from 'node-fetch';

export const command = {
    name: 'anime',
    aliases: ['ani', 'manga'],
    description: 'Search for real anime information and images',
    usage: 'anime <anime name>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide an anime name!\n\n📝 **Examples:**\n• .anime Naruto\n• .anime Attack on Titan\n• .anime Demon Slayer\n• .anime One Piece\n• .anime Your Name',
                contextInfo: {
                    externalAdReply: {
                        title: 'Anime Search',
                        body: 'Search for real anime information',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
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
                text: '🔍 Searching for anime information... Please wait!'
            });
            
            // Use Jikan API (MyAnimeList unofficial API)
            const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`;
            
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            const animeList = data.data || [];
            
            if (animeList.length === 0) {
                await sock.sendMessage(from, {
                    text: `❌ No anime found for "${query}"\n\n💡 **Try:**\n• Check spelling\n• Use English anime names\n• Try popular anime titles\n\n**Popular anime:**\n• Naruto\n• Attack on Titan\n• Demon Slayer\n• One Piece\n• Dragon Ball`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Anime Not Found',
                            body: 'Try different search terms',
                            thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            const anime = animeList[0];
            
            // Format anime information
            const title = anime.title || 'Unknown';
            const titleEnglish = anime.title_english || title;
            const titleJapanese = anime.title_japanese || title;
            const type = anime.type || 'Unknown';
            const episodes = anime.episodes || 'Unknown';
            const status = anime.status || 'Unknown';
            const score = anime.score || 'N/A';
            const year = anime.year || 'Unknown';
            const synopsis = anime.synopsis ? (anime.synopsis.length > 300 ? anime.synopsis.substring(0, 300) + '...' : anime.synopsis) : 'No synopsis available';
            const genres = anime.genres ? anime.genres.map(g => g.name).join(', ') : 'Unknown';
            const studios = anime.studios ? anime.studios.map(s => s.name).join(', ') : 'Unknown';
            const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=700&fit=crop';
            
            const animeInfo = `🎌 **${titleEnglish}**\n\n` +
                `📺 **Japanese:** ${titleJapanese}\n` +
                `🎭 **Type:** ${type}\n` +
                `📺 **Episodes:** ${episodes}\n` +
                `📊 **Status:** ${status}\n` +
                `⭐ **Score:** ${score}/10\n` +
                `📅 **Year:** ${year}\n` +
                `🎨 **Genres:** ${genres}\n` +
                `🏢 **Studios:** ${studios}\n\n` +
                `📝 **Synopsis:**\n${synopsis}\n\n` +
                `🔗 **MyAnimeList ID:** ${anime.mal_id}`;
            
            await sock.sendMessage(from, {
                image: { url: imageUrl },
                caption: animeInfo,
                contextInfo: {
                    externalAdReply: {
                        title: titleEnglish,
                        body: `${type} • ${episodes} episodes • ${score}/10`,
                        thumbnailUrl: imageUrl,
                        sourceUrl: anime.url || 'https://myanimelist.net',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            console.error('Anime search error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to search for anime information.\n\n🔄 **Please try again with:**\n• Check spelling\n• Use popular anime names\n• Try again in a few moments\n\n**Popular searches:**\n• Naruto\n• Attack on Titan\n• Demon Slayer\n• One Piece'
            });
        }
    }
};
