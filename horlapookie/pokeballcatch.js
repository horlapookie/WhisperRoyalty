export const command = {
    name: 'pokeballcatch',
    aliases: ['pcatch', 'ballcatch', 'pokeball'],
    description: 'Use a pokeball to catch wild Pokemon with higher success rate',
    category: 'pokemon',
    usage: '.pcatch [pokemon_name]',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Check if user is owner (for DM access)
        const { settings } = await import('../settings.js');

        const extractPhoneNumber = (jid) => {
            if (!jid) return null;

            // Handle LID format (participant JIDs): extract number after colon
            if (jid.includes('@lid')) {
                const match = jid.match(/:(\d+)@/);
                return match ? match[1] : null;
            } 
            // Handle standard WhatsApp format
            else if (jid.includes('@s.whatsapp.net')) {
                const match = jid.match(/^(\d+)@/);
                return match ? match[1] : null;
            } 
            // Generic @ format
            else if (jid.includes('@')) {
                const match = jid.match(/(\d+)@/);
                return match ? match[1] : null;
            }

            return jid;
        };

        const senderPhoneNumber = extractPhoneNumber(sender);
        const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
        const isOwner = ownerNumbers.some(num => {
            const ownerPhone = extractPhoneNumber(num);
            return senderPhoneNumber === ownerPhone || sender === num || sender.includes(ownerPhone);
        });

        // Allow owner to use in DMs, but restrict others to groups only
        if (!isGroup && !isOwner) {
            await sock.sendMessage(from, {
                text: '❌ Pokeball catching only works in groups!'
            });
            return;
        }

        // Initialize storage
        if (!global.wildPokemon) global.wildPokemon = new Map();
        const dataManager = global.dataManager;

        // Check if player has pokeballs
        const playerStats = dataManager.getPlayerStats(sender);
        const pokeballs = playerStats.pokeballs || 0;

        if (pokeballs <= 0) {
            await sock.sendMessage(from, {
                text: '❌ **NO POKEBALLS!**\n\n💼 You have 0 pokeballs remaining!\n\n🎁 Use `.pokeballsdaily` to claim your daily pokeballs!\n💡 You can also use regular `.catch` without pokeballs.',
                contextInfo: {
                    externalAdReply: {
                        title: 'No Pokeballs Available',
                        body: 'Claim daily pokeballs to catch Pokemon',
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Get Pokemon name if provided
        const targetPokemon = args.trim().toLowerCase();

        // Find wild Pokemon in current group
        let wildPokemon;
        if (targetPokemon) {
            // Find specific Pokemon by name
            wildPokemon = Array.from(global.wildPokemon.entries())
                .find(([key, pokemon]) => pokemon.groupId === from && pokemon.name.toLowerCase() === targetPokemon);
        } else {
            // Find any Pokemon in the group
            wildPokemon = Array.from(global.wildPokemon.entries())
                .find(([key, pokemon]) => pokemon.groupId === from);
        }

        if (!wildPokemon) {
            const message = targetPokemon 
                ? `❌ No wild ${targetPokemon.charAt(0).toUpperCase() + targetPokemon.slice(1)} to catch! Use .spawnpokemon first.`
                : '❌ No wild Pokemon to catch! Use .spawnpokemon first.';

            await sock.sendMessage(from, {
                text: message,
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

        // Deduct pokeball first
        playerStats.pokeballs = pokeballs - 1;
        dataManager.setPlayerStats(sender, playerStats);

        // Set fixed 80% success rate for pokeball catches
        const enhancedChance = 0.80; // Fixed 80% success rate

       // Define available pokeballs and their catch rates
        const pokeballTypes = {
            pokeball: {
                name: 'pokeball',
                catchRate: 0.80
            },
            greatball: {
                name: 'greatball',
                catchRate: 0.90
            },
            ultraball: {
                name: 'ultraball',
                catchRate: 0.98
            }
        };

        // Default to pokeball if none is specified or invalid
        let selectedBall = pokeballTypes.pokeball;

        // Determine which pokeball type to use based on command arguments
        if (args.length > 0) {
            const ballType = args[0].toLowerCase();
            if (pokeballTypes[ballType]) {
                selectedBall = pokeballTypes[ballType];
            }
        }
        
        // Deduct the selected pokeball
        if (playerStats.pokeballs && playerStats.pokeballs[selectedBall.name] > 0) {
            playerStats.pokeballs[selectedBall.name] -= 1;
        } else {
            await sock.sendMessage(from, {
                text: `❌ You don't have any ${selectedBall.name}s left!`,
            });
            return;
        }

        dataManager.setPlayerStats(sender, playerStats);
        
        // Calculate catch chance
        const catchChance = calculateCatchChance(pokemon.rarity, pokemon.level) * selectedBall.catchRate;
        
        // Send realistic pokeball throwing GIF
        try {
            await sock.sendMessage(from, {
                    video: { url: 'https://files.catbox.moe/dbpvlo.gif' },
                    caption: `🎯 **${selectedBall.name.toUpperCase()} THROWN!**\n\n⚡ Throwing ${selectedBall.name} at **${pokemon.name}**...\n🎯 Catch rate: ${(catchChance * 100).toFixed(0)}%\n💼 ${selectedBall.name}s remaining: ${playerStats.pokeballs[selectedBall.type]}`,
                    gifPlayback: true
                });
        } catch (error) {
            // Try alternative realistic throwing GIF
            try {
                await sock.sendMessage(from, {
                    video: { url: 'https://media.giphy.com/media/3oEjHKvjqt5pssL99C/giphy.gif' },
                    caption: `🎯 **${selectedBall.name.toUpperCase()} THROWN!**\n\n⚡ Throwing ${selectedBall.name} at **${pokemon.name}**...\n🎯 Catch rate: ${(catchChance * 100).toFixed(0)}%\n💼 ${selectedBall.name}s remaining: ${playerStats.pokeballs[selectedBall.type]}`,
                    gifPlayback: true
                });
            } catch (error2) {
                // Final fallback throwing GIF
                try {
                    await sock.sendMessage(from, {
                        video: { url: 'https://i.gifer.com/7Ubs.gif' },
                        caption: `🎯 **${selectedBall.name.toUpperCase()} THROWN!**\n\n⚡ Throwing ${selectedBall.name} at **${pokemon.name}**...\n🎯 Catch rate: ${(catchChance * 100).toFixed(0)}%\n💼 ${selectedBall.name}s remaining: ${playerStats.pokeballs[selectedBall.type]}`,
                        gifPlayback: true
                    });
                } catch (error3) {
                    console.log('Failed to send pokeball throw GIF:', error3);
                }
            }
        }

        // Wait for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 3000));

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
                isShiny: Math.random() < 0.001, // 0.1% shiny chance
                caughtWithPokeball: true
            };

            playerCollection.push(caughtPokemon);
            dataManager.setPlayerPokemon(sender, playerCollection);

            // Update player stats
            updateCatchStats(sender);
            playerStats.pokeballCatches = (playerStats.pokeballCatches || 0) + 1;
            dataManager.setPlayerStats(sender, playerStats);

            const shinyText = caughtPokemon.isShiny ? ' ✨**SHINY**✨' : '';
            const natureText = `\n• **Nature:** ${caughtPokemon.nature} (${getNatureEffect(caughtPokemon.nature)})`;

            // Send realistic pokeball catch success video
            try {
                await sock.sendMessage(from, {
                    text: `🎉 **${selectedBall.name.toUpperCase()} CATCH SUCCESSFUL!**${shinyText}\n\n✅ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} caught **${pokemon.name}** with a ${selectedBall.name}!\n\n**Pokemon Details:**\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}${natureText}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Happiness:** ${caughtPokemon.happiness}/100\n\n🎯 **Catch Stats:**\n• Success Rate: ${(catchChance * 100).toFixed(0)}%\n• Pokeball Catches: ${playerStats.pokeballCatches}\n\n🎒 Use .pokedex to view your collection!`,
                    mentions: [sender],
                    gifPlayback: true
                });
            } catch (error) {
                // Try alternative success GIF - pokeball shaking and catching
                try {
                    await sock.sendMessage(from, {
                        video: { url: 'https://media.giphy.com/media/HhODBGhJXuejK/giphy.gif' },
                        caption: `🎉 **${selectedBall.name.toUpperCase()} CATCH SUCCESSFUL!**${shinyText}\n\n✅ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} caught **${pokemon.name}** with a ${selectedBall.name}!\n\n**Pokemon Details:**\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}${natureText}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Happiness:** ${caughtPokemon.happiness}/100\n\n🎯 **Catch Stats:**\n• Success Rate: ${(catchChance * 100).toFixed(0)}%\n• Pokeball Catches: ${playerStats.pokeballCatches}\n\n🎒 Use .pokedex to view your collection!`,
                        mentions: [sender],
                        gifPlayback: true
                    });
                } catch (error2) {
                    // Final fallback success GIF
                    try {
                        await sock.sendMessage(from, {
                            video: { url: 'https://i.gifer.com/80Dh.gif' },
                            caption: `🎉 **${selectedBall.name.toUpperCase()} CATCH SUCCESSFUL!**${shinyText}\n\n✅ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} caught **${pokemon.name}** with a ${selectedBall.name}!\n\n**Pokemon Details:**\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}${natureText}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Happiness:** ${caughtPokemon.happiness}/100\n\n🎯 **Catch Stats:**\n• Success Rate: ${(catchChance * 100).toFixed(0)}%\n• Pokeball Catches: ${playerStats.pokeballCatches}\n\n🎒 Use .pokedex to view your collection!`,
                            mentions: [sender],
                            gifPlayback: true
                        });
                    } catch (error3) {
                        // Fallback to text
                        await sock.sendMessage(from, {
                            text: `🎉 **${selectedBall.name.toUpperCase()} CATCH SUCCESSFUL!**${shinyText}\n\n✅ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} caught **${pokemon.name}** with a ${selectedBall.name}!\n\n**Pokemon Details:**\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}${natureText}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Happiness:** ${caughtPokemon.happiness}/100\n\n🎯 **Catch Stats:**\n• Success Rate: ${(catchChance * 100).toFixed(0)}%\n• Pokeball Catches: ${playerStats.pokeballCatches}\n\n🎒 Use .pokedex to view your collection!`,
                            mentions: [sender]
                        });
                    }
                }
            }

        } else {
            // Send realistic pokeball escape failure video
            try {
                await sock.sendMessage(from, {
                    video: { url: 'https://media.giphy.com/media/YLgIOmtIMUACY/giphy.gif' },
                    caption: `💔 **${selectedBall.name.toUpperCase()} CATCH FAILED!**\n\n❌ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} failed to catch **${pokemon.name}**!\n\n🎯 **Success Rate:** ${(catchChance * 100).toFixed(0)}%\n💪 **${pokemon.name}** broke free from the ${selectedBall.name}!\n💼 **${selectedBall.name}s remaining:** ${playerStats.pokeballs[selectedBall.type]}\n\n💡 **Tips:**\n• Weaken the Pokemon first for better catch rates\n• Lower HP Pokemon are easier to catch\n• Try using .attack to damage it more!`,
                    mentions: [sender],
                    gifPlayback: true
                });
            } catch (error) {
                // Try alternative failure GIF - pokeball breaking open
                try {
                    await sock.sendMessage(from, {
                        video: { url: 'https://media.giphy.com/media/F2aEJrGD7pTud6XGzl/giphy.gif' },
                        caption: `💔 **${selectedBall.name.toUpperCase()} CATCH FAILED!**\n\n❌ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} failed to catch **${pokemon.name}**!\n\n🎯 **Success Rate:** ${(catchChance * 100).toFixed(0)}%\n💪 **${pokemon.name}** broke free from the ${selectedBall.name}!\n💼 **${selectedBall.name}s remaining:** ${playerStats.pokeballs[selectedBall.type]}\n\n💡 **Tips:**\n• Weaken the Pokemon first for better catch rates\n• Lower HP Pokemon are easier to catch\n• Try using .attack to damage it more!`,
                        mentions: [sender],
                        gifPlayback: true
                    });
                } catch (error2) {
                    // Final fallback failure GIF
                    try {
                        await sock.sendMessage(from, {
                            video: { url: 'https://i.gifer.com/Q6fW.gif' },
                            caption: `💔 **${selectedBall.name.toUpperCase()} CATCH FAILED!**\n\n❌ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} failed to catch **${pokemon.name}**!\n\n🎯 **Success Rate:** ${(catchChance * 100).toFixed(0)}%\n💪 **${pokemon.name}** broke free from the ${selectedBall.name}!\n💼 **${selectedBall.name}s remaining:** ${playerStats.pokeballs[selectedBall.type]}\n\n💡 **Tips:**\n• Weaken the Pokemon first for better catch rates\n• Lower HP Pokemon are easier to catch\n• Try using .attack to damage it more!`,
                            mentions: [sender],
                            gifPlayback: true
                        });
                    } catch (error3) {
                        // Fallback to text
                        await sock.sendMessage(from, {
                            text: `💔 **${selectedBall.name.toUpperCase()} CATCH FAILED!**\n\n❌ @${context.senderPhoneNumber || sender.replace('@s.whatsapp.net', '')} failed to catch **${pokemon.name}**!\n\n🎯 **Success Rate:** ${(catchChance * 100).toFixed(0)}%\n💪 **${pokemon.name}** broke free from the ${selectedBall.name}!\n💼 **${selectedBall.name}s remaining:** ${playerStats.pokeballs[selectedBall.type]}\n\n💡 **Tips:**\n• Weaken the Pokemon first for better catch rates\n• Lower HP Pokemon are easier to catch\n• Try using .attack to damage it more!`,
                            mentions: [sender]
                        });
                    }
                }
            }
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