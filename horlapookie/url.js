
export const command = {
    name: 'url',
    aliases: ['shorten', 'link'],
    description: 'Shorten a long URL',
    usage: 'url <long_url>',
    category: 'misc',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🔗 Please provide a URL to shorten!\n\nExample: .url https://www.google.com',
                quoted: msg
            });
            return;
        }
        
        const url = args.trim();
        
        try {
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
            const shortUrl = await response.text();
            
            if (shortUrl.startsWith('http')) {
                await sock.sendMessage(from, {
                    text: `🔗 **URL Shortened**\n\nOriginal: ${url}\nShortened: ${shortUrl}`,
                    quoted: msg
                });
            } else {
                await sock.sendMessage(from, {
                    text: '❌ Invalid URL. Please provide a valid URL starting with http:// or https://',
                    quoted: msg
                });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to shorten URL. Try again later.',
                quoted: msg
            });
        }
    }
};
