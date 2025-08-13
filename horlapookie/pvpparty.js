
const command = {
    name: 'pvpparty',
    aliases: ['party', 'battleparty'],
    description: 'View your Pokemon battle party',
    usage: 'pvpparty',
    category: 'pokemon',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const playerParty = getPlayerParty(sender);
        
        if (playerParty.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ Your party is empty!\n\n🎮 Use `.transfer2party <number>` to add Pokemon to your party!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Empty Party',
                        body: 'Add Pokemon to your party',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=530',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const trainerName = msg.pushName || sender.split('@')[0];
        let partyText = `👥 **Your Pokemon Party**\n\n👤 **Trainer:** **${trainerName}**\n🎯 **Party Size:** ${playerParty.length}/4\n\n`;
        
        playerParty.forEach((pokemon, index) => {
            const hpPercent = (pokemon.hp / pokemon.maxHp) * 100;
            const stars = '⭐'.repeat(getRarityStars(pokemon.rarity));
            partyText += `${index + 1}. **${pokemon.nickname}** ${stars}\n`;
            partyText += `   ${pokemon.type} | Level ${pokemon.level}\n`;
            partyText += `   HP: ${pokemon.hp}/${pokemon.maxHp} (${hpPercent.toFixed(0)}%)\n`;
            partyText += `   ATK: ${pokemon.attack} | DEF: ${pokemon.defense} | SPD: ${pokemon.speed}\n\n`;
        });
        
        partyText += `🎮 **Commands:**\n• .transfer2pc <1-4> - Move Pokemon to PC\n• .pvp heal - Heal party Pokemon\n• .pvp challenge @user - Start PvP battle\n• .pve - Start PvE battle`;
        
        await sock.sendMessage(from, {
            text: partyText,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Party',
                    body: `${playerParty.length}/4 Pokemon ready`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=531',
                    sourceUrl: 'https://github.com',
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
