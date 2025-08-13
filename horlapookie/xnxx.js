
import axios from 'axios';
import { load } from 'cheerio';

export const command = {
    name: 'xnxx',
    aliases: ['xnx'],
    description: 'Search XNXX videos',
    usage: 'xnxx <search query>',
    category: 'nsfw',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a search query!\n\n📝 **Usage:**\n• .xnxx amateur\n• .xnxx teen\n• .xnxx milf\n\n🔞 **Note:** This is an adult command for 18+ users only',
                contextInfo: {
                    externalAdReply: {
                        title: '🔞 XNXX Search',
                        body: 'Adult content search - 18+ only',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=adult3',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        const query = args.trim();

        try {
            await sock.sendMessage(from, {
                text: '🔍 Searching XNXX... Please wait!'
            });

            const results = await searchXNXX(query);

            if (!results || results.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ No results found for your search query. Try different keywords.'
                });
                return;
            }

            let resultText = `🔞 **XNXX Search Results for "${query}"**\n\n`;
            
            results.slice(0, 8).forEach((video, index) => {
                resultText += `${index + 1}. **${video.title}**\n⏱️ ${video.duration} • 👁️ ${video.views}\n🔞 ${video.quality}\n\n`;
            });

            resultText += `\n🔞 **Total Results:** ${results.length}\n📱 **Use:** Reply with number to get video\n\n⚠️ **Warning:** Adult content - 18+ only`;

            await sock.sendMessage(from, {
                text: resultText,
                contextInfo: {
                    externalAdReply: {
                        title: '🔞 XNXX Search Results',
                        body: `${results.length} videos found`,
                        thumbnailUrl: results[0]?.thumbnail || 'https://picsum.photos/300/300?random=adult4',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });

        } catch (error) {
            console.error('XNXX search error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to search adult content. Try again later or use different keywords.'
            });
        }
    }
};

async function searchXNXX(query) {
    try {
        const searchUrl = `https://www.xnxx.com/search/${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = load(response.data);
        const results = [];

        $('.mozaique').each((index, element) => {
            const title = $(element).find('.thumb-under p a').attr('title');
            const url = 'https://www.xnxx.com' + $(element).find('.thumb-under p a').attr('href');
            const thumbnail = $(element).find('.thumb img').attr('data-src') || $(element).find('.thumb img').attr('src');
            const duration = $(element).find('.duration').text();
            const views = $(element).find('.metadata').text();
            const quality = $(element).find('.video-hd-mark').text() || 'SD';

            if (title && url) {
                results.push({
                    title: title.trim(),
                    url: url,
                    thumbnail: thumbnail,
                    duration: duration || 'Unknown',
                    views: views || 'Unknown',
                    quality: quality
                });
            }
        });

        return results.slice(0, 10);

    } catch (error) {
        console.error('XNXX search error:', error);
        return null;
    }
}
