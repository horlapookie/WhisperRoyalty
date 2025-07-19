
const command = {
    name: 'learn',
    aliases: ['learnmove', 'newmove'],
    description: 'Teach your Pokemon a new move',
    usage: 'learn <pokemon_number>',
    category: 'pokemon',
    cooldown: 30,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const pokemonNumber = parseInt(args.trim());
        if (isNaN(pokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a Pokemon number!\n\n📝 **Example:** .learn 1'
            });
            return;
        }
        
        const collection = dataManager.getPlayerPokemon(sender);
        const pokemonIndex = pokemonNumber - 1;
        
        if (pokemonIndex < 0 || pokemonIndex >= collection.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid Pokemon number! You have ${collection.length} Pokemon.`
            });
            return;
        }
        
        const pokemon = collection[pokemonIndex];
        
        if (pokemon.level < 10) {
            await sock.sendMessage(from, {
                text: `❌ **${pokemon.nickname}** must be at least level 10 to learn new moves! Current level: ${pokemon.level}`
            });
            return;
        }
        
        // Get available moves for this Pokemon type and level
        const availableMoves = getLearnableMoves(pokemon.type, pokemon.level);
        const currentMoveNames = pokemon.moves.map(move => move.name.toLowerCase());
        const newMoves = availableMoves.filter(move => !currentMoveNames.includes(move.name.toLowerCase()));
        
        if (newMoves.length === 0) {
            await sock.sendMessage(from, {
                text: `❌ **${pokemon.nickname}** cannot learn any new moves at this level!\n\n💡 Try training to higher levels or this Pokemon already knows the best moves for its type.`
            });
            return;
        }
        
        // Random chance to learn based on level
        const successChance = Math.min(0.7, 0.3 + (pokemon.level / 100));
        if (Math.random() > successChance) {
            await sock.sendMessage(from, {
                text: `❌ **${pokemon.nickname}** failed to learn a new move this time!\n\n💡 Try again later. Success chance: ${(successChance * 100).toFixed(0)}%`
            });
            return;
        }
        
        // Select random new move
        const newMove = newMoves[Math.floor(Math.random() * newMoves.length)];
        
        if (pokemon.moves.length >= 4) {
            // Replace oldest move
            pokemon.moves.shift();
        }
        
        pokemon.moves.push(newMove);
        collection[pokemonIndex] = pokemon;
        dataManager.setPlayerPokemon(sender, collection);
        
        await sock.sendMessage(from, {
            text: `🎓 **New Move Learned!**\n\n**${pokemon.nickname}** learned **${newMove.name}**!\n\n✨ **Move Details:**\n• Power: ${newMove.power}\n• Type: ${newMove.type}\n• Accuracy: ${newMove.accuracy}%\n\n📚 **Current Moves:**\n${pokemon.moves.map((move, i) => `${i + 1}. **${move.name}** (${move.power} power)`).join('\n')}\n\n💡 Pokemon can know up to 4 moves!`,
            contextInfo: {
                externalAdReply: {
                    title: 'New Move Learned!',
                    body: `${pokemon.nickname} learned ${newMove.name}`,
                    thumbnailUrl: pokemon.image,
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
        
        function getLearnableMoves(type, level) {
            const movesByType = {
                'Fire': [
                    { name: 'Flamethrower', power: 90, type: 'Fire', accuracy: 100 },
                    { name: 'Fire Blast', power: 110, type: 'Fire', accuracy: 85 },
                    { name: 'Heat Wave', power: 95, type: 'Fire', accuracy: 90 },
                    { name: 'Sunny Day', power: 0, type: 'Fire', accuracy: 100 },
                    { name: 'Will-O-Wisp', power: 0, type: 'Fire', accuracy: 85 }
                ],
                'Water': [
                    { name: 'Surf', power: 90, type: 'Water', accuracy: 100 },
                    { name: 'Hydro Pump', power: 110, type: 'Water', accuracy: 80 },
                    { name: 'Ice Beam', power: 90, type: 'Ice', accuracy: 100 },
                    { name: 'Rain Dance', power: 0, type: 'Water', accuracy: 100 },
                    { name: 'Aqua Tail', power: 90, type: 'Water', accuracy: 90 }
                ],
                'Electric': [
                    { name: 'Thunderbolt', power: 90, type: 'Electric', accuracy: 100 },
                    { name: 'Thunder', power: 110, type: 'Electric', accuracy: 70 },
                    { name: 'Volt Tackle', power: 120, type: 'Electric', accuracy: 100 },
                    { name: 'Thunder Wave', power: 0, type: 'Electric', accuracy: 90 },
                    { name: 'Discharge', power: 80, type: 'Electric', accuracy: 100 }
                ],
                'Grass': [
                    { name: 'Solar Beam', power: 120, type: 'Grass', accuracy: 100 },
                    { name: 'Petal Dance', power: 120, type: 'Grass', accuracy: 100 },
                    { name: 'Leaf Storm', power: 130, type: 'Grass', accuracy: 90 },
                    { name: 'Sleep Powder', power: 0, type: 'Grass', accuracy: 75 },
                    { name: 'Synthesis', power: 0, type: 'Grass', accuracy: 100 }
                ]
            };
            
            // Get moves for primary type
            const primaryType = type.split('/')[0];
            let moves = movesByType[primaryType] || [
                { name: 'Hyper Beam', power: 150, type: 'Normal', accuracy: 90 },
                { name: 'Double-Edge', power: 120, type: 'Normal', accuracy: 100 },
                { name: 'Swift', power: 60, type: 'Normal', accuracy: 100 }
            ];
            
            // Filter by level requirement
            return moves.filter(move => level >= (move.power / 5) || move.power === 0);
        }
    }
};

export { command };
