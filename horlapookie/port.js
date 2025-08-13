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

        try {
            await sock.sendMessage(sender, {
                text: `🔍 **Checking port connectivity for ${host}...**\n⏳ Please wait...`
            });

            const net = await import('net');
            const dns = await import('dns');
            const { promisify } = await import('util');
            const lookupAsync = promisify(dns.lookup);

            // Common ports to check
            const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306];

            // Get IP address
            let targetIP;
            try {
                const result = await lookupAsync(host);
                targetIP = result.address;
            } catch (e) {
                targetIP = host; // Assume it's already an IP
            }

            const checkPort = (host, port) => {
                return new Promise((resolve) => {
                    const socket = new net.Socket();
                    const timeout = 3000;

                    socket.setTimeout(timeout);
                    socket.on('connect', () => {
                        socket.destroy();
                        resolve({ port, status: 'open' });
                    });

                    socket.on('timeout', () => {
                        socket.destroy();
                        resolve({ port, status: 'timeout' });
                    });

                    socket.on('error', () => {
                        resolve({ port, status: 'closed' });
                    });

                    socket.connect(port, host);
                });
            };

            // Check common ports
            const portChecks = commonPorts.map(port => checkPort(targetIP, port));
            const results = await Promise.all(portChecks);

            const openPorts = results.filter(r => r.status === 'open');
            const closedPorts = results.filter(r => r.status === 'closed');

            let portInfo = `🔍 **Port Scan Results**\n\n🎯 **Target:** ${host}`;
            if (targetIP !== host) {
                portInfo += ` (${targetIP})`;
            }
            portInfo += `\n\n`;

            if (openPorts.length > 0) {
                portInfo += `🟢 **Open Ports:** ${openPorts.length}\n`;
                portInfo += `━━━━━━━━━━━━━━━━━━━━\n`;
                openPorts.forEach(({port}) => {
                    const service = getServiceName(port);
                    portInfo += `🔓 ${port}/tcp - ${service}\n`;
                });
            } else {
                portInfo += `🔒 **No open ports found**\n`;
            }

            portInfo += `\n📊 **Summary:**\n`;
            portInfo += `• Open: ${openPorts.length}\n`;
            portInfo += `• Closed: ${closedPorts.length}\n`;
            portInfo += `• Total scanned: ${commonPorts.length}\n`;

            portInfo += `\n🛡️ **Security Analysis:**\n`;
            if (openPorts.length === 0) {
                portInfo += `🟢 Host appears secure (firewall/closed ports)\n`;
            } else if (openPorts.length < 3) {
                portInfo += `🟡 Minimal services exposed\n`;
            } else {
                portInfo += `🔴 Multiple services accessible\n`;
            }

            portInfo += `\n⚠️ Educational purposes only`;

            await sock.sendMessage(sender, {
                text: portInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `🔍 Port Scan: ${host}`,
                        body: `${openPorts.length} open ports found`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

        } catch (error) {
            await sock.sendMessage(sender, {
                text: `❌ **Port Scan Failed**\n\n🎯 Host: ${host}\n💥 Error: ${error.message}\n\n💡 **Possible causes:**\n• Invalid hostname/IP\n• Network connectivity issues\n• Host is filtering packets\n• DNS resolution failed\n\n🔧 **Try:**\n• Check host spelling\n• Use IP address instead\n• Try .ping ${host} first`,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Port Scan Error',
                        body: 'Failed to scan ports',
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

function getServiceName(port) {
    const services = {
        21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
        80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS',
        993: 'IMAPS', 995: 'POP3S', 3389: 'RDP', 5432: 'PostgreSQL',
        3306: 'MySQL'
    };
    return services[port] || 'Unknown';
}