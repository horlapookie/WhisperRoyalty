
const command = {
    name: 'pvpstats',
    aliases: ['stats', 'mystats', 'battlestats'],
    description: 'View your Pokemon battle statistics',
    usage: 'pvpstats',
    category: 'pokemon',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const stats = dataManager.getPlayerStats(sender);
        const winRate = (stats.battles || 0) > 0 ? (((stats.wins || 0) / stats.battles) * 100).toFixed(1) : 0;
        const allPokemon = dataManager.getPlayerPokemon(sender);
        const playerParty = getPlayerParty(sender);

        const trainerName = msg.pushName || sender.split('@')[0];

        await sock.sendMessage(from, {
            text: `📊 **Pokemon Trainer Statistics**\n\n👤 **Trainer:** **${trainerName}**\n\n**🏆 Battle Records:**\n• **Wins:** ${stats.wins || 0}\n• **Losses:** ${stats.losses || 0}\n• **Total Battles:** ${stats.battles || 0}\n• **Win Rate:** ${winRate}%\n\n**📱 Pokemon Collection:**\n• **Total Pokemon:** ${allPokemon.length}\n• **Party Pokemon:** ${playerParty.length}/4\n• **PC Pokemon:** ${allPokemon.length - playerParty.length}\n• **Pokemon Caught:** ${stats.pokemonCaught || 0}\n\n**🎖️ Trainer Info:**\n• **Battle Rank:** ${getBattleRank(stats.wins || 0)}\n• **Battle Points:** ${(stats.wins || 0) * 50}\n• **Trainer Level:** ${Math.floor((stats.wins || 0) / 5) + 1}`,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: 'Trainer Statistics',
                    body: `${stats.wins || 0}W/${stats.losses || 0}L - ${winRate}% WR`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=512',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });

        function getPlayerParty(playerId) {
            const stats = dataManager.getPlayerStats(playerId);
            if (!stats.party) stats.party = [];

            const allPokemon = dataManager.getPlayerPokemon(playerId);
            return allPokemon.filter(pokemon => stats.party.includes(pokemon.id));
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
