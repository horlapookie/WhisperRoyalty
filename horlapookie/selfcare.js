
export const command = {
    name: 'selfcare',
    aliases: ['wellness', 'mentalhealth'],
    description: 'Get self-care tips and reminders',
    category: 'utility',
    usage: '.selfcare [category]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const selfCareTips = {
                physical: [
                    "Take a 10-minute walk outside",
                    "Drink a glass of water",
                    "Do some gentle stretching",
                    "Take deep breaths for 2 minutes",
                    "Get some sunlight on your face",
                    "Take a warm shower or bath",
                    "Eat a nutritious snack"
                ],
                mental: [
                    "Practice gratitude - list 3 things you're thankful for",
                    "Do a 5-minute meditation",
                    "Write down your thoughts in a journal",
                    "Call a friend or family member",
                    "Listen to your favorite music",
                    "Read a few pages of a good book",
                    "Practice positive self-talk"
                ],
                emotional: [
                    "Allow yourself to feel your emotions without judgment",
                    "Give yourself a compliment",
                    "Do something creative",
                    "Spend time with a pet or loved one",
                    "Watch something that makes you laugh",
                    "Practice self-compassion",
                    "Set healthy boundaries"
                ],
                spiritual: [
                    "Spend time in nature",
                    "Practice mindfulness",
                    "Reflect on your values and purpose",
                    "Do something kind for someone else",
                    "Connect with your beliefs or spirituality",
                    "Practice forgiveness (of yourself or others)",
                    "Engage in prayer or reflection"
                ]
            };
            
            const category = args && selfCareTips[args.toLowerCase()] ? args.toLowerCase() : 'mental';
            const tips = selfCareTips[category];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            
            await sock.sendMessage(from, {
                text: `💚 *Self-Care Reminder*\n\n🌸 Category: ${category}\n\n✨ Today's tip:\n"${randomTip}"\n\n🤗 Remember: Taking care of yourself is not selfish, it's necessary!\n\n📝 Categories: physical, mental, emotional, spiritual`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get self-care tip!'
            });
        }
    }
};
