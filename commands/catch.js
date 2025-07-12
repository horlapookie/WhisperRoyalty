
export const command = {
    name: 'catch',
    aliases: ['pokecatch', 'catchpokemon'],
    description: 'Catch wild Pokemon that have spawned',
    category: 'games',
    usage: '.catch',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ Pokemon catching only works in groups!'
            });
            return;
        }
        
        // Initialize storage
        if (!global.wildPokemon) global.wildPokemon = new Map();
        const dataManager = global.dataManager;
        
        // Find wild Pokemon in current group
        const wildPokemon = Array.from(global.wildPokemon.entries())
            .find(([key, pokemon]) => pokemon.groupId === from);
            
        if (!wildPokemon) {
            await sock.sendMessage(from, {
                text: '❌ No wild Pokemon to catch! Use .spawnpokemon first.',
                contextInfo: {
                    externalAdReply: {
                        title: 'No Wild Pokemon',
                        body: 'Spawn Pokemon first!',
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const [spawnKey, pokemon] = wildPokemon;
        
        // Calculate catch chance
        const catchChance = calculateCatchChance(pokemon.rarity, pokemon.level);
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
                isShiny: Math.random() < 0.001 // 0.1% shiny chance
            };
            
            playerCollection.push(caughtPokemon);
            dataManager.setPlayerPokemon(sender, playerCollection);
            
            // Update player stats
            updateCatchStats(sender);
            
            const shinyText = caughtPokemon.isShiny ? ' ✨**SHINY**✨' : '';
            const natureText = `\n• **Nature:** ${caughtPokemon.nature} (${getNatureEffect(caughtPokemon.nature)})`;
            
            await sock.sendMessage(from, {
                text: `🎉 **POKEMON CAUGHT!**${shinyText}\n\n✅ @${sender.split('@')[0]} successfully caught **${pokemon.name}**!\n\n**Pokemon Details:**\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}${natureText}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Attack:** ${pokemon.attack}\n• **Defense:** ${pokemon.defense}\n• **Speed:** ${pokemon.speed}\n• **Happiness:** ${caughtPokemon.happiness}/100\n\n**Moves Known:**\n${caughtPokemon.moves.map((move, i) => `${i + 1}. ${move.name} (${move.type})`).join('\n')}\n\n🎒 Use .pokedex to view your collection!\n🏋️ Use .train ${pokemon.name} to train it!\n⚔️ Use .pvp challenge @user to battle!`,
                mentions: [sender],
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
            
            // Send Pokemon image
            try {
                const imageUrl = caughtPokemon.isShiny ? pokemon.shinyImage || pokemon.image : pokemon.image;
                await sock.sendMessage(from, {
                    image: { url: imageUrl },
                    caption: `📸 Your new ${pokemon.name}!${shinyText}\n🎯 Catch Rate: ${(catchChance * 100).toFixed(1)}%\n🏆 Total Caught: ${playerCollection.length}`
                });
            } catch (error) {
                console.log('Failed to send Pokemon image:', error);
            }
            
        } else {
            await sock.sendMessage(from, {
                text: `💔 **CATCH FAILED!**\n\n❌ @${sender.split('@')[0]} failed to catch **${pokemon.name}**!\n\n🎯 **Catch Rate:** ${(catchChance * 100).toFixed(1)}%\n💪 **${pokemon.name}** broke free! Try again!\n\n💡 **Tips:**\n• Lower level Pokemon are easier to catch\n• Common Pokemon have higher catch rates\n• Keep trying, RNG can be cruel!`,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: 'Catch Failed',
                        body: `${pokemon.name} escaped!`,
                        thumbnailUrl: pokemon.image,
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        function calculateCatchChance(rarity, level) {
            const baseChances = {
                'Common': 0.85,
                'Uncommon': 0.65,
                'Rare': 0.45,
                'Legendary': 0.15
            };
            
            const baseChance = baseChances[rarity] || 0.5;
            const levelPenalty = Math.max(0, (level - 1) * 0.008);
            
            return Math.max(0.05, baseChance - levelPenalty);
        }
        
        function updateCatchStats(playerId) {
            const stats = dataManager.getPlayerStats(playerId);
            stats.pokemonCaught++;
            dataManager.setPlayerStats(playerId, stats);
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
        
        function getNatureEffect(nature) {
            const effects = {
                'Hardy': 'Balanced', 'Lonely': '+Atk -Def', 'Brave': '+Atk -Spd',
                'Adamant': '+Atk -SpAtk', 'Naughty': '+Atk -SpDef', 'Bold': '+Def -Atk',
                'Docile': 'Balanced', 'Relaxed': '+Def -Spd', 'Impish': '+Def -SpAtk',
                'Lax': '+Def -SpDef', 'Timid': '+Spd -Atk', 'Hasty': '+Spd -Def',
                'Serious': 'Balanced', 'Jolly': '+Spd -SpAtk', 'Naive': '+Spd -SpDef',
                'Modest': '+SpAtk -Atk', 'Mild': '+SpAtk -Def', 'Quiet': '+SpAtk -Spd',
                'Bashful': 'Balanced', 'Rash': '+SpAtk -SpDef', 'Calm': '+SpDef -Atk',
                'Gentle': '+SpDef -Def', 'Sassy': '+SpDef -Spd', 'Careful': '+SpDef -SpAtk',
                'Quirky': 'Balanced'
            };
            return effects[nature] || 'Unknown';
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
