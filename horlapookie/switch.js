
export const command = {
    name: 'switch',
    aliases: ['swap', 'change'],
    description: 'Switch Pokemon during battle',
    category: 'pokemon',
    usage: '.switch <pokemon_number>',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Check for active battles
        if (!global.catchBattles) global.catchBattles = new Map();
        if (!global.battles) global.battles = new Map();

        const catchBattle = global.catchBattles.get(from);
        const pvpBattle = global.battles.get(from);
        const battle = catchBattle || pvpBattle;

        if (!battle) {
            await sock.sendMessage(from, {
                text: '❌ **No active battle found!**\n\n💡 Use .catch or .pvp to start a battle!'
            });
            return;
        }

        // Check if it's player's turn (for PvP battles)
        if (pvpBattle && battle.turn !== sender) {
            await sock.sendMessage(from, {
                text: '⏰ **Not your turn!**\n\nWait for your opponent to make their move.'
            });
            return;
        }

        const pokemonNumber = parseInt(args.trim());
        if (isNaN(pokemonNumber) || pokemonNumber < 1) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid Pokemon number!**\n\n📝 **Usage:** .switch <number>\n💡 **Example:** .switch 2'
            });
            return;
        }

        const dataManager = global.dataManager;
        const playerPokemon = dataManager.getPlayerPokemon(sender);
        const pokemonIndex = pokemonNumber - 1;

        if (pokemonIndex >= playerPokemon.length) {
            await sock.sendMessage(from, {
                text: `❌ **Pokemon #${pokemonNumber} not found!**\n\n📋 You only have ${playerPokemon.length} Pokemon.`
            });
            return;
        }

        const newPokemon = playerPokemon[pokemonIndex];

        if (newPokemon.hp <= 0) {
            await sock.sendMessage(from, {
                text: `❌ **${newPokemon.nickname} has fainted!**\n\n💚 Pokemon must have HP to battle.`
            });
            return;
        }

        // Handle wild battle switching
        if (catchBattle) {
            const currentPokemon = battle.trainer.pokemon;
            
            if (currentPokemon.id === newPokemon.id) {
                await sock.sendMessage(from, {
                    text: `❌ **${newPokemon.nickname} is already in battle!**`
                });
                return;
            }

            // Update battle with new Pokemon
            battle.trainer.pokemon = newPokemon;

            await sock.sendMessage(from, {
                text: `🔄 **POKEMON SWITCH!**\n\n📤 **${currentPokemon.nickname}** return!\n📥 **${newPokemon.nickname}** go!\n\n**🔥 Active Pokemon:**\n• **${newPokemon.nickname}** (Level ${newPokemon.level})\n• **HP:** ${newPokemon.hp}/${newPokemon.maxHp}\n• **Type:** ${newPokemon.type}\n\n💡 Use .attack to continue the battle!`
            });

            // Switch turns for wild battle (wild Pokemon gets to attack)
            battle.currentTurn = 'wild';
            setTimeout(async () => {
                await handleWildPokemonTurn(sock, from, battle);
            }, 2000);

        } else if (pvpBattle) {
            // Handle PvP battle switching
            const isPlayer1 = battle.player1.id === sender;
            const player = isPlayer1 ? battle.player1 : battle.player2;
            const currentActivePokemon = player.team[player.activePokemon];

            // Check if trying to switch to already active Pokemon
            if (player.activePokemon === pokemonIndex) {
                await sock.sendMessage(from, {
                    text: `❌ **${newPokemon.nickname} is already active!**`
                });
                return;
            }

            // Check if Pokemon is in party
            const pokemonInParty = player.team.find(p => p.id === newPokemon.id);
            if (!pokemonInParty) {
                await sock.sendMessage(from, {
                    text: `❌ **${newPokemon.nickname} is not in your battle party!**\n\n💡 Use .transfer2party to add Pokemon to your party.`
                });
                return;
            }

            // Update active Pokemon
            const oldIndex = player.activePokemon;
            player.activePokemon = player.team.findIndex(p => p.id === newPokemon.id);

            await sock.sendMessage(from, {
                text: `🔄 **POKEMON SWITCH!**\n\n📤 **${currentActivePokemon.nickname}** return!\n📥 **${newPokemon.nickname}** go!\n\n**Current Battle:**\n• **${newPokemon.nickname}** (Level ${newPokemon.level})\n• **HP:** ${newPokemon.currentHp}/${newPokemon.maxHp}\n• **Type:** ${newPokemon.type}`,
                mentions: [sender]
            });

            // Switch turns after switching
            battle.turn = battle.player1.id === sender ? battle.player2.id : battle.player1.id;
            battle.round++;
        }

        async function handleWildPokemonTurn(sock, from, battle) {
            const wildPokemon = battle.wildPokemon;
            const playerPokemon = battle.trainer.pokemon;

            const wildMove = wildPokemon.moves[Math.floor(Math.random() * wildPokemon.moves.length)];
            const wildDamage = calculateDamage(wildPokemon, playerPokemon, wildMove);
            playerPokemon.hp = Math.max(0, playerPokemon.hp - wildDamage);

            // Update player's Pokemon in data
            const dataManager = global.dataManager;
            const playerCollection = dataManager.getPlayerPokemon(battle.trainer.id);
            const pokemonIndex = playerCollection.findIndex(p => p.id === playerPokemon.id);
            if (pokemonIndex !== -1) {
                playerCollection[pokemonIndex].hp = playerPokemon.hp;
                dataManager.setPlayerPokemon(battle.trainer.id, playerCollection);
            }

            await sock.sendMessage(from, {
                text: `🌟 **Wild ${wildPokemon.name}** used **${wildMove.name}**!\n\n💥 Dealt ${wildDamage} damage to **${playerPokemon.nickname}**!`
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            await sock.sendMessage(from, {
                text: `**🔥 ${playerPokemon.nickname}:** ${playerPokemon.hp}/${playerPokemon.maxHp} HP\n**🌟 ${wildPokemon.name}:** ${wildPokemon.hp}/${wildPokemon.maxHp} HP`
            });

            // Check if player's Pokemon fainted
            if (playerPokemon.hp <= 0) {
                await handlePlayerPokemonFainted(sock, from, battle);
                return;
            }

            // Give turn back to player
            battle.currentTurn = battle.trainer.id;
        }

        async function handlePlayerPokemonFainted(sock, from, battle) {
            const dataManager = global.dataManager;
            const playerPokemon = dataManager.getPlayerPokemon(battle.trainer.id);
            const alivePokemon = playerPokemon.filter(p => p.hp > 0);

            if (alivePokemon.length === 0) {
                // Player has no more Pokemon - battle over
                await sock.sendMessage(from, {
                    text: `💔 **DEFEAT!**\n\n😵 All your Pokemon have fainted!\n\n🌟 **Wild ${battle.wildPokemon.name}** wins the battle!\n\n💡 Heal your Pokemon and try again!`
                });
                global.catchBattles.delete(from);
                return;
            }

            // Force switch to next available Pokemon
            const nextPokemon = alivePokemon[0];
            battle.trainer.pokemon = nextPokemon;

            await sock.sendMessage(from, {
                text: `💀 **${battle.trainer.pokemon.nickname || 'Your Pokemon'} fainted!**\n\n🔄 **${nextPokemon.nickname}** was automatically sent out!\n\n**🔥 New Active Pokemon:**\n• **${nextPokemon.nickname}** (Level ${nextPokemon.level})\n• **HP:** ${nextPokemon.hp}/${nextPokemon.maxHp}\n• **Type:** ${nextPokemon.type}`
            });

            battle.currentTurn = battle.trainer.id;
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
