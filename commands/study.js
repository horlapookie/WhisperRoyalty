
export const command = {
    name: 'study',
    aliases: ['studytips', 'learning'],
    description: 'Get study tips and techniques',
    category: 'utility',
    usage: '.study [technique]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const studyTechniques = {
                pomodoro: {
                    name: "Pomodoro Technique",
                    description: "A time management method using timed intervals",
                    steps: [
                        "1. Choose a task to work on",
                        "2. Set a timer for 25 minutes",
                        "3. Work on the task until timer rings",
                        "4. Take a 5-minute break",
                        "5. Repeat 3-4 times",
                        "6. Take a longer 15-30 minute break"
                    ]
                },
                feynman: {
                    name: "Feynman Technique",
                    description: "Learn by teaching concepts in simple terms",
                    steps: [
                        "1. Choose a concept to learn",
                        "2. Explain it in simple terms as if teaching a child",
                        "3. Identify gaps in your understanding",
                        "4. Go back to source material to fill gaps",
                        "5. Simplify your explanation further",
                        "6. Use analogies and examples"
                    ]
                },
                active: {
                    name: "Active Recall",
                    description: "Test yourself instead of just re-reading",
                    steps: [
                        "1. Read the material once",
                        "2. Close your books/notes",
                        "3. Write down everything you remember",
                        "4. Check what you missed",
                        "5. Focus on the gaps",
                        "6. Repeat the process"
                    ]
                },
                spaced: {
                    name: "Spaced Repetition",
                    description: "Review material at increasing intervals",
                    steps: [
                        "1. Learn new material",
                        "2. Review after 1 day",
                        "3. Review after 3 days",
                        "4. Review after 1 week",
                        "5. Review after 2 weeks",
                        "6. Review after 1 month"
                    ]
                }
            };
            
            if (!args) {
                const techniques = Object.keys(studyTechniques);
                return await sock.sendMessage(from, {
                    text: `📚 *Study Techniques*\n\n🎯 Available techniques:\n${techniques.map(t => `• ${t} - ${studyTechniques[t].name}`).join('\n')}\n\n💡 Use .study <technique> for details!\n\nExample: .study pomodoro`
                });
            }
            
            const technique = studyTechniques[args.toLowerCase()];
            if (!technique) {
                return await sock.sendMessage(from, {
                    text: '❌ Technique not found!\n\nAvailable: pomodoro, feynman, active, spaced'
                });
            }
            
            await sock.sendMessage(from, {
                text: `📖 *${technique.name}*\n\n📝 Description:\n${technique.description}\n\n🔢 Steps:\n${technique.steps.join('\n')}\n\n💪 Happy studying! Remember: consistency beats intensity!`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get study technique!'
            });
        }
    }
};
