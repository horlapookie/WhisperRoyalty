export const command = {
    name: 'dns',
    aliases: ['nslookup', 'dig'],
    description: 'DNS lookup information (educational)',
    usage: 'dns <domain>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🌐 Please provide a domain!\n\nExample: .dns google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'DNS Lookup',
                        body: 'Domain Name System',
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
            text: `🌐 *DNS Lookup Information*\n\n🎯 Domain: ${domain}\n\n📊 *DNS Record Types:*\n• A: IPv4 address\n• AAAA: IPv6 address\n• CNAME: Canonical name\n• MX: Mail exchange\n• NS: Name server\n• TXT: Text records\n• SOA: Start of authority\n\n🔍 *Common DNS commands:*\n• nslookup ${domain}\n• dig ${domain}\n• dig ${domain} MX\n• dig ${domain} NS\n• host ${domain}\n\n📝 *Information gathering uses:*\n• Subdomain enumeration\n• Mail server discovery\n• Name server identification\n• Infrastructure mapping\n\n🛡️ *DNS Security:*\n• DNS poisoning\n• DNS tunneling\n• DNS amplification attacks\n• DNSSEC validation\n\n⚠️ *Educational Purpose Only*\nThis command provides information about DNS lookup for learning cybersecurity concepts.`,
            contextInfo: {
                externalAdReply: {
                    title: 'DNS Lookup',
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
