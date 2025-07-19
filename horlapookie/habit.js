
export const command = {
    name: 'habit',
    description: 'Track daily habits',
    category: 'utility',
    usage: '.habit <add/list/check> [habit]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '❌ Please specify action!\n\nUsage:\n• .habit add "Drink 8 glasses of water"\n• .habit list\n• .habit check "Exercise for 30 minutes"'
            });
        }

        try {
            const [action, ...habitParts] = args.split(' ');
            const habitName = habitParts.join(' ');
            
            // Mock habit suggestions
            const habitSuggestions = [
                "🚰 Drink 8 glasses of water daily",
                "🏃 Exercise for 30 minutes",
                "📚 Read for 20 minutes",
                "🧘 Meditate for 10 minutes",
                "🥗 Eat a healthy breakfast",
                "😴 Sleep 8 hours",
                "📱 Limit screen time to 2 hours",
                "🚶 Take 10,000 steps",
                "📝 Write in journal",
                "🎯 Practice gratitude"
            ];
            
            switch (action.toLowerCase()) {
                case 'add':
                    if (!habitName) {
                        return await sock.sendMessage(from, {
                            text: '❌ Please specify habit to add!\n\nExample: .habit add "Exercise daily"'
                        });
                    }
                    await sock.sendMessage(from, {
                        text: `✅ *Habit Added*\n\n📝 Habit: "${habitName}"\n📅 Starting today!\n\n💪 Stay consistent for best results!`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Habit Tracker',
                                body: 'Build good habits',
                                thumbnailUrl: 'https://picsum.photos/300/300?random=127',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    break;
                    
                case 'list':
                    const randomHabits = habitSuggestions.slice(0, 5);
                    await sock.sendMessage(from, {
                        text: `📋 *Habit Suggestions*\n\n${randomHabits.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\n💡 Use .habit add "<habit>" to track these!`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Habit Suggestions',
                                body: 'Healthy habits',
                                thumbnailUrl: 'https://picsum.photos/300/300?random=128',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    break;
                    
                case 'check':
                    if (!habitName) {
                        return await sock.sendMessage(from, {
                            text: '❌ Please specify habit to check!\n\nExample: .habit check "Exercise"'
                        });
                    }
                    await sock.sendMessage(from, {
                        text: `🎉 *Habit Completed*\n\n✅ "${habitName}" - Done for today!\n🔥 Keep the streak going!\n\n📊 Consistency is key to success!`
                    });
                    break;
                    
                default:
                    await sock.sendMessage(from, {
                        text: '❌ Invalid action!\n\nAvailable actions:\n• add - Add new habit\n• list - Show habit suggestions\n• check - Mark habit as complete'
                    });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to process habit command!'
            });
        }
    }
};
