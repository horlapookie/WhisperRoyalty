export const command = {
    name: 'port',
    aliases: ['portscan', 'netstat'],
    description: 'Port scanning information (educational)',
    usage: 'port <host>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🔍 Please provide a host!\n\nExample: .port google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Port Scanner',
                        body: 'Network port analysis',
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
            text: `🔍 *Port Scanning Information*\n\n🎯 Host: ${host}\n\n📊 *Common Port Scanning Tools:*\n• nmap -p 80,443 ${host}\n• netcat -zv ${host} 80\n• telnet ${host} 80\n• masscan -p1-65535 ${host}\n\n🔢 *Common Ports:*\n• 21: FTP\n• 22: SSH\n• 23: Telnet\n• 25: SMTP\n• 53: DNS\n• 80: HTTP\n• 110: POP3\n• 143: IMAP\n• 443: HTTPS\n• 993: IMAPS\n• 995: POP3S\n\n🔍 *Port States:*\n• Open: Service listening\n• Closed: No service\n• Filtered: Firewall blocked\n• Unfiltered: Accessible but unknown\n\n🛡️ *Security considerations:*\n• Service fingerprinting\n• Vulnerability assessment\n• Attack surface analysis\n• Network reconnaissance\n\n⚠️ *Educational Purpose Only*\nThis command provides information about port scanning for learning cybersecurity concepts.`,
            contextInfo: {
                externalAdReply: {
                    title: 'Port Scanner',
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
