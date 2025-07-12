
const command = {
    name: 'spawnpokemon',
    aliases: ['spawn', 'wildpokemon'],
    description: 'Spawn random wild Pokemon to catch',
    category: 'games',
    usage: '.spawnpokemon',
    cooldown: 30,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ Pokemon spawning only works in groups!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Groups Only',
                        body: 'Pokemon spawning requires a group',
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        // Initialize global Pokemon storage
        if (!global.wildPokemon) global.wildPokemon = new Map();
        if (!global.pokemonCooldowns) global.pokemonCooldowns = new Map();
        
        // Check cooldown
        const cooldownKey = `${from}-spawn`;
        const lastSpawn = global.pokemonCooldowns.get(cooldownKey) || 0;
        const cooldownTime = 60000; // 1 minute
        
        if (Date.now() - lastSpawn < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (Date.now() - lastSpawn)) / 1000);
            await sock.sendMessage(from, {
                text: `⏰ Please wait ${remaining} seconds before spawning another Pokemon!\n\n💡 Wild Pokemon need time to appear naturally!`
            });
            return;
        }
        
        const pokemon = getRandomWildPokemon();
        const spawnKey = `${from}-${Date.now()}`;
        
        // Store wild Pokemon
        global.wildPokemon.set(spawnKey, {
            ...pokemon,
            spawner: sender,
            spawnTime: Date.now(),
            groupId: from
        });
        
        global.pokemonCooldowns.set(cooldownKey, Date.now());
        
        const shinyText = pokemon.isShiny ? ' ✨**SHINY**✨' : '';
        const rarityEmoji = getRarityEmoji(pokemon.rarity);
        
        await sock.sendMessage(from, {
            text: `🌟 **WILD POKEMON APPEARED!**${shinyText}\n\n${rarityEmoji} **${pokemon.name}** (Level ${pokemon.level})\n${pokemon.description}\n\n**Pokemon Stats:**\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Attack:** ${pokemon.attack}\n• **Defense:** ${pokemon.defense}\n• **Speed:** ${pokemon.speed}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}\n• **Nature:** ${pokemon.nature}\n\n**Available Moves:**\n${pokemon.moves.map((move, i) => `${i + 1}. ${move.name} (${move.type})`).join('\n')}\n\n⚡ **Quick! Use .catch to catch it!**\n⏰ *Disappears in 2 minutes*\n🎯 *Estimated catch rate: ${calculateCatchRate(pokemon.rarity, pokemon.level)}%*`,
            contextInfo: {
                externalAdReply: {
                    title: `Wild ${pokemon.name} Appeared!${shinyText}`,
                    body: `Level ${pokemon.level} ${pokemon.type} • ${pokemon.rarity}`,
                    thumbnailUrl: pokemon.isShiny ? pokemon.shinyImage : pokemon.image,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
        
        // Send Pokemon image
        try {
            const imageUrl = pokemon.isShiny ? pokemon.shinyImage : pokemon.image;
            await sock.sendMessage(from, {
                image: { url: imageUrl },
                caption: `📸 A wild ${pokemon.name} appeared!${shinyText}\n🏷️ Level ${pokemon.level} ${pokemon.type} Pokemon`
            });
        } catch (error) {
            console.log('Failed to send Pokemon spawn image:', error);
        }
        
        // Auto-expire after 2 minutes
        setTimeout(() => {
            if (global.wildPokemon.has(spawnKey)) {
                global.wildPokemon.delete(spawnKey);
                sock.sendMessage(from, {
                    text: `🏃‍♂️ **${pokemon.name}** ran away into the wild! Better luck next time.`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Pokemon Fled',
                            body: `${pokemon.name} escaped`,
                            thumbnailUrl: pokemon.image,
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }, 120000); // 2 minutes
        
        function getRandomWildPokemon() {
            const pokemonList = [
                { 
                    name: 'Pikachu', 
                    type: 'Electric', 
                    rarity: 'Common', 
                    description: 'A small electric mouse Pokemon that stores electricity in its cheek pouches.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png'
                },
                { 
                    name: 'Charmander', 
                    type: 'Fire', 
                    rarity: 'Common', 
                    description: 'A fire lizard Pokemon. The flame on its tail shows its emotions.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/4.png'
                },
                { 
                    name: 'Squirtle', 
                    type: 'Water', 
                    rarity: 'Common', 
                    description: 'A tiny turtle Pokemon that can withdraw into its shell for protection.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/7.png'
                },
                { 
                    name: 'Bulbasaur', 
                    type: 'Grass/Poison', 
                    rarity: 'Common', 
                    description: 'A seed Pokemon with a plant bulb on its back that grows larger with age.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png'
                },
                { 
                    name: 'Eevee', 
                    type: 'Normal', 
                    rarity: 'Uncommon', 
                    description: 'An evolution Pokemon with an unstable genetic makeup.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/133.png'
                },
                { 
                    name: 'Charizard', 
                    type: 'Fire/Flying', 
                    rarity: 'Rare', 
                    description: 'A flame Pokemon that spits fire hot enough to melt almost anything.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/6.png'
                },
                { 
                    name: 'Dragonite', 
                    type: 'Dragon/Flying', 
                    rarity: 'Rare', 
                    description: 'A dragon Pokemon capable of circling the globe in 16 hours.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/149.png'
                },
                { 
                    name: 'Mewtwo', 
                    type: 'Psychic', 
                    rarity: 'Legendary', 
                    description: 'A genetic Pokemon created through gene splicing. Its powers are unmatched.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/150.png'
                },
                { 
                    name: 'Mew', 
                    type: 'Psychic', 
                    rarity: 'Legendary', 
                    description: 'A mythical Pokemon said to possess the genetic composition of all Pokemon.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/151.png'
                },
                { 
                    name: 'Lucario', 
                    type: 'Fighting/Steel', 
                    rarity: 'Rare', 
                    description: 'An aura Pokemon that can sense the emotions of creatures over half a mile away.',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png',
                    shinyImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/448.png'
                }
            ];
            
            const rarityChances = {
                'Common': 50,
                'Uncommon': 30,
                'Rare': 15,
                'Legendary': 5
            };
            
            const random = Math.random() * 100;
            let rarity = 'Common';
            
            if (random <= rarityChances.Legendary) rarity = 'Legendary';
            else if (random <= rarityChances.Rare + rarityChances.Legendary) rarity = 'Rare';
            else if (random <= rarityChances.Uncommon + rarityChances.Rare + rarityChances.Legendary) rarity = 'Uncommon';
            
            const availablePokemon = pokemonList.filter(p => p.rarity === rarity);
            const selectedPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
            
            const level = Math.floor(Math.random() * 50) + 1;
            const isShiny = Math.random() < 0.005; // 0.5% shiny chance
            
            const baseStats = generateStats(level, rarity);
            const nature = getRandomNature();
            const moves = generateMovesByType(selectedPokemon.type);
            
            return {
                ...selectedPokemon,
                level,
                maxHp: baseStats.hp,
                hp: baseStats.hp,
                attack: baseStats.attack,
                defense: baseStats.defense,
                speed: baseStats.speed,
                exp: 0,
                expToNext: level * 100,
                nature,
                moves,
                isShiny,
                id: Date.now() + Math.random()
            };
        }
        
        function generateStats(level, rarity) {
            const rarityMultiplier = {
                'Common': 1.0,
                'Uncommon': 1.2,
                'Rare': 1.5,
                'Legendary': 2.0
            };
            
            const multiplier = rarityMultiplier[rarity] || 1.0;
            
            return {
                hp: Math.floor((Math.random() * 50 + 50) * multiplier * (level / 50 + 0.5)),
                attack: Math.floor((Math.random() * 40 + 30) * multiplier * (level / 50 + 0.5)),
                defense: Math.floor((Math.random() * 40 + 30) * multiplier * (level / 50 + 0.5)),
                speed: Math.floor((Math.random() * 40 + 30) * multiplier * (level / 50 + 0.5))
            };
        }
        
        function getRandomNature() {
            const natures = [
                'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
                'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
                'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
                'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash'
            ];
            return natures[Math.floor(Math.random() * natures.length)];
        }
        
        function generateMovesByType(type) {
            const movesByType = {
                'Electric': [
                    { name: 'Thunder Shock', power: 40, type: 'Electric' },
                    { name: 'Quick Attack', power: 40, type: 'Normal' },
                    { name: 'Thunder Wave', power: 0, type: 'Electric' },
                    { name: 'Spark', power: 65, type: 'Electric' }
                ],
                'Fire': [
                    { name: 'Ember', power: 40, type: 'Fire' },
                    { name: 'Scratch', power: 40, type: 'Normal' },
                    { name: 'Fire Spin', power: 35, type: 'Fire' },
                    { name: 'Flame Wheel', power: 60, type: 'Fire' }
                ],
                'Water': [
                    { name: 'Water Gun', power: 40, type: 'Water' },
                    { name: 'Tackle', power: 40, type: 'Normal' },
                    { name: 'Bubble', power: 40, type: 'Water' },
                    { name: 'Water Pulse', power: 60, type: 'Water' }
                ],
                'Grass': [
                    { name: 'Vine Whip', power: 45, type: 'Grass' },
                    { name: 'Tackle', power: 40, type: 'Normal' },
                    { name: 'Razor Leaf', power: 55, type: 'Grass' },
                    { name: 'Absorb', power: 20, type: 'Grass' }
                ]
            };
            
            const primaryType = type.split('/')[0];
            return movesByType[primaryType] || [
                { name: 'Tackle', power: 40, type: 'Normal' },
                { name: 'Growl', power: 0, type: 'Normal' },
                { name: 'Scratch', power: 40, type: 'Normal' },
                { name: 'Leer', power: 0, type: 'Normal' }
            ];
        }
        
        function getRarityEmoji(rarity) {
            const emojis = {
                'Common': '⚪',
                'Uncommon': '🟢', 
                'Rare': '🔵',
                'Legendary': '🟣'
            };
            return emojis[rarity] || '⚪';
        }
        
        function calculateCatchRate(rarity, level) {
            const baseChances = {
                'Common': 85,
                'Uncommon': 65,
                'Rare': 45,
                'Legendary': 15
            };
            
            const baseChance = baseChances[rarity] || 50;
            const levelPenalty = Math.max(0, (level - 1) * 0.8);
            
            return Math.max(5, Math.floor(baseChance - levelPenalty));
        }
    }
};

export { command };
