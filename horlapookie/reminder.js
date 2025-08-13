
export const command = {
    name: 'reminder',
    aliases: ['remind', 'alarm'],
    description: 'Set a reminder',
    usage: 'reminder <minutes> <message>',
    category: 'utility',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide time and message!\n\nExample: .reminder 30 Call mom'
            });
            return;
        }
        
        const parts = args.trim().split(' ');
        const minutes = parseInt(parts[0]);
        const message = parts.slice(1).join(' ');
        
        if (isNaN(minutes) || minutes <= 0) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a valid number of minutes!'
            });
            return;
        }
        
        if (minutes > 1440) { // 24 hours max
            await sock.sendMessage(from, {
                text: '❌ Maximum reminder time is 24 hours (1440 minutes)!'
            });
            return;
        }
        
        try {
            await sock.sendMessage(from, {
                text: `⏰ **Reminder Set**\n\n**Time:** ${minutes} minute(s)\n**Message:** ${message}\n\n✅ I'll remind you when the time comes!`
            });
            
            // Set the reminder
            setTimeout(async () => {
                await sock.sendMessage(from, {
                    text: `🔔 **REMINDER**\n\n${message}\n\n⏰ This reminder was set ${minutes} minute(s) ago.`
                });
            }, minutes * 60000);
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to set reminder!'
            });
        }
    }
};
