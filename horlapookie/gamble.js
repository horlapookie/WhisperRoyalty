
export const command = {
    name: 'gamble',
    aliases: ['bet', 'roll'],
    description: 'Gamble your gold with dice roll',
    usage: 'gamble <amount>',
    category: 'games',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const amount = parseInt(args.trim());

        if (!amount || amount <= 0) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid bet amount!**\n\n📝 **Usage:** .gamble <amount>\n💡 **Example:** .gamble 50'
            });
            return;
        }

        const playerStats = dataManager.getPlayerStats(sender);
        const walletGold = playerStats.gold || 0;

        if (amount > walletGold) {
            await sock.sendMessage(from, {
                text: `❌ **Insufficient wallet funds!**\n\n💰 **Wallet:** ${walletGold} gold\n🎰 **Bet:** ${amount} gold\n💸 **Need:** ${amount - walletGold} more gold`
            });
            return;
        }

        // Roll dice (1-6 for player, 1-6 for house)
        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const houseRoll = Math.floor(Math.random() * 6) + 1;

        let winnings = 0;
        let multiplier = 0;
        let resultText = '';

        if (playerRoll > houseRoll) {
            // Random multipliers: 2x, 3x, 5x, 7x
            const multipliers = [2, 3, 5, 7];
            multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
            winnings = amount * multiplier;
            
            playerStats.gold = walletGold + winnings - amount;
            resultText = `🎲 **DICE GAMBLE** 🎲\n\n🎯 **You:** ${playerRoll} | **House:** ${houseRoll}\n\n🎉 **YOU WIN!**\n🎯 **${multiplier}x Multiplier!**\n💰 **Won:** ${winnings} gold (+${winnings - amount})\n💳 **Balance:** ${playerStats.gold} gold`;
        } else if (playerRoll < houseRoll) {
            playerStats.gold = walletGold - amount;
            resultText = `🎲 **DICE GAMBLE** 🎲\n\n🎯 **You:** ${playerRoll} | **House:** ${houseRoll}\n\n💸 **YOU LOSE!**\n💔 **Lost:** ${amount} gold\n💳 **Balance:** ${playerStats.gold} gold`;
        } else {
            // Tie - return bet
            resultText = `🎲 **DICE GAMBLE** 🎲\n\n🎯 **You:** ${playerRoll} | **House:** ${houseRoll}\n\n🤝 **TIE!**\n↩️ **Bet returned:** ${amount} gold\n💳 **Balance:** ${playerStats.gold} gold`;
        }

        dataManager.savePlayerStats(sender, playerStats);

        await sock.sendMessage(from, {
            text: resultText,
            contextInfo: {
                externalAdReply: {
                    title: 'Dice Gamble',
                    body: playerRoll > houseRoll ? `Won ${winnings} gold! (${multiplier}x)` : playerRoll < houseRoll ? `Lost ${amount} gold` : 'Tie - Bet returned',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=dice',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            },
            quoted: msg
        });
    }
};
