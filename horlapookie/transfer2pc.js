
const command = {
    name: 'transfer2pc',
    aliases: ['movetopc'],
    description: 'Transfer Pokemon from battle party to PC',
    usage: 'transfer2pc <number>',
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
                    text: '❌ Cannot transfer Pokemon during battle!'
                });
                return;
            }
        }
        
        const pokemonNumber = parseInt(args.trim());
        if (isNaN(pokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a Pokemon number!\n\n📝 **Example:** .transfer2pc 1'
            });
            return;
        }
        
        const playerParty = getPlayerParty(sender);
        const pokemonIndex = pokemonNumber - 1;
        
        if (pokemonIndex < 0 || pokemonIndex >= playerParty.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid Pokemon number! You have ${playerParty.length} Pokemon in your party.`
            });
            return;
        }
        
        const pokemon = playerParty[pokemonIndex];
        
        // Remove from party in player stats
        const stats = dataManager.getPlayerStats(sender);
        if (!stats.party) stats.party = [];
        stats.party = stats.party.filter(id => id !== pokemon.id);
        dataManager.setPlayerStats(sender, stats);
        
        await sock.sendMessage(from, {
            text: `✅ **Pokemon Transferred to PC!**\n\n💻 **${pokemon.nickname}** has been moved to PC storage!\n\n📊 **Party Status:** ${playerParty.length - 1}/4 Pokemon\n\n💡 You can transfer it back anytime with `.transfer2party <number>``,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Transferred',
                    body: `${pokemon.nickname} moved to PC`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=535',
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
    }
};

export { command };
