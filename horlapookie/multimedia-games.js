
export const command = {
    name: 'mgames',
    aliases: ['multimediagames', 'picturegames'],
    description: 'Interactive multimedia games with pictures and puzzles',
    usage: 'mgames puzzle | mgames guess | mgames memory | mgames word',
    category: 'fun',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, sender, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🎮 **Multimedia Games**\n\n**Available Games:**\n• .mgames puzzle - Picture puzzle challenge\n• .mgames guess - Guess the image\n• .mgames memory - Memory matching game\n• .mgames word - Word picture game\n\n🏆 **Features:**\n• Interactive gameplay\n• Score tracking\n• Multiplayer support\n• Daily challenges',
                contextInfo: {
                    externalAdReply: {
                        title: 'Multimedia Games',
                        body: 'Interactive picture games',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const game = args.trim().toLowerCase();
        
        // Initialize game states
        if (!global.multiMediaGames) {
            global.multiMediaGames = {};
        }
        
        if (!global.multiMediaGames[sender]) {
            global.multiMediaGames[sender] = {
                currentGame: null,
                score: 0,
                level: 1,
                streak: 0
            };
        }
        
        const playerData = global.multiMediaGames[sender];
        
        try {
            switch (game) {
                case 'puzzle':
                    await startPuzzleGame(sock, from, sender, playerData, settings);
                    break;
                    
                case 'guess':
                    await startGuessGame(sock, from, sender, playerData, settings);
                    break;
                    
                case 'memory':
                    await startMemoryGame(sock, from, sender, playerData, settings);
                    break;
                    
                case 'word':
                    await startWordGame(sock, from, sender, playerData, settings);
                    break;
                    
                default:
                    await showGameHelp(sock, from, settings);
                    break;
            }
        } catch (error) {
            console.error('Multimedia games error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error starting game. Please try again.'
            });
        }
        
        async function startPuzzleGame(sock, from, sender, playerData, settings) {
            const puzzles = [
                {
                    image: 'https://picsum.photos/400/400?random=1',
                    pieces: 9,
                    difficulty: 'Easy',
                    answer: 'nature'
                },
                {
                    image: 'https://picsum.photos/400/400?random=2',
                    pieces: 16,
                    difficulty: 'Medium',
                    answer: 'architecture'
                },
                {
                    image: 'https://picsum.photos/400/400?random=3',
                    pieces: 25,
                    difficulty: 'Hard',
                    answer: 'landscape'
                }
            ];
            
            const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
            playerData.currentGame = {
                type: 'puzzle',
                data: puzzle,
                startTime: Date.now()
            };
            
            await sock.sendMessage(from, {
                image: { url: puzzle.image },
                caption: `🧩 **Picture Puzzle Challenge**\n\n**Difficulty:** ${puzzle.difficulty}\n**Pieces:** ${puzzle.pieces}\n**Your Task:** Identify what this image represents\n\n**How to Play:**\n• Study the image carefully\n• Reply with your guess\n• Get points for correct answers!\n\n**Current Score:** ${playerData.score} points\n**Level:** ${playerData.level}\n**Streak:** ${playerData.streak}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Picture Puzzle',
                        body: `Level ${playerData.level} - ${puzzle.difficulty}`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        async function startGuessGame(sock, from, sender, playerData, settings) {
            const categories = [
                {
                    name: 'Animals',
                    images: [
                        { url: 'https://picsum.photos/400/400?random=10', answer: 'cat' },
                        { url: 'https://picsum.photos/400/400?random=11', answer: 'dog' },
                        { url: 'https://picsum.photos/400/400?random=12', answer: 'bird' }
                    ]
                },
                {
                    name: 'Objects',
                    images: [
                        { url: 'https://picsum.photos/400/400?random=20', answer: 'car' },
                        { url: 'https://picsum.photos/400/400?random=21', answer: 'house' },
                        { url: 'https://picsum.photos/400/400?random=22', answer: 'tree' }
                    ]
                }
            ];
            
            const category = categories[Math.floor(Math.random() * categories.length)];
            const item = category.images[Math.floor(Math.random() * category.images.length)];
            
            playerData.currentGame = {
                type: 'guess',
                data: { category: category.name, item },
                startTime: Date.now()
            };
            
            await sock.sendMessage(from, {
                image: { url: item.url },
                caption: `🔍 **Guess the Image**\n\n**Category:** ${category.name}\n**Challenge:** What do you see in this image?\n\n**Instructions:**\n• Look at the image carefully\n• Type your guess\n• Score points for correct answers!\n\n**Current Score:** ${playerData.score} points\n**Level:** ${playerData.level}\n**Streak:** ${playerData.streak}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Guess Game',
                        body: `Category: ${category.name}`,
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        async function startMemoryGame(sock, from, sender, playerData, settings) {
            const cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
            const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
            
            playerData.currentGame = {
                type: 'memory',
                data: {
                    cards: gameCards,
                    revealed: Array(16).fill(false),
                    matched: Array(16).fill(false),
                    firstCard: null,
                    moves: 0
                },
                startTime: Date.now()
            };
            
            const gameBoard = generateMemoryBoard(gameCards, playerData.currentGame.data.revealed);
            
            await sock.sendMessage(from, {
                text: `🧠 **Memory Matching Game**\n\n${gameBoard}\n\n**How to Play:**\n• Remember the positions\n• Type two numbers (1-16) to flip cards\n• Example: "5 12" to flip cards 5 and 12\n• Match all pairs to win!\n\n**Current Score:** ${playerData.score} points\n**Level:** ${playerData.level}\n**Moves:** ${playerData.currentGame.data.moves}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Memory Game',
                        body: 'Match all pairs to win',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        async function startWordGame(sock, from, sender, playerData, settings) {
            const wordImages = [
                { url: 'https://picsum.photos/400/400?random=30', letters: 'NATUR', answer: 'NATURE' },
                { url: 'https://picsum.photos/400/400?random=31', letters: 'OCENA', answer: 'OCEAN' },
                { url: 'https://picsum.photos/400/400?random=32', letters: 'MOUTAIN', answer: 'MOUNTAIN' }
            ];
            
            const wordImage = wordImages[Math.floor(Math.random() * wordImages.length)];
            const scrambled = wordImage.letters.split('').sort(() => Math.random() - 0.5).join('');
            
            playerData.currentGame = {
                type: 'word',
                data: wordImage,
                startTime: Date.now()
            };
            
            await sock.sendMessage(from, {
                image: { url: wordImage.url },
                caption: `🔤 **Word Picture Game**\n\n**Scrambled Letters:** ${scrambled}\n**Your Task:** Unscramble the letters to describe this image\n\n**Instructions:**\n• Look at the image for clues\n• Rearrange the letters\n• Type the correct word\n\n**Current Score:** ${playerData.score} points\n**Level:** ${playerData.level}\n**Streak:** ${playerData.streak}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Word Game',
                        body: 'Unscramble the word',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        function generateMemoryBoard(cards, revealed) {
            let board = '```\n';
            for (let i = 0; i < 16; i++) {
                if (i % 4 === 0 && i > 0) board += '\n';
                board += revealed[i] ? `${cards[i]} ` : `${String(i + 1).padStart(2, '0')} `;
            }
            board += '\n```';
            return board;
        }
        
        async function showGameHelp(sock, from, settings) {
            await sock.sendMessage(from, {
                text: `🎮 **Multimedia Games Help**\n\n**Available Games:**\n\n🧩 **Puzzle Game**\n• Identify images and themes\n• Multiple difficulty levels\n• Score points for correct guesses\n\n🔍 **Guess Game**\n• Category-based image guessing\n• Various themes (animals, objects, etc.)\n• Build your guessing skills\n\n🧠 **Memory Game**\n• Classic card matching\n• Remember positions\n• Complete in minimum moves\n\n🔤 **Word Game**\n• Unscramble letters\n• Image-based clues\n• Vocabulary building\n\n**Scoring System:**\n• Correct answers: +10 points\n• Streak bonus: +5 points\n• Level progression: Every 50 points\n• Time bonus: Faster = more points`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Games Help',
                        body: 'How to play multimedia games',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
