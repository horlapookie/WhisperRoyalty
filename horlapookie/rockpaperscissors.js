
export const command = {
    name: 'rps',
    aliases: ['rockpaperscissors', 'rock-paper-scissors'],
    description: 'Play Rock Paper Scissors',
    usage: 'rps <rock/paper/scissors> | rps challenge @user | rps accept | rps decline',
    category: 'gaming',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!global.rpsGames) global.rpsGames = new Map();

        const argsArray = args.trim().split(' ');
        const action = argsArray[0]?.toLowerCase();

        const choices = ['rock', 'paper', 'scissors'];
        const emojis = { rock: '🗿', paper: '📄', scissors: '✂️' };

        try {
            if (action === 'challenge' && isGroup) {
                const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                if (!mentioned || mentioned === sender) {
                    await sock.sendMessage(from, {
                        text: '❌ Please mention someone to challenge!\n**Usage:** `.rps challenge @username`',
                        quoted: msg
                    });
                    return;
                }

                if (global.rpsGames.has(from)) {
                    await sock.sendMessage(from, {
                        text: '🎮 There\'s already an active RPS game in this group!',
                        quoted: msg
                    });
                    return;
                }

                const game = {
                    challenger: sender,
                    opponent: mentioned,
                    status: 'pending',
                    createdAt: Date.now()
                };

                global.rpsGames.set(from, game);

                await sock.sendMessage(from, {
                    text: `🎮 **ROCK PAPER SCISSORS CHALLENGE!**

@${sender.split('@')[0]} has challenged @${mentioned.split('@')[0]} to Rock Paper Scissors!

**Accept:** \`.rps accept\`
**Decline:** \`.rps decline\`

⏳ Challenge expires in 1 minute`,
                    mentions: [mentioned, sender],
                    quoted: msg
                });

                setTimeout(() => {
                    const currentGame = global.rpsGames.get(from);
                    if (currentGame && currentGame.status === 'pending') {
                        global.rpsGames.delete(from);
                        sock.sendMessage(from, { text: '⏰ RPS challenge expired.' });
                    }
                }, 60000);

            } else if (action === 'accept') {
                const game = global.rpsGames.get(from);
                if (!game || game.status !== 'pending' || sender !== game.opponent) {
                    await sock.sendMessage(from, {
                        text: '❌ No valid challenge found for you!',
                        quoted: msg
                    });
                    return;
                }

                game.status = 'active';
                await sock.sendMessage(from, {
                    text: `🎮 **RPS BATTLE ACCEPTED!**

Both players, choose your move in DM:
• \`.rps rock\`
• \`.rps paper\`  
• \`.rps scissors\`

⏰ You have 30 seconds to choose!`,
                    quoted: msg
                });

                setTimeout(() => {
                    const currentGame = global.rpsGames.get(from);
                    if (currentGame && currentGame.status === 'active') {
                        global.rpsGames.delete(from);
                        sock.sendMessage(from, { text: '⏰ RPS game expired - no moves made!' });
                    }
                }, 30000);

            } else if (action === 'decline') {
                const game = global.rpsGames.get(from);
                if (!game || game.status !== 'pending' || sender !== game.opponent) {
                    await sock.sendMessage(from, {
                        text: '❌ No valid challenge found for you!',
                        quoted: msg
                    });
                    return;
                }

                global.rpsGames.delete(from);
                await sock.sendMessage(from, {
                    text: '❌ RPS challenge declined.',
                    quoted: msg
                });

            } else if (choices.includes(action)) {
                // Check if there's an active multiplayer game
                let multiplayerGame = null;
                for (const [groupId, game] of global.rpsGames.entries()) {
                    if (game.status === 'active' && (sender === game.challenger || sender === game.opponent)) {
                        multiplayerGame = { groupId, game };
                        break;
                    }
                }

                if (multiplayerGame) {
                    // Multiplayer game
                    const { groupId, game } = multiplayerGame;
                    
                    if (sender === game.challenger) {
                        game.challengerChoice = action;
                    } else {
                        game.opponentChoice = action;
                    }

                    if (game.challengerChoice && game.opponentChoice) {
                        // Both players made choices
                        const challenger = game.challenger;
                        const opponent = game.opponent;
                        const challengerChoice = game.challengerChoice;
                        const opponentChoice = game.opponentChoice;

                        let result = '';
                        if (challengerChoice === opponentChoice) {
                            result = '🤝 **TIE!**';
                        } else if (
                            (challengerChoice === 'rock' && opponentChoice === 'scissors') ||
                            (challengerChoice === 'paper' && opponentChoice === 'rock') ||
                            (challengerChoice === 'scissors' && opponentChoice === 'paper')
                        ) {
                            result = `🏆 **@${challenger.split('@')[0]} WINS!**`;
                        } else {
                            result = `🏆 **@${opponent.split('@')[0]} WINS!**`;
                        }

                        global.rpsGames.delete(groupId);

                        await sock.sendMessage(groupId, {
                            text: `🎮 **ROCK PAPER SCISSORS RESULTS!**

@${challenger.split('@')[0]}: ${emojis[challengerChoice]} ${challengerChoice.toUpperCase()}
@${opponent.split('@')[0]}: ${emojis[opponentChoice]} ${opponentChoice.toUpperCase()}

${result}`,
                            mentions: [challenger, opponent]
                        });

                    } else {
                        // Acknowledge choice received
                        await sock.sendMessage(sender, {
                            text: `✅ Your choice (${emojis[action]} ${action.toUpperCase()}) has been recorded! Waiting for opponent...`
                        });
                    }

                } else {
                    // Single player vs bot
                    const playerChoice = action;
                    const botChoice = choices[Math.floor(Math.random() * 3)];

                    let result = '';
                    if (playerChoice === botChoice) {
                        result = '🤝 **TIE!**';
                    } else if (
                        (playerChoice === 'rock' && botChoice === 'scissors') ||
                        (playerChoice === 'paper' && botChoice === 'rock') ||
                        (playerChoice === 'scissors' && botChoice === 'paper')
                    ) {
                        result = '🏆 **YOU WIN!**';
                    } else {
                        result = '🤖 **BOT WINS!**';
                    }

                    await sock.sendMessage(from, {
                        text: `🎮 **ROCK PAPER SCISSORS**

Your choice: ${emojis[playerChoice]} **${playerChoice.toUpperCase()}**
Bot choice: ${emojis[botChoice]} **${botChoice.toUpperCase()}**

${result}`,
                        quoted: msg
                    });
                }

            } else {
                await sock.sendMessage(from, {
                    text: `🎮 **Rock Paper Scissors**

**Single Player:**
• \`.rps rock\` - Choose rock
• \`.rps paper\` - Choose paper  
• \`.rps scissors\` - Choose scissors

**Multiplayer (Groups):**
• \`.rps challenge @user\` - Challenge someone
• \`.rps accept\` - Accept challenge
• \`.rps decline\` - Decline challenge

🗿 Rock beats Scissors
📄 Paper beats Rock
✂️ Scissors beats Paper`,
                    quoted: msg
                });
            }

        } catch (error) {
            console.error('RPS Game Error:', error);
            await sock.sendMessage(from, {
                text: '❌ An error occurred in the RPS game.',
                quoted: msg
            });
        }
    }
};
