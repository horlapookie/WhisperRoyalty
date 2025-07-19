
const command = {
    name: 'cancel-evolution',
    aliases: ['cancelevo', 'noevolve'],
    description: 'Cancel Pokemon evolution when it reaches level 50',
    usage: 'cancel-evolution <number>',
    category: 'pokemon',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        const pokemonNumber = parseInt(args.trim());
        if (isNaN(pokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a Pokemon number!\n\n📝 **Example:** .cancel-evolution 1'
            });
            return;
        }
        
        const collection = dataManager.getPlayerPokemon(sender);
        const pokemonIndex = pokemonNumber - 1;
        
        if (pokemonIndex < 0 || pokemonIndex >= collection.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid Pokemon number! You have ${collection.length} Pokemon.`
            });
            return;
        }
        
        const pokemon = collection[pokemonIndex];
        
        if (pokemon.level < 50) {
            await sock.sendMessage(from, {
                text: `❌ **${pokemon.nickname}** is only level ${pokemon.level}. Evolution only happens at level 50!`
            });
            return;
        }
        
        // Mark as evolution cancelled
        pokemon.evolutionCancelled = true;
        collection[pokemonIndex] = pokemon;
        dataManager.setPlayerPokemon(sender, collection);
        
        await sock.sendMessage(from, {
            text: `🚫 **Evolution Cancelled!**\n\n**${pokemon.nickname}** will not evolve and will remain in its current form.\n\n💡 You can still manually evolve it later with .evolve ${pokemonNumber}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Evolution Cancelled',
                    body: `${pokemon.nickname} stays the same`,
                    thumbnailUrl: pokemon.image,
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
    }
};

export { command };
