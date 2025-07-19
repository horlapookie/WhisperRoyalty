
export const command = {
    name: 'use',
    aliases: ['useitem', 'useball'],
    description: 'Use pokeballs or items by number',
    usage: 'use pokeball <number>',
    category: 'pokemon',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const argsArray = args.trim().split(' ');
        const itemType = argsArray[0]?.toLowerCase();
        const itemNumber = parseInt(argsArray[1]);

        if (itemType === 'pokeball' || itemType === 'pokeballs') {
            if (!itemNumber || itemNumber < 1) {
                await sock.sendMessage(from, {
                    text: '❌ **Invalid pokeball number!**\n\n📝 **Usage:** .use pokeball <number>\n💡 Use .pokeballs to see your numbered pokeball list'
                });
                return;
            }

            const playerStats = dataManager.getPlayerStats(sender);
            const playerBalls = playerStats.pokeballs || {};
            
            const ballTypes = ['miniball', 'pokeball', 'ultraball', 'masterball'];
            const availableBalls = [];
            
            ballTypes.forEach(type => {
                const count = playerBalls[type] || 0;
                if (count > 0) {
                    availableBalls.push({ type, count });
                }
            });
            
            if (itemNumber > availableBalls.length) {
                await sock.sendMessage(from, {
                    text: `❌ **Pokeball number ${itemNumber} not found!**\n\n📋 **Available:** 1-${availableBalls.length}\n💡 Use .pokeballs to see your inventory`
                });
                return;
            }
            
            const selectedBall = availableBalls[itemNumber - 1];
            
            // Check if there are wild Pokemon to catch
            if (!global.wildPokemon) global.wildPokemon = new Map();
            
            const wildPokemon = Array.from(global.wildPokemon.entries())
                .find(([key, pokemon]) => pokemon.groupId === from);
                
            if (!wildPokemon) {
                await sock.sendMessage(from, {
                    text: '❌ **No wild Pokemon to catch!**\n\n💡 Use .spawnpokemon first to find Pokemon!'
                });
                return;
            }
            
            const [spawnKey, pokemon] = wildPokemon;
            
            // Deduct pokeball
            playerStats.pokeballs[selectedBall.type] = selectedBall.count - 1;
            dataManager.savePlayerStats(sender, playerStats);
            
            // Calculate catch rates
            const catchRates = {
                miniball: 0.15,
                pokeball: 0.45,
                ultraball: 0.65,
                masterball: 1.0
            };
            
            const catchChance = catchRates[selectedBall.type];
            const success = Math.random() < catchChance;
            
            if (success) {
                // Remove from wild Pokemon
                global.wildPokemon.delete(spawnKey);
                
                // Add to player's collection
                const playerCollection = dataManager.getPlayerPokemon(sender);
                const caughtPokemon = {
                    ...pokemon,
                    caughtAt: Date.now(),
                    trainerId: sender,
                    nickname: pokemon.name,
                    happiness: 50,
                    nature: getRandomNature(),
                    moves: generatePokemonMoves(pokemon),
                    isShiny: Math.random() < 0.001,
                    caughtWith: selectedBall.type
                };
                
                playerCollection.push(caughtPokemon);
                dataManager.setPlayerPokemon(sender, playerCollection);
                
                // Update stats
                const stats = dataManager.getPlayerStats(sender);
                stats.pokemonCaught = (stats.pokemonCaught || 0) + 1;
                stats.pokeballCatches = (stats.pokeballCatches || 0) + 1;
                dataManager.savePlayerStats(sender, stats);
                
                const shinyText = caughtPokemon.isShiny ? ' ✨**SHINY**✨' : '';
                const ballName = selectedBall.type.charAt(0).toUpperCase() + selectedBall.type.slice(1);
                
                await sock.sendMessage(from, {
                    text: `🎉 **POKEMON CAUGHT!**${shinyText}\n\n✅ **${pokemon.name}** caught with ${ballName}!\n🎯 **Catch Rate:** ${(catchChance * 100).toFixed(0)}%\n\n**Pokemon Details:**\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n\n💡 Use .pokedex to view your collection!`,
                    contextInfo: {
                        externalAdReply: {
                            title: `${pokemon.name} Caught!${shinyText}`,
                            body: `Level ${pokemon.level} ${pokemon.type} Pokemon`,
                            thumbnailUrl: caughtPokemon.isShiny ? pokemon.shinyImage || pokemon.image : pokemon.image,
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                
            } else {
                const ballName = selectedBall.type.charAt(0).toUpperCase() + selectedBall.type.slice(1);
                
                await sock.sendMessage(from, {
                    text: `💔 **CATCH FAILED!**\n\n❌ **${pokemon.name}** broke free from the ${ballName}!\n🎯 **Catch Rate:** ${(catchChance * 100).toFixed(0)}%\n\n💪 **${pokemon.name}** is still wild! Try again!`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Catch Failed',
                            body: `${pokemon.name} escaped from ${ballName}!`,
                            thumbnailUrl: pokemon.image,
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
            
        } else {
            await sock.sendMessage(from, {
                text: '❌ **Invalid item type!**\n\n📝 **Usage:** .use pokeball <number>\n💡 More item types coming soon!'
            });
        }
        
        function getRandomNature() {
            const natures = [
                'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
                'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
                'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
                'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
                'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
            ];
            return natures[Math.floor(Math.random() * natures.length)];
        }
        
        function generatePokemonMoves(pokemon) {
            const movesByType = {
                'Electric': [
                    { name: 'Thunder Shock', power: 40, type: 'Electric', accuracy: 100 },
                    { name: 'Quick Attack', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Thunder Wave', power: 0, type: 'Electric', accuracy: 90 },
                    { name: 'Spark', power: 65, type: 'Electric', accuracy: 100 }
                ],
                'Fire': [
                    { name: 'Ember', power: 40, type: 'Fire', accuracy: 100 },
                    { name: 'Scratch', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Fire Spin', power: 35, type: 'Fire', accuracy: 85 },
                    { name: 'Flame Wheel', power: 60, type: 'Fire', accuracy: 100 }
                ],
                'Water': [
                    { name: 'Water Gun', power: 40, type: 'Water', accuracy: 100 },
                    { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Bubble', power: 40, type: 'Water', accuracy: 100 },
                    { name: 'Water Pulse', power: 60, type: 'Water', accuracy: 100 }
                ],
                'Grass': [
                    { name: 'Vine Whip', power: 45, type: 'Grass', accuracy: 100 },
                    { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Razor Leaf', power: 55, type: 'Grass', accuracy: 95 },
                    { name: 'Absorb', power: 20, type: 'Grass', accuracy: 100 }
                ]
            };

            const primaryType = pokemon.type.split('/')[0];
            const availableMoves = movesByType[primaryType] || [
                { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                { name: 'Growl', power: 0, type: 'Normal', accuracy: 100 },
                { name: 'Scratch', power: 40, type: 'Normal', accuracy: 100 },
                { name: 'Leer', power: 0, type: 'Normal', accuracy: 100 }
            ];

            return availableMoves.slice(0, 4);
        }
    }
};
