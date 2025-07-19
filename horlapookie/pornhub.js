
import axios from 'axios';
import { load } from 'cheerio';

export const command = {
    name: 'pornhub',
    aliases: ['ph', 'phub'],
    description: 'Search and download PornHub videos',
    usage: 'pornhub <search query>',
    category: 'nsfw',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a search query!\n\n📝 **Usage:**\n• .pornhub big boobs\n• .pornhub amateur\n• .pornhub milf\n\n🔞 **Note:** This is an adult command for 18+ users only',
                contextInfo: {
                    externalAdReply: {
                        title: '🔞 PornHub Search',
                        body: 'Adult content search - 18+ only',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=adult',
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
                text: '🔍 Searching for adult content... Please wait!'
            });

            const results = await searchPornHub(query);

            if (!results || results.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ No results found for your search query. Try different keywords.'
                });
                return;
            }

            // Get random video from results
            const randomVideo = results[Math.floor(Math.random() * results.length)];
            const videoUrl = await getVideoUrl(randomVideo.url);

            if (videoUrl) {
                await sock.sendMessage(from, {
                    video: { url: videoUrl },
                    caption: `🔞 **PornHub Video**\n\n📹 **Title:** ${randomVideo.title}\n⏱️ **Duration:** ${randomVideo.duration}\n👁️ **Views:** ${randomVideo.views}\n🔗 **Source:** PornHub\n\n🔞 **Warning:** Adult content - 18+ only`,
                    contextInfo: {
                        externalAdReply: {
                            title: '🔞 PornHub Video',
                            body: `${randomVideo.duration} • ${randomVideo.views} views`,
                            thumbnailUrl: randomVideo.thumbnail,
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                // Send list of available videos
                let resultText = `🔞 **PornHub Search Results for "${query}"**\n\n`;
                
                results.slice(0, 5).forEach((video, index) => {
                    resultText += `${index + 1}. **${video.title}**\n⏱️ ${video.duration} • 👁️ ${video.views}\n🔗 ${video.url}\n\n`;
                });

                await sock.sendMessage(from, {
                    text: resultText,
                    contextInfo: {
                        externalAdReply: {
                            title: '🔞 PornHub Search Results',
                            body: `${results.length} videos found`,
                            thumbnailUrl: 'https://picsum.photos/300/300?random=adult2',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }

        } catch (error) {
            console.error('PornHub search error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to search adult content. Try again later or use different keywords.'
            });
        }
    }
};

async function searchPornHub(query) {
    try {
        const searchUrl = `https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = load(response.data);
        const results = [];

        $('.phimage').each((index, element) => {
            const title = $(element).find('a').attr('title');
            const url = 'https://www.pornhub.com' + $(element).find('a').attr('href');
            const thumbnail = $(element).find('img').attr('data-src') || $(element).find('img').attr('src');
            const duration = $(element).find('.duration').text();
            const views = $(element).find('.views').text();

            if (title && url) {
                results.push({
                    title: title.trim(),
                    url: url,
                    thumbnail: thumbnail,
                    duration: duration || 'Unknown',
                    views: views || 'Unknown'
                });
            }
        });

        return results.slice(0, 10);

    } catch (error) {
        console.error('PornHub search error:', error);
        return null;
    }
}

async function getVideoUrl(pageUrl) {
    try {
        // This would require additional processing to extract actual video URLs
        // For now, returning null to show search results instead
        return null;
        
    } catch (error) {
        console.error('Video URL extraction error:', error);
        return null;
    }
}
