
export const command = {
    name: 'vision',
    aliases: ['goals', 'dreams'],
    description: 'Create vision board and set goals',
    category: 'utility',
    usage: '.vision [add/list/inspire] [goal]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '✨ *Vision Board Creator*\n\nUsage:\n• .vision add "Learn a new language"\n• .vision list\n• .vision inspire\n\n💫 Turn your dreams into reality!'
            });
        }

        try {
            const [action, ...goalParts] = args.split(' ');
            const goal = goalParts.join(' ');
            
            switch (action.toLowerCase()) {
                case 'add':
                    if (!goal) {
                        return await sock.sendMessage(from, {
                            text: '❌ Please specify a goal to add!'
                        });
                    }
                    await sock.sendMessage(from, {
                        text: `🎯 *Goal Added to Vision Board*\n\n✨ Goal: "${goal}"\n\n📅 Date Added: ${new Date().toLocaleDateString()}\n\n💪 Remember: A goal without a plan is just a wish. Break it down into actionable steps!`
                    });
                    break;
                    
                case 'list':
                    const sampleGoals = [
                        "🏃‍♀️ Run a marathon",
                        "📚 Read 50 books this year", 
                        "🌍 Travel to 5 new countries",
                        "💼 Start my own business",
                        "🎓 Learn a new skill",
                        "💝 Volunteer regularly",
                        "🏠 Buy my dream house",
                        "👨‍👩‍👧‍👦 Spend more time with family"
                    ];
                    
                    await sock.sendMessage(from, {
                        text: `🎯 *Your Vision Board*\n\n${sampleGoals.join('\n')}\n\n✨ These are sample goals. Use .vision add "your goal" to create your own!\n\n💡 Tip: Review your goals daily for better success!`
                    });
                    break;
                    
                case 'inspire':
                    const inspirationalGoals = [
                        "What would you do if you knew you couldn't fail?",
                        "Where do you see yourself in 5 years?",
                        "What skill would change your life if you mastered it?",
                        "What dream have you been putting off?",
                        "What would make you feel most proud of yourself?",
                        "What impact do you want to make on the world?",
                        "What adventure is calling your name?",
                        "What fear would you like to overcome?"
                    ];
                    
                    const randomInspiration = inspirationalGoals[Math.floor(Math.random() * inspirationalGoals.length)];
                    
                    await sock.sendMessage(from, {
                        text: `🌟 *Goal Inspiration*\n\n💭 "${randomInspiration}"\n\n✨ Take a moment to think about this, then use .vision add to capture your answer!\n\n🚀 Your future self will thank you!`
                    });
                    break;
                    
                default:
                    await sock.sendMessage(from, {
                        text: '❌ Invalid action!\n\nAvailable actions:\n• add - Add new goal\n• list - Show sample goals\n• inspire - Get goal inspiration'
                    });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to process vision command!'
            });
        }
    }
};
