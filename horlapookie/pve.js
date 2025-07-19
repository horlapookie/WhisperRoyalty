
const command = {
    name: 'pve',
    aliases: ['pvebattle', 'wildpokemon'],
    description: 'Start a PvE battle against wild Pokemon',
    usage: 'pve [pokemon_name] - Start PvE battle with specific or random Pokemon from your party',
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
        
        if (currentBattle) {
            await sock.sendMessage(from, {
                text: '⚔️ A battle is already in progress!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Battle In Progress',
                        body: 'Complete current battle first',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=520',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const playerParty = getPlayerParty(sender);
        if (playerParty.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ You need Pokemon in your party to battle!\n\n🎮 Use `.pvp transfer2party <number>` to add Pokemon to your party first!',
                contextInfo: {
                    externalAdReply: {
                        title: 'No Party Pokemon',
                        body: 'Add Pokemon to your party first',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=525',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        let chosenPokemon = null;
        let activePokemonIndex = 0;
        
        // If user specified a Pokemon name, find it in their party
        if (args && args.trim()) {
            const pokemonName = args.trim().toLowerCase();
            const pokemonIndex = playerParty.findIndex(p => 
                p.name.toLowerCase().includes(pokemonName) ||
                p.nickname.toLowerCase().includes(pokemonName)
            );
            
            if (pokemonIndex === -1) {
                await sock.sendMessage(from, {
                    text: `❌ Pokemon "${args.trim()}" not found in your party!\n\n**Your Party Pokemon:**\n${playerParty.map((p, i) => `${i + 1}. ${p.nickname} (${p.name})`).join('\n')}\n\n💡 Use exact name or try .pve without specifying a Pokemon`
                });
                return;
            }
            
            if (playerParty[pokemonIndex].hp <= 0) {
                await sock.sendMessage(from, {
                    text: `❌ ${playerParty[pokemonIndex].nickname} has fainted and cannot battle!\n\n💚 Use .pvp heal to restore your Pokemon first.`
                });
                return;
            }
            
            activePokemonIndex = pokemonIndex;
            chosenPokemon = playerParty[pokemonIndex];
        } else {
            // Use first healthy Pokemon in party
            const healthyIndex = playerParty.findIndex(p => p.hp > 0);
            if (healthyIndex === -1) {
                await sock.sendMessage(from, {
                    text: '❌ All Pokemon in your party have fainted!\n\n💚 Use .pvp heal to restore your Pokemon first.'
                });
                return;
            }
            activePokemonIndex = healthyIndex;
            chosenPokemon = playerParty[healthyIndex];
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
                activePokemon: activePokemonIndex,
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
        
        const playerName = msg.pushName || sender.split('@')[0];
        const battleField = getWeatherEmoji(battle.weather) + getTerrainEmoji(battle.terrain);
        
        await sock.sendMessage(from, {
            image: { url: 'https://picsum.photos/800/600?random=pvebattle1' },
            caption: `🌟 **WILD POKEMON BATTLE BEGINS!**\n\n${battleField} **Battle Conditions:**\n• Weather: ${battle.weather}\n• Terrain: ${battle.terrain}\n\n**👤 Trainer:** **${playerName}**\n**🔥 Your Pokemon:** **${chosenPokemon.nickname}** (Lv.${chosenPokemon.level})\n\n**⚔️ VS**\n\n**🌿 Wild Pokemon:** **${wildPokemon.nickname}** (Lv.${wildPokemon.level})\n\n**Current Battle Status:**\n${getBattlePokemonStatus(chosenPokemon)}\n\n**VS**\n\n${getBattlePokemonStatus(wildPokemon)}\n\n**⚡ Available Actions:**\n${getMovesText(chosenPokemon.moves)}\n\n🎮 **Commands:**\n• .pvp move1/2/3/4 - Use moves\n• .pvp switch <1-4> - Switch Pokemon\n• .pvp forfeit - Escape from battle\n\n**💡 Your Turn!** Choose your move!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Wild Pokemon Battle!',
                    body: `${chosenPokemon.nickname} vs Wild ${wildPokemon.nickname}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=521',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
        
        // Helper functions
        function getPlayerParty(playerId) {
            const stats = dataManager.getPlayerStats(playerId);
            if (!stats.party) stats.party = [];
            
            const allPokemon = dataManager.getPlayerPokemon(playerId);
            return allPokemon.filter(pokemon => stats.party.includes(pokemon.id));
        }
        
        function getBattlePokemonStatus(pokemon) {
            const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
            let hpBar = '';
            for (let i = 0; i < 10; i++) {
                hpBar += i < (hpPercent / 10) ? '█' : '░';
            }
            
            const statusText = pokemon.statusEffect ? ` [${pokemon.statusEffect}]` : '';
            return `**${pokemon.nickname}** (Lv.${pokemon.level})${statusText}\n${pokemon.type} • HP: ${pokemon.currentHp}/${pokemon.maxHp} [${hpBar}] ${hpPercent.toFixed(0)}%`;
        }
        
        function getMovesText(moves) {
            return moves.map((move, index) => 
                `${index + 1}. **${move.name}** ${move.power > 0 ? `(${move.power} power)` : '(Status)'} - ${move.type}`
            ).join('\n');
        }
        
        function generateWildOpponent() {
            const wildPokemonList = [
                { name: 'Rattata', type: 'Normal', rarity: 'Common' },
                { name: 'Pidgey', type: 'Normal/Flying', rarity: 'Common' },
                { name: 'Geodude', type: 'Rock/Ground', rarity: 'Uncommon' },
                { name: 'Machop', type: 'Fighting', rarity: 'Uncommon' },
                { name: 'Haunter', type: 'Ghost/Poison', rarity: 'Rare' },
                { name: 'Alakazam', type: 'Psychic', rarity: 'Rare' },
                { name: 'Scyther', type: 'Bug/Flying', rarity: 'Rare' },
                { name: 'Electabuzz', type: 'Electric', rarity: 'Rare' },
                { name: 'Magmar', type: 'Fire', rarity: 'Rare' },
                { name: 'Pinsir', type: 'Bug', rarity: 'Uncommon' },
                { name: 'Tauros', type: 'Normal', rarity: 'Uncommon' },
                { name: 'Lapras', type: 'Water/Ice', rarity: 'Rare' }
            ];
            
            const pokemon = wildPokemonList[Math.floor(Math.random() * wildPokemonList.length)];
            const level = Math.floor(Math.random() * 40) + 15; // Level 15-55
            
            const baseStats = generateStats(level, pokemon.rarity);
            
            return {
                id: `wild_${Date.now()}`,
                name: pokemon.name,
                nickname: pokemon.name,
                type: pokemon.type,
                level,
                maxHp: baseStats.hp,
                currentHp: baseStats.hp,
                hp: baseStats.hp,
                attack: baseStats.attack,
                defense: baseStats.defense,
                speed: baseStats.speed,
                rarity: pokemon.rarity,
                moves: generateMovesByType(pokemon.type),
                exp: 0,
                nature: getRandomNature(),
                statusEffect: null,
                statChanges: { attack: 0, defense: 0, speed: 0 }
            };
        }
        
        function generateStats(level, rarity) {
            const rarityMultiplier = {
                'Common': 1.0,
                'Uncommon': 1.2,
                'Rare': 1.4,
                'Legendary': 1.8
            };
            
            const multiplier = rarityMultiplier[rarity] || 1.0;
            
            return {
                hp: Math.floor((60 + Math.random() * 60) * level * 0.15 * multiplier),
                attack: Math.floor((35 + Math.random() * 35) * level * 0.12 * multiplier),
                defense: Math.floor((35 + Math.random() * 35) * level * 0.12 * multiplier),
                speed: Math.floor((25 + Math.random() * 45) * level * 0.12 * multiplier)
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
                ],
                'Water': [
                    { name: 'Water Gun', power: 40, type: 'Water', accuracy: 100 },
                    { name: 'Bubble Beam', power: 65, type: 'Water', accuracy: 100 },
                    { name: 'Surf', power: 90, type: 'Water', accuracy: 100 },
                    { name: 'Hydro Pump', power: 110, type: 'Water', accuracy: 80 }
                ],
                'Electric': [
                    { name: 'Thunder Shock', power: 40, type: 'Electric', accuracy: 100 },
                    { name: 'Spark', power: 65, type: 'Electric', accuracy: 100 },
                    { name: 'Thunderbolt', power: 90, type: 'Electric', accuracy: 100 },
                    { name: 'Thunder', power: 110, type: 'Electric', accuracy: 70 }
                ],
                'Fighting': [
                    { name: 'Karate Chop', power: 50, type: 'Fighting', accuracy: 100 },
                    { name: 'Low Kick', power: 50, type: 'Fighting', accuracy: 90 },
                    { name: 'Cross Chop', power: 100, type: 'Fighting', accuracy: 80 },
                    { name: 'Dynamic Punch', power: 100, type: 'Fighting', accuracy: 50 }
                ],
                'Rock': [
                    { name: 'Rock Throw', power: 50, type: 'Rock', accuracy: 90 },
                    { name: 'Rock Slide', power: 75, type: 'Rock', accuracy: 90 },
                    { name: 'Stone Edge', power: 100, type: 'Rock', accuracy: 80 },
                    { name: 'Rock Blast', power: 25, type: 'Rock', accuracy: 90 }
                ],
                'Ghost': [
                    { name: 'Lick', power: 30, type: 'Ghost', accuracy: 100 },
                    { name: 'Shadow Punch', power: 60, type: 'Ghost', accuracy: 100 },
                    { name: 'Shadow Ball', power: 80, type: 'Ghost', accuracy: 100 },
                    { name: 'Night Shade', power: 0, type: 'Ghost', accuracy: 100 }
                ],
                'Psychic': [
                    { name: 'Confusion', power: 50, type: 'Psychic', accuracy: 100 },
                    { name: 'Psybeam', power: 65, type: 'Psychic', accuracy: 100 },
                    { name: 'Psychic', power: 90, type: 'Psychic', accuracy: 100 },
                    { name: 'Future Sight', power: 120, type: 'Psychic', accuracy: 100 }
                ],
                'Bug': [
                    { name: 'Bug Bite', power: 60, type: 'Bug', accuracy: 100 },
                    { name: 'Fury Cutter', power: 40, type: 'Bug', accuracy: 95 },
                    { name: 'X-Scissor', power: 80, type: 'Bug', accuracy: 100 },
                    { name: 'Megahorn', power: 120, type: 'Bug', accuracy: 85 }
                ]
            };
            
            const primaryType = type.split('/')[0];
            const moves = movesByType[primaryType] || movesByType['Normal'];
            return moves.slice(0, 4);
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
        
        function getRandomNature() {
            const natures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];
            return natures[Math.floor(Math.random() * natures.length)];
        }
    }
};

export { command };
