
const command = {
    name: 'pvpleaderboard',
    aliases: ['leaderboard', 'battleboard', 'rankings'],
    description: 'View the Pokemon battle leaderboard',
    usage: 'pvpleaderboard',
    category: 'pokemon',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const dataManager = global.dataManager;

        const leaderboardData = dataManager.getBattleLeaderboard();
        const leaderboard = Object.entries(leaderboardData)
            .map(([playerId, stats]) => ({ playerId, ...stats }))
            .sort((a, b) => (b.wins || 0) - (a.wins || 0) || ((b.wins || 0) / Math.max(b.battles || 1, 1)) - ((a.wins || 0) / Math.max(a.battles || 1, 1)))
            .slice(0, 10);

        if (leaderboard.length === 0) {
            await sock.sendMessage(from, {
                text: '📊 **Pokemon Battle Leaderboard**\n\n❌ No battles have been fought yet!\n\n🎮 Start battling with .pvp challenge @user',
                contextInfo: {
                    externalAdReply: {
                        title: 'Empty Leaderboard',
                        body: 'No battles yet',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=513',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        let leaderboardText = '🏆 **POKEMON BATTLE LEADERBOARD**\n\n';

        leaderboard.forEach((entry, index) => {
            const wins = entry.wins || 0;
            const battles = entry.battles || 0;
            const winRate = battles > 0 ? ((wins / battles) * 100).toFixed(1) : '0.0';
            const rank = getRankEmoji(index + 1);
            const phoneNumber = entry.playerId.split('@')[0];

            leaderboardText += `${rank} **#${index + 1}** +${phoneNumber}\n`;
            leaderboardText += `   🏆 ${wins}W/${entry.losses || 0}L (${winRate}%)\n`;
            leaderboardText += `   🎖️ ${getBattleRank(wins)}\n\n`;
        });

        leaderboardText += `🎮 **Battle to climb the ranks!**\n⚔️ Use .pvp challenge @user to battle`;

        await sock.sendMessage(from, {
            text: leaderboardText,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Battle Leaderboard',
                    body: 'Top trainers ranking',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=513',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });

        function getRankEmoji(position) {
            const emojis = { 1: '🥇', 2: '🥈', 3: '🥉' };
            return emojis[position] || '🏅';
        }

        function getBattleRank(wins) {
            if (wins >= 100) return 'Pokemon Master 🏆';
            if (wins >= 50) return 'Elite Four 👑';
            if (wins >= 25) return 'Gym Leader 🥇';
            if (wins >= 15) return 'Ace Trainer 🥈';
            if (wins >= 10) return 'Veteran Trainer 🥉';
            if (wins >= 5) return 'Pokemon Trainer 🎖️';
            return 'Rookie 🆕';
        }
    }
};

export { command };
