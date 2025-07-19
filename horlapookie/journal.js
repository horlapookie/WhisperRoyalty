
export const command = {
    name: 'journal',
    description: 'Create daily journal entries',
    category: 'utility',
    usage: '.journal <write/prompt/mood> [entry]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '❌ Please specify action!\n\nUsage:\n• .journal write "Today was amazing..."\n• .journal prompt\n• .journal mood [happy/sad/excited]'
            });
        }

        try {
            const [action, ...entryParts] = args.split(' ');
            const entry = entryParts.join(' ');
            
            switch (action.toLowerCase()) {
                case 'write':
                    if (!entry) {
                        return await sock.sendMessage(from, {
                            text: '❌ Please provide your journal entry!'
                        });
                    }
                    await sock.sendMessage(from, {
                        text: `📔 *Journal Entry Saved*\n\n📅 Date: ${new Date().toLocaleDateString()}\n\n📝 Entry:\n"${entry}"\n\n✨ Great job reflecting on your day!`
                    });
                    break;
                    
                case 'prompt':
                    const prompts = [
                        "What are three things you're grateful for today?",
                        "Describe a moment that made you smile today.",
                        "What challenge did you overcome today?",
                        "What did you learn about yourself today?",
                        "How did you show kindness to someone today?",
                        "What are you looking forward to tomorrow?",
                        "Describe your biggest accomplishment today.",
                        "What would you do differently today?",
                        "Who inspired you today and why?",
                        "What made today special or unique?"
                    ];
                    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                    
                    await sock.sendMessage(from, {
                        text: `💭 *Journal Prompt*\n\n❓ Today's Question:\n"${randomPrompt}"\n\n📝 Use .journal write "your response" to save your thoughts!`
                    });
                    break;
                    
                case 'mood':
                    const mood = entry || 'neutral';
                    const moodEmojis = {
                        happy: '😊', sad: '😢', excited: '🤩', angry: '😠',
                        calm: '😌', stressed: '😰', grateful: '🙏', confused: '😕'
                    };
                    const emoji = moodEmojis[mood.toLowerCase()] || '😐';
                    
                    await sock.sendMessage(from, {
                        text: `😊 *Mood Tracker*\n\n📅 Date: ${new Date().toLocaleDateString()}\n${emoji} Mood: ${mood}\n\n💡 Remember: It's okay to feel whatever you're feeling. Tomorrow is a new day!`
                    });
                    break;
                    
                default:
                    await sock.sendMessage(from, {
                        text: '❌ Invalid action!\n\nAvailable actions:\n• write - Save journal entry\n• prompt - Get writing prompt\n• mood - Track your mood'
                    });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to process journal command!'
            });
        }
    }
};
