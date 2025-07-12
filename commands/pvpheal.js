
const command = {
    name: 'pvpheal',
    aliases: ['heal', 'healparty'],
    description: 'Heal all Pokemon in your party',
    usage: 'pvpheal',
    category: 'pokemon',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        const playerParty = getPlayerParty(sender);

        if (playerParty.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ No Pokemon in your party to heal!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Empty Party',
                        body: 'Add Pokemon to your party first',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=530',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Check cooldown (5 minutes)
        const stats = dataManager.getPlayerStats(sender);
        const lastHeal = stats.lastHeal || 0;
        const cooldownTime = 5 * 60 * 1000; // 5 minutes
        const timeLeft = cooldownTime - (Date.now() - lastHeal);

        if (timeLeft > 0) {
            const minutes = Math.ceil(timeLeft / 60000);
            await sock.sendMessage(from, {
                text: `⏰ Healing is on cooldown! Wait ${minutes} minutes before healing again.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Healing Cooldown',
                        body: `${minutes} minutes remaining`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=531',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Heal all party Pokemon
        const allPokemon = dataManager.getPlayerPokemon(sender);
        playerParty.forEach(partyPokemon => {
            const pokemonIndex = allPokemon.findIndex(p => p.id === partyPokemon.id);
            if (pokemonIndex !== -1) {
                allPokemon[pokemonIndex].hp = allPokemon[pokemonIndex].maxHp;
            }
        });

        dataManager.setPlayerPokemon(sender, allPokemon);

        // Update last heal time
        stats.lastHeal = Date.now();
        dataManager.setPlayerStats(sender, stats);

        await sock.sendMessage(from, {
            text: `💚 **PARTY POKEMON HEALED!**\n\n✨ All Pokemon in your party have been fully healed!\n\n🏥 **Healed Pokemon:** ${playerParty.length}\n⏰ **Next heal available in:** 5 minutes\n\n🎮 Your party is ready for battle!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Party Healed',
                    body: `${playerParty.length} Pokemon restored`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=509',
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
