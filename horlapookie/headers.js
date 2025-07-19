export const command = {
    name: 'headers',
    aliases: ['httpheaders'],
    description: 'HTTP headers analysis (educational)',
    usage: 'headers <url>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🌐 Please provide a URL!\n\nExample: .headers https://google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'HTTP Headers',
                        body: 'Web security analysis',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const url = args.trim();
        
        await sock.sendMessage(sender, {
            text: `🌐 *HTTP Headers Analysis*\n\n🎯 URL: ${url}\n\n📊 *Common HTTP Headers:*\n• Server: Web server software\n• X-Powered-By: Backend technology\n• Set-Cookie: Cookie settings\n• Content-Security-Policy: CSP rules\n• X-Frame-Options: Clickjacking protection\n• Strict-Transport-Security: HTTPS enforcement\n• X-Content-Type-Options: MIME type protection\n\n🔍 *Analysis tools:*\n• curl -I ${url}\n• wget --server-response ${url}\n• Online: securityheaders.com\n• Browser DevTools\n\n🛡️ *Security implications:*\n• Information disclosure\n• Technology fingerprinting\n• Security misconfigurations\n• Attack surface analysis\n\n⚠️ *Educational Purpose Only*\nThis command provides information about HTTP header analysis for learning web security concepts.`,
            contextInfo: {
                externalAdReply: {
                    title: 'HTTP Headers',
                    body: 'Educational information',
                    thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                    sourceUrl: 'https://github.com',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });
    }
};
