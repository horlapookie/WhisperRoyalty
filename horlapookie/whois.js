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

        try {
            await sock.sendMessage(sender, {
                text: `🔍 **Performing WHOIS lookup for ${domain}...**\n⏳ Please wait...`
            });

            const whois = (await import('whois')).default;

            const whoisData = await new Promise((resolve, reject) => {
                whois.lookup(domain, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            // Parse WHOIS data
            const lines = whoisData.split('\n');
            let registrar = 'Unknown';
            let creationDate = 'Unknown';
            let expirationDate = 'Unknown';
            let nameServers = [];
            let status = 'Unknown';

            lines.forEach(line => {
                const lower = line.toLowerCase();
                if (lower.includes('registrar:') && registrar === 'Unknown') {
                    registrar = line.split(':')[1]?.trim() || 'Unknown';
                } else if ((lower.includes('creation date') || lower.includes('created')) && creationDate === 'Unknown') {
                    creationDate = line.split(':')[1]?.trim().split('T')[0] || 'Unknown';
                } else if ((lower.includes('expiry date') || lower.includes('expires')) && expirationDate === 'Unknown') {
                    expirationDate = line.split(':')[1]?.trim().split('T')[0] || 'Unknown';
                } else if (lower.includes('name server') && nameServers.length < 4) {
                    const ns = line.split(':')[1]?.trim();
                    if (ns && !nameServers.includes(ns)) nameServers.push(ns);
                } else if (lower.includes('status') && status === 'Unknown') {
                    status = line.split(':')[1]?.trim() || 'Unknown';
                }
            });

            let whoisInfo = `🌐 **WHOIS Information**\n\n🎯 **Domain:** ${domain}\n\n`;
            whoisInfo += `🏢 **Registrar:** ${registrar}\n`;
            whoisInfo += `📅 **Created:** ${creationDate}\n`;
            whoisInfo += `⏰ **Expires:** ${expirationDate}\n`;
            whoisInfo += `📊 **Status:** ${status}\n\n`;

            if (nameServers.length > 0) {
                whoisInfo += `🌐 **Name Servers:**\n`;
                nameServers.forEach(ns => {
                    whoisInfo += `  • ${ns}\n`;
                });
            }

            whoisInfo += `\n📝 **Raw WHOIS Data:**\n`;
            whoisInfo += `\`\`\`\n${whoisData.slice(0, 1000)}${whoisData.length > 1000 ? '\n...[truncated]' : ''}\n\`\`\`\n`;
            whoisInfo += `\n⚠️ Educational purposes only`;

            await sock.sendMessage(sender, {
                text: whoisInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `🌐 WHOIS: ${domain}`,
                        body: `Registrar: ${registrar}`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

        } catch (error) {
            await sock.sendMessage(sender, {
                text: `❌ **WHOIS Lookup Failed**\n\n🎯 Domain: ${domain}\n💥 Error: ${error.message}\n\n💡 **Possible causes:**\n• Invalid domain name\n• Domain doesn't exist\n• WHOIS server timeout\n• Rate limiting\n\n🔧 **Alternative:**\n• Try online WHOIS tools\n• Check domain registrar directly\n• Use DNS lookup: .dns ${domain}`,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ WHOIS Lookup Error',
                        body: 'Failed to fetch domain info',
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