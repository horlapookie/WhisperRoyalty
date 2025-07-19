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
                text: `🔍 **Starting Nmap scan on ${target}...**\n\n⏳ Scanning in progress...`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Nmap Scanner',
                        body: 'Scan in progress',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            // Perform basic port scan
            const scanCommand = `nmap -T4 -F ${target}`;
            const { stdout, stderr } = await execAsync(scanCommand, { timeout: 30000 });

            if (stderr && !stdout) {
                await sock.sendMessage(sender, {
                    text: `❌ **Scan Error**\n\n${stderr}\n\n💡 Make sure the target is reachable and you have permission to scan.`
                });
                return;
            }

            // Format results
            const results = stdout || 'No results returned';
            const truncatedResults = results.length > 2000 ? results.substring(0, 2000) + '\n...[truncated]' : results;

            await sock.sendMessage(sender, {
                text: `🔍 **Nmap Scan Results**\n\n🎯 **Target:** ${target}\n\n📊 **Results:**\n\`\`\`\n${truncatedResults}\n\`\`\`\n\n⚠️ **Legal Notice:** Only scan systems you own or have explicit permission to test.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Nmap Scan Complete',
                        body: 'Results ready',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(sender, {
                text: `❌ **Scan Failed**\n\nError: ${error.message}\n\n💡 Possible reasons:\n• Target unreachable\n• Network timeout\n• Permission denied\n• Nmap not installed\n\n🔧 Try: nmap -sn ${target} for ping scan`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Nmap Error',
                        body: 'Scan failed',
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
