export const command = {
    name: 'ping',
    aliases: ['speed', 'status'],
    description: 'Check bot speed, uptime and network connectivity',
    usage: 'ping [host]',
    category: 'info',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        const startTime = Date.now();
        
        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        // Memory usage
        const memUsage = process.memoryUsage();
        const memUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memTotal = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        // CPU usage approximation
        const cpuUsage = process.cpuUsage();
        const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);
        
        if (!args.trim()) {
            // Bot status ping
            const responseTime = Date.now() - startTime;
            
            await sock.sendMessage(sender, {
                text: `🛡️ **yourhïghness Bot Status** 🛡️

⚡ **Response Time:** ${responseTime}ms
🕒 **Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s
💾 **Memory:** ${memUsed}MB / ${memTotal}MB
🖥️ **CPU Usage:** ${cpuPercent}%
🌐 **Connection:** ${global.botConnected ? '🟢 Online' : '🔴 Offline'}
📱 **Platform:** Node.js ${process.version}

🔥 **Performance Status:**
${responseTime < 100 ? '🟢 Excellent' : responseTime < 300 ? '🟡 Good' : '🔴 Slow'} - ${responseTime}ms

💡 **Usage:** \`.ping <host>\` to test network connectivity
Example: \`.ping google.com\``,
                contextInfo: {
                    externalAdReply: {
                        title: '🛡️ Bot Performance Monitor',
                        body: `${responseTime}ms response • ${days}d uptime`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        // Network ping functionality
        const host = args.trim();
        
        try {
            await sock.sendMessage(sender, {
                text: `🔍 **Testing Connection to ${host}...**\n⏳ Please wait...`
            });

            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            // Perform ping test
            const pingCommand = process.platform === 'win32' 
                ? `ping -n 4 ${host}` 
                : `ping -c 4 ${host}`;
                
            const { stdout, stderr } = await execAsync(pingCommand, { timeout: 10000 });

            if (stderr && !stdout) {
                await sock.sendMessage(sender, {
                    text: `❌ **Ping Failed**\n\n🎯 Host: ${host}\n❌ Error: ${stderr.slice(0, 200)}\n\n💡 The host might be unreachable or blocking ICMP packets.`
                });
                return;
            }

            // Parse ping results
            const lines = stdout.split('\n');
            let avgTime = 'Unknown';
            let packetLoss = 'Unknown';
            
            // Extract average time and packet loss
            const avgMatch = stdout.match(/avg[^0-9]*([0-9.]+)/i) || stdout.match(/Average = ([0-9.]+)/i);
            if (avgMatch) avgTime = avgMatch[1] + 'ms';
            
            const lossMatch = stdout.match(/([0-9.]+)% packet loss/i) || stdout.match(/\(([0-9.]+)% loss\)/i);
            if (lossMatch) packetLoss = lossMatch[1] + '%';

            const responseTime = Date.now() - startTime;
            
            await sock.sendMessage(sender, {
                text: `🛡️ **Network Ping Results** 🛡️

🎯 **Target:** ${host}
⚡ **Bot Response:** ${responseTime}ms
🌐 **Network Latency:** ${avgTime}
📊 **Packet Loss:** ${packetLoss}
🔗 **Status:** ${packetLoss === '0%' || packetLoss === '0.0%' ? '🟢 Excellent' : '🟡 Good'}

📈 **Performance Analysis:**
• ${avgTime !== 'Unknown' && parseFloat(avgTime) < 50 ? '🟢 Very Fast' : avgTime !== 'Unknown' && parseFloat(avgTime) < 100 ? '🟡 Fast' : '🔴 Slow'} connection
• ${packetLoss === '0%' ? '🟢 Stable' : '🟡 Some packet loss'} network

🔍 **Raw Output:**
\`\`\`
${stdout.slice(0, 500)}${stdout.length > 500 ? '\n...[truncated]' : ''}
\`\`\``,
                contextInfo: {
                    externalAdReply: {
                        title: `🛡️ Ping: ${host}`,
                        body: `${avgTime} avg • ${packetLoss} loss`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(sender, {
                text: `❌ **Ping Error**\n\n🎯 Target: ${host}\n💥 Error: ${error.message}\n\n💡 Possible causes:\n• Host unreachable\n• Network timeout\n• Invalid hostname\n• Firewall blocking`
            });
        }
    }
};
