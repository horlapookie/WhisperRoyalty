
export const command = {
    name: 'time',
    aliases: ['timezone', 'clock'],
    description: 'Get current time in different timezones',
    usage: 'time [timezone]',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const timezone = args.trim() || 'UTC';
        
        try {
            const now = new Date();
            let timeString;
            
            if (timezone.toUpperCase() === 'UTC') {
                timeString = now.toUTCString();
            } else {
                timeString = now.toLocaleString('en-US', { timeZone: timezone });
            }
            
            await sock.sendMessage(from, {
                text: `🕐 **Current Time**\n\nTimezone: ${timezone}\nTime: ${timeString}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Invalid timezone. Examples: UTC, America/New_York, Europe/London, Asia/Tokyo',
                quoted: msg
            });
        }
    }
};
