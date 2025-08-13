export const command = {
    name: 'headers',
    aliases: ['httpheaders', 'webheaders'],
    description: 'Analyze HTTP headers of websites',
    usage: 'headers <url>',
    category: 'network',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🌐 **HTTP Headers Analyzer**\n\nPlease provide a URL!\n\n📝 **Example:**\n`.headers https://google.com`\n`.headers https://github.com`\n\n🔍 **What it analyzes:**\n• Server information\n• Security headers\n• Technology stack\n• Cache policies\n• Cookie settings',
                contextInfo: {
                    externalAdReply: {
                        title: '🌐 HTTP Headers Analyzer',
                        body: 'Web security & tech analysis',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        let url = args.trim();
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        try {
            await sock.sendMessage(sender, {
                text: `🔍 **Analyzing headers for ${url}...**\n⏳ Please wait...`
            });

            const axios = (await import('axios')).default;
            
            const response = await axios.head(url, {
                timeout: 10000,
                maxRedirects: 5,
                validateStatus: () => true // Accept all status codes
            });

            const headers = response.headers;
            const status = response.status;
            
            // Security headers analysis
            const securityHeaders = {
                'x-frame-options': headers['x-frame-options'] || '❌ Missing',
                'x-content-type-options': headers['x-content-type-options'] || '❌ Missing',
                'x-xss-protection': headers['x-xss-protection'] || '❌ Missing',
                'strict-transport-security': headers['strict-transport-security'] || '❌ Missing',
                'content-security-policy': headers['content-security-policy'] || '❌ Missing',
                'referrer-policy': headers['referrer-policy'] || '❌ Missing'
            };
            
            // Technology detection
            const server = headers['server'] || 'Unknown';
            const poweredBy = headers['x-powered-by'] || 'Unknown';
            const contentType = headers['content-type'] || 'Unknown';
            
            // Format important headers
            let headerInfo = `🌐 **HTTP Headers Analysis**\n\n`;
            headerInfo += `🎯 **Target:** ${url}\n`;
            headerInfo += `📊 **Status:** ${status} ${getStatusText(status)}\n\n`;
            
            headerInfo += `🖥️ **Server Info:**\n`;
            headerInfo += `• Server: ${server}\n`;
            headerInfo += `• Powered By: ${poweredBy}\n`;
            headerInfo += `• Content-Type: ${contentType}\n\n`;
            
            headerInfo += `🛡️ **Security Headers:**\n`;
            Object.entries(securityHeaders).forEach(([key, value]) => {
                const icon = value.includes('❌') ? '🔴' : '🟢';
                headerInfo += `${icon} ${key}: ${value.slice(0, 50)}${value.length > 50 ? '...' : ''}\n`;
            });
            
            headerInfo += `\n📋 **All Headers:**\n`;
            let allHeaders = '';
            let count = 0;
            for (const [key, value] of Object.entries(headers)) {
                if (count < 15) { // Limit to prevent message being too long
                    allHeaders += `• ${key}: ${value.toString().slice(0, 60)}${value.toString().length > 60 ? '...' : ''}\n`;
                    count++;
                }
            }
            if (Object.keys(headers).length > 15) {
                allHeaders += `• ... and ${Object.keys(headers).length - 15} more headers\n`;
            }
            
            headerInfo += allHeaders;
            
            // Security score
            const secureCount = Object.values(securityHeaders).filter(v => !v.includes('❌')).length;
            const securityScore = Math.round((secureCount / Object.keys(securityHeaders).length) * 100);
            
            headerInfo += `\n🏆 **Security Score:** ${securityScore}% (${secureCount}/${Object.keys(securityHeaders).length} headers)`;

            await sock.sendMessage(sender, {
                text: headerInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `🌐 Headers: ${new URL(url).hostname}`,
                        body: `${status} • ${securityScore}% security score`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: url,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(sender, {
                text: `❌ **Headers Analysis Failed**\n\n🎯 URL: ${url}\n💥 Error: ${error.message}\n\n💡 **Possible causes:**\n• Invalid URL format\n• Website is down\n• Network timeout\n• CORS restrictions\n• SSL certificate issues\n\n🔧 **Try:**\n• Check URL spelling\n• Use http:// instead of https://\n• Wait and try again`,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Headers Analysis Error',
                        body: 'Failed to fetch headers',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        }
    }
};

function getStatusText(status) {
    const statusTexts = {
        200: 'OK', 201: 'Created', 204: 'No Content',
        301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
        400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
        500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable'
    };
    return statusTexts[status] || 'Unknown';
}
