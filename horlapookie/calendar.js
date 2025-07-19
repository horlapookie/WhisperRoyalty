
export const command = {
    name: 'calendar',
    aliases: ['cal', 'date'],
    description: 'Display calendar and important dates',
    category: 'utility',
    usage: '.calendar [month]',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const currentDate = new Date();
        const currentMonth = months[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
        const today = currentDate.getDate();
        
        await sock.sendMessage(from, {
            text: `📅 **Calendar - ${currentMonth} ${currentYear}**\n\n**Today:** ${today}${getDaySuffix(today)} ${currentMonth}\n**Day of Week:** ${currentDate.toLocaleDateString('en-US', { weekday: 'long' })}\n\n**Upcoming Events:**\n• New Year: Jan 1st\n• Valentine's Day: Feb 14th\n• Christmas: Dec 25th\n\n**Week Number:** ${getWeekNumber(currentDate)}\n**Days in Month:** ${new Date(currentYear, currentDate.getMonth() + 1, 0).getDate()}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Calendar & Events',
                    body: `${currentMonth} ${currentYear}`,
                    thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
        
        function getDaySuffix(day) {
            if (day >= 11 && day <= 13) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        }
        
        function getWeekNumber(date) {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }
    }
};
