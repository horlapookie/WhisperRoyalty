
export const command = {
    name: 'bank',
    aliases: ['balance', 'bal'],
    description: 'Check your bank balance and total wealth',
    usage: 'bank',
    category: 'economy',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const playerStats = dataManager.getPlayerStats(sender);
        const wallet = playerStats.gold || 0;
        const bank = playerStats.bankGold || 0;
        const total = wallet + bank;
        
        await sock.sendMessage(from, {
            text: `🏦 **Bank Statement**\n\n👤 **Account Holder:** @${sender.split('@')[0]}\n\n💰 **Wallet:** ${wallet} gold\n🏛️ **Bank:** ${bank} gold\n📊 **Total Worth:** ${total} gold\n\n💡 **Tips:**\n• Use .deposit <amount> to store gold safely\n• Use .withdraw <amount> to take gold out\n• Bank gold is safe from being robbed!`,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: 'Bank Balance',
                    body: `Total: ${total} gold`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=600',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
