// Store active trivia games
const triviaGames = new Map();

export const command = {
    name: 'trivia',
    aliases: ['quiz'],
    description: 'Play trivia quiz game with enhanced answer system',
    usage: 'trivia | trivia answer <A/B/C/D>',
    category: 'games',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        const argsArray = args.trim().split(' ');
        const action = argsArray[0]?.toLowerCase();

        if (action === 'answer') {
            await handleAnswer(sock, msg, argsArray[1], context);
            return;
        }

        const questions = [
            {
                question: "What is the capital of France?",
                options: ["A) London", "B) Berlin", "C) Paris", "D) Madrid"],
                answer: "C",
                explanation: "Paris is the capital and largest city of France."
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["A) Van Gogh", "B) Da Vinci", "C) Picasso", "D) Monet"],
                answer: "B",
                explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519."
            },
            {
                question: "What is the largest planet in our solar system?",
                options: ["A) Earth", "B) Mars", "C) Jupiter", "D) Saturn"],
                answer: "C",
                explanation: "Jupiter is the largest planet in our solar system."
            },
            {
                question: "In which year did World War II end?",
                options: ["A) 1944", "B) 1945", "C) 1946", "D) 1947"],
                answer: "B",
                explanation: "World War II ended in 1945 with Japan's surrender."
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["A) Go", "B) Gd", "C) Au", "D) Ag"],
                answer: "C",
                explanation: "Au comes from the Latin word 'aurum' meaning gold."
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"],
                answer: "B",
                explanation: "Mars is called the Red Planet due to iron oxide on its surface."
            },
            {
                question: "What is the smallest country in the world?",
                options: ["A) Monaco", "B) Vatican City", "C) Andorra", "D) San Marino"],
                answer: "B",
                explanation: "Vatican City is the smallest country with 0.17 square miles."
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["A) Charles Dickens", "B) William Shakespeare", "C) Jane Austen", "D) Mark Twain"],
                answer: "B",
                explanation: "William Shakespeare wrote Romeo and Juliet around 1595."
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["A) Gold", "B) Iron", "C) Diamond", "D) Platinum"],
                answer: "C",
                explanation: "Diamond is the hardest naturally occurring substance."
            },
            {
                question: "Which ocean is the largest?",
                options: ["A) Atlantic", "B) Pacific", "C) Indian", "D) Arctic"],
                answer: "B",
                explanation: "The Pacific Ocean is the largest ocean on Earth."
            }
        ];

        // Check if there's an active game for this user
        const gameKey = `${from}_${sender}`;

        if (triviaGames.has(gameKey)) {
            return await sock.sendMessage(from, {
                text: '🧠 You already have an active trivia game! Answer the current question first with .trivia answer <A/B/C/D>',
                contextInfo: {
                    externalAdReply: {
                        title: 'Active Trivia Game',
                        body: 'Complete current question',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=517',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }

        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        // Store the game
        triviaGames.set(gameKey, {
            question: randomQuestion,
            startTime: Date.now(),
            answered: false
        });

        // Auto-clear after 60 seconds
        setTimeout(() => {
            if (triviaGames.has(gameKey)) {
                triviaGames.delete(gameKey);
                sock.sendMessage(from, {
                    text: '⏰ **Trivia Timeout**\n\nThe question has expired! Use .trivia to start a new game.',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Trivia Timeout',
                            body: 'Question expired',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=518',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }, 60000);

        await sock.sendMessage(from, {
            text: `🧠 **Trivia Question** 🎯\n\n❓ ${randomQuestion.question}\n\n${randomQuestion.options.join('\n')}\n\n⏰ **Answer with:** .trivia answer <A/B/C/D>\n💡 Example: .trivia answer C\n🕒 **Time limit:** 60 seconds`,
            contextInfo: {
                externalAdReply: {
                    title: 'Trivia Quiz Game',
                    body: 'Test your knowledge - Answer quickly!',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=519',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });

        async function handleAnswer(sock, msg, userAnswer, context) {
            const { from, sender } = context;
            const gameKey = `${from}_${sender}`;

            if (!triviaGames.has(gameKey)) {
                await sock.sendMessage(from, {
                    text: '❌ No active trivia game! Use .trivia to start a new game.'
                });
                return;
            }

            const game = triviaGames.get(gameKey);
            if (game.answered) {
                await sock.sendMessage(from, {
                    text: '❌ You have already answered this question!'
                });
                return;
            }

            if (!userAnswer || !['A', 'B', 'C', 'D'].includes(userAnswer.toUpperCase())) {
                await sock.sendMessage(from, {
                    text: '❌ Invalid answer! Please use .trivia answer <A/B/C/D>\n\nExample: .trivia answer C'
                });
                return;
            }

            game.answered = true;
            const isCorrect = userAnswer.toUpperCase() === game.question.answer;
            const timeTaken = Math.round((Date.now() - game.startTime) / 1000);

            // Update player stats
            const dataManager = global.dataManager;
            const stats = dataManager.getPlayerStats(sender);
            stats.triviaPlayed = (stats.triviaPlayed || 0) + 1;
            if (isCorrect) {
                stats.triviaCorrect = (stats.triviaCorrect || 0) + 1;
                stats.triviaPoints = (stats.triviaPoints || 0) + Math.max(10, 20 - timeTaken);
            }
            dataManager.setPlayerStats(sender, stats);

            let resultText;
            if (isCorrect) {
                const points = Math.max(10, 20 - timeTaken);
                resultText = `🎉 **CORRECT!** 🎉\n\n✅ **Answer:** ${game.question.answer}\n💡 **Explanation:** ${game.question.explanation}\n⏱️ **Time:** ${timeTaken} seconds\n🏆 **Points Earned:** +${points}\n📊 **Total Correct:** ${stats.triviaCorrect}/${stats.triviaPlayed}\n\n🎮 Use .trivia for another question!`;
            } else {
                resultText = `❌ **WRONG!** ❌\n\n✅ **Correct Answer:** ${game.question.answer}\n💡 **Explanation:** ${game.question.explanation}\n⏱️ **Time:** ${timeTaken} seconds\n📊 **Score:** ${stats.triviaCorrect || 0}/${stats.triviaPlayed}\n\n💪 Better luck next time! Use .trivia to try again!`;
            }

            await sock.sendMessage(from, {
                text: resultText,
                contextInfo: {
                    externalAdReply: {
                        title: isCorrect ? 'Trivia - Correct!' : 'Trivia - Wrong!',
                        body: isCorrect ? 'Great job!' : 'Try again!',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=520',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });

            triviaGames.delete(gameKey);
        }
    }
};

// Export function to handle trivia answers (for backwards compatibility)
export function handleTriviaAnswer(sock, msg, messageText, context) {
    // This function is now deprecated but kept for compatibility
    return false;
}