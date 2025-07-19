
export const command = {
    name: 'workout',
    aliases: ['exercise', 'fitness'],
    description: 'Generate custom workout routines',
    category: 'utility',
    usage: '.workout [type/duration]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const workouts = {
                quick: {
                    name: "Quick 10-Minute Workout",
                    duration: "10 minutes",
                    exercises: [
                        "Jumping Jacks - 1 minute",
                        "Push-ups - 1 minute", 
                        "Squats - 1 minute",
                        "Plank - 1 minute",
                        "Mountain Climbers - 1 minute",
                        "Burpees - 1 minute",
                        "High Knees - 1 minute",
                        "Lunges - 1 minute",
                        "Wall Sit - 1 minute",
                        "Cool down stretches - 1 minute"
                    ]
                },
                strength: {
                    name: "Strength Training",
                    duration: "20-30 minutes",
                    exercises: [
                        "Warm-up: Light cardio - 5 minutes",
                        "Push-ups: 3 sets of 10-15 reps",
                        "Squats: 3 sets of 15-20 reps",
                        "Lunges: 3 sets of 10 per leg",
                        "Planks: 3 sets of 30-60 seconds",
                        "Dips: 3 sets of 8-12 reps",
                        "Glute bridges: 3 sets of 15 reps",
                        "Cool down: Stretching - 5 minutes"
                    ]
                },
                cardio: {
                    name: "Cardio Blast",
                    duration: "15-20 minutes",
                    exercises: [
                        "Warm-up: Marching in place - 2 minutes",
                        "Jumping Jacks - 2 minutes",
                        "High Knees - 1 minute", 
                        "Butt Kicks - 1 minute",
                        "Mountain Climbers - 2 minutes",
                        "Burpees - 1 minute",
                        "Running in place - 3 minutes",
                        "Jump Squats - 1 minute",
                        "Cool down: Walking and stretching - 5 minutes"
                    ]
                },
                yoga: {
                    name: "Relaxing Yoga Flow",
                    duration: "15-25 minutes",
                    exercises: [
                        "Child's Pose - 1 minute",
                        "Cat-Cow Stretches - 2 minutes",
                        "Downward Dog - 1 minute",
                        "Warrior I (both sides) - 2 minutes",
                        "Tree Pose (both sides) - 2 minutes",
                        "Seated Forward Fold - 2 minutes",
                        "Pigeon Pose (both sides) - 4 minutes",
                        "Savasana (final relaxation) - 5 minutes"
                    ]
                }
            };
            
            const type = args && workouts[args.toLowerCase()] ? args.toLowerCase() : 'quick';
            const workout = workouts[type];
            
            await sock.sendMessage(from, {
                text: `💪 *${workout.name}*\n\n⏰ Duration: ${workout.duration}\n\n🏋️‍♀️ Exercises:\n${workout.exercises.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}\n\n🔥 Available types: quick, strength, cardio, yoga\n\n💧 Remember to stay hydrated and listen to your body!`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate workout!'
            });
        }
    }
};
