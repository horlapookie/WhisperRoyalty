const command = {
    name: 'pc',
    aliases: ['pcstorage', 'pokemonpc'],
    description: 'View your Pokemon PC storage',
    usage: 'pc',
    category: 'pokemon',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const allPokemon = dataManager.getPlayerPokemon(sender);
        const playerParty = getPlayerParty(sender);
        const partyIds = playerParty.map(p => p.id);
        const pcPokemon = allPokemon.filter(p => !partyIds.includes(p.id));

        if (pcPokemon.length === 0) {
            await sock.sendMessage(from, {
                text: '💻 **Pokemon PC Storage**\n\n❌ No Pokemon in PC storage!\n\nAll your Pokemon are either in your party or you haven\'t caught any yet.',
                contextInfo: {
                    externalAdReply: {
                        title: 'Empty PC Storage',
                        body: 'No Pokemon in storage',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=532',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        const trainerName = msg.pushName || sender.split('@')[0];
        let pcText = `💻 **Pokemon PC Storage**\n\n👤 **Trainer:** **${trainerName}**\n📦 **Pokemon in PC:** ${pcPokemon.length}\n📊 **Party:** ${playerParty.length}/4\n\n`;

        pcPokemon.forEach((pokemon, index) => {
            const hpPercent = (pokemon.hp / pokemon.maxHp) * 100;
            const stars = '⭐'.repeat(getRarityStars(pokemon.rarity));
            pcText += `${index + 1}. **${pokemon.nickname}** ${stars}\n`;
            pcText += `   ${pokemon.type} | Level ${pokemon.level}\n`;
            pcText += `   HP: ${pokemon.hp}/${pokemon.maxHp} (${hpPercent.toFixed(0)}%)\n\n`;
        });

        pcText += `🎮 **Commands:**\n• .transfer2party <number> - Move Pokemon to party\n• .party - View your battle party`;

        await sock.sendMessage(from, {
            text: pcText,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon PC Storage',
                    body: `${pcPokemon.length} Pokemon in storage`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=533',
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

        function getRarityStars(rarity) {
            const rarityStars = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Legendary': 5 };
            return rarityStars[rarity] || 1;
        }
    }
};

export { command };