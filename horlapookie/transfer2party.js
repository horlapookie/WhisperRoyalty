
const command = {
    name: 'transfer2party',
    aliases: ['addtoparty'],
    description: 'Transfer Pokemon from PC to battle party',
    usage: 'transfer2party <number>',
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
                text: '❌ Please specify a Pokemon number!\n\n📝 **Example:** .transfer2party 1'
            });
            return;
        }
        
        const allPokemon = dataManager.getPlayerPokemon(sender);
        const playerParty = getPlayerParty(sender);
        
        if (playerParty.length >= 4) {
            await sock.sendMessage(from, {
                text: '❌ Your party is full! (4/4 Pokemon)\n\nUse `.transfer2pc <number>` to move a Pokemon to PC first.'
            });
            return;
        }
        
        const partyIds = playerParty.map(p => p.id);
        const pcPokemon = allPokemon.filter(p => !partyIds.includes(p.id));
        const pokemonIndex = pokemonNumber - 1;
        
        if (pokemonIndex < 0 || pokemonIndex >= pcPokemon.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid Pokemon number! You have ${pcPokemon.length} Pokemon in PC storage.`
            });
            return;
        }
        
        const pokemon = pcPokemon[pokemonIndex];
        
        // Add to party in player stats
        const stats = dataManager.getPlayerStats(sender);
        if (!stats.party) stats.party = [];
        stats.party.push(pokemon.id);
        dataManager.setPlayerStats(sender, stats);
        
        await sock.sendMessage(from, {
            text: `✅ **Pokemon Transferred to Party!**\n\n🎯 **${pokemon.nickname}** has been added to your party!\n\n**${pokemon.nickname}** (Lv.${pokemon.level})\n${pokemon.type} • HP: ${pokemon.hp}/${pokemon.maxHp}\n\n📊 **Party Status:** ${playerParty.length + 1}/4 Pokemon\n\n💡 Your Pokemon is now ready for battle!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Transferred',
                    body: `${pokemon.nickname} added to party`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=534',
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
