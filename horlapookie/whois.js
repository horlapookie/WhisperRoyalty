export const command = {
    name: 'whois',
    aliases: ['domaininfo'],
    description: 'Domain information lookup (educational)',
    usage: 'whois <domain>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🌐 Please provide a domain!\n\nExample: .whois google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'WHOIS Lookup',
                        body: 'Domain information',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const domain = args.trim();
        
        await sock.sendMessage(sender, {
            text: `🌐 *WHOIS Information*\n\n🎯 Domain: ${domain}\n\n📊 *WHOIS typically provides:*\n• Domain registrar\n• Registration date\n• Expiration date\n• Name servers\n• Registrant information\n• Administrative contacts\n• Technical contacts\n\n🔍 *Common WHOIS commands:*\n• whois ${domain}\n• whois -h whois.internic.net ${domain}\n• Online: whois.net, whois.com\n\n📝 *Information gathering uses:*\n• Reconnaissance\n• Domain research\n• Contact information\n• Infrastructure mapping\n\n⚠️ *Educational Purpose Only*\nThis command provides information about WHOIS usage for learning cybersecurity concepts.`,
            contextInfo: {
                externalAdReply: {
                    title: 'WHOIS Lookup',
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
