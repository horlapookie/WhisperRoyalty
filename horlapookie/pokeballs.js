
export const command = {
    name: 'pokeballs',
    aliases: ['pstatus', 'pokeballstatus', 'ballstatus'],
    description: 'Check your pokeball inventory and stats',
    category: 'pokemon',
    usage: '.pokeballs',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const playerStats = dataManager.getPlayerStats(sender);
        const pokeballs = playerStats.pokeballs || 0;
        const totalClaimed = playerStats.totalPokeballsClaimed || 0;
        const pokeballCatches = playerStats.pokeballCatches || 0;
        const dailyStreak = playerStats.dailyStreak || 0;

        // Check when next daily claim is available
        const lastClaim = playerStats.lastPokeballClaim ? new Date(playerStats.lastPokeballClaim) : null;
        const now = new Date();
        const today = now.toDateString();
        const lastClaimDate = lastClaim ? lastClaim.toDateString() : null;
        
        let nextClaimInfo = '';
        if (lastClaimDate === today) {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeUntilReset = tomorrow.getTime() - now.getTime();
            const hoursLeft = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            nextClaimInfo = `🕐 **Next claim:** ${hoursLeft}h ${minutesLeft}m`;
        } else {
            nextClaimInfo = '✅ **Daily claim available now!**';
        }

        // Calculate success rate (pokeballs have 80% base rate)
        const totalCatches = playerStats.pokemonCaught || 0;
        const successRate = totalCatches > 0 ? ((pokeballCatches / totalCatches) * 100).toFixed(1) : 0;

        // Show pokeballs by type with numbers
        const playerBalls = playerStats.pokeballs || {};
        let ballsList = '';
        let ballCounter = 1;
        
        const ballTypes = {
            miniball: { name: 'Miniball', rate: '15%' },
            pokeball: { name: 'Pokeball', rate: '45%' },
            ultraball: { name: 'Ultraball', rate: '65%' },
            masterball: { name: 'Masterball', rate: '100%' }
        };
        
        Object.entries(ballTypes).forEach(([type, info]) => {
            const count = playerBalls[type] || 0;
            if (count > 0) {
                ballsList += `**${ballCounter}.** ${info.name}: ${count} (${info.rate} catch rate)\n`;
                ballCounter++;
            }
        });
        
        if (!ballsList) ballsList = 'No pokeballs available!\n';

        await sock.sendMessage(from, {
            text: `🎾 **POKEBALL INVENTORY**\n\n${ballsList}\n${nextClaimInfo}\n\n📊 **Statistics:**\n• Daily Streak: ${dailyStreak} days\n• Total Claimed: ${totalClaimed}\n• Pokeball Catches: ${pokeballCatches}/${totalCatches}\n• Success with Pokeballs: ${successRate}%\n\n💡 **Commands:**\n• \`.pokeballsdaily\` - Claim daily pokeballs\n• \`.use pokeball 1\` - Use pokeball by number\n• \`.pcatch\` - Use default pokeball`,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokeball Inventory',
                    body: `${pokeballs} pokeballs available`,
                    thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
