
export const command = {
    name: 'inspire',
    aliases: ['motivation', 'motivate'],
    description: 'Get inspirational quotes and messages',
    category: 'fun',
    usage: '.inspire [category]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const inspirations = {
                success: [
                    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
                    "The way to get started is to quit talking and begin doing. - Walt Disney",
                    "Don't be afraid to give up the good to go for the great. - John D. Rockefeller"
                ],
                motivation: [
                    "The only impossible journey is the one you never begin. - Tony Robbins",
                    "Your limitation—it's only your imagination.",
                    "Push yourself, because no one else is going to do it for you."
                ],
                life: [
                    "Life is what happens to you while you're busy making other plans. - John Lennon",
                    "The purpose of our lives is to be happy. - Dalai Lama",
                    "Life is really simple, but we insist on making it complicated. - Confucius"
                ],
                dreams: [
                    "All our dreams can come true, if we have the courage to pursue them. - Walt Disney",
                    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
                    "Dream big and dare to fail. - Norman Vaughan"
                ]
            };
            
            const category = args && inspirations[args.toLowerCase()] ? args.toLowerCase() : 'motivation';
            const messages = inspirations[category];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            await sock.sendMessage(from, {
                text: `✨ *Daily Inspiration*\n\n🌟 Category: ${category}\n\n💫 "${randomMessage}"\n\n🚀 You've got this! Keep pushing forward! 💪`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get inspiration!'
            });
        }
    }
};
