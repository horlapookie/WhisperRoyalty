
export const command = {
    name: 'mart-buy',
    aliases: ['mbuy', 'mart-purchase'],
    description: 'Buy items/Pokemon from mart by number',
    usage: 'mart-buy <number> [quantity]',
    category: 'economy',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const argsArray = args.trim().split(' ');
        const itemNumber = parseInt(argsArray[0]);
        const quantity = parseInt(argsArray[1]) || 1;
        
        if (!itemNumber || itemNumber < 1) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid item number!**\n\n📝 **Usage:** .mart-buy <number> [quantity]\n💡 Use .mart items or .mart pokemon to see numbered lists'
            });
            return;
        }
        
        // Mart inventory
        const martItems = {
            miniball: { name: 'Miniball', price: 50, category: 'pokeball', description: '15% catch rate' },
            pokeball: { name: 'Pokeball', price: 100, category: 'pokeball', description: '45% catch rate' },
            ultraball: { name: 'Ultraball', price: 200, category: 'pokeball', description: '65% catch rate' },
            masterball: { name: 'Masterball', price: 500, category: 'pokeball', description: '100% catch rate' },
            potion: { name: 'Potion', price: 200, category: 'healing', description: 'Heals 20 HP' },
            superpotion: { name: 'Super Potion', price: 700, category: 'healing', description: 'Heals 50 HP' },
            hyperpotion: { name: 'Hyper Potion', price: 1200, category: 'healing', description: 'Heals 100 HP' },
            fullrestore: { name: 'Full Restore', price: 3000, category: 'healing', description: 'Fully heals Pokemon' },
            xattack: { name: 'X Attack', price: 500, category: 'battle', description: 'Boosts attack in battle' },
            xdefense: { name: 'X Defense', price: 550, category: 'battle', description: 'Boosts defense in battle' },
            xspeed: { name: 'X Speed', price: 350, category: 'battle', description: 'Boosts speed in battle' },
            firestone: { name: 'Fire Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' },
            waterstone: { name: 'Water Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' },
            thunderstone: { name: 'Thunder Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' },
            leafstone: { name: 'Leaf Stone', price: 2000, category: 'evolution', description: 'Evolves certain Pokemon' }
        };
        
        // Pokemon for sale
        const martPokemon = {
            tier1: [
                { name: 'Magikarp', price: 1000, level: 100, type: 'Water', rarity: 'Common' },
                { name: 'Caterpie', price: 1200, level: 100, type: 'Bug', rarity: 'Common' },
                { name: 'Pidgey', price: 1500, level: 100, type: 'Normal/Flying', rarity: 'Common' },
                { name: 'Rattata', price: 1300, level: 100, type: 'Normal', rarity: 'Common' }
            ],
            tier2: [
                { name: 'Psyduck', price: 3500, level: 100, type: 'Water', rarity: 'Uncommon' },
                { name: 'Machop', price: 4000, level: 100, type: 'Fighting', rarity: 'Uncommon' },
                { name: 'Slowpoke', price: 3800, level: 100, type: 'Water/Psychic', rarity: 'Uncommon' },
                { name: 'Ponyta', price: 4500, level: 100, type: 'Fire', rarity: 'Uncommon' }
            ],
            tier3: [
                { name: 'Pikachu', price: 8000, level: 100, type: 'Electric', rarity: 'Rare' },
                { name: 'Eevee', price: 10000, level: 100, type: 'Normal', rarity: 'Rare' },
                { name: 'Lapras', price: 12000, level: 100, type: 'Water/Ice', rarity: 'Rare' },
                { name: 'Snorlax', price: 15000, level: 100, type: 'Normal', rarity: 'Rare' }
            ],
            tier4: [
                { name: 'Charizard', price: 20000, level: 100, type: 'Fire/Flying', rarity: 'Epic' },
                { name: 'Blastoise', price: 18000, level: 100, type: 'Water', rarity: 'Epic' },
                { name: 'Venusaur', price: 18000, level: 100, type: 'Grass/Poison', rarity: 'Epic' },
                { name: 'Gengar', price: 22000, level: 100, type: 'Ghost/Poison', rarity: 'Epic' }
            ],
            tier5: [
                { name: 'Articuno', price: 50000, level: 100, type: 'Ice/Flying', rarity: 'Legendary' },
                { name: 'Zapdos', price: 50000, level: 100, type: 'Electric/Flying', rarity: 'Legendary' },
                { name: 'Moltres', price: 50000, level: 100, type: 'Fire/Flying', rarity: 'Legendary' },
                { name: 'Dragonite', price: 45000, level: 100, type: 'Dragon/Flying', rarity: 'Legendary' }
            ]
        };
        
        // Create numbered arrays
        const itemArray = [];
        const categories = ['pokeball', 'healing', 'battle', 'evolution'];
        
        categories.forEach(category => {
            Object.entries(martItems).filter(([key, item]) => item.category === category)
                .forEach(([key, item]) => {
                    itemArray.push({ key, ...item, type: 'item' });
                });
        });
        
        const pokemonArray = [];
        Object.values(martPokemon).forEach(tier => {
            tier.forEach(pokemon => {
                pokemonArray.push({ ...pokemon, type: 'pokemon' });
            });
        });
        
        const allItems = [...itemArray, ...pokemonArray];
        
        if (itemNumber > allItems.length) {
            await sock.sendMessage(from, {
                text: `❌ **Item number ${itemNumber} not found!**\n\n📋 **Available items:** 1-${allItems.length}\n💡 Use .mart items or .mart pokemon to see the list`
            });
            return;
        }
        
        const selectedItem = allItems[itemNumber - 1];
        const playerStats = dataManager.getPlayerStats(sender);
        const playerGold = playerStats.gold || 0;
        
        if (selectedItem.type === 'item') {
            // Buying item
            if (quantity <= 0 || quantity > 50) {
                await sock.sendMessage(from, {
                    text: '❌ Invalid quantity! Please specify 1-50 items.'
                });
                return;
            }
            
            const totalCost = selectedItem.price * quantity;
            
            if (playerGold < totalCost) {
                await sock.sendMessage(from, {
                    text: `❌ **Insufficient funds!**\n\n💰 **Cost:** ${totalCost} gold\n💳 **Your Gold:** ${playerGold} gold\n💸 **Needed:** ${totalCost - playerGold} gold`
                });
                return;
            }
            
            // Process purchase
            playerStats.gold = playerGold - totalCost;
            playerStats.inventory = playerStats.inventory || {};
            playerStats.inventory[selectedItem.key] = (playerStats.inventory[selectedItem.key] || 0) + quantity;
            
            if (selectedItem.category === 'pokeball') {
                if (typeof playerStats.pokeballs !== 'object' || playerStats.pokeballs === null) {
                    playerStats.pokeballs = {};
                }
                playerStats.pokeballs[selectedItem.key] = (playerStats.pokeballs[selectedItem.key] || 0) + quantity;
            }
            
            dataManager.savePlayerStats(sender, playerStats);
            
            await sock.sendMessage(from, {
                text: `✅ **Purchase Successful!**\n\n🛒 **Bought:** ${quantity}x ${selectedItem.name}\n💰 **Cost:** ${totalCost} gold\n💳 **Remaining Gold:** ${playerStats.gold} gold\n\n📦 **Item Added to Inventory!**`
            });
            
        } else {
            // Buying Pokemon
            if (playerGold < selectedItem.price) {
                await sock.sendMessage(from, {
                    text: `❌ **Insufficient funds!**\n\n💰 **Cost:** ${selectedItem.price} gold\n💳 **Your Gold:** ${playerGold} gold\n💸 **Needed:** ${selectedItem.price - playerGold} gold`
                });
                return;
            }
            
            // Create Pokemon (same logic as mart.js)
            const newPokemon = {
                id: Date.now() + Math.random(),
                name: selectedItem.name.toLowerCase(),
                nickname: selectedItem.name,
                level: selectedItem.level,
                type: selectedItem.type,
                rarity: selectedItem.rarity,
                hp: 100,
                maxHp: 100,
                attack: 80 + selectedItem.level,
                defense: 70 + selectedItem.level,
                speed: 60 + selectedItem.level,
                experience: 0,
                happiness: 100,
                nature: 'Hardy',
                moves: ['Tackle', 'Quick Attack', 'Body Slam', 'Hyper Beam'],
                trainerId: sender,
                caughtAt: Date.now(),
                isShiny: Math.random() < 0.01,
                boughtFrom: 'mart'
            };
            
            const playerPokemon = dataManager.getPlayerPokemon(sender);
            playerPokemon.push(newPokemon);
            dataManager.setPlayerPokemon(sender, playerPokemon);
            
            playerStats.gold = playerGold - selectedItem.price;
            playerStats.pokemonBought = (playerStats.pokemonBought || 0) + 1;
            dataManager.savePlayerStats(sender, playerStats);
            
            const shinyText = newPokemon.isShiny ? ' ✨**SHINY**✨' : '';
            
            await sock.sendMessage(from, {
                text: `🎉 **POKEMON PURCHASED!**${shinyText}\n\n🛒 **Bought:** ${selectedItem.name} (Level ${selectedItem.level})\n💰 **Cost:** ${selectedItem.price} gold\n💳 **Remaining Gold:** ${playerStats.gold} gold\n\n📊 **Pokemon Details:**\n• **Type:** ${selectedItem.type}\n• **Rarity:** ${selectedItem.rarity}\n• **Level:** ${selectedItem.level}\n• **HP:** ${newPokemon.hp}/${newPokemon.maxHp}\n\n💡 Use .pc to see your new Pokemon!`
            });
        }
    }
};
