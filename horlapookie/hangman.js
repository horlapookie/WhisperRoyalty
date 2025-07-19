const hangmanWords = [
    'javascript', 'whatsapp', 'computer', 'programming', 'algorithm', 'database',
    'network', 'security', 'encryption', 'developer', 'software', 'hardware',
    'internet', 'website', 'application', 'technology', 'artificial', 'intelligence',
    'machine', 'learning', 'blockchain', 'cryptocurrency', 'quantum', 'computing'
];

const hangmanStages = [
    '```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========\n```',
    '```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========\n```',
    '```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========\n```',
    '```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========\n```',
    '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========\n```',
    '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========\n```',
    '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========\n```'
];

// Simple in-memory game storage
const activeGames = new Map();

export const command = {
    name: 'hangman',
    aliases: ['hang'],
    description: 'Play hangman game (5 chances)',
    usage: 'hangman [letter]',
    category: 'Games',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            // Start new game
            const word = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
            const game = {
                word: word.toLowerCase(),
                guessed: [],
                wrongGuesses: 0,
                maxWrongGuesses: 5
            };
            
            activeGames.set(sender, game);
            
            const display = getWordDisplay(game.word, game.guessed);
            
            await sock.sendMessage(sender, {
                text: `🎮 *Hangman Game Started!*\n\n${hangmanStages[0]}\n\n📝 Word: ${display}\n❌ Wrong guesses: ${game.wrongGuesses}/${game.maxWrongGuesses}\n🔤 Guessed letters: ${game.guessed.join(', ') || 'none'}\n\n💡 Guess a letter: .hangman <letter>\nExample: .hangman a`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Hangman Game',
                        body: 'Word guessing game',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const game = activeGames.get(sender);
        if (!game) {
            await sock.sendMessage(sender, {
                text: '❌ No active game! Start a new game with .hangman',
                contextInfo: {
                    externalAdReply: {
                        title: 'Hangman Game',
                        body: 'No active game',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const letter = args.trim().toLowerCase();
        
        if (letter.length !== 1 || !/[a-z]/.test(letter)) {
            await sock.sendMessage(sender, {
                text: '❌ Please enter a single letter (a-z)!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Hangman Game',
                        body: 'Invalid input',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        if (game.guessed.includes(letter)) {
            await sock.sendMessage(sender, {
                text: `❌ You already guessed "${letter}"! Try a different letter.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Hangman Game',
                        body: 'Already guessed',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        game.guessed.push(letter);
        
        if (game.word.includes(letter)) {
            // Correct guess
            const display = getWordDisplay(game.word, game.guessed);
            
            if (display === game.word) {
                // Won the game
                activeGames.delete(sender);
                await sock.sendMessage(sender, {
                    text: `🎉 *Congratulations! You Won!*\n\n📝 Word: ${game.word.toUpperCase()}\n✅ You guessed the word with ${game.wrongGuesses} wrong guesses!\n\n🎮 Play again: .hangman`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Hangman Game',
                            body: 'You won!',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            } else {
                // Continue game
                await sock.sendMessage(sender, {
                    text: `✅ *Good guess!*\n\n${hangmanStages[game.wrongGuesses]}\n\n📝 Word: ${display}\n❌ Wrong guesses: ${game.wrongGuesses}/${game.maxWrongGuesses}\n🔤 Guessed letters: ${game.guessed.join(', ')}\n\n💡 Guess next letter: .hangman <letter>`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Hangman Game',
                            body: 'Good guess!',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            }
        } else {
            // Wrong guess
            game.wrongGuesses++;
            
            if (game.wrongGuesses >= game.maxWrongGuesses) {
                // Game over
                activeGames.delete(sender);
                await sock.sendMessage(sender, {
                    text: `💀 *Game Over!*\n\n${hangmanStages[game.wrongGuesses]}\n\n📝 The word was: ${game.word.toUpperCase()}\n❌ You ran out of guesses!\n\n🎮 Play again: .hangman`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Hangman Game',
                            body: 'Game over!',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            } else {
                // Continue game
                const display = getWordDisplay(game.word, game.guessed);
                await sock.sendMessage(sender, {
                    text: `❌ *Wrong guess!*\n\n${hangmanStages[game.wrongGuesses]}\n\n📝 Word: ${display}\n❌ Wrong guesses: ${game.wrongGuesses}/${game.maxWrongGuesses}\n🔤 Guessed letters: ${game.guessed.join(', ')}\n\n💡 Guess next letter: .hangman <letter>`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Hangman Game',
                            body: 'Wrong guess!',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                });
            }
        }
    }
};

function getWordDisplay(word, guessed) {
    return word.split('').map(letter => guessed.includes(letter) ? letter : '_').join(' ');
}
