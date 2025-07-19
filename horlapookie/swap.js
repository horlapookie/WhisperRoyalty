
const command = {
    name: 'swap',
    aliases: ['switch', 'reorder'],
    description: 'Swap positions of Pokemon in your party',
    usage: 'swap <position1> <position2>',
    category: 'pokemon',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        // Check if in battle
        if (global.battles && global.battles.has(from)) {
            const currentBattle = global.battles.get(from);
            if (currentBattle.status === 'active') {
                await sock.sendMessage(from, {
                    text: '❌ Cannot swap Pokemon positions during battle!'
                });
                return;
            }
        }
        
        const argsArray = args.trim().split(' ');
        if (argsArray.length !== 2) {
            await sock.sendMessage(from, {
                text: '❌ Please specify two positions to swap!\n\n📝 **Example:** .swap 1 4\n💡 This swaps Pokemon in position 1 with position 4'
            });
            return;
        }
        
        const pos1 = parseInt(argsArray[0]);
        const pos2 = parseInt(argsArray[1]);
        
        if (isNaN(pos1) || isNaN(pos2)) {
            await sock.sendMessage(from, {
                text: '❌ Please provide valid position numbers!\n\n📝 **Example:** .swap 1 4'
            });
            return;
        }
        
        const playerParty = getPlayerParty(sender);
        
        if (playerParty.length < 2) {
            await sock.sendMessage(from, {
                text: '❌ You need at least 2 Pokemon in your party to swap positions!'
            });
            return;
        }
        
        const index1 = pos1 - 1;
        const index2 = pos2 - 1;
        
        if (index1 < 0 || index1 >= playerParty.length || index2 < 0 || index2 >= playerParty.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid positions! Your party has ${playerParty.length} Pokemon (positions 1-${playerParty.length})`
            });
            return;
        }
        
        if (index1 === index2) {
            await sock.sendMessage(from, {
                text: '❌ Cannot swap a Pokemon with itself!'
            });
            return;
        }
        
        // Get the Pokemon IDs to swap
        const pokemon1 = playerParty[index1];
        const pokemon2 = playerParty[index2];
        
        // Update party order in stats
        const stats = dataManager.getPlayerStats(sender);
        if (!stats.party) stats.party = [];
        
        // Swap the positions in the party array
        const temp = stats.party[index1];
        stats.party[index1] = stats.party[index2];
        stats.party[index2] = temp;
        
        dataManager.setPlayerStats(sender, stats);
        
        await sock.sendMessage(from, {
            text: `✅ **Pokemon Positions Swapped!**\n\n🔄 **${pokemon1.nickname}** (Position ${pos1}) ↔️ **${pokemon2.nickname}** (Position ${pos2})\n\n📊 **Updated Party Order:**\n${getPlayerParty(sender).map((p, i) => `${i + 1}. **${p.nickname}** (${p.name})`).join('\n')}\n\n💡 Use .pvpparty to see your complete party!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Positions Swapped',
                    body: `${pokemon1.nickname} ↔️ ${pokemon2.nickname}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=540',
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
    }
};

export { command };
