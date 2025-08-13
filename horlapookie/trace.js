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

        try {
            await sock.sendMessage(sender, {
                text: `🔍 **Performing traceroute to ${host}...**\n⏳ Please wait (this may take up to 30 seconds)...`
            });

            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            // Use appropriate traceroute command based on platform
            const isWindows = process.platform === 'win32';
            const traceCommand = isWindows ? `tracert -h 15 ${host}` : `traceroute -m 15 ${host}`;

            const { stdout, stderr } = await execAsync(traceCommand, { timeout: 30000 });

            if (stderr && !stdout) {
                throw new Error(stderr);
            }

            // Parse traceroute results
            const lines = stdout.split('\n').filter(line => line.trim());
            let traceInfo = `🔍 **Traceroute Results**\n\n🎯 **Target:** ${host}\n\n`;

            let hopCount = 0;
            let reachedDestination = false;

            lines.forEach(line => {
                if (line.match(/^\s*\d+/)) {
                    hopCount++;
                    // Parse hop information
                    const hopMatch = line.match(/^\s*(\d+)\s+(.+)/);
                    if (hopMatch && hopCount <= 10) { // Limit display to first 10 hops
                        const hopNum = hopMatch[1];
                        const hopData = hopMatch[2];

                        // Extract IP and timing info
                        const ipMatch = hopData.match(/(\d+\.\d+\.\d+\.\d+)/);
                        const timeMatch = hopData.match(/(\d+(?:\.\d+)?)\s*ms/g);

                        if (ipMatch) {
                            const ip = ipMatch[1];
                            const avgTime = timeMatch ? timeMatch[0] : 'N/A';
                            traceInfo += `${hopNum.padStart(2)}. ${ip} (${avgTime})\n`;

                            if (ip === host || hopData.includes(host)) {
                                reachedDestination = true;
                            }
                        } else if (hopData.includes('*')) {
                            traceInfo += `${hopNum.padStart(2)}. * * * (timeout)\n`;
                        }
                    }
                }
            });

            if (hopCount > 10) {
                traceInfo += `... and ${hopCount - 10} more hops\n`;
            }

            traceInfo += `\n📊 **Summary:**\n`;
            traceInfo += `• Total hops: ${hopCount}\n`;
            traceInfo += `• Destination reached: ${reachedDestination ? '✅ Yes' : '❌ No'}\n`;

            if (!reachedDestination) {
                traceInfo += `\n⚠️ **Note:** Trace may be incomplete due to:\n`;
                traceInfo += `• Firewall blocking ICMP/UDP\n`;
                traceInfo += `• Router not responding\n`;
                traceInfo += `• Network filtering\n`;
            }

            traceInfo += `\n🔍 **Network Path Analysis:**\n`;
            traceInfo += `• Shows route packets take\n`;
            traceInfo += `• Identifies network bottlenecks\n`;
            traceInfo += `• Reveals ISP infrastructure\n`;
            traceInfo += `\n⚠️ Educational purposes only`;

            await sock.sendMessage(sender, {
                text: traceInfo,
                contextInfo: {
                    externalAdReply: {
                        title: `🔍 Traceroute: ${host}`,
                        body: `${hopCount} hops traced`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

        } catch (error) {
            // Fallback to basic network info if traceroute fails
            await sock.sendMessage(sender, {
                text: `❌ **Traceroute Failed**\n\n🎯 Host: ${host}\n💥 Error: ${error.message}\n\n💡 **Traceroute may not work due to:**\n• System doesn't have traceroute/tracert\n• Network restrictions\n• ICMP blocking\n• Insufficient permissions\n\n🔧 **Alternatives:**\n• Try .ping ${host} for basic connectivity\n• Use .dns ${host} for DNS info\n• Try online traceroute tools\n\n📚 **Traceroute Information:**\n• Shows network path to destination\n• Identifies routing hops\n• Measures latency per hop\n• Useful for network troubleshooting\n\n⚠️ Educational purposes only`,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Traceroute Error',
                        body: 'System command not available',
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