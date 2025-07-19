
export const command = {
    name: 'withdraw',
    aliases: ['wd', 'takeout'],
    description: 'Withdraw gold from your bank to wallet',
    usage: 'withdraw <amount>',
    category: 'economy',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const amount = parseInt(args.trim());

        if (!amount || amount <= 0) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid amount!**\n\n📝 **Usage:** .withdraw <amount>\n💡 **Example:** .withdraw 100'
            });
            return;
        }

        const playerStats = dataManager.getPlayerStats(sender);
        const bankGold = playerStats.bankGold || 0;
        const walletGold = playerStats.gold || 0;

        if (amount > bankGold) {
            await sock.sendMessage(from, {
                text: `❌ **Insufficient bank funds!**\n\n🏛️ **Bank Balance:** ${bankGold} gold\n💰 **Requested:** ${amount} gold\n💸 **Short by:** ${amount - bankGold} gold`
            });
            return;
        }

        // Process withdrawal
        playerStats.bankGold = bankGold - amount;
        playerStats.gold = walletGold + amount;
        dataManager.savePlayerStats(sender, playerStats);

        await sock.sendMessage(from, {
            text: `✅ **Withdrawal Successful!**\n\n💸 **Withdrawn:** ${amount} gold\n💰 **Wallet:** ${playerStats.gold} gold\n🏛️ **Bank:** ${playerStats.bankGold} gold\n📊 **Total Worth:** ${playerStats.gold + playerStats.bankGold} gold`,
            contextInfo: {
                externalAdReply: {
                    title: 'Bank Withdrawal',
                    body: `${amount} gold withdrawn to wallet`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=bank',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
