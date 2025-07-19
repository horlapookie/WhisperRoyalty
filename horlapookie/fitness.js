
export const command = {
    name: 'fitness',
    aliases: ['workout', 'exercise'],
    description: 'Get fitness tips and workouts',
    usage: 'fitness <muscle group or type>',
    category: 'health',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const workoutType = args.trim().toLowerCase() || 'general';
        
        try {
            const workouts = {
                chest: {
                    exercises: ['Push-ups', 'Bench Press', 'Chest Flyes', 'Dips'],
                    tips: 'Focus on full range of motion and controlled movements.'
                },
                legs: {
                    exercises: ['Squats', 'Lunges', 'Deadlifts', 'Calf Raises'],
                    tips: 'Keep your core tight and maintain proper form.'
                },
                arms: {
                    exercises: ['Bicep Curls', 'Tricep Dips', 'Pull-ups', 'Push-ups'],
                    tips: 'Control the weight on both lifting and lowering phases.'
                },
                cardio: {
                    exercises: ['Running', 'Cycling', 'Jump Rope', 'Burpees'],
                    tips: 'Start slow and gradually increase intensity.'
                },
                general: {
                    exercises: ['Squats', 'Push-ups', 'Planks', 'Jumping Jacks'],
                    tips: 'Consistency is key to seeing results.'
                }
            };
            
            const workout = workouts[workoutType] || workouts.general;
            
            const fitnessInfo = `💪 **Fitness Guide**

**Workout Type:** ${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}

**Recommended Exercises:**
${workout.exercises.map((exercise, index) => `${index + 1}. ${exercise}`).join('\n')}

**💡 Pro Tip:** ${workout.tips}

**Workout Plan:**
• Warm-up: 5-10 minutes
• Main workout: 20-30 minutes
• Cool-down: 5-10 minutes

**Weekly Goal:**
• Beginners: 3 days/week
• Intermediate: 4-5 days/week
• Advanced: 5-6 days/week

**Remember:**
✅ Stay hydrated
✅ Get enough rest
✅ Listen to your body
✅ Maintain proper form

🏃‍♂️ **Stay Active, Stay Healthy!**`;

            await sock.sendMessage(from, {
                text: fitnessInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Fitness Guide',
                        body: 'Workout tips',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=124',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get fitness information!'
            });
        }
    }
};
