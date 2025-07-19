
const command = {
    name: 'trade-confirm',
    aliases: ['tradeconfirm', 'confirntrade', 'accepttrade'],
    description: 'Confirm and accept a Pokemon trade proposal',
    usage: 'trade-confirm',
    category: 'pokemon',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        if (!global.trades) global.trades = new Map();
        
        const pendingTradeId = global.trades.get(`pending_${sender}`);
        if (!pendingTradeId) {
            await sock.sendMessage(from, {
                text: '❌ You have no pending trade proposals!\n\n💡 Someone needs to send you a trade proposal first using `.trade @you <number> <number>`'
            });
            return;
        }
        
        const trade = global.trades.get(pendingTradeId);
        if (!trade || trade.receiver !== sender) {
            await sock.sendMessage(from, {
                text: '❌ Invalid trade proposal!'
            });
            return;
        }
        
        // Check if Pokemon still exist in both parties
        const initiatorParty = getPlayerParty(trade.initiator);
        const receiverParty = getPlayerParty(trade.receiver);
        
        const initiatorPokemon = initiatorParty.find(p => p.id === trade.initiatorPokemon.id);
        const receiverPokemon = receiverParty.find(p => p.id === trade.receiverPokemon.id);
        
        if (!initiatorPokemon || !receiverPokemon) {
            await sock.sendMessage(from, {
                text: '❌ One of the Pokemon in the trade is no longer available!'
            });
            global.trades.delete(pendingTradeId);
            global.trades.delete(`pending_${sender}`);
            return;
        }
        
        // Execute the trade
        const initiatorStats = dataManager.getPlayerStats(trade.initiator);
        const receiverStats = dataManager.getPlayerStats(trade.receiver);
        
        // Update trainer IDs and ownership
        initiatorPokemon.trainerId = trade.receiver;
        receiverPokemon.trainerId = trade.initiator;
        initiatorPokemon.tradedFrom = trade.initiator;
        receiverPokemon.tradedFrom = trade.receiver;
        initiatorPokemon.tradedAt = Date.now();
        receiverPokemon.tradedAt = Date.now();
        
        // Swap Pokemon in parties
        const initiatorPartyIndex = initiatorStats.party.indexOf(trade.initiatorPokemon.id);
        const receiverPartyIndex = receiverStats.party.indexOf(trade.receiverPokemon.id);
        
        if (initiatorPartyIndex !== -1) {
            initiatorStats.party[initiatorPartyIndex] = receiverPokemon.id;
        }
        if (receiverPartyIndex !== -1) {
            receiverStats.party[receiverPartyIndex] = initiatorPokemon.id;
        }
        
        // Update Pokemon collections
        const initiatorCollection = dataManager.getPlayerPokemon(trade.initiator);
        const receiverCollection = dataManager.getPlayerPokemon(trade.receiver);
        
        // Remove Pokemon from original collections
        const updatedInitiatorCollection = initiatorCollection.filter(p => p.id !== trade.initiatorPokemon.id);
        const updatedReceiverCollection = receiverCollection.filter(p => p.id !== trade.receiverPokemon.id);
        
        // Add traded Pokemon to new collections
        updatedInitiatorCollection.push(receiverPokemon);
        updatedReceiverCollection.push(initiatorPokemon);
        
        // Save all changes
        dataManager.setPlayerPokemon(trade.initiator, updatedInitiatorCollection);
        dataManager.setPlayerPokemon(trade.receiver, updatedReceiverCollection);
        dataManager.setPlayerStats(trade.initiator, initiatorStats);
        dataManager.setPlayerStats(trade.receiver, receiverStats);
        
        // Update trade stats
        initiatorStats.tradesCompleted = (initiatorStats.tradesCompleted || 0) + 1;
        receiverStats.tradesCompleted = (receiverStats.tradesCompleted || 0) + 1;
        dataManager.setPlayerStats(trade.initiator, initiatorStats);
        dataManager.setPlayerStats(trade.receiver, receiverStats);
        
        const initiatorName = trade.initiator.split('@')[0];
        const receiverName = trade.receiver.split('@')[0];
        
        await sock.sendMessage(from, {
            text: `✅ **TRADE COMPLETED!**\n\n🎉 **Successful Pokemon Trade**\n\n**Trade Summary:**\n👤 **${initiatorName}** received: **${initiatorPokemon.nickname}** (${initiatorPokemon.name}) Level ${initiatorPokemon.level}\n👤 **${receiverName}** received: **${receiverPokemon.nickname}** (${receiverPokemon.name}) Level ${receiverPokemon.level}\n\n💝 Both Pokemon have found new trainers!\n📊 Total trades completed: ${initiatorStats.tradesCompleted || 1}\n\n💡 Use .pvpparty to see your updated team!`,
            mentions: [trade.initiator],
            contextInfo: {
                externalAdReply: {
                    title: 'Trade Completed!',
                    body: `${receiverPokemon.nickname} ↔️ ${initiatorPokemon.nickname}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=541',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
        
        // Clean up trade
        global.trades.delete(pendingTradeId);
        global.trades.delete(`pending_${sender}`);
        
        function getPlayerParty(playerId) {
            const stats = dataManager.getPlayerStats(playerId);
            if (!stats.party) stats.party = [];
            
            const allPokemon = dataManager.getPlayerPokemon(playerId);
            return allPokemon.filter(pokemon => stats.party.includes(pokemon.id));
        }
    }
};

export { command };
