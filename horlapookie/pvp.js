const command = {
    name: 'pvp',
    aliases: ['battle', 'fight'],
    description: 'Pokemon PvP battle system',
    usage: 'pvp challenge @user | pve | accept | decline | move1-4 | switch <1-4> | forfeit',
    category: 'pokemon',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Initialize battle storage
        if (!global.battles) global.battles = new Map();
        const dataManager = global.dataManager;

        const battleKey = from;
        const currentBattle = global.battles.get(battleKey);

        const argsArray = args.trim().split(' ');
        const action = argsArray[0]?.toLowerCase();

        // Redirect gift command to pokemongift
        if (action === 'gift') {
            await sock.sendMessage(from, {
                text: '🎁 **Pokemon Gift System**\n\nUse the dedicated command: `.pokemongift @user <number>`\n\n📝 **Example:** .pokemongift @username 1\n\n💡 Use .pc to see your Pokemon numbers!'
            });
            return;
        }

        switch (action) {
            case 'challenge':
                if (!isGroup) {
                    await sock.sendMessage(from, {
                        text: '❌ PvP battles can only be started in groups!',
                        contextInfo: {
                            externalAdReply: {
                                title: 'PvP Battle System',
                                body: 'Groups only feature',
                                thumbnailUrl: 'https://picsum.photos/300/300?random=501',
                                sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }
                await handleChallenge(sock, msg, argsArray, context);
                break;

            case 'pve':
                await handlePvE(sock, msg, context);
                break;

            case 'accept':
                await handleAccept(sock, msg, context);
                break;

            case 'decline':
                await handleDecline(sock, msg, context);
                break;

            case 'move1':
            case 'move2':
            case 'move3':
            case 'move4':
                await handleMove(sock, msg, action, context);
                break;

            case 'switch':
                await handleSwitch(sock, msg, argsArray[1], context);
                break;

            case 'forfeit':
                await handleForfeit(sock, msg, context);
                break;

            default:
                await showHelp(sock, msg, context);
                break;
        }

        async function handleChallenge(sock, msg, argsArray, context) {
            if (currentBattle) {
                await sock.sendMessage(from, {
                    text: '⚔️ A battle is already in progress in this group!',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Battle In Progress',
                            body: 'Wait for current battle to end',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=502',
                            sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                            mediaType: 1
                        }
                    }
                });
                return;
            }

            // Get target user from different methods
            let targetUser = null;

            // Method 1: Check if replying to someone's message
            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                targetUser = msg.message.extendedTextMessage.contextInfo.participant;
            }
            // Method 2: Check if mentioned someone
            else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
                targetUser = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }
            // Method 3: Check if phone number is provided in arguments
            else {
                const challengeArgs = args.split(' ').slice(1); // Remove 'challenge'
                if (challengeArgs[0] && challengeArgs[0].match(/^\d{10,15}$/)) {
                    // If argument is a phone number (10-15 digits)
                    targetUser = challengeArgs[0] + '@s.whatsapp.net';
                }
            }

            if (!targetUser) {
                await sock.sendMessage(from, {
                    text: '❌ Please specify who to challenge!\n\n📝 **Methods:**\n• Reply to their message: .pvp challenge\n• Mention them: .pvp challenge @username\n• Use their number: .pvp challenge 2347049044897'
                });
                return;
            }

            const mentioned = targetUser;

            if (mentioned === sender) {
                await sock.sendMessage(from, {
                    text: '❌ You cannot challenge yourself!'
                });
                return;
            }

            // Check if both players have party Pokemon
            const challengerParty = getPlayerParty(sender);
            const challengedParty = getPlayerParty(mentioned);

            if (challengerParty.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ You need Pokemon in your party to battle!\n\n🎮 Use `.transfer2party <number>` to add Pokemon to your party first!'
                });
                return;
            }

            if (challengedParty.length === 0) {
                await sock.sendMessage(from, {
                    text: `❌ @${mentioned.split('@')[0]} needs Pokemon in their party to battle!`,
                    mentions: [mentioned]
                });
                return;
            }

            // Create pending challenge
            global.battles.set(battleKey, {
                challenger: sender,
                challenged: mentioned,
                status: 'pending',
                createdAt: Date.now(),
                battleType: 'pvp'
            });

            // Get usernames from WhatsApp
            const challengerName = msg.pushName || sender.split('@')[0];
            const challengedName = mentioned.split('@')[0];

            await sock.sendMessage(from, {
                text: `⚔️ **POKEMON PARTY BATTLE CHALLENGE!**\n\n🔥 **${challengerName}** has challenged **${challengedName}** to a Pokemon party battle!\n\n**⚡ Battle Rules:**\n• Use your party Pokemon (up to 4)\n• Strategic switching between Pokemon\n• Type effectiveness and status effects\n• First trainer to defeat all opponent Pokemon wins!\n\n**🎮 Commands for ${challengedName}:**\n• .pvp accept - Accept the challenge\n• .pvp decline - Decline the challenge\n\n⏰ **Challenge expires in 60 seconds**`,
                mentions: [sender, mentioned],
                contextInfo: {
                    externalAdReply: {
                        title: 'Pokemon Party Battle!',
                        body: 'Epic trainer battle awaits!',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=504',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });

            // Auto-expire challenge after 60 seconds
            setTimeout(() => {
                const battle = global.battles.get(battleKey);
                if (battle && battle.status === 'pending') {
                    global.battles.delete(battleKey);
                    sock.sendMessage(from, {
                        text: '⏰ **Challenge Expired**\n\nThe battle challenge has timed out.',
                        contextInfo: {
                            externalAdReply: {
                                title: 'Challenge Expired',
                                body: 'Battle timed out',
                                thumbnailUrl: 'https://picsum.photos/300/300?random=505',
                                sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                                mediaType: 1
                            }
                        }
                    });
                }
            }, 60000);
        }

        async function handlePvE(sock, msg, context) {
            if (currentBattle) {
                await sock.sendMessage(from, {
                    text: '⚔️ A battle is already in progress!',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Battle In Progress',
                            body: 'Complete current battle first',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=520',
                            sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                            mediaType: 1
                        }
                    }
                });
                return;
            }

            const playerParty = getPlayerParty(sender);
            if (playerParty.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ You need Pokemon in your party to battle!\n\n🎮 Use `.transfer2party <number>` to add Pokemon to your party first!'
                });
                return;
            }

            // Generate random wild Pokemon for PvE
            const wildPokemon = generateWildOpponent();

            // Initialize PvE battle
            const battle = {
                challenger: sender,
                challenged: 'WILD_POKEMON',
                status: 'active',
                turn: sender,
                round: 1,
                weather: getRandomWeather(),
                terrain: getRandomTerrain(),
                battleType: 'pve',
                player1: {
                    id: sender,
                    team: playerParty.map(p => ({
                        ...p,
                        currentHp: p.hp,
                        maxHp: p.hp,
                        statusEffect: null,
                        statChanges: { attack: 0, defense: 0, speed: 0 }
                    })),
                    activePokemon: 0,
                    faintedCount: 0
                },
                player2: {
                    id: 'WILD_POKEMON',
                    team: [wildPokemon],
                    activePokemon: 0,
                    faintedCount: 0
                }
            };

            global.battles.set(battleKey, battle);

            await sock.sendMessage(from, {
                image: { url: 'https://picsum.photos/800/600?random=battle1' },
                caption: `🌟 **WILD POKEMON BATTLE!**\n\n⚔️ A wild **${wildPokemon.nickname}** appeared!\n\n**Your Active Pokemon:**\n${getBattlePokemonStatus(battle.player1.team[0])}\n\n**VS**\n\n**Wild Pokemon:**\n${getBattlePokemonStatus(wildPokemon)}\n\n**⚡ Available Actions:**\n${getMovesText(battle.player1.team[0].moves)}\n\n🎮 **Commands:** .pvp move1/2/3/4, .pvp switch <1-4>, or .pvp forfeit`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Wild Pokemon Battle!',
                        body: `${battle.player1.team[0].nickname} vs Wild ${wildPokemon.nickname}`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=521',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        }

        async function handleAccept(sock, msg, context) {
            if (!currentBattle || currentBattle.status !== 'pending') {
                await sock.sendMessage(from, {
                    text: '❌ No pending challenge to accept!'
                });
                return;
            }

            if (sender !== currentBattle.challenged) {
                await sock.sendMessage(from, {
                    text: '❌ Only the challenged player can accept the battle!'
                });
                return;
            }

            // Get each player's party
            const challengerParty = getPlayerParty(currentBattle.challenger);
            const challengedParty = getPlayerParty(currentBattle.challenged);

            if (challengerParty.length === 0 || challengedParty.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ One or both players don\'t have Pokemon in their party!'
                });
                global.battles.delete(battleKey);
                return;
            }

            // Initialize party battle
            const battle = {
                challenger: currentBattle.challenger,
                challenged: currentBattle.challenged,
                status: 'active',
                turn: Math.random() < 0.5 ? currentBattle.challenger : currentBattle.challenged,
                round: 1,
                weather: getRandomWeather(),
                terrain: getRandomTerrain(),
                battleType: 'pvp',
                player1: {
                    id: currentBattle.challenger,
                    team: challengerParty.map(p => ({
                        ...p,
                        currentHp: p.hp,
                        maxHp: p.hp,
                        statusEffect: null,
                        statChanges: { attack: 0, defense: 0, speed: 0 }
                    })),
                    activePokemon: 0,
                    faintedCount: 0
                },
                player2: {
                    id: currentBattle.challenged,
                    team: challengedParty.map(p => ({
                        ...p,
                        currentHp: p.hp,
                        maxHp: p.hp,
                        statusEffect: null,
                        statChanges: { attack: 0, defense: 0, speed: 0 }
                    })),
                    activePokemon: 0,
                    faintedCount: 0
                }
            };

            global.battles.set(battleKey, battle);

            const battleField = getWeatherEmoji(battle.weather) + getTerrainEmoji(battle.terrain);

            // Get participant names
            const challenger1Name = battle.player1.id === sender ? (msg.pushName || battle.player1.id.split('@')[0]) : battle.player1.id.split('@')[0];
            const challenger2Name = battle.player2.id === sender ? (msg.pushName || battle.player2.id.split('@')[0]) : battle.player2.id.split('@')[0];
            const currentTurnName = battle.turn === battle.player1.id ? challenger1Name : challenger2Name;

            await sock.sendMessage(from, {
                image: { url: 'https://picsum.photos/800/600?random=pvpbattle' },
                caption: `🔥 **POKEMON PARTY BATTLE BEGINS!**\n\n${battleField} **Battle Conditions:**\n• Weather: ${battle.weather}\n• Terrain: ${battle.terrain}\n\n**🔴 Challenger:** **${challenger1Name}**\n${getPartyStatus(battle.player1)}\n\n**🔵 Defender:** **${challenger2Name}**\n${getPartyStatus(battle.player2)}\n\n**👤 First Turn:** **${currentTurnName}**\n\n**Current Battle:**\n${getBattlePokemonStatus(battle.player1.team[battle.player1.activePokemon])}\n\n**VS**\n\n${getBattlePokemonStatus(battle.player2.team[battle.player2.activePokemon])}\n\n**⚡ Available Actions:**\n${getMovesText(getCurrentPlayer(battle).team[getCurrentPlayer(battle).activePokemon].moves)}\n\n🎮 **Commands:** .pvp move1/2/3/4 or .pvp switch <1-4>`,
                mentions: [battle.player1.id, battle.player2.id, battle.turn],
                contextInfo: {
                    externalAdReply: {
                        title: 'Pokemon Party Battle!',
                        body: `${battle.player1.team[0].nickname} vs ${battle.player2.team[0].nickname}`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=506',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        }

        async function handleMove(sock, msg, moveCommand, context) {
            if (!currentBattle || currentBattle.status !== 'active') {
                await sock.sendMessage(from, {
                    text: '❌ No active battle!'
                });
                return;
            }

            if (sender !== currentBattle.turn) {
                await sock.sendMessage(from, {
                    text: '❌ It\'s not your turn!'
                });
                return;
            }

            const moveIndex = parseInt(moveCommand.replace('move', '')) - 1;
            const attacker = getCurrentPlayer(currentBattle);
            const defender = getOpponent(currentBattle);
            const attackingPokemon = attacker.team[attacker.activePokemon];
            const defendingPokemon = defender.team[defender.activePokemon];

            if (!attackingPokemon.moves[moveIndex]) {
                await sock.sendMessage(from, {
                    text: `❌ Invalid move! Your ${attackingPokemon.nickname} only knows:\n\n${getMovesText(attackingPokemon.moves)}`
                });
                return;
            }

            const move = attackingPokemon.moves[moveIndex];
            const battleResult = await executeBattleMove(move, attackingPokemon, defendingPokemon, currentBattle);

            // Check if defending Pokemon fainted
            if (defendingPokemon.currentHp <= 0) {
                defender.faintedCount++;

                // Check if all Pokemon fainted (battle over)
                if (defender.faintedCount >= defender.team.length) {
                    global.battles.delete(battleKey);
                    await endBattle(sock, from, attacker, defender, battleResult);
                    return;
                }

                // Force switch to next available Pokemon
                const nextPokemon = defender.team.findIndex((p, i) => i !== defender.activePokemon && p.currentHp > 0);
                if (nextPokemon !== -1) {
                    defender.activePokemon = nextPokemon;
                    await sock.sendMessage(from, {
                        text: battleResult + `\n\n💀 **${defendingPokemon.nickname}** has fainted!\n\n🔄 @${defender.id.split('@')[0]} must send out their next Pokemon!\n\n**Next Pokemon:** ${defender.team[nextPokemon].nickname}\n\n**👤 Turn:** @${currentBattle.turn.split('@')[0]}`,
                        mentions: [defender.id, currentBattle.turn]
                    });
                }
            } else {
                // Switch turns and continue battle
                if (currentBattle.battleType === 'pve') {
                    setTimeout(async () => {
                        await handleAIMove(sock, from, currentBattle);
                    }, 2000);
                } else {
                    currentBattle.turn = defender.id;
                }

                currentBattle.round++;
                global.battles.set(battleKey, currentBattle);

                if (currentBattle.battleType !== 'pve') {
                    const continueBattleText = battleResult + `\n\n**👤 Turn:** @${currentBattle.turn.split('@')[0]}\n**🔢 Round:** ${currentBattle.round}\n\n**Current Battle:**\n${getBattlePokemonStatus(attacker.team[attacker.activePokemon])}\n\n**VS**\n\n${getBattlePokemonStatus(defender.team[defender.activePokemon])}\n\n**⚡ Available Actions:**\n${getMovesText(getCurrentPlayer(currentBattle).team[getCurrentPlayer(currentBattle).activePokemon].moves)}`;

                    await sock.sendMessage(from, {
                        image: { url: `https://picsum.photos/800/600?random=battle${currentBattle.round}` },
                        caption: continueBattleText,
                        mentions: [attacker.id, defender.id, currentBattle.turn],
                        contextInfo: {
                            externalAdReply: {
                                title: 'Battle Continues',
                                body: `Round ${currentBattle.round}`,
                                thumbnailUrl: 'https://picsum.photos/300/300?random=507',
                                sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                                mediaType: 1
                            }
                        }
                    });
                }
            }
        }

        async function handleSwitch(sock, msg, pokemonNumber, context) {
            if (!currentBattle || currentBattle.status !== 'active') {
                await sock.sendMessage(from, {
                    text: '❌ No active battle!'
                });
                return;
            }

            if (sender !== currentBattle.turn) {
                 await sock.sendMessage(from, {
                    text: '❌ It\'s not your turn!'
                });
               return;
            }

            const player = getCurrentPlayer(currentBattle);
            const pokemonIndex = parseInt(pokemonNumber) - 1;

            if (isNaN(pokemonIndex) || pokemonIndex < 0 || pokemonIndex >= player.team.length) {
                await sock.sendMessage(from, {
                    text: `❌ Invalid Pokemon number! You have ${player.team.length} Pokemon in your party.`
                });
                return;
            }

            if (pokemonIndex === player.activePokemon) {
                await sock.sendMessage(from, {
                    text: '❌ That Pokemon is already active!'
                });
                return;
            }

            if (player.team[pokemonIndex].currentHp <= 0) {
                await sock.sendMessage(from, {
                    text: '❌ That Pokemon has fainted and cannot battle!'
                });
                return;
            }

            const oldPokemon = player.team[player.activePokemon];
            player.activePokemon = pokemonIndex;
            const newPokemon = player.team[pokemonIndex];

            // Switch turns after switching
            if (currentBattle.battleType !== 'pve') {
                currentBattle.turn = getOpponent(currentBattle).id;
            }
            currentBattle.round++;

            const playerName = msg.pushName || sender.split('@')[0];
            const turnPlayerName = currentBattle.turn === sender ? playerName : currentBattle.turn.split('@')[0];

            await sock.sendMessage(from, {
                text: `🔄 **POKEMON SWITCH!**\n\n**${playerName}** recalled **${oldPokemon.nickname}** and sent out **${newPokemon.nickname}**!\n\n${getBattlePokemonStatus(newPokemon)}\n\n**👤 Turn:** **${turnPlayerName}**\n**🔢 Round:** ${currentBattle.round}`,
                mentions: [sender, currentBattle.turn],
                contextInfo: {
                    externalAdReply: {
                        title: 'Pokemon Switch',
                        body: `${newPokemon.nickname} enters battle!`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=508',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });

            if (currentBattle.battleType === 'pve') {
                setTimeout(async () => {
                    await handleAIMove(sock, from, currentBattle);
                }, 2000);
            }
        }

        async function handleForfeit(sock, msg, context) {
            if (!currentBattle || currentBattle.status !== 'active') {
                await sock.sendMessage(from, {
                    text: '❌ No active battle to forfeit!'
                });
                return;
            }

            const isPlayer = sender === currentBattle.player1.id || sender === currentBattle.player2.id;
            if (!isPlayer) {
                await sock.sendMessage(from, {
                    text: '❌ Only battle participants can forfeit!'
                });
                return;
            }

            const winner = sender === currentBattle.player1.id ? currentBattle.player2 : currentBattle.player1;

            global.battles.delete(battleKey);

            if (currentBattle.battleType === 'pvp') {
                const forfeiterName = msg.pushName || sender.split('@')[0];
                const winnerName = winner.id.split('@')[0];

                await sock.sendMessage(from, {
                    text: `🏳️ **BATTLE FORFEIT**\n\n❌ **${forfeiterName}** has forfeited the battle!\n\n🏆 **${winnerName}** wins by forfeit!`,
                    mentions: [sender, winner.id],
                    contextInfo: {
                        externalAdReply: {
                            title: 'Battle Forfeit',
                            body: 'Battle ended by forfeit',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=515',
                            sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: `🏳️ **BATTLE FORFEIT**\n\n❌ You escaped from the wild Pokemon battle!`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Escaped from Battle',
                            body: 'Successfully ran away',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=515',
                            sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                            mediaType: 1
                        }
                    }
                });
            }
        }

        async function handleDecline(sock, msg, context) {
            if (!currentBattle || currentBattle.status !== 'pending') {
                await sock.sendMessage(from, {
                    text: '❌ No pending challenge to decline!'
                });
                return;
            }

            if (sender !== currentBattle.challenged) {
                await sock.sendMessage(from, {
                    text: '❌ Only the challenged player can decline!'
                });
                return;
            }

            global.battles.delete(battleKey);

            const challengedName = currentBattle.challenged.split('@')[0];

            await sock.sendMessage(from, {
                text: `❌ **Challenge Declined**\n\n**${challengedName}** has declined the battle challenge.`,
                mentions: [currentBattle.challenged]
            });
        }

        async function showHelp(sock, msg, context) {
            await sock.sendMessage(from, {
                text: `⚔️ **Pokemon Battle System**\n\n**🎮 Battle Commands:**\n• .pvp challenge @user - Challenge to PvP battle\n• .pvp pve - Battle wild Pokemon (PvE)\n• .pvp accept - Accept challenge\n• .pvp decline - Decline challenge\n• .pvp move1/2/3/4 - Use moves in battle\n• .pvp switch <1-4> - Switch Pokemon in battle\n• .pvp forfeit - Give up current battle\n\n**📋 How to Play:**\n1. Catch Pokemon with .spawnpokemon and .catch\n2. Build your party with .transfer2party <number>\n3. Challenge trainers (PvP) or wild Pokemon (PvE)\n4. Strategically switch between Pokemon\n\n**🌟 Features:**\n• Party system: Manage up to 4 battle Pokemon\n• PvP: Strategic battles with other trainers\n• PvE: Train against wild Pokemon\n• Advanced battle mechanics\n\n**💡 Other Commands:**\n• .party - View your battle party\n• .pc - View PC storage\n• .transfer2party <number> - Move Pokemon to party\n• .transfer2pc <number> - Move Pokemon to PC\n• .pvpheal - Heal party Pokemon\n• .pvpstats - View battle statistics\n• .pvpleaderboard - View leaderboard\n\n🎮 **Ready for epic Pokemon adventures?**`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Pokemon Battle System',
                        body: 'Strategic battles await!',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=516',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        }

        // Helper functions
        function getPlayerParty(playerId) {
            const stats = dataManager.getPlayerStats(playerId);
            if (!stats.party) stats.party = [];

            const allPokemon = dataManager.getPlayerPokemon(playerId);
            return allPokemon.filter(pokemon => stats.party.includes(pokemon.id));
        }

        function getCurrentPlayer(battle) {
            return battle.turn === battle.player1.id ? battle.player1 : battle.player2;
        }

        function getOpponent(battle) {
            return battle.turn === battle.player1.id ? battle.player2 : battle.player1;
        }

        function getPartyStatus(player) {
            return player.team.map((pokemon, index) => {
                const isActive = index === player.activePokemon ? '⚡' : '';
                const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
                const status = pokemon.currentHp > 0 ? `${hpPercent.toFixed(0)}% HP` : '💀 Fainted';
                return `${isActive}${index + 1}. **${pokemon.nickname}** (${status})`;
            }).join('\n');
        }

        function getBattlePokemonStatus(pokemon) {
            const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
            const hpBar = '█'.repeat(Math.floor(hpPercent / 10)) + '░'.repeat(10 - Math.floor(hpPercent / 10));
            return `**${pokemon.nickname}** (Level ${pokemon.level})\n💚 HP: ${pokemon.currentHp}/${pokemon.maxHp} (${hpPercent.toFixed(0)}%)\n${hpBar}\n⚡ ATK: ${pokemon.attack} | 🛡️ DEF: ${pokemon.defense} | 💨 SPD: ${pokemon.speed}`;
        }

        function getMovesText(moves) {
            return moves.map((move, index) => 
                `${index + 1}. **${move.name}** ${move.power > 0 ? `(${move.power} power)` : '(Status)'} - ${move.type}`
            ).join('\n');
        }

        function getRandomWeather() {
            const weathers = ['Clear', 'Rain', 'Sun', 'Hail', 'Sandstorm'];
            return weathers[Math.floor(Math.random() * weathers.length)];
        }

        function getRandomTerrain() {
            const terrains = ['Normal', 'Electric', 'Grassy', 'Misty', 'Psychic'];
            return terrains[Math.floor(Math.random() * terrains.length)];
        }

        function getWeatherEmoji(weather) {
            const emojis = { 'Clear': '☀️', 'Rain': '🌧️', 'Sun': '🌞', 'Hail': '🧊', 'Sandstorm': '🌪️' };
            return emojis[weather] || '☀️';
        }

        function getTerrainEmoji(terrain) {
            const emojis = { 'Normal': '🏞️', 'Electric': '⚡', 'Grassy': '🌿', 'Misty': '🌫️', 'Psychic': '🔮' };
            return emojis[terrain] || '🏞️';
        }

        async function executeBattleMove(move, attacker, defender, battle) {
            let damage = 0;
            let battleText = `⚔️ **${attacker.nickname}** used **${move.name}**!\n\n`;

            if (move.power > 0) {
                // Calculate damage
                const criticalHit = Math.random() < 0.1;
                const effectiveness = getTypeEffectiveness(move.type, defender.type);

                damage = Math.floor(
                    ((move.power * (attacker.attack / defender.defense)) * 0.4 + 10) *
                    effectiveness *
                    (criticalHit ? 1.5 : 1) *
                    (0.85 + Math.random() * 0.15)
                );

                defender.currentHp = Math.max(0, defender.currentHp - damage);

                battleText += `💥 **${defender.nickname}** took ${damage} damage!\n`;

                if (effectiveness > 1) battleText += `🔥 **It's super effective!**\n`;
                else if (effectiveness < 1) battleText += `🌊 **It's not very effective...**\n`;

                if (criticalHit) battleText += `⭐ **Critical hit!**\n`;
            } else {
                battleText += `✨ **Status move used!**\n`;
            }

            return battleText;
        }

        function getTypeEffectiveness(attackType, defenderType) {
            const effectiveness = {
                'Fire': { 'Grass': 2, 'Water': 0.5 },
                'Water': { 'Fire': 2, 'Grass': 0.5 },
                'Grass': { 'Water': 2, 'Fire': 0.5 },
                'Electric': { 'Water': 2, 'Ground': 0 }
            };

            const defenderTypes = defenderType.split('/');
            let multiplier = 1;

            defenderTypes.forEach(type => {
                if (effectiveness[attackType] && effectiveness[attackType][type] !== undefined) {
                    multiplier *= effectiveness[attackType][type];
                }
            });

            return multiplier;
        }

        function generateWildOpponent() {
            const wildPokemonList = [
                { name: 'Rattata', type: 'Normal', rarity: 'Common' },
                { name: 'Pidgey', type: 'Normal/Flying', rarity: 'Common' },
                { name: 'Geodude', type: 'Rock/Ground', rarity: 'Uncommon' },
                { name: 'Machop', type: 'Fighting', rarity: 'Uncommon' },
                { name: 'Haunter', type: 'Ghost/Poison', rarity: 'Rare' },
                { name: 'Alakazam', type: 'Psychic', rarity: 'Rare' }
            ];

            const pokemon = wildPokemonList[Math.floor(Math.random() * wildPokemonList.length)];
            const level = Math.floor(Math.random() * 11) + 19; // Pokemon level between 19-30
            const baseStats = generateStats(level, pokemon.rarity);

            return {
                id: `wild_${Date.now()}`,
                name: pokemon.name,
                nickname: pokemon.name,
                type: pokemon.type,
                level,                maxHp: baseStats.hp,
                currentHp: baseStats.hp,
                hp: baseStats.hp,
                attack: baseStats.attack,
                defense: baseStats.defense,
                speed: baseStats.speed,
                rarity: pokemon.rarity,
                moves: generateMovesByType(pokemon.type),
                exp: 0,
                statusEffect: null,
                statChanges: { attack: 0, defense: 0, speed: 0 }
            };
        }

        function generateStats(level, rarity) {
            const rarityMultiplier = { 'Common': 1.0, 'Uncommon': 1.2, 'Rare': 1.4, 'Legendary': 1.8 };
            const multiplier = rarityMultiplier[rarity] || 1.0;

            return {
                hp: Math.floor((50 + Math.random() * 50) * level * 0.1 * multiplier),
                attack: Math.floor((30 + Math.random() * 30) * level * 0.1 * multiplier),
                defense: Math.floor((30 + Math.random() * 30) * level * 0.1 * multiplier),
                speed: Math.floor((20 + Math.random() * 40) * level * 0.1 * multiplier)
            };
        }

        function generateMovesByType(type) {
            const movesByType = {
                'Normal': [
                    { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Quick Attack', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Body Slam', power: 85, type: 'Normal', accuracy: 100 },
                    { name: 'Hyper Beam', power: 150, type: 'Normal', accuracy: 90 }
                ],
                'Fire': [
                    { name: 'Ember', power: 40, type: 'Fire', accuracy: 100 },
                    { name: 'Flame Wheel', power: 60, type: 'Fire', accuracy: 100 },
                    { name: 'Flamethrower', power: 90, type: 'Fire', accuracy: 100 },
                    { name: 'Fire Blast', power: 110, type: 'Fire', accuracy: 85 }
                ]
            };

            const primaryType = type.split('/')[0];
            const moves = movesByType[primaryType] || movesByType['Normal'];
            return moves.slice(0, 4);
        }

        async function handleAIMove(sock, from, battle) {
            const wildPokemon = battle.player2.team[0];
            const playerPokemon = battle.player1.team[battle.player1.activePokemon];

            const moveIndex = Math.floor(Math.random() * wildPokemon.moves.length);
            const move = wildPokemon.moves[moveIndex];

            const battleResult = await executeBattleMove(move, wildPokemon, playerPokemon, battle);

            if (playerPokemon.currentHp <= 0) {
                battle.player1.faintedCount++;

                if (battle.player1.faintedCount >= battle.player1.team.length) {
                    global.battles.delete(from);
                    await endBattle(sock, from, battle.player2, battle.player1, battleResult);
                    return;
                }

                const nextPokemon = battle.player1.team.findIndex((p, i) => i !== battle.player1.activePokemon && p.currentHp > 0);
                if (nextPokemon !== -1) {
                    battle.player1.activePokemon = nextPokemon;
                    await sock.sendMessage(from, {
                        text: battleResult + `\n\n💀 **${playerPokemon.nickname}** has fainted!\n\n🔄 **Next Pokemon:** ${battle.player1.team[nextPokemon].nickname}\n\n**👤 Your Turn!**`
                    });
                }
            } else {
                battle.turn = battle.player1.id;
                battle.round++;
                global.battles.set(from, battle);

                await sock.sendMessage(from, {
                    text: battleResult + `\n\n**👤 Your Turn!** Choose your move:\n\n**⚡ Available Actions:**\n${getMovesText(playerPokemon.moves)}`
                });
            }
        }

        async function endBattle(sock, from, winner, loser, battleResult) {
            const winnerName = msg.pushName || winner.id.split('@')[0];
            const loserName = loser.id.split('@')[0];

            // Update PvP leaderboard
            const dataManager = global.dataManager;

            // Update winner stats
            const winnerStats = dataManager.getPlayerStats(winner.id);
            winnerStats.pvpWins = (winnerStats.pvpWins || 0) + 1;
            winnerStats.pvpBattles = (winnerStats.pvpBattles || 0) + 1;
            winnerStats.winStreak = (winnerStats.winStreak || 0) + 1;
            winnerStats.gold = (winnerStats.gold || 0) + 500; // Winner bonus
            dataManager.setPlayerStats(winner.id, winnerStats);

            // Update loser stats
            const loserStats = dataManager.getPlayerStats(loser.id);
            loserStats.pvpLosses = (loserStats.pvpLosses || 0) + 1;
            loserStats.pvpBattles = (loserStats.pvpBattles || 0) + 1;
            loserStats.winStreak = 0; // Reset win streak
            dataManager.setPlayerStats(loser.id, loserStats);

            await sock.sendMessage(from, {
                text: `🏆 **BATTLE ENDED!**\n\n🎉 **Winner:** ${winnerName}\n💔 **Loser:** ${loserName}\n\n**🎁 Rewards:**\n• Winner: +500 gold\n• PvP records updated!\n\n**📊 Updated Stats:**\n**${winnerName}:** ${winnerStats.pvpWins}W-${winnerStats.pvpLosses || 0}L (${winnerStats.winStreak} streak)\n**${loserName}:** ${loserStats.pvpWins || 0}W-${loserStats.pvpLosses}L\n\n${battleResult}`,
                mentions: [winner.id, loser.id],
                contextInfo: {
                    externalAdReply: {
                        title: 'Battle Victory!',
                        body: `${winnerName} defeated ${loserName}!`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=victory',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        }
    }
};

export { command };