
export const command = {
    name: 'flashcard',
    description: 'Create study flashcards',
    category: 'utility',
    usage: '.flashcard <subject>',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const flashcards = {
                math: [
                    { q: "What is the formula for the area of a circle?", a: "π × r²" },
                    { q: "What is the Pythagorean theorem?", a: "a² + b² = c²" },
                    { q: "What is the derivative of x²?", a: "2x" }
                ],
                science: [
                    { q: "What is the chemical symbol for gold?", a: "Au" },
                    { q: "What is the speed of light?", a: "299,792,458 m/s" },
                    { q: "What is photosynthesis?", a: "Process by which plants convert sunlight into energy" }
                ],
                history: [
                    { q: "When did World War II end?", a: "1945" },
                    { q: "Who was the first person to walk on the moon?", a: "Neil Armstrong" },
                    { q: "When was the Declaration of Independence signed?", a: "July 4, 1776" }
                ]
            };
            
            const subject = args || 'math';
            const cards = flashcards[subject.toLowerCase()] || flashcards.math;
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            
            await sock.sendMessage(from, {
                text: `📚 *Flashcard Study*\n\n📖 Subject: ${subject}\n\n❓ Question:\n${randomCard.q}\n\n💡 Think about your answer, then tap to reveal...\n\n✅ Answer:\n${randomCard.a}\n\n🎯 Available subjects: math, science, history`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Flashcard Study',
                        body: 'Study helper',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=125',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get flashcard!'
            });
        }
    }
};
