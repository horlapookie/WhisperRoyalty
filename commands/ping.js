export const command = {
    name: 'ping',
    aliases: ['pingtest'],
    description: 'Network ping test information (educational)',
    usage: 'ping <host>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🔍 Please provide a host!\n\nExample: .ping google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Ping Test',
                        body: 'Network connectivity',
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
            text: `🔍 *Ping Test Information*\n\n🎯 Host: ${host}\n\n📊 *Ping Command Usage:*\n• ping ${host}\n• ping -c 4 ${host} (Linux/Mac)\n• ping -n 4 ${host} (Windows)\n• ping -t ${host} (Continuous)\n\n📈 *Ping Analysis:*\n• Response time (latency)\n• Packet loss percentage\n• Host availability\n• Network path quality\n\n🔍 *Advanced ping options:*\n• ping -s 1000 ${host} (Packet size)\n• ping -i 2 ${host} (Interval)\n• ping -w 10 ${host} (Timeout)\n• ping -f ${host} (Flood ping)\n\n🛡️ *Security considerations:*\n• ICMP filtering\n• DDoS potential\n• Network reconnaissance\n• Firewall detection\n\n⚠️ *Educational Purpose Only*\nThis command provides information about ping testing for learning network concepts.`,
            contextInfo: {
                externalAdReply: {
                    title: 'Ping Test',
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
