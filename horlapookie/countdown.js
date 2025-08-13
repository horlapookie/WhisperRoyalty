
export const command = {
    name: 'countdown',
    description: 'Create countdown to specific date',
    category: 'utility',
    usage: '.countdown <DD/MM/YYYY> <event>',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '❌ Please provide date and event!\n\nUsage: .countdown 25/12/2024 Christmas'
            });
        }

        try {
            const parts = args.split(' ');
            const dateStr = parts[0];
            const eventName = parts.slice(1).join(' ') || 'Event';
            
            const [day, month, year] = dateStr.split('/').map(Number);
            const targetDate = new Date(year, month - 1, day);
            const today = new Date();
            
            const diffTime = targetDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let message = `⏰ *Countdown Timer*\n\n🎯 Event: ${eventName}\n📅 Date: ${dateStr}\n\n`;
            
            if (diffDays < 0) {
                message += `✅ This event has already passed ${Math.abs(diffDays)} days ago!`;
            } else if (diffDays === 0) {
                message += `🎉 Today is the day! ${eventName} is happening now!`;
            } else {
                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);
                const days = diffDays % 30;
                
                message += `⏳ Time remaining:\n`;
                if (years > 0) message += `📆 ${years} years\n`;
                if (months > 0) message += `📅 ${months} months\n`;
                message += `🗓️ ${days} days\n\n`;
                message += `🔢 Total days: ${diffDays}`;
            }
            
            await sock.sendMessage(from, { 
                text: message,
                contextInfo: {
                    externalAdReply: {
                        title: 'Countdown Timer',
                        body: 'Event countdown',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=114',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Invalid date format! Use DD/MM/YYYY'
            });
        }
    }
};
