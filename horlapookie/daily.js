
export const command = {
    name: 'daily',
    aliases: ['dailyreward', 'claim'],
    description: 'Claim your daily gold reward',
    usage: 'daily',
    category: 'economy',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const playerStats = dataManager.getPlayerStats(sender);
        const now = Date.now();
        const lastDaily = playerStats.lastDaily || 0;
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - lastDaily < cooldown) {
            const timeLeft = cooldown - (now - lastDaily);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            
            await sock.sendMessage(from, {
                text: `⏰ **Daily Cooldown**\n\n❌ You already claimed your daily reward!\n\n⏳ **Time until next claim:** ${hoursLeft}h ${minutesLeft}m\n\n💡 Come back tomorrow for more gold!`
            });
            return;
        }
        
        // Calculate reward based on level/streak
        const streak = (playerStats.dailyStreak || 0) + 1;
        const baseReward = 100;
        const streakBonus = Math.min(streak * 10, 200); // Max 200 bonus
        const totalReward = baseReward + streakBonus;
        
        // Update player data
        playerStats.gold = (playerStats.gold || 0) + totalReward;
        playerStats.lastDaily = now;
        playerStats.dailyStreak = streak;
        dataManager.savePlayerStats(sender, playerStats);
        
        await sock.sendMessage(from, {
            text: `🎁 **Daily Reward Claimed!**\n\n💰 **Gold Earned:** ${totalReward} gold\n📈 **Daily Streak:** ${streak} days\n🔥 **Streak Bonus:** +${streakBonus} gold\n\n💳 **New Balance:** ${playerStats.gold} gold\n\n✨ Keep claiming daily to increase your streak bonus!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Daily Reward',
                    body: `+${totalReward} gold | ${streak} day streak`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=601',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
