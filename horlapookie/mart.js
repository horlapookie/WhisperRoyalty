
export const command = {
    name: 'mart',
    aliases: ['shop', 'store', 'market'],
    description: 'Visit the Pokemon Mart to buy items and Pokemon',
    usage: 'mart [category] or mart buy <item/pokemon> [quantity]',
    category: 'economy',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const argsArray = args.trim().split(' ');
        const action = argsArray[0]?.toLowerCase();
        
        // Mart inventory
        const martItems = {
            // Pokeballs
            miniball: { name: 'Miniball', price: 50, category: 'pokeball', description: '15% catch rate' },
            pokeball: { name: 'Pokeball', price: 100, category: 'pokeball', description: '45% catch rate' },
            ultraball: { name: 'Ultraball', price: 200, category: 'pokeball', description: '65% catch rate' },
            masterball: { name: 'Masterball', price: 500, category: 'pokeball', description: '100% catch rate' },
            
            // Healing items
            potion: { name: 'Potion', price: 200, category: 'healing', description: 'Heals 20 HP' },
            superpotion: { name: 'Super Potion', price: 700, category: 'healing', description: 'Heals 50 HP' },
            hyperpotion: { name: 'Hyper Potion', price: 1200, category: 'healing', description: 'Heals 100 HP' },
            fullrestore: { name: 'Full Restore', price: 3000, category: 'healing', description: 'Fully heals Pokemon' },
            
            // Battle items
            xattack: { name: 'X Attack', price: 500, category: 'battle', description: 'Boosts attack in battle' },
            xdefense: { name: 'X Defense', price: 550, category: 'battle', description: 'Boosts defense in battle' },
            xspeed: { name: 'X Speed', price: 350, category: 'battle', description: 'Boosts speed in battle' },
            
            // Evolution items
            firestone: { name: 'Fire Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' },
            waterstone: { name: 'Water Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' },
            thunderstone: { name: 'Thunder Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' },
            leafstone: { name: 'Leaf Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' }
        };
        
        // Pokemon for sale (organized by tiers/prices)
        const martPokemon = {
            // Tier 1: Basic Pokemon (1000-3000 gold)
            tier1: [
                { name: 'Magikarp', price: 1000, level: 100, type: 'Water', rarity: 'Common' },
                { name: 'Caterpie', price: 1200, level: 100, type: 'Bug', rarity: 'Common' },
                { name: 'Pidgey', price: 1500, level: 100, type: 'Normal/Flying', rarity: 'Common' },
                { name: 'Rattata', price: 1300, level: 100, type: 'Normal', rarity: 'Common' }
            ],
            
            // Tier 2: Uncommon Pokemon (3000-7000 gold)
            tier2: [
                { name: 'Psyduck', price: 3500, level: 100, type: 'Water', rarity: 'Uncommon' },
                { name: 'Machop', price: 4000, level: 100, type: 'Fighting', rarity: 'Uncommon' },
                { name: 'Slowpoke', price: 3800, level: 100, type: 'Water/Psychic', rarity: 'Uncommon' },
                { name: 'Ponyta', price: 4500, level: 100, type: 'Fire', rarity: 'Uncommon' }
            ],
            
            // Tier 3: Rare Pokemon (7000-15000 gold)
            tier3: [
                { name: 'Pikachu', price: 8000, level: 100, type: 'Electric', rarity: 'Rare' },
                { name: 'Eevee', price: 10000, level: 100, type: 'Normal', rarity: 'Rare' },
                { name: 'Lapras', price: 12000, level: 100, type: 'Water/Ice', rarity: 'Rare' },
                { name: 'Snorlax', price: 15000, level: 100, type: 'Normal', rarity: 'Rare' }
            ],
            
            // Tier 4: Epic Pokemon (15000-30000 gold)
            tier4: [
                { name: 'Charizard', price: 20000, level: 100, type: 'Fire/Flying', rarity: 'Epic' },
                { name: 'Blastoise', price: 18000, level: 100, type: 'Water', rarity: 'Epic' },
                { name: 'Venusaur', price: 18000, level: 100, type: 'Grass/Poison', rarity: 'Epic' },
                { name: 'Gengar', price: 22000, level: 100, type: 'Ghost/Poison', rarity: 'Epic' }
            ],
            
            // Tier 5: Legendary Pokemon (30000+ gold)
            tier5: [
                { name: 'Articuno', price: 50000, level: 100, type: 'Ice/Flying', rarity: 'Legendary' },
                { name: 'Zapdos', price: 50000, level: 100, type: 'Electric/Flying', rarity: 'Legendary' },
                { name: 'Moltres', price: 50000, level: 100, type: 'Fire/Flying', rarity: 'Legendary' },
                { name: 'Dragonite', price: 45000, level: 100, type: 'Dragon/Flying', rarity: 'Legendary' }
            ]
        };
        
        if (action === 'buy') {
            const item = argsArray[1]?.toLowerCase();
            const quantity = parseInt(argsArray[2]) || 1;
            
            if (!item) {
                await sock.sendMessage(from, {
                    text: '❌ Please specify what to buy!\n\n📝 **Example:** .mart buy pokeball 5\n💡 Use .mart to see available items'
                });
                return;
            }
            
            const playerStats = dataManager.getPlayerStats(sender);
            const playerGold = playerStats.gold || 0;
            
            // Check if buying item
            if (martItems[item]) {
                const itemData = martItems[item];
                const totalCost = itemData.price * quantity;
                
                if (quantity <= 0 || quantity > 50) {
                    await sock.sendMessage(from, {
                        text: '❌ Invalid quantity! Please specify 1-50 items.'
                    });
                    return;
                }
                
                if (playerGold < totalCost) {
                    await sock.sendMessage(from, {
                        text: `❌ **Insufficient funds!**\n\n💰 **Cost:** ${totalCost} gold\n💳 **Your Gold:** ${playerGold} gold\n💸 **Needed:** ${totalCost - playerGold} gold`
                    });
                    return;
                }
                
                // Process purchase
                playerStats.gold = playerGold - totalCost;
                playerStats.inventory = playerStats.inventory || {};
                playerStats.inventory[item] = (playerStats.inventory[item] || 0) + quantity;
                
                // Special handling for pokeballs
                if (itemData.category === 'pokeball') {
                    playerStats.pokeballs = playerStats.pokeballs || {};
                    playerStats.pokeballs[item] = (playerStats.pokeballs[item] || 0) + quantity;
                }
                
                dataManager.savePlayerStats(sender, playerStats);
                
                await sock.sendMessage(from, {
                    text: `✅ **Purchase Successful!**\n\n🛒 **Bought:** ${quantity}x ${itemData.name}\n💰 **Cost:** ${totalCost} gold\n💳 **Remaining Gold:** ${playerStats.gold} gold\n\n📦 **Item Added to Inventory!**`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Mart Purchase Complete',
                            body: `${quantity}x ${itemData.name} purchased`,
                            thumbnailUrl: 'https://picsum.photos/300/300?random=603',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            // Check if buying Pokemon
            let foundPokemon = null;
            for (const tier in martPokemon) {
                foundPokemon = martPokemon[tier].find(p => p.name.toLowerCase() === item);
                if (foundPokemon) break;
            }
            
            if (foundPokemon) {
                if (playerGold < foundPokemon.price) {
                    await sock.sendMessage(from, {
                        text: `❌ **Insufficient funds!**\n\n💰 **Cost:** ${foundPokemon.price} gold\n💳 **Your Gold:** ${playerGold} gold\n💸 **Needed:** ${foundPokemon.price - playerGold} gold`
                    });
                    return;
                }
                
                // Create Pokemon
                const newPokemon = {
                    id: Date.now() + Math.random(),
                    name: foundPokemon.name.toLowerCase(),
                    nickname: foundPokemon.name,
                    level: foundPokemon.level,
                    type: foundPokemon.type,
                    rarity: foundPokemon.rarity,
                    hp: 100,
                    maxHp: 100,
                    attack: 80 + foundPokemon.level,
                    defense: 70 + foundPokemon.level,
                    speed: 60 + foundPokemon.level,
                    experience: 0,
                    happiness: 100,
                    nature: 'Hardy',
                    moves: ['Tackle', 'Quick Attack', 'Body Slam', 'Hyper Beam'],
                    trainerId: sender,
                    caughtAt: Date.now(),
                    isShiny: Math.random() < 0.01, // 1% shiny chance for bought Pokemon
                    boughtFrom: 'mart'
                };
                
                // Add to player's collection
                const playerPokemon = dataManager.getPlayerPokemon(sender);
                playerPokemon.push(newPokemon);
                dataManager.setPlayerPokemon(sender, playerPokemon);
                
                // Deduct gold
                playerStats.gold = playerGold - foundPokemon.price;
                playerStats.pokemonBought = (playerStats.pokemonBought || 0) + 1;
                dataManager.savePlayerStats(sender, playerStats);
                
                const shinyText = newPokemon.isShiny ? ' ✨**SHINY**✨' : '';
                
                await sock.sendMessage(from, {
                    text: `🎉 **POKEMON PURCHASED!**${shinyText}\n\n🛒 **Bought:** ${foundPokemon.name} (Level ${foundPokemon.level})\n💰 **Cost:** ${foundPokemon.price} gold\n💳 **Remaining Gold:** ${playerStats.gold} gold\n\n📊 **Pokemon Details:**\n• **Type:** ${foundPokemon.type}\n• **Rarity:** ${foundPokemon.rarity}\n• **Level:** ${foundPokemon.level}\n• **HP:** ${newPokemon.hp}/${newPokemon.maxHp}\n\n💡 Use .pc to see your new Pokemon!`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Pokemon Purchase Complete',
                            body: `${foundPokemon.name} Level ${foundPokemon.level} purchased`,
                            thumbnailUrl: 'https://picsum.photos/300/300?random=604',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            await sock.sendMessage(from, {
                text: `❌ Item or Pokemon "${item}" not found in mart!\n\n💡 Use .mart to see available items and Pokemon`
            });
            return;
        }
        
        // Show mart categories
        if (!action || action === 'items') {
            let itemsList = `🏪 **POKEMON MART - ITEMS**\n\n`;
            
            const categories = {
                'pokeball': '⚪ **Pokeballs**',
                'healing': '❤️ **Healing Items**',
                'battle': '⚔️ **Battle Items**',
                'evolution': '🔄 **Evolution Items**'
            };
            
            let itemCounter = 1;
            for (const [category, title] of Object.entries(categories)) {
                itemsList += `${title}\n`;
                const categoryItems = Object.entries(martItems).filter(([key, item]) => item.category === category);
                categoryItems.forEach(([key, item]) => {
                    itemsList += `**${itemCounter}.** ${item.name} - ${item.price} gold (${item.description})\n`;
                    itemCounter++;
                });
                itemsList += '\n';
            }
            
            itemsList += `💰 **Your Gold:** ${dataManager.getPlayerStats(sender).gold || 0}\n\n`;
            itemsList += `**📝 Usage:**\n• .mart-buy 1 [quantity] - Buy by number\n• .mart buy pokeball 5 - Buy by name\n• .mart pokemon - View Pokemon for sale`;
            
            await sock.sendMessage(from, {
                text: itemsList,
                contextInfo: {
                    externalAdReply: {
                        title: 'Pokemon Mart - Items',
                        body: 'Buy items and Pokemon with gold',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=605',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (action === 'pokemon') {
            const page = parseInt(argsArray[1]) || 1;
            const itemsPerPage = 10;
            
            // Flatten all Pokemon into one array with numbers
            const allPokemon = [];
            let counter = 1;
            
            Object.values(martPokemon).forEach(tier => {
                tier.forEach(pokemon => {
                    allPokemon.push({ ...pokemon, id: counter++ });
                });
            });
            
            const totalPages = Math.ceil(allPokemon.length / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageItems = allPokemon.slice(startIndex, endIndex);
            
            let pokemonList = `🏪 **POKEMON MART - PAGE ${page}/${totalPages}**\n\n`;
            
            pageItems.forEach(pokemon => {
                pokemonList += `**${pokemon.id}.** ${pokemon.name} - ${pokemon.price} gold (${pokemon.type})\n`;
            });
            
            pokemonList += `\n💰 **Your Gold:** ${dataManager.getPlayerStats(sender).gold || 0}\n\n`;
            pokemonList += `**📝 Usage:**\n• .mart pokemon [page] - Browse pages\n• .mart-buy ${pageItems[0]?.id || 1} - Buy by number\n• .mart buy <pokemon_name> - Buy by name\n\n**💡 All Pokemon are Level 100!**`;
            
            await sock.sendMessage(from, {
                text: pokemonList,
                contextInfo: {
                    externalAdReply: {
                        title: `Pokemon Mart - Page ${page}`,
                        body: `${allPokemon.length} Pokemon available`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=606',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        // Default mart overview
        const playerGold = dataManager.getPlayerStats(sender).gold || 0;
        
        await sock.sendMessage(from, {
            text: `🏪 **WELCOME TO POKEMON MART!**\n\n💰 **Your Gold:** ${playerGold}\n\n**📋 Available Categories:**\n• **Items** - Pokeballs, healing items, battle items\n• **Pokemon** - Level 100 Pokemon organized by tiers\n\n**🔍 Commands:**\n• .mart items - View all items\n• .mart pokemon - View Pokemon for sale\n• .mart buy <item> [quantity] - Purchase items\n• .mart buy <pokemon> - Purchase Pokemon\n\n**💡 All Pokemon come at Level 100 with maximum stats!**\n**✨ 1% chance for shiny Pokemon when purchasing!**`,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Mart',
                    body: 'Items & Level 100 Pokemon for sale',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=607',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
