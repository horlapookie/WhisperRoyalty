const command = {
    name: 'givepoke',
    aliases: ['givepokemon', 'sendpoke'],
    description: 'Give a Pokemon to another user',
    usage: 'givepoke @user <number> | Reply to message: givepoke <number> | givepoke <phone_number> <number>',
    category: 'pokemon',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        // Check if in battle
        if (global.battles && global.battles.has(from)) {
            const currentBattle = global.battles.get(from);
            if (currentBattle.status === 'active') {
                await sock.sendMessage(from, {
                    text: '❌ Cannot give Pokemon during battle!'
                });
                return;
            }
        }

        // Get target user from different methods
        let targetUser = null;
        let pokemonNumber = null;

        // Method 1: Check if replying to someone's message
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            targetUser = msg.message.extendedTextMessage.contextInfo.participant;
            pokemonNumber = parseInt(args.trim());
        }
        // Method 2: Check if mentioned someone
        else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
            targetUser = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            const argsArray = args.trim().split(' ');
            pokemonNumber = parseInt(argsArray[1]);
        }
        // Method 3: Check if phone number is provided in arguments
        else {
            const argsArray = args.trim().split(' ');
            if (argsArray[0] && argsArray[0].match(/^\d{10,15}$/)) {
                // If first argument is a phone number (10-15 digits)
                targetUser = argsArray[0] + '@s.whatsapp.net';
                pokemonNumber = parseInt(argsArray[1]);
            }
        }

        if (!targetUser) {
            await sock.sendMessage(from, {
                text: '❌ Please specify who to give Pokemon to!\n\n📝 **Methods:**\n• Reply to their message: .givepoke 1\n• Mention them: .givepoke @username 1\n• Use their number: .givepoke 2347049044897 1\n\n💡 Use .pc to see your Pokemon numbers!'
            });
            return;
        }

        if (targetUser === sender) {
            await sock.sendMessage(from, {
                text: '❌ You cannot give Pokemon to yourself!'
            });
            return;
        }

        if (isNaN(pokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a valid Pokemon number!\n\n📝 **Example:** .givepoke @username 1\n\n💡 Use .pc to see your Pokemon list'
            });
            return;
        }

        const allPokemon = dataManager.getPlayerPokemon(sender);
        const pokemonIndex = pokemonNumber - 1;

        if (pokemonIndex < 0 || pokemonIndex >= allPokemon.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid Pokemon number! You have ${allPokemon.length} Pokemon total.\n\n💡 Use .pc to see your Pokemon list`
            });
            return;
        }

        const pokemon = allPokemon[pokemonIndex];

        // Transfer Pokemon
        pokemon.trainerId = targetUser;
        pokemon.giftedFrom = sender;
        pokemon.giftedAt = Date.now();

        // Remove from sender's collection
        const updatedSenderPokemon = allPokemon.filter(p => p.id !== pokemon.id);
        dataManager.setPlayerPokemon(sender, updatedSenderPokemon);

        // Remove from party if it was in party
        const senderStats = dataManager.getPlayerStats(sender);
        if (senderStats.party && senderStats.party.includes(pokemon.id)) {
            senderStats.party = senderStats.party.filter(id => id !== pokemon.id);
            dataManager.setPlayerStats(sender, senderStats);
        }

        // Add to receiver's collection
        const receiverPokemon = dataManager.getPlayerPokemon(targetUser);
        receiverPokemon.push(pokemon);
        dataManager.setPlayerPokemon(targetUser, receiverPokemon);

        // Update gift stats
        senderStats.pokemonGifted = (senderStats.pokemonGifted || 0) + 1;
        dataManager.setPlayerStats(sender, senderStats);

        const receiverStats = dataManager.getPlayerStats(targetUser);
        receiverStats.pokemonReceived = (receiverStats.pokemonReceived || 0) + 1;
        dataManager.setPlayerStats(targetUser, receiverStats);

        const senderName = msg.pushName || sender.split('@')[0];
        const receiverName = targetUser.split('@')[0];

        await sock.sendMessage(from, {
            text: `🎁 **POKEMON GIVEN SUCCESSFULLY!**\n\n👤 **From:** **${senderName}**\n👤 **To:** **@${receiverName}**\n\n🎯 **Pokemon Given:** **${pokemon.nickname}** (${pokemon.name})\n⭐ **Level:** ${pokemon.level}\n🏷️ **Type:** ${pokemon.type}\n\n💝 ${pokemon.nickname} has found a new trainer!\n📊 Total Pokemon given: ${senderStats.pokemonGifted}\n\n💡 Use .pc to see your updated collection!`,
            mentions: [targetUser],
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Gift Complete!',
                    body: `${pokemon.nickname} given to ${receiverName}`,
                    thumbnailUrl: pokemon.image || 'https://picsum.photos/300/300?random=540',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
    }
};

export { command };