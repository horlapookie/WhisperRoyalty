
const command = {
    name: 'pokemongift',
    aliases: ['gift', 'pokegift', 'sendpokemon'],
    description: 'Gift a Pokemon to another user',
    usage: 'pokemongift @user <pokemon_number>',
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
                    text: '❌ Cannot gift Pokemon during battle!'
                });
                return;
            }
        }
        
        // Check if mentioned user exists
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentioned) {
            await sock.sendMessage(from, {
                text: '❌ Please mention someone to gift Pokemon to!\n\n📝 **Example:** .pokemongift @username 1',
                contextInfo: {
                    externalAdReply: {
                        title: 'Pokemon Gift System',
                        body: 'Mention someone to gift Pokemon',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=540',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (mentioned === sender) {
            await sock.sendMessage(from, {
                text: '❌ You cannot gift Pokemon to yourself!'
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const pokemonNumber = parseInt(argsArray[1]);
        
        if (isNaN(pokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a valid Pokemon number!\n\n📝 **Example:** .pokemongift @username 1\n\n💡 Use .pc to see your Pokemon list'
            });
            return;
        }
        
        const senderPokemon = dataManager.getPlayerPokemon(sender);
        const pokemonIndex = pokemonNumber - 1;
        
        if (pokemonIndex < 0 || pokemonIndex >= senderPokemon.length) {
            await sock.sendMessage(from, {
                text: `❌ Invalid Pokemon number! You have ${senderPokemon.length} Pokemon.\n\n💡 Use .pc to see your Pokemon list`
            });
            return;
        }
        
        const pokemon = senderPokemon[pokemonIndex];
        
        // Check if Pokemon is in party
        const senderStats = dataManager.getPlayerStats(sender);
        if (senderStats.party && senderStats.party.includes(pokemon.id)) {
            await sock.sendMessage(from, {
                text: '❌ Cannot gift Pokemon that is in your battle party!\n\n🎮 Use `.transfer2pc <number>` to move it to PC first.'
            });
            return;
        }
        
        // Remove Pokemon from sender
        const updatedSenderPokemon = senderPokemon.filter(p => p.id !== pokemon.id);
        dataManager.setPlayerPokemon(sender, updatedSenderPokemon);
        
        // Add Pokemon to recipient
        const recipientPokemon = dataManager.getPlayerPokemon(mentioned);
        const giftedPokemon = {
            ...pokemon,
            trainerId: mentioned,
            giftedFrom: sender,
            giftedAt: Date.now()
        };
        
        recipientPokemon.push(giftedPokemon);
        dataManager.setPlayerPokemon(mentioned, recipientPokemon);
        
        // Update stats
        const recipientStats = dataManager.getPlayerStats(mentioned);
        recipientStats.pokemonReceived = (recipientStats.pokemonReceived || 0) + 1;
        dataManager.setPlayerStats(mentioned, recipientStats);
        
        senderStats.pokemonGifted = (senderStats.pokemonGifted || 0) + 1;
        dataManager.setPlayerStats(sender, senderStats);
        
        // Get user names
        const senderName = msg.pushName || sender.split('@')[0];
        const recipientName = mentioned.split('@')[0];
        
        await sock.sendMessage(from, {
            text: `🎁 **POKEMON GIFT SUCCESSFUL!**\n\n👤 **From:** ${senderName}\n👤 **To:** @${recipientName}\n\n🎊 **Gift Details:**\n• **Pokemon:** ${pokemon.nickname} (${pokemon.name})\n• **Level:** ${pokemon.level}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n\n💝 **${pokemon.nickname}** has been successfully gifted!\n\n📊 **Your Stats:**\n• Pokemon Gifted: ${senderStats.pokemonGifted}\n• Remaining Pokemon: ${updatedSenderPokemon.length}`,
            mentions: [mentioned],
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Gift Complete!',
                    body: `${pokemon.nickname} gifted to ${recipientName}`,
                    thumbnailUrl: pokemon.image,
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
        
        // Send notification to recipient (if they're in the same group)
        if (isGroup) {
            setTimeout(async () => {
                await sock.sendMessage(from, {
                    text: `🎉 **@${recipientName}** - You received a Pokemon gift!\n\n🎁 **${pokemon.nickname}** (${pokemon.name}) from **${senderName}**\n\n💡 Use .pc to see your new Pokemon!`,
                    mentions: [mentioned]
                });
            }, 2000);
        }
    }
};

export { command };
