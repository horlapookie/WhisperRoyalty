
export const command = {
    name: 'pvpleaderboard',
    aliases: ['pvplb', 'battleboard', 'pvprank'],
    description: 'View PvP battle leaderboard',
    category: 'pokemon',
    usage: '.pvpleaderboard [top_number]',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const topCount = parseInt(args.trim()) || 10;
        const maxCount = Math.min(Math.max(topCount, 1), 25); // Limit between 1-25

        // Get all player data
        const allPlayerData = dataManager.getAllPlayerData();
        
        // Filter and sort players by PvP stats
        const pvpPlayers = Object.entries(allPlayerData)
            .map(([playerId, data]) => {
                const stats = data.stats || {};
                return {
                    id: playerId,
                    displayId: stats.username || playerId.split('@')[0] || playerId,
                    wins: stats.pvpWins || 0,
                    losses: stats.pvpLosses || 0,
                    battles: stats.pvpBattles || 0,
                    winStreak: stats.winStreak || 0,
                    winRate: stats.pvpBattles > 0 ? ((stats.pvpWins || 0) / stats.pvpBattles * 100).toFixed(1) : '0.0'
                };
            })
            .filter(player => player.battles > 0) // Only include players who have battled
            .sort((a, b) => {
                // Sort by wins first, then by win rate, then by win streak
                if (b.wins !== a.wins) return b.wins - a.wins;
                if (b.winRate !== a.winRate) return parseFloat(b.winRate) - parseFloat(a.winRate);
                return b.winStreak - a.winStreak;
            })
            .slice(0, maxCount);

        if (pvpPlayers.length === 0) {
            await sock.sendMessage(from, {
                text: '📊 **PvP LEADERBOARD**\n\n❌ No PvP battles have been recorded yet!\n\n💡 Use `.pvp challenge @user` to start battling!',
                contextInfo: {
                    externalAdReply: {
                        title: 'PvP Leaderboard',
                        body: 'No battles yet',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=leaderboard',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Find current user's position
        const userPosition = pvpPlayers.findIndex(p => p.id === sender) + 1;
        const userStats = dataManager.getPlayerStats(sender);

        let leaderboardText = `🏆 **PvP LEADERBOARD** (Top ${maxCount})\n\n`;

        pvpPlayers.forEach((player, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
            const isCurrentUser = player.id === sender ? '👤' : '';
            
            leaderboardText += `${medal} **#${rank}** ${player.displayId} ${isCurrentUser}\n`;
            leaderboardText += `   📊 ${player.wins}W-${player.losses}L (${player.winRate}%)\n`;
            leaderboardText += `   🔥 Streak: ${player.winStreak}\n\n`;
        });

        // Add user's stats if they're not in top list
        if (userPosition === 0 || userPosition > maxCount) {
            const myWins = userStats.pvpWins || 0;
            const myLosses = userStats.pvpLosses || 0;
            const myBattles = userStats.pvpBattles || 0;
            const myWinRate = myBattles > 0 ? (myWins / myBattles * 100).toFixed(1) : '0.0';
            const myStreak = userStats.winStreak || 0;

            leaderboardText += `━━━━━━━━━━━━━━━━━━━━\n`;
            leaderboardText += `👤 **Your Stats:**\n`;
            if (myBattles > 0) {
                const allPlayers = Object.entries(allPlayerData)
                    .filter(([_, data]) => (data.stats?.pvpBattles || 0) > 0)
                    .sort((a, b) => (b[1].stats?.pvpWins || 0) - (a[1].stats?.pvpWins || 0));
                const myRank = allPlayers.findIndex(([id]) => id === sender) + 1;
                
                leaderboardText += `🏅 Rank: #${myRank || 'Unranked'}\n`;
                leaderboardText += `📊 ${myWins}W-${myLosses}L (${myWinRate}%)\n`;
                leaderboardText += `🔥 Streak: ${myStreak}`;
            } else {
                leaderboardText += `📊 No battles yet\n💡 Use .pvp challenge @user to start!`;
            }
        }

        await sock.sendMessage(from, {
            text: leaderboardText,
            contextInfo: {
                externalAdReply: {
                    title: 'PvP Leaderboard',
                    body: `Top ${maxCount} PvP battlers`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=ranking',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
