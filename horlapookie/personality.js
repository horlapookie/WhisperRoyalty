
export const command = {
    name: 'personality',
    aliases: ['mbti', 'personalitytest'],
    description: 'Take a simple personality test',
    category: 'fun',
    usage: '.personality',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const personalities = [
                {
                    type: "INTJ - The Architect",
                    description: "Imaginative and strategic thinkers, with a plan for everything.",
                    traits: "Independent, Decisive, Hard-working, Determined, Confident"
                },
                {
                    type: "ENFP - The Campaigner", 
                    description: "Enthusiastic, creative and sociable free spirits.",
                    traits: "Curious, Observant, Energetic, Enthusiastic, Excellent Communicator"
                },
                {
                    type: "ISFJ - The Protector",
                    description: "Very dedicated and warm protectors, always ready to defend loved ones.",
                    traits: "Supportive, Reliable, Patient, Imaginative, Observant"
                },
                {
                    type: "ESTP - The Entrepreneur",
                    description: "Smart, energetic and very perceptive people, truly enjoy living on the edge.",
                    traits: "Bold, Rational, Practical, Original, Perceptive"
                },
                {
                    type: "INFP - The Mediator",
                    description: "Poetic, kind and altruistic people, always eager to help good causes.",
                    traits: "Idealistic, Loyal, Adaptive, Curious, Caring"
                },
                {
                    type: "ESTJ - The Executive",
                    description: "Excellent administrators, unsurpassed at managing things or people.",
                    traits: "Dedicated, Strong-willed, Direct, Honest, Loyal"
                }
            ];
            
            const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
            
            await sock.sendMessage(from, {
                text: `🧠 *Personality Analysis*\n\n🎯 Your Type: ${randomPersonality.type}\n\n📝 Description:\n${randomPersonality.description}\n\n✨ Key Traits:\n${randomPersonality.traits}\n\n💡 This is a simplified test! For accurate results, take a full MBTI assessment.\n\n🔄 Use the command again for different results!`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to analyze personality!'
            });
        }
    }
};
