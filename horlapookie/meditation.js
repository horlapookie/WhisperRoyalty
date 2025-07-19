
export const command = {
    name: 'meditation',
    aliases: ['meditate', 'mindfulness'],
    description: 'Guided meditation and mindfulness',
    category: 'utility',
    usage: '.meditation [type/time]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const meditations = {
                breathing: {
                    title: "Breathing Meditation",
                    steps: [
                        "1. Sit comfortably with your back straight",
                        "2. Close your eyes or soften your gaze",
                        "3. Take a deep breath in through your nose (4 seconds)",
                        "4. Hold your breath gently (4 seconds)",
                        "5. Exhale slowly through your mouth (6 seconds)",
                        "6. Repeat this cycle 5-10 times",
                        "7. Notice how your body feels more relaxed"
                    ]
                },
                gratitude: {
                    title: "Gratitude Meditation",
                    steps: [
                        "1. Sit quietly and close your eyes",
                        "2. Think of 3 things you're grateful for today",
                        "3. Feel the emotion of gratitude in your heart",
                        "4. Expand this feeling throughout your body",
                        "5. Send gratitude to people who help you",
                        "6. Hold this warm feeling for 2-3 minutes",
                        "7. Open your eyes when ready"
                    ]
                },
                stress: {
                    title: "Stress Relief Meditation",
                    steps: [
                        "1. Find a quiet, comfortable space",
                        "2. Take 3 deep, calming breaths",
                        "3. Identify where you feel tension in your body",
                        "4. Breathe into those areas and let them soften",
                        "5. Imagine stress leaving your body with each exhale",
                        "6. Replace tension with peace and calm",
                        "7. Stay here for 5-10 minutes"
                    ]
                }
            };
            
            const type = args && meditations[args.toLowerCase()] ? args.toLowerCase() : 'breathing';
            const meditation = meditations[type];
            
            await sock.sendMessage(from, {
                text: `🧘‍♀️ *${meditation.title}*\n\n🕯️ Find a quiet space and follow these steps:\n\n${meditation.steps.join('\n\n')}\n\n✨ Take your time and be gentle with yourself.\n\n💚 Available types: breathing, gratitude, stress`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to load meditation guide!'
            });
        }
    }
};
