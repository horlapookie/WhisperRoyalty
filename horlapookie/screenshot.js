
export const command = {
    name: 'screenshot',
    aliases: ['ss', 'capture'],
    description: 'Take screenshot of website',
    usage: 'screenshot <url>',
    category: 'utility',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a URL!\n\nExample: .screenshot https://google.com'
            });
            return;
        }
        
        const url = args.trim();
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a valid URL starting with http:// or https://'
            });
            return;
        }
        
        try {
            await sock.sendMessage(from, {
                text: `📸 **Website Screenshot**

**URL:** ${url}
**Status:** Processing...

⏳ Taking screenshot, please wait...

**Settings:**
• Resolution: 1920x1080
• Format: PNG
• Quality: High

💡 **Note:** This is a demonstration. Real screenshot functionality would require a headless browser.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Website Screenshot',
                        body: 'Capturing webpage...',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=90',
                        sourceUrl: url,
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to take screenshot!'
            });
        }
    }
};
