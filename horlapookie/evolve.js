
const command = {
    name: 'evolve',
    aliases: ['evolution', 'evo'],
    description: 'Evolve Pokemon that reached level 50',
    usage: 'evolve <number>',
    category: 'pokemon',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const pokemonNumber = parseInt(args.trim());
        if (isNaN(pokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a Pokemon number!\n\n📝 **Example:** .evolve 1'
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
        
        if (pokemon.level < 50) {
            await sock.sendMessage(from, {
                text: `❌ **${pokemon.nickname}** is only level ${pokemon.level}. Pokemon must reach level 50 to evolve!`
            });
            return;
        }
        
        const evolutionData = getEvolution(pokemon.name);
        if (!evolutionData) {
            await sock.sendMessage(from, {
                text: `❌ **${pokemon.nickname}** cannot evolve or is already in its final form!`
            });
            return;
        }
        
        const oldName = pokemon.name;
        const oldNickname = pokemon.nickname;
        
        // Apply evolution
        pokemon.name = evolutionData.name;
        pokemon.type = evolutionData.type;
        pokemon.rarity = evolutionData.rarity;
        pokemon.image = evolutionData.image;
        pokemon.nickname = evolutionData.name; // Update nickname to evolved form
        pokemon.evolutionCancelled = false;
        
        // Boost stats for evolution
        pokemon.maxHp += 30;
        pokemon.hp = pokemon.maxHp;
        pokemon.attack += 15;
        pokemon.defense += 15;
        pokemon.speed += 10;
        
        collection[pokemonIndex] = pokemon;
        dataManager.setPlayerPokemon(sender, collection);
        
        await sock.sendMessage(from, {
            text: `🎉 **EVOLUTION COMPLETE!**\n\n**${oldNickname}** evolved into **${pokemon.name}**!\n\n✨ **Evolution Bonuses:**\n• HP: +30 (${pokemon.hp}/${pokemon.maxHp})\n• Attack: +15 (${pokemon.attack})\n• Defense: +15 (${pokemon.defense})\n• Speed: +10 (${pokemon.speed})\n• Type: ${pokemon.type}\n• Rarity: ${pokemon.rarity}\n\n🔥 Your Pokemon is now much stronger!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Evolution!',
                    body: `${oldName} → ${pokemon.name}`,
                    thumbnailUrl: pokemon.image,
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
        
        function getEvolution(pokemonName) {
            const evolutions = {
                'charmander': { name: 'Charmeleon', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
                'charmeleon': { name: 'Charizard', type: 'Fire/Flying', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
                'squirtle': { name: 'Wartortle', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png' },
                'wartortle': { name: 'Blastoise', type: 'Water', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
                'bulbasaur': { name: 'Ivysaur', type: 'Grass/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
                'ivysaur': { name: 'Venusaur', type: 'Grass/Poison', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' },
                'pikachu': { name: 'Raichu', type: 'Electric', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
                'machop': { name: 'Machoke', type: 'Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png' },
                'machoke': { name: 'Machamp', type: 'Fighting', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png' },
                'geodude': { name: 'Graveler', type: 'Rock/Ground', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png' },
                'graveler': { name: 'Golem', type: 'Rock/Ground', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png' },
                'gastly': { name: 'Haunter', type: 'Ghost/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png' },
                'haunter': { name: 'Gengar', type: 'Ghost/Poison', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
                'mareep': { name: 'Flaaffy', type: 'Electric', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png' },
                'flaaffy': { name: 'Ampharos', type: 'Electric', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png' }
            };
            
            return evolutions[pokemonName.toLowerCase()];
        }
    }
};

export { command };
