
export const command = {
    name: 'birthday',
    description: 'Calculate days until birthday',
    category: 'utility',
    usage: '.birthday <DD/MM>',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '❌ Please provide your birthday!\n\nUsage: .birthday 25/12'
            });
        }

        try {
            const [day, month] = args.split('/').map(Number);
            
            if (!day || !month || day > 31 || month > 12) {
                return await sock.sendMessage(from, {
                    text: '❌ Invalid date format! Use DD/MM'
                });
            }

            const today = new Date();
            const currentYear = today.getFullYear();
            let birthday = new Date(currentYear, month - 1, day);
            
            if (birthday < today) {
                birthday = new Date(currentYear + 1, month - 1, day);
            }
            
            const diffTime = birthday - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let message = `🎂 *Birthday Countdown*\n\n`;
            if (diffDays === 0) {
                message += `🎉 Happy Birthday! Today is your special day!`;
            } else {
                message += `📅 Days until birthday: ${diffDays}\n`;
                message += `🗓️ Your birthday: ${day}/${month}\n`;
                message += `⏰ Time remaining: ${Math.floor(diffDays / 365)} years, ${diffDays % 365} days`;
            }
            
            await sock.sendMessage(from, { text: message });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to calculate birthday!'
            });
        }
    }
};
