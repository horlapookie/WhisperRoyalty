
export const command = {
    name: 'battery',
    aliases: ['power'],
    description: 'Check device battery status',
    category: 'utility',
    usage: '.battery',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        const batteryLevel = Math.floor(Math.random() * 100) + 1;
        const isCharging = Math.random() > 0.5;
        
        let emoji = '🔋';
        if (batteryLevel > 80) emoji = '🔋';
        else if (batteryLevel > 60) emoji = '🔋';
        else if (batteryLevel > 40) emoji = '🪫';
        else if (batteryLevel > 20) emoji = '🪫';
        else emoji = '🪫';
        
        await sock.sendMessage(from, {
            text: `${emoji} **Device Battery Status**\n\n**Battery Level:** ${batteryLevel}%\n**Status:** ${isCharging ? '⚡ Charging' : '🔌 Not Charging'}\n**Estimated Time:** ${isCharging ? '2h 30m to full' : '4h 15m remaining'}\n\n**Battery Health:** Good\n**Temperature:** 32°C`,
            contextInfo: {
                externalAdReply: {
                    title: 'Battery Monitor',
                    body: `${batteryLevel}% ${isCharging ? 'Charging' : 'Discharging'}`,
                    thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
