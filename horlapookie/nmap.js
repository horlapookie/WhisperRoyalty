export const command = {
    name: 'nmap',
    aliases: ['portscan'],
    description: 'Network mapping information (educational)',
    usage: 'nmap <target>',
    category: 'Ethical Hacking',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🔍 Please provide a target!\n\nExample: .nmap google.com\n\n⚠️ Educational purposes only!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Nmap Scanner',
                        body: 'Network mapping tool',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const target = args.trim();
        
        try {
            await sock.sendMessage(sender, {
                text: `🔍 **Starting Nmap scan on ${target}...**\n\n⏳ Scanning in progress...\n🕒 This may take up to 30 seconds`,
                contextInfo: {
                    externalAdReply: {
                        title: '🛡️ Nmap Network Scanner',
                        body: 'Professional port scanning',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

            // Use node-nmap for cross-platform compatibility
            const nmap = (await import('node-nmap')).default;
            
            const scanData = await new Promise((resolve, reject) => {
                const scan = new nmap.NmapScan(target, '-F -T4');
                
                scan.on('complete', (data) => {
                    resolve(data);
                });
                scan.on('error', (error) => {
                    reject(error);
                });
                
                scan.startScan();
            });

            // Parse scan results
            let openPorts = [];
            let hostInfo = `${target}`;
            
            if (scanData && scanData.length > 0) {
                const host = scanData[0];
                if (host.openPorts && host.openPorts.length > 0) {
                    openPorts = host.openPorts.map(port => `${port.port}/${port.protocol} open ${port.service || 'unknown'}`);
                }
                if (host.hostname) {
                    hostInfo = host.hostname;
                }
            }

            let formattedResults = `🛡️ **Nmap Scan Results**\n\n`;
            formattedResults += `🎯 **Target:** ${target}\n`;
            
            if (hostInfo) {
                formattedResults += `📍 **Host:** ${hostInfo.replace('Nmap scan report for ', '')}\n`;
            }
            
            if (openPorts.length > 0) {
                formattedResults += `\n🟢 **Open Ports Found:** ${openPorts.length}\n`;
                formattedResults += `━━━━━━━━━━━━━━━━━━━━\n`;
                
                openPorts.slice(0, 10).forEach(port => {
                    const parts = port.split(/\s+/);
                    const portNum = parts[0];
                    const service = parts[2] || 'unknown';
                    formattedResults += `🔓 ${portNum} - ${service}\n`;
                });
                
                if (openPorts.length > 10) {
                    formattedResults += `... and ${openPorts.length - 10} more ports\n`;
                }
            } else {
                formattedResults += `\n🔒 **No open ports found** (or host is down)\n`;
            }
            
            // Add scan timing info if available
            formattedResults += `\n⏱️ **Scan completed**\n`;
            
            // Add security analysis
            formattedResults += `\n🔍 **Security Analysis:**\n`;
            if (openPorts.length === 0) {
                formattedResults += `🟢 Host appears secure (no open ports)\n`;
            } else if (openPorts.length < 5) {
                formattedResults += `🟡 Minimal attack surface (${openPorts.length} open ports)\n`;
            } else {
                formattedResults += `🔴 Multiple services exposed (${openPorts.length} open ports)\n`;
            }
            
            // Check for common risky ports
            const riskyPorts = ['21/tcp', '23/tcp', '139/tcp', '445/tcp', '1433/tcp', '3389/tcp'];
            const foundRisky = openPorts.filter(port => 
                riskyPorts.some(risky => port.includes(risky))
            );
            
            if (foundRisky.length > 0) {
                formattedResults += `⚠️ Potentially risky services detected\n`;
            }
            
            formattedResults += `\n📋 **Scan Summary:**\n`;
            formattedResults += `Target: ${target} | Method: TCP SYN scan\n`;
            formattedResults += `\n⚠️ **Legal Notice:** Only scan systems you own or have explicit permission to test.`;

            await sock.sendMessage(sender, {
                text: formattedResults,
                contextInfo: {
                    externalAdReply: {
                        title: `🛡️ Nmap: ${target}`,
                        body: `${openPorts.length} open ports found`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://nmap.org',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            
        } catch (error) {
            let errorMsg = `❌ **Nmap Scan Failed**\n\n🎯 Target: ${target}\n💥 Error: ${error.message}\n\n`;
            
            if (error.message.includes('timeout')) {
                errorMsg += `⏰ **Timeout Error:**\n• Scan took too long (>45s)\n• Target might be filtering packets\n• Try a more specific target\n\n`;
            } else if (error.message.includes('not found')) {
                errorMsg += `🚫 **Nmap Not Found:**\n• Nmap is not installed\n• This feature requires nmap package\n• Contact admin to install nmap\n\n`;
            } else if (error.message.includes('Permission denied')) {
                errorMsg += `🔐 **Permission Error:**\n• Root/admin privileges required\n• Some scan types need elevated access\n• Try basic scan: -sT instead of -sS\n\n`;
            }
            
            errorMsg += `🔧 **Alternative Options:**\n`;
            errorMsg += `• Use online tools: nmap.online\n`;
            errorMsg += `• Try basic connectivity: .ping ${target}\n`;
            errorMsg += `• Use port checker: .port ${target} 80\n`;
            errorMsg += `• DNS lookup: .dns ${target}`;

            await sock.sendMessage(sender, {
                text: errorMsg,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Nmap Scan Error',
                        body: 'Scan failed - see alternatives',
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
