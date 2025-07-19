
export const command = {
    name: 'slots',
    aliases: ['slot', 'slotmachine'],
    description: 'Play the slot machine with random win multipliers',
    usage: 'slots [bet_amount]',
    category: 'games',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const playerStats = dataManager.getPlayerStats(sender);
        const walletGold = playerStats.gold || 0;
        const bet = parseInt(args.trim()) || 10;

        if (bet < 1) {
            await sock.sendMessage(from, {
                text: '❌ Minimum bet is 1 gold!',
                quoted: msg
            });
            return;
        }

        if (bet > walletGold) {
            await sock.sendMessage(from, {
                text: `❌ You don't have enough gold! You have ${walletGold} gold in wallet.`,
                quoted: msg
            });
            return;
        }

        // 70% win rate for balanced gameplay
        const isWin = Math.random() < 0.7;
        const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
        
        let reel1, reel2, reel3, winMultiplier = 0, winType = '';

        if (isWin) {
            // Random multipliers: 2x, 3x, 5x, 7x
            const multipliers = [2, 3, 5, 7];
            winMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
            
            // Generate winning combination
            const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel1 = reel2 = reel3 = winSymbol;
            
            switch (winSymbol) {
                case '🍒': winType = 'Three Cherries!'; break;
                case '🍋': winType = 'Three Lemons!'; break;
                case '🍊': winType = 'Three Oranges!'; break;
                case '🍇': winType = 'Three Grapes!'; break;
                case '⭐': winType = 'Three Stars!'; break;
                case '💎': winType = 'JACKPOT - Three Diamonds!'; break;
                case '7️⃣': winType = 'MEGA JACKPOT - Lucky Sevens!'; break;
            }
        } else {
            // Generate losing combination
            reel1 = symbols[Math.floor(Math.random() * symbols.length)];
            reel2 = symbols[Math.floor(Math.random() * symbols.length)];
            reel3 = symbols[Math.floor(Math.random() * symbols.length)];
            
            // Ensure it's not a winning combination
            while (reel1 === reel2 && reel2 === reel3) {
                reel3 = symbols[Math.floor(Math.random() * symbols.length)];
            }
        }

        const winAmount = Math.floor(bet * winMultiplier);
        const netGain = winAmount - bet;
        
        // Update player gold
        playerStats.gold = walletGold + netGain;
        dataManager.setPlayerStats(sender, playerStats);

        let resultText = `🎰 **SLOT MACHINE** 🎰\n\n`;
        resultText += `┌─────────────┐\n`;
        resultText += `│  ${reel1}  ${reel2}  ${reel3}  │\n`;
        resultText += `└─────────────┘\n\n`;

        if (winMultiplier > 0) {
            resultText += `🎉 **${winType}**\n`;
            resultText += `🎯 **${winMultiplier}x Multiplier!**\n`;
            resultText += `💰 You won ${winAmount} gold! (+${netGain})\n`;
        } else {
            resultText += `💸 No match... You lost ${bet} gold!\n`;
        }

        resultText += `\n💰 **Balance:** ${playerStats.gold} gold`;

        if (playerStats.gold < 10) {
            resultText += `\n\n💡 **Low funds!** Use .daily to earn more gold!`;
        }

        await sock.sendMessage(from, {
            text: resultText,
            contextInfo: {
                externalAdReply: {
                    title: 'Slot Machine',
                    body: winMultiplier > 0 ? `Won ${winAmount} gold! (${winMultiplier}x)` : `Lost ${bet} gold`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=slot',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            },
            quoted: msg
        });
    }
};
