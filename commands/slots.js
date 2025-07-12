
export const command = {
    name: 'slots',
    aliases: ['slot', 'slotmachine'],
    description: 'Play the slot machine',
    usage: 'slots [bet_amount]',
    category: 'gaming',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Initialize player coins
        if (!global.playerCoins) global.playerCoins = new Map();
        
        let playerCoins = global.playerCoins.get(sender) || 100; // Start with 100 coins
        const bet = parseInt(args.trim()) || 10;

        if (bet < 1) {
            await sock.sendMessage(from, {
                text: '❌ Minimum bet is 1 coin!',
                quoted: msg
            });
            return;
        }

        if (bet > playerCoins) {
            await sock.sendMessage(from, {
                text: `❌ You don't have enough coins! You have ${playerCoins} coins.`,
                quoted: msg
            });
            return;
        }

        const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
        const weights = [30, 25, 20, 15, 7, 2, 1]; // Rarity weights

        // Weighted random selection
        const getRandomSymbol = () => {
            const totalWeight = weights.reduce((sum, w) => sum + w, 0);
            let random = Math.random() * totalWeight;
            
            for (let i = 0; i < symbols.length; i++) {
                random -= weights[i];
                if (random <= 0) return symbols[i];
            }
            return symbols[0];
        };

        const reel1 = getRandomSymbol();
        const reel2 = getRandomSymbol();
        const reel3 = getRandomSymbol();

        let winMultiplier = 0;
        let winType = '';

        // Check for wins
        if (reel1 === reel2 && reel2 === reel3) {
            // Three of a kind
            switch (reel1) {
                case '🍒': winMultiplier = 3; winType = 'Three Cherries!'; break;
                case '🍋': winMultiplier = 4; winType = 'Three Lemons!'; break;
                case '🍊': winMultiplier = 5; winType = 'Three Oranges!'; break;
                case '🍇': winMultiplier = 8; winType = 'Three Grapes!'; break;
                case '⭐': winMultiplier = 15; winType = 'Three Stars!'; break;
                case '💎': winMultiplier = 50; winType = 'JACKPOT - Three Diamonds!'; break;
                case '7️⃣': winMultiplier = 100; winType = 'MEGA JACKPOT - Lucky Sevens!'; break;
            }
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            // Two of a kind
            winMultiplier = 1.5;
            winType = 'Two of a kind!';
        }

        const winAmount = Math.floor(bet * winMultiplier);
        const netGain = winAmount - bet;
        
        playerCoins += netGain;
        global.playerCoins.set(sender, Math.max(0, playerCoins));

        let resultText = `🎰 **SLOT MACHINE** 🎰\n\n`;
        resultText += `┌─────────────┐\n`;
        resultText += `│  ${reel1}  ${reel2}  ${reel3}  │\n`;
        resultText += `└─────────────┘\n\n`;

        if (winMultiplier > 0) {
            resultText += `🎉 **${winType}**\n`;
            resultText += `💰 You won ${winAmount} coins! (+${netGain})\n`;
        } else {
            resultText += `💸 No match... You lost ${bet} coins!\n`;
        }

        resultText += `\n💰 **Balance:** ${playerCoins} coins`;

        if (playerCoins === 0) {
            resultText += `\n\n🎁 **Bankrupt Bonus!** You've been given 50 coins to continue playing!`;
            global.playerCoins.set(sender, 50);
        }

        await sock.sendMessage(from, {
            text: resultText,
            contextInfo: {
                externalAdReply: {
                    title: 'Slot Machine',
                    body: winMultiplier > 0 ? `Won ${winAmount} coins!` : `Lost ${bet} coins`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=slot',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            },
            quoted: msg
        });
    }
};
