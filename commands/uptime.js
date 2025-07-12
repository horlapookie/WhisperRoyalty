
const startTime = Date.now();

export const command = {
    name: 'uptime',
    aliases: ['runtime', 'online'],
    description: 'Check bot uptime and system statistics',
    usage: 'uptime',
    category: 'utility',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const currentTime = Date.now();
        const uptimeMs = currentTime - startTime;
        
        const days = Math.floor(uptimeMs / 86400000);
        const hours = Math.floor((uptimeMs % 86400000) / 3600000);
        const minutes = Math.floor((uptimeMs % 3600000) / 60000);
        const seconds = Math.floor((uptimeMs % 60000) / 1000);
        
        const memoryUsage = process.memoryUsage();
        const memoryUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memoryTotalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        let uptimeText = '';
        if (days > 0) uptimeText += `${days}d `;
        if (hours > 0) uptimeText += `${hours}h `;
        if (minutes > 0) uptimeText += `${minutes}m `;
        uptimeText += `${seconds}s`;
        
        const getStatusEmoji = () => {
            if (days > 7) return '🟢'; // Green - Very stable
            if (days > 1) return '🟡'; // Yellow - Stable
            return '🔵'; // Blue - Recently started
        };
        
        await sock.sendMessage(from, {
            text: `🤖 **Bot Status & Uptime** ${getStatusEmoji()}\n\n⏰ **Uptime:** ${uptimeText}\n📅 **Started:** ${new Date(startTime).toLocaleString()}\n\n💾 **Memory Usage:**\n• **Used:** ${memoryUsedMB} MB\n• **Total:** ${memoryTotalMB} MB\n• **Usage:** ${((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(1)}%\n\n⚡ **System Info:**\n• **Node.js:** ${process.version}\n• **Platform:** ${process.platform}\n• **Architecture:** ${process.arch}\n\n📊 **Bot Version:** yourhïghness v0.0.1\n🟢 **Status:** Online & Running\n\n🎮 Ready to serve your commands!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Bot Uptime & Status',
                    body: `Online for ${uptimeText}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=527',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
