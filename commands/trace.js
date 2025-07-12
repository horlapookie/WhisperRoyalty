export const command = {
    name: 'trace',
    aliases: ['traceroute', 'tracert'],
    description: 'Network traceroute information (educational)',
    usage: 'trace <host>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🔍 Please provide a host!\n\nExample: .trace google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Traceroute',
                        body: 'Network path tracing',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const host = args.trim();
        
        await sock.sendMessage(sender, {
            text: `🔍 *Traceroute Information*\n\n🎯 Host: ${host}\n\n📊 *Traceroute Commands:*\n• traceroute ${host} (Linux/Mac)\n• tracert ${host} (Windows)\n• mtr ${host} (Better traceroute)\n• tcptraceroute ${host} (TCP)\n\n📈 *Information provided:*\n• Network path to destination\n• Hop-by-hop latency\n• Router IP addresses\n• Geographic routing path\n\n🔍 *Advanced options:*\n• traceroute -n ${host} (No DNS lookup)\n• traceroute -p 80 ${host} (Specific port)\n• traceroute -m 20 ${host} (Max hops)\n• traceroute -q 1 ${host} (Queries per hop)\n\n🛡️ *Security analysis:*\n• Network topology mapping\n• Firewall identification\n• ISP infrastructure\n• Geographic location\n\n📝 *Use cases:*\n• Network troubleshooting\n• Performance analysis\n• Security assessment\n• Infrastructure mapping\n\n⚠️ *Educational Purpose Only*\nThis command provides information about traceroute for learning network concepts.`,
            contextInfo: {
                externalAdReply: {
                    title: 'Traceroute',
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
