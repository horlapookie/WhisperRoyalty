export const command = {
    name: 'pokedex',
    aliases: ['pc', 'pokemoncollection', 'mypokemon'],
    description: 'View your complete Pokemon collection and trainer data',
    category: 'games',
    usage: '.pokedex [page] or .pokedex [pokemon_name]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Initialize storage
        const dataManager = global.dataManager;
        const collection = dataManager.getPlayerPokemon(sender);
        const stats = dataManager.getPlayerStats(sender);

        if (collection.length === 0) {
            await sock.sendMessage(from, {
                text: '📱 **Your Pokedex is Empty!**\n\n❌ You haven\'t caught any Pokemon yet!\n\n💡 Use .spawnpokemon to find wild Pokemon and .catch to catch them!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Empty Pokedex',
                        body: 'Catch some Pokemon first!',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=501',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        if (args && args.trim()) {
            const searchTerm = args.trim();

            // Check if it's a number (page)
            if (!isNaN(searchTerm)) {
                const page = parseInt(searchTerm);
                await showPokemonList(sock, from, sender, collection, stats, page);
            } else {
                // Search for specific Pokemon
                const pokemon = collection.find(p => 
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    p.nickname.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (pokemon) {
                    await showPokemonDetails(sock, from, pokemon);
                } else {
                    await sock.sendMessage(from, {
                        text: `❌ Pokemon "${searchTerm}" not found in your collection!`
                    });
                }
            }
        } else {
            await showPokemonList(sock, from, sender, collection, stats, 1);
        }

        async function showPokemonList(sock, from, sender, collection, stats, page = 1) {
            const itemsPerPage = 8;
            const totalPages = Math.ceil(collection.length / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageItems = collection.slice(startIndex, endIndex);

            // Get party Pokemon IDs for display
            const partyIds = stats.party || [];

            // Calculate collection stats
            const rarityCount = {
                'Common': collection.filter(p => p.rarity === 'Common').length,
                'Uncommon': collection.filter(p => p.rarity === 'Uncommon').length,
                'Rare': collection.filter(p => p.rarity === 'Rare').length,
                'Legendary': collection.filter(p => p.rarity === 'Legendary').length
            };

            let pokemonList = `📱 **Complete Pokedex** (Page ${page}/${totalPages})\n\n👤 **Trainer:** @${sender.split('@')[0]}\n📊 **Total Pokemon:** ${collection.length}\n🎯 **Party:** ${partyIds.length}/4 Pokemon\n\n**📈 Collection Stats:**\n• Common: ${rarityCount.Common} 🟢\n• Uncommon: ${rarityCount.Uncommon} 🔵\n• Rare: ${rarityCount.Rare} 🟣\n• Legendary: ${rarityCount.Legendary} 🟡\n\n**🏆 Trainer Progress:**\n• Battles: ${stats.battles || 0} (${stats.wins || 0}W/${stats.losses || 0}L)\n• Pokemon Caught: ${stats.pokemonCaught || 0}\n• Trivia Points: ${stats.triviaPoints || 0}\n\n**📋 Pokemon Collection:**\n\n`;

            pageItems.forEach((pokemon, index) => {
                const globalIndex = startIndex + index + 1;
                const isInParty = partyIds.includes(pokemon.id);
                const statusIcon = isInParty ? '🎯' : '💻';
                const hpPercent = (pokemon.hp / pokemon.maxHp) * 100;
                const stars = '⭐'.repeat(getRarityStars(pokemon.rarity));

                pokemonList += `${globalIndex}. ${statusIcon} **${pokemon.nickname}** ${stars}\n`;
                pokemonList += `   ${pokemon.type} | Level ${pokemon.level}\n`;
                pokemonList += `   HP: ${pokemon.hp}/${pokemon.maxHp} (${hpPercent.toFixed(0)}%)\n\n`;
            });

            if (totalPages > 1) {
                pokemonList += `\n📄 Use .pokedex ${page + 1} for next page`;
            }

            pokemonList += `\n\n💡 **Commands:**\n• .pokedex <pokemon_name> - View details\n• .pvp party - Manage battle party\n• .pvp pc - View PC storage\n\n🎯 Party Pokemon | 💻 PC Storage`;

            await sock.sendMessage(from, {
                text: pokemonList,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: 'Complete Pokemon Collection',
                        body: `${collection.length} Pokemon | ${partyIds.length}/4 in party`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=502',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }

        async function showPokemonDetails(sock, from, pokemon) {
            const stars = '⭐'.repeat(getRarityStars(pokemon.rarity));
            const expProgress = pokemon.expToNext ? (pokemon.exp / pokemon.expToNext * 100).toFixed(1) : '0.0';
            const stats = dataManager.getPlayerStats(sender);
            const isInParty = (stats.party || []).includes(pokemon.id);

            await sock.sendMessage(from, {
                text: `📋 **Pokemon Details**\n\n**${pokemon.nickname}** ${stars}\n${isInParty ? '🎯 **In Battle Party**' : '💻 **In PC Storage**'}\n\n**Basic Info:**\n• Species: ${pokemon.name}\n• Type: ${pokemon.type}\n• Level: ${pokemon.level}\n• Rarity: ${pokemon.rarity}\n• Nature: ${pokemon.nature || 'Unknown'}\n\n**Stats:**\n• HP: ${pokemon.hp}/${pokemon.maxHp}\n• Attack: ${pokemon.attack}\n• Defense: ${pokemon.defense}\n• Speed: ${pokemon.speed}\n\n**Experience:**\n• EXP: ${pokemon.exp || 0}/${pokemon.expToNext || 'Max'}\n• Progress: ${expProgress}%\n\n**Moves:**\n${pokemon.moves ? pokemon.moves.map((move, i) => `${i + 1}. ${move.name} (${move.type})`).join('\n') : 'No moves learned'}\n\n**Trainer Info:**\n• Caught: ${new Date(pokemon.caughtAt).toLocaleDateString()}\n• Happiness: ${pokemon.happiness || 50}/100\n• ID: ${pokemon.id}\n\n🎮 **Available Commands:**\n• .pvp ${isInParty ? 'transfer2pc' : 'transfer2party'} <number> - Move Pokemon\n• .pvp heal - Heal all party Pokemon`,
                contextInfo: {
                    externalAdReply: {
                        title: `${pokemon.nickname} Details`,
                        body: `Level ${pokemon.level} ${pokemon.type} | ${pokemon.rarity}`,
                        thumbnailUrl: pokemon.image || 'https://picsum.photos/300/300?random=503',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }

        function getRarityStars(rarity) {
            const rarityStars = {
                'Common': 1,
                'Uncommon': 2,
                'Rare': 3,
                'Legendary': 5
            };
            return rarityStars[rarity] || 1;
        }
    }
};