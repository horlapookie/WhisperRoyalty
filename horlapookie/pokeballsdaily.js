
export const command = {
    name: 'pokeballsdaily',
    aliases: ['pdaily', 'pokeballs', 'dailypokeballs'],
    description: 'Claim your daily pokeballs',
    category: 'pokemon',
    usage: '.pokeballsdaily',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        // Get player stats
        const playerStats = dataManager.getPlayerStats(sender);
        
        // Check if already claimed today
        const now = new Date();
        const today = now.toDateString();
        const lastClaim = playerStats.lastPokeballClaim ? new Date(playerStats.lastPokeballClaim).toDateString() : null;

        if (lastClaim === today) {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeUntilReset = tomorrow.getTime() - now.getTime();
            const hoursLeft = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

            await sock.sendMessage(from, {
                text: `❌ **ALREADY CLAIMED TODAY!**\n\n🕐 **Next claim available in:** ${hoursLeft}h ${minutesLeft}m\n\n💼 **Current Pokeballs:** ${playerStats.pokeballs || 0}\n\n💡 Come back tomorrow for more pokeballs!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Daily Pokeballs Already Claimed',
                        body: `Next claim in ${hoursLeft}h ${minutesLeft}m`,
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Calculate daily pokeballs (base 10 + bonus)
        const baseAmount = 10;
        const streakBonus = Math.min(Math.floor((playerStats.dailyStreak || 0) / 7), 5); // +1 per week, max +5
        const levelBonus = Math.floor((playerStats.pokemonCaught || 0) / 50); // +1 per 50 caught
        const dailyAmount = baseAmount + streakBonus + levelBonus;

        // Update player data
        playerStats.pokeballs = (playerStats.pokeballs || 0) + dailyAmount;
        playerStats.lastPokeballClaim = now.getTime();
        playerStats.dailyStreak = (playerStats.dailyStreak || 0) + 1;
        playerStats.totalPokeballsClaimed = (playerStats.totalPokeballsClaimed || 0) + dailyAmount;
        
        dataManager.setPlayerStats(sender, playerStats);

        // Send real pokeball image
        try {
            await sock.sendMessage(from, {
                image: { url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/items/poke-ball.png' },
                caption: `🔥 **DAILY POKEBALLS CLAIMED!**\n\n🎁 **Received:** ${dailyAmount} Pokeballs\n💼 **Total Pokeballs:** ${playerStats.pokeballs}\n🔥 **Daily Streak:** ${playerStats.dailyStreak} days\n\n**Bonus Breakdown:**\n• Base Amount: ${baseAmount}\n• Streak Bonus: +${streakBonus}\n• Level Bonus: +${levelBonus}\n\n✨ Come back tomorrow for more!\n🎯 Use pokeballs to catch Pokemon with higher success rates!`
            });
        } catch (error) {
            // Try alternative pokeball image
            try {
                await sock.sendMessage(from, {
                    image: { url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
                    caption: `🔥 **DAILY POKEBALLS CLAIMED!**\n\n🎁 **Received:** ${dailyAmount} Pokeballs\n💼 **Total Pokeballs:** ${playerStats.pokeballs}\n🔥 **Daily Streak:** ${playerStats.dailyStreak} days\n\n**Bonus Breakdown:**\n• Base Amount: ${baseAmount}\n• Streak Bonus: +${streakBonus}\n• Level Bonus: +${levelBonus}\n\n✨ Come back tomorrow for more!\n🎯 Use pokeballs to catch Pokemon with higher success rates!`
                });
            } catch (error2) {
                // Fallback to text if images fail
                await sock.sendMessage(from, {
                    text: `🔥 **DAILY POKEBALLS CLAIMED!**\n\n🎁 **Received:** ${dailyAmount} Pokeballs\n💼 **Total Pokeballs:** ${playerStats.pokeballs}\n🔥 **Daily Streak:** ${playerStats.dailyStreak} days\n\n**Bonus Breakdown:**\n• Base Amount: ${baseAmount}\n• Streak Bonus: +${streakBonus}\n• Level Bonus: +${levelBonus}\n\n✨ Come back tomorrow for more!\n🎯 Use pokeballs to catch Pokemon with higher success rates!`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Daily Pokeballs Claimed!',
                            body: `${dailyAmount} Pokeballs received`,
                            thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }
    }
};
