
export const command = {
    name: 'train',
    aliases: ['trainpokemon', 'pokemontrain'],
    description: 'Train your Pokemon to level up',
    category: 'games',
    usage: '.train <pokemon_name>',
    cooldown: 300, // 5 minutes
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!args || !args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please specify which Pokemon to train!\n\nExample: .train Pikachu'
            });
            return;
        }
        
        // Initialize storage
        const dataManager = global.dataManager;
        const playerCollection = dataManager.getPlayerPokemon(sender);
        
        if (playerCollection.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ You don\'t have any Pokemon to train! Use .spawnpokemon and .catch first.'
            });
            return;
        }
        
        const pokemonName = args.trim();
        const pokemonIndex = playerCollection.findIndex(p => 
            p.name.toLowerCase().includes(pokemonName.toLowerCase()) || 
            p.nickname.toLowerCase().includes(pokemonName.toLowerCase())
        );
        
        if (pokemonIndex === -1) {
            await sock.sendMessage(from, {
                text: `❌ Pokemon "${pokemonName}" not found in your collection!`
            });
            return;
        }
        
        const pokemon = playerCollection[pokemonIndex];
        
        // Training results
        const expGained = Math.floor(Math.random() * 50) + 20;
        const oldLevel = pokemon.level;
        pokemon.exp += expGained;
        
        let leveledUp = false;
        let newMoves = [];
        
        // Check for level up
        while (pokemon.exp >= pokemon.expToNext) {
            pokemon.exp -= pokemon.expToNext;
            pokemon.level++;
            leveledUp = true;
            
            // Increase stats
            pokemon.maxHp += Math.floor(Math.random() * 10) + 5;
            pokemon.hp = pokemon.maxHp; // Full heal on level up
            pokemon.attack += Math.floor(Math.random() * 5) + 2;
            pokemon.defense += Math.floor(Math.random() * 5) + 2;
            pokemon.speed += Math.floor(Math.random() * 5) + 2;
            
            // Set new exp requirement
            pokemon.expToNext = pokemon.level * 100;
            
            // Chance to learn new move based on level and type
            if (Math.random() < 0.4) {
                const levelMoves = getLevelMoves(pokemon.type, pokemon.level);
                const availableMoves = levelMoves.filter(move => 
                    !pokemon.moves.some(existing => existing.name === move.name)
                );
                
                if (availableMoves.length > 0) {
                    const newMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    if (pokemon.moves.length < 4) {
                        pokemon.moves.push(newMove);
                    } else {
                        // Replace random move if at max capacity
                        const replaceIndex = Math.floor(Math.random() * pokemon.moves.length);
                        pokemon.moves[replaceIndex] = newMove;
                    }
                    newMoves.push(newMove.name);
                }
            }
        }
        
        // Update the Pokemon in collection
        playerCollection[pokemonIndex] = pokemon;
        dataManager.setPlayerPokemon(sender, playerCollection);
        
        // Update training stats
        const stats = dataManager.getPlayerStats(sender);
        stats.trainingCount++;
        dataManager.setPlayerStats(sender, stats);
        
        let trainingResult = `🏋️ **Training Complete!**\n\n**${pokemon.nickname}** gained ${expGained} EXP!\n\n`;
        
        if (leveledUp) {
            trainingResult += `🎉 **LEVEL UP!**\n\n**${pokemon.nickname}** leveled up from ${oldLevel} to ${pokemon.level}!\n\n`;
            trainingResult += `**Stat Increases:**\n• HP: ${pokemon.hp}/${pokemon.maxHp}\n• Attack: ${pokemon.attack}\n• Defense: ${pokemon.defense}\n• Speed: ${pokemon.speed}\n\n`;
            
            if (newMoves.length > 0) {
                trainingResult += `✨ **New Moves Learned:**\n• ${newMoves.join('\n• ')}\n\n`;
            }
        }
        
        const expProgress = (pokemon.exp / pokemon.expToNext * 100).toFixed(1);
        trainingResult += `**Progress to Next Level:**\n${pokemon.exp}/${pokemon.expToNext} EXP (${expProgress}%)\n\n`;
        trainingResult += `⏰ *Training cooldown: 5 minutes*`;
        
        await sock.sendMessage(from, {
            text: trainingResult,
            contextInfo: {
                externalAdReply: {
                    title: `${pokemon.nickname} Training`,
                    body: `Level ${pokemon.level} ${pokemon.type}`,
                    thumbnailUrl: pokemon.image,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
function getLevelMoves(type, level) {
            const movesByType = {
                'Electric': [
                    { name: 'Thunder Shock', power: 40, type: 'Electric', accuracy: 100, level: 1 },
                    { name: 'Thunder Wave', power: 0, type: 'Electric', accuracy: 90, level: 5 },
                    { name: 'Spark', power: 65, type: 'Electric', accuracy: 100, level: 10 },
                    { name: 'Thunder', power: 110, type: 'Electric', accuracy: 70, level: 20 },
                    { name: 'Thunderbolt', power: 90, type: 'Electric', accuracy: 100, level: 15 }
                ],
                'Fire': [
                    { name: 'Ember', power: 40, type: 'Fire', accuracy: 100, level: 1 },
                    { name: 'Fire Spin', power: 35, type: 'Fire', accuracy: 85, level: 5 },
                    { name: 'Flame Wheel', power: 60, type: 'Fire', accuracy: 100, level: 10 },
                    { name: 'Flamethrower', power: 90, type: 'Fire', accuracy: 100, level: 15 },
                    { name: 'Fire Blast', power: 110, type: 'Fire', accuracy: 85, level: 20 }
                ],
                'Water': [
                    { name: 'Water Gun', power: 40, type: 'Water', accuracy: 100, level: 1 },
                    { name: 'Bubble', power: 40, type: 'Water', accuracy: 100, level: 5 },
                    { name: 'Water Pulse', power: 60, type: 'Water', accuracy: 100, level: 10 },
                    { name: 'Surf', power: 90, type: 'Water', accuracy: 100, level: 15 },
                    { name: 'Hydro Pump', power: 110, type: 'Water', accuracy: 80, level: 20 }
                ],
                'Grass': [
                    { name: 'Vine Whip', power: 45, type: 'Grass', accuracy: 100, level: 1 },
                    { name: 'Razor Leaf', power: 55, type: 'Grass', accuracy: 95, level: 5 },
                    { name: 'Mega Drain', power: 40, type: 'Grass', accuracy: 100, level: 10 },
                    { name: 'Solar Beam', power: 120, type: 'Grass', accuracy: 100, level: 20 },
                    { name: 'Petal Dance', power: 120, type: 'Grass', accuracy: 100, level: 15 }
                ]
            };
            
            const primaryType = type.split('/')[0];
            const typeMoves = movesByType[primaryType] || movesByType['Fire'];
            
            return typeMoves.filter(move => move.level <= level);
        }
