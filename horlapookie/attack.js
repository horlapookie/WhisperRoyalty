export const command = {
    name: 'attack',
    aliases: ['fight', 'battle'],
    description: 'Attack in Pokemon battles',
    category: 'pokemon',
    usage: '.attack [move_number]',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Check for active battle
        if (!global.catchBattles) global.catchBattles = new Map();

        const battle = global.catchBattles.get(from);
        if (!battle) {
            await sock.sendMessage(from, {
                text: '❌ **No active battle found!**\n\n💡 Use .catch to start a battle with wild Pokemon!'
            });
            return;
        }

        if (battle.currentTurn !== sender) {
            await sock.sendMessage(from, {
                text: '⏰ **Not your turn!**\n\nWait for the wild Pokemon to attack.'
            });
            return;
        }

        const playerPokemon = battle.trainer.pokemon;
        const wildPokemon = battle.wildPokemon;
        const dataManager = global.dataManager;

        // Show moves if no move specified
        if (!args.trim()) {
            let movesList = `⚔️ **Choose Your Move | ${playerPokemon.nickname}**\n\n`;
            playerPokemon.moves.forEach((move, index) => {
                movesList += `**${index + 1}.** ${move.name}\n• **Type:** ${move.type}\n• **Power:** ${move.power}\n• **Accuracy:** ${move.accuracy}%\n\n`;
            });
            movesList += `📝 **Usage:** .attack <number>\n💡 Example: .attack 1`;

            await sock.sendMessage(from, { text: movesList });
            return;
        }

        const moveIndex = parseInt(args.trim()) - 1;
        if (isNaN(moveIndex) || moveIndex < 0 || moveIndex >= playerPokemon.moves.length) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid move number!**\n\nUse .attack to see available moves.'
            });
            return;
        }

        const move = playerPokemon.moves[moveIndex];

        // Calculate damage
        const damage = calculateDamage(playerPokemon, wildPokemon, move);
        wildPokemon.hp = Math.max(0, wildPokemon.hp - damage);

        // Type effectiveness message
        const effectiveness = getTypeEffectiveness(move.type, wildPokemon.type);
        let effectivenessText = '';
        if (effectiveness > 1) effectivenessText = '**It\'s super effective!** ⚡';
        else if (effectiveness < 1) effectivenessText = '**It\'s not very effective...** 💔';

        // Send attack message first
        await sock.sendMessage(from, {
            text: `⚔️ **${playerPokemon.nickname}** used **${move.name}**!\n\n💥 Dealt ${damage} damage to **${wildPokemon.name}**!\n${effectivenessText}`
        });

        // Wait a moment then send HP status
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(from, {
            text: `**🔥 ${playerPokemon.nickname}:** ${playerPokemon.hp}/${playerPokemon.maxHp} HP\n**🌟 ${wildPokemon.name}:** ${wildPokemon.hp}/${wildPokemon.maxHp} HP`
        });

        // Check if wild Pokemon fainted
        if (wildPokemon.hp <= 0) {
            await handleBattleEnd(sock, from, battle, 'player_win');
            return;
        }

        // Wild Pokemon's turn
        await new Promise(resolve => setTimeout(resolve, 2000));

        const wildMove = wildPokemon.moves[Math.floor(Math.random() * wildPokemon.moves.length)];
        const wildDamage = calculateDamage(wildPokemon, playerPokemon, wildMove);
        playerPokemon.hp = Math.max(0, playerPokemon.hp - wildDamage);

        // Update player's Pokemon in data
        const playerCollection = dataManager.getPlayerPokemon(sender);
        const pokemonIndex = playerCollection.findIndex(p => p.id === playerPokemon.id);
        if (pokemonIndex !== -1) {
            playerCollection[pokemonIndex].hp = playerPokemon.hp;
            dataManager.setPlayerPokemon(sender, playerCollection);
        }

        const wildEffectiveness = getTypeEffectiveness(wildMove.type, playerPokemon.type);
        let wildEffectivenessText = '';
        if (wildEffectiveness > 1) wildEffectivenessText = '**It\'s super effective!** ⚡';
        else if (wildEffectiveness < 1) wildEffectivenessText = '**It\'s not very effective...** 💔';

        // Send wild Pokemon attack message first
        await sock.sendMessage(from, {
            text: `🌟 **Wild ${wildPokemon.name}** used **${wildMove.name}**!\n\n💥 Dealt ${wildDamage} damage to **${playerPokemon.nickname}**!\n${wildEffectivenessText}`
        });

        // Wait a moment then send HP status
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(from, {
            text: `**🔥 ${playerPokemon.nickname}:** ${playerPokemon.hp}/${playerPokemon.maxHp} HP\n**🌟 ${wildPokemon.name}:** ${wildPokemon.hp}/${wildPokemon.maxHp} HP`
        });

        // Check if player's Pokemon fainted
        if (playerPokemon.hp <= 0) {
            await handleBattleEnd(sock, from, battle, 'wild_win');
            return;
        }

        // Continue battle
        battle.round++;

        async function handleBattleEnd(sock, from, battle, result) {
            const dataManager = global.dataManager;

            if (result === 'player_win') {
                // Player wins - Pokemon gains EXP and player gets rewards
                const expGained = Math.floor(Math.random() * 100) + 50;
                const goldEarned = Math.floor(Math.random() * 200) + 100;

                // Level up logic
                const playerPokemon = battle.trainer.pokemon;
                const oldLevel = playerPokemon.level;
                playerPokemon.exp = (playerPokemon.exp || 0) + expGained;
                const expToNext = playerPokemon.expToNext || (playerPokemon.level * 100);

                let leveledUp = false;
                let newMoves = [];

                // Check for level up
                while (playerPokemon.exp >= expToNext) {
                    playerPokemon.exp -= expToNext;
                    playerPokemon.level++;
                    leveledUp = true;

                    // Increase stats
                    playerPokemon.maxHp += Math.floor(Math.random() * 10) + 5;
                    playerPokemon.hp = playerPokemon.maxHp; // Full heal on level up
                    playerPokemon.attack = Math.floor((playerPokemon.attack || 50) * 1.05);
                    playerPokemon.defense = Math.floor((playerPokemon.defense || 50) * 1.05);
                    playerPokemon.speed = Math.floor((playerPokemon.speed || 50) * 1.05);

                    // Set new exp requirement
                    playerPokemon.expToNext = playerPokemon.level * 100;

                    // Chance to learn new move
                    if (Math.random() < 0.4) {
                        const levelMoves = getLevelMoves(playerPokemon.type, playerPokemon.level);
                        const availableMoves = levelMoves.filter(move => 
                            !playerPokemon.moves.some(existing => existing.name === move.name)
                        );

                        if (availableMoves.length > 0) {
                            const newMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                            if (playerPokemon.moves.length < 4) {
                                playerPokemon.moves.push(newMove);
                            } else {
                                // Replace random move if at max capacity
                                const replaceIndex = Math.floor(Math.random() * playerPokemon.moves.length);
                                playerPokemon.moves[replaceIndex] = newMove;
                            }
                            newMoves.push(newMove.name);
                        }
                    }
                }

                // Update player's Pokemon collection
                const playerCollection = dataManager.getPlayerPokemon(battle.trainer.id);
                const pokemonIndex = playerCollection.findIndex(p => p.id === playerPokemon.id);
                if (pokemonIndex !== -1) {
                    playerCollection[pokemonIndex] = playerPokemon;
                    dataManager.setPlayerPokemon(battle.trainer.id, playerCollection);
                }

                // Update player stats
                const playerStats = dataManager.getPlayerStats(battle.trainer.id);
                playerStats.gold = (playerStats.gold || 0) + goldEarned;
                dataManager.savePlayerStats(battle.trainer.id, playerStats);

                let victoryMessage = `🎉 **VICTORY!**\n\n⭐ **${battle.wildPokemon.name}** fainted!\n\n**🎁 Rewards:**\n• **${expGained} EXP** gained\n• **${goldEarned} gold** earned`;

                if (leveledUp) {
                    victoryMessage += `\n🎉 **${playerPokemon.nickname}** leveled up from Level ${oldLevel} to Level ${playerPokemon.level}!`;

                    if (newMoves.length > 0) {
                        victoryMessage += `\n✨ **New Moves Learned:** ${newMoves.join(', ')}`;
                    }
                }

                victoryMessage += `\n\n💡 The wild Pokemon fled! Use .spawnpokemon to find more Pokemon!`;

                await sock.sendMessage(from, { text: victoryMessage });

                // Clean up
                global.wildPokemon.delete(battle.spawnKey);
                global.catchBattles.delete(from);
                return;
            }

            function getLevelMoves(type, level) {
                const movesByType = {
                    'Fire': [
                        { name: 'Flamethrower', power: 90, type: 'Fire', accuracy: 100 },
                        { name: 'Fire Blast', power: 110, type: 'Fire', accuracy: 85 },
                        { name: 'Heat Wave', power: 95, type: 'Fire', accuracy: 90 },
                        { name: 'Sunny Day', power: 0, type: 'Fire', accuracy: 100 }
                    ],
                    'Water': [
                        { name: 'Surf', power: 90, type: 'Water', accuracy: 100 },
                        { name: 'Hydro Pump', power: 110, type: 'Water', accuracy: 80 },
                        { name: 'Ice Beam', power: 90, type: 'Ice', accuracy: 100 },
                        { name: 'Rain Dance', power: 0, type: 'Water', accuracy: 100 }
                    ],
                    'Electric': [
                        { name: 'Thunderbolt', power: 90, type: 'Electric', accuracy: 100 },
                        { name: 'Thunder', power: 110, type: 'Electric', accuracy: 70 },
                        { name: 'Volt Tackle', power: 120, type: 'Electric', accuracy: 100 },
                        { name: 'Thunder Wave', power: 0, type: 'Electric', accuracy: 90 }
                    ],
                    'Grass': [
                        { name: 'Solar Beam', power: 120, type: 'Grass', accuracy: 100 },
                        { name: 'Petal Dance', power: 120, type: 'Grass', accuracy: 100 },
                        { name: 'Leaf Storm', power: 130, type: 'Grass', accuracy: 90 },
                        { name: 'Sleep Powder', power: 0, type: 'Grass', accuracy: 75 }
                    ]
                };

                const primaryType = type.split('/')[0];
                let moves = movesByType[primaryType] || [
                    { name: 'Hyper Beam', power: 150, type: 'Normal', accuracy: 90 },
                    { name: 'Double-Edge', power: 120, type: 'Normal', accuracy: 100 },
                    { name: 'Swift', power: 60, type: 'Normal', accuracy: 100 }
                ];

                return moves.filter(move => level >= (move.power / 5) || move.power === 0);
            }
        }

        function calculateDamage(attacker, defender, move) {
            const baseDamage = move.power || 40;
            const level = attacker.level || 1;
            const attack = attacker.attack || 50;
            const defense = defender.defense || 50;

            const effectiveness = getTypeEffectiveness(move.type, defender.type);
            const randomFactor = 0.85 + Math.random() * 0.3;

            const damage = Math.floor(((((2 * level + 10) / 250) * (attack / defense) * baseDamage) + 2) * effectiveness * randomFactor);

            return Math.max(1, damage);
        }

        function getTypeEffectiveness(attackType, defenderType) {
            const typeChart = {
                'Fire': { 'Grass': 2, 'Water': 0.5, 'Fire': 0.5 },
                'Water': { 'Fire': 2, 'Grass': 0.5, 'Water': 0.5 },
                'Grass': { 'Water': 2, 'Fire': 0.5, 'Grass': 0.5 },
                'Electric': { 'Water': 2, 'Ground': 0, 'Electric': 0.5 },
                'Fighting': { 'Normal': 2, 'Flying': 0.5, 'Psychic': 0.5 }
            };

            const defenderTypes = defenderType.split('/');
            let effectiveness = 1;

            for (const type of defenderTypes) {
                if (typeChart[attackType] && typeChart[attackType][type] !== undefined) {
                    effectiveness *= typeChart[attackType][type];
                }
            }

            return effectiveness;
        }
    }
};