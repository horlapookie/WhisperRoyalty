
const command = {
    name: 'trade-delete',
    aliases: ['tradedelete', 'declinetrade', 'canceltrade'],
    description: 'Decline a Pokemon trade proposal',
    usage: 'trade-delete',
    category: 'pokemon',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!global.trades) global.trades = new Map();
        
        const pendingTradeId = global.trades.get(`pending_${sender}`);
        if (!pendingTradeId) {
            await sock.sendMessage(from, {
                text: '❌ You have no pending trade proposals to decline!'
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
        
        const initiatorName = trade.initiator.split('@')[0];
        const receiverName = trade.receiver.split('@')[0];
        
        await sock.sendMessage(from, {
            text: `❌ **TRADE DECLINED**\n\n**@${receiverName}** declined the Pokemon trade with **${initiatorName}**\n\n**Declined Trade:**\n🚫 ${trade.initiatorPokemon.nickname} ↔️ ${trade.receiverPokemon.nickname}\n\n💡 You can propose a different trade anytime!`,
            mentions: [trade.initiator],
            contextInfo: {
                externalAdReply: {
                    title: 'Trade Declined',
                    body: `${receiverName} declined the trade`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=542',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
        
        // Clean up trade
        global.trades.delete(pendingTradeId);
        global.trades.delete(`pending_${sender}`);
    }
};

export { command };
