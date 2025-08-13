
import axios from 'axios';
import { load } from 'cheerio';

export const command = {
    name: 'redtube',
    aliases: ['red', 'rt'],
    description: 'Search RedTube videos',
    usage: 'redtube <search query>',
    category: 'nsfw',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a search query!\n\n📝 **Usage:**\n• .redtube big tits\n• .redtube blowjob\n• .redtube hardcore\n\n🔞 **Note:** This is an adult command for 18+ users only',
                contextInfo: {
                    externalAdReply: {
                        title: '🔞 RedTube Search',
                        body: 'Adult content search - 18+ only',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=adult5',
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
                text: '🔍 Searching RedTube... Please wait!'
            });

            const results = await searchRedTube(query);

            if (!results || results.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ No results found for your search query. Try different keywords.'
                });
                return;
            }

            let resultText = `🔞 **RedTube Search Results for "${query}"**\n\n`;
            
            results.slice(0, 6).forEach((video, index) => {
                resultText += `${index + 1}. **${video.title}**\n⏱️ ${video.duration} • 👁️ ${video.views}\n💯 ${video.rating}% liked\n\n`;
            });

            resultText += `\n🔞 **Total Results:** ${results.length}\n🎬 **Platform:** RedTube\n\n⚠️ **Warning:** Adult content - 18+ only`;

            await sock.sendMessage(from, {
                text: resultText,
                contextInfo: {
                    externalAdReply: {
                        title: '🔞 RedTube Search Results',
                        body: `${results.length} videos found`,
                        thumbnailUrl: results[0]?.thumbnail || 'https://picsum.photos/300/300?random=adult6',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });

        } catch (error) {
            console.error('RedTube search error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to search adult content. Try again later or use different keywords.'
            });
        }
    }
};

async function searchRedTube(query) {
    try {
        const searchUrl = `https://www.redtube.com/?data[search][query]=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = load(response.data);
        const results = [];

        $('.video_link_td').each((index, element) => {
            const title = $(element).find('a').attr('title');
            const url = 'https://www.redtube.com' + $(element).find('a').attr('href');
            const thumbnail = $(element).find('img').attr('data-original') || $(element).find('img').attr('src');
            const duration = $(element).find('.duration').text();
            const views = $(element).find('.views').text();
            const rating = $(element).find('.rating').text();

            if (title && url) {
                results.push({
                    title: title.trim(),
                    url: url,
                    thumbnail: thumbnail,
                    duration: duration || 'Unknown',
                    views: views || 'Unknown',
                    rating: rating || 'N/A'
                });
            }
        });

        return results.slice(0, 10);

    } catch (error) {
        console.error('RedTube search error:', error);
        return null;
    }
}
