import axios from 'axios';

export const command = {
    name: 'wikipedia',
    aliases: ['wiki', 'search-wiki'],
    description: 'Search Wikipedia for information',
    usage: 'wikipedia <search_query>',
    category: 'info',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, settings } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '📚 Please provide a search query!\n\nExample: .wikipedia Albert Einstein'
            });
            return;
        }

        const query = args.trim();

        try {
            // First, search for the page
            const searchResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    format: 'json',
                    list: 'search',
                    srsearch: query,
                    srlimit: 1
                }
            });

            const searchResults = searchResponse.data.query.search;

            if (searchResults.length === 0) {
                await sock.sendMessage(from, {
                    text: `📚 **Wikipedia Search**\n\n🔍 **Query:** ${query}\n\n❌ No results found.\n\nTry:\n• Different spelling\n• More specific terms\n• Alternative names`
                });
                return;
            }

            const pageTitle = searchResults[0].title;
            const snippet = searchResults[0].snippet.replace(/<[^>]*>/g, ''); // Remove HTML tags

            // Get the full page summary
            const summaryResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`);
            const data = summaryResponse.data;

            const title = data.title || pageTitle;
            const extract = data.extract || snippet || 'No description available';
            const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
            const thumbnail = data.thumbnail?.source || '';

            await sock.sendMessage(from, {
                text: `📚 **Wikipedia**\n\n**${title}**\n\n${extract}\n\n🔗 **Read more:** ${pageUrl}`,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: 'Wikipedia Article',
                        thumbnailUrl: thumbnail || settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: pageUrl,
                        mediaType: 1
                    }
                }
            });

        } catch (error) {
            console.error('Wikipedia search error:', error);
            await sock.sendMessage(from, {
                text: `❌ Wikipedia search failed: ${error.message}\n\nTry:\n• Checking your internet connection\n• Using a different search term\n• Trying again later`
            });
        }
    }
};