
import axios from 'axios';

export const command = {
    name: 'shorten',
    aliases: ['shorturl', 'tinyurl'],
    description: 'Shorten long URLs using TinyURL service',
    usage: 'shorten <url>',
    category: 'utility',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🔗 **URL Shortener**\n\n📝 **Usage:** .shorten <url>\n\n**Example:** .shorten https://www.example.com/very/long/url/path\n\n💡 I\'ll create a shorter, easier to share URL!'
            });
            return;
        }
        
        let url = args.trim();
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // Basic URL validation
        try {
            new URL(url);
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Invalid URL format!\n\n💡 **Examples of valid URLs:**\n• https://www.example.com\n• http://example.com\n• example.com (protocol will be added)'
            });
            return;
        }
        
        try {
            await sock.sendMessage(from, {
                text: '🔗 Shortening URL... Please wait!'
            });
            
            // Using TinyURL API
            const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
            
            if (response.data && response.data.includes('tinyurl.com')) {
                const shortUrl = response.data.trim();
                const originalLength = url.length;
                const shortLength = shortUrl.length;
                const savedChars = originalLength - shortLength;
                const compressionPercent = ((savedChars / originalLength) * 100).toFixed(1);
                
                await sock.sendMessage(from, {
                    text: `🔗 **URL Shortened Successfully!** ✅\n\n📎 **Original URL:**\n${url}\n\n🎯 **Shortened URL:**\n${shortUrl}\n\n📊 **Statistics:**\n• **Original length:** ${originalLength} characters\n• **Shortened length:** ${shortLength} characters\n• **Characters saved:** ${savedChars}\n• **Compression:** ${compressionPercent}%\n\n📋 *Shortened URL copied to message - easy to share!*`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'URL Shortened',
                            body: `Saved ${savedChars} characters`,
                            thumbnailUrl: 'https://picsum.photos/300/300?random=531',
                            sourceUrl: shortUrl,
                            mediaType: 1
                        }
                    }
                });
            } else {
                throw new Error('Invalid response from TinyURL');
            }
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Failed to shorten URL!\n\n🔗 **Original URL:** ${url}\n\n💡 **Possible issues:**\n• URL might be invalid or unreachable\n• Service temporarily unavailable\n• URL might already be shortened\n\n🔄 Try again later or check the URL format.`
            });
        }
    }
};
