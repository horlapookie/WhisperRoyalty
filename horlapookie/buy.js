
export const command = {
    name: 'buy',
    aliases: ['purchase', 'shop'],
    description: 'Buy pokeballs and items with gold',
    usage: 'buy <item> [quantity]',
    category: 'economy',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: `🛒 **Pokemon Shop**\n\n**🟢 Pokeballs Available:**\n• miniball - 50 gold (15% catch rate)\n• pokeball - 100 gold (45% catch rate)\n• ultraball - 200 gold (65% catch rate)\n• masterball - 500 gold (100% catch rate)\n\n**📝 Usage:**\n• .buy pokeball 5 - Buy 5 pokeballs\n• .buy masterball - Buy 1 masterball\n\n💰 Use .bank to check your balance!`
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const item = argsArray[0].toLowerCase();
        const quantity = parseInt(argsArray[1]) || 1;
        
        const shop = {
            miniball: { name: 'Miniball', price: 50, rate: 15 },
            pokeball: { name: 'Pokeball', price: 100, rate: 45 },
            ultraball: { name: 'Ultraball', price: 200, rate: 65 },
            masterball: { name: 'Masterball', price: 500, rate: 100 }
        };
        
        if (!shop[item]) {
            await sock.sendMessage(from, {
                text: `❌ **Item not found!**\n\nAvailable items: ${Object.keys(shop).join(', ')}\n\n💡 Use .buy to see the shop menu!`
            });
            return;
        }
        
        if (quantity <= 0 || quantity > 100) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid quantity!** Please specify 1-100 items.'
            });
            return;
        }
        
        const itemData = shop[item];
        const totalCost = itemData.price * quantity;
        const playerStats = dataManager.getPlayerStats(sender);
        const playerGold = playerStats.gold || 0;
        
        if (playerGold < totalCost) {
            await sock.sendMessage(from, {
                text: `❌ **Insufficient funds!**\n\n💰 **Cost:** ${totalCost} gold\n💳 **Your Gold:** ${playerGold} gold\n💸 **Needed:** ${totalCost - playerGold} gold\n\n💡 Use .daily to earn more gold!`
            });
            return;
        }
        
        // Process purchase
        playerStats.gold = playerGold - totalCost;
        playerStats.pokeballs = playerStats.pokeballs || {};
        playerStats.pokeballs[item] = (playerStats.pokeballs[item] || 0) + quantity;
        dataManager.savePlayerStats(sender, playerStats);
        
        await sock.sendMessage(from, {
            text: `✅ **Purchase Successful!**\n\n🛒 **Bought:** ${quantity}x ${itemData.name}\n💰 **Cost:** ${totalCost} gold\n💳 **Remaining Gold:** ${playerStats.gold} gold\n\n📦 **Your Pokeballs:**\n${Object.entries(playerStats.pokeballs).map(([type, count]) => `• ${shop[type]?.name || type}: ${count}`).join('\n')}\n\n🎮 Use .spawnpokemon to find Pokemon to catch!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Purchase Complete',
                    body: `${quantity}x ${itemData.name} | ${playerStats.gold} gold left`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=602',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
