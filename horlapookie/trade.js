
const command = {
    name: 'trade',
    aliases: ['pokemontrade', 'tradepoke'],
    description: 'Trade Pokemon with another user',
    usage: 'trade @user <your_pokemon_number> <their_pokemon_number>',
    category: 'pokemon',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;
        
        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ Pokemon trading is only available in groups!'
            });
            return;
        }
        
        // Get target user from different methods
        let targetUser = null;
        let tradePokemonNumbers = [];
        
        // Method 1: Check if replying to someone's message
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            targetUser = msg.message.extendedTextMessage.contextInfo.participant;
            const argsArray = args.trim().split(' ');
            tradePokemonNumbers = argsArray.slice(0, 2); // Get first two numbers
        }
        // Method 2: Check if mentioned someone
        else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
            targetUser = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            const argsArray = args.trim().split(' ');
            tradePokemonNumbers = argsArray.slice(1, 3); // Skip mention, get next two numbers
        }
        // Method 3: Check if phone number is provided in arguments
        else {
            const argsArray = args.trim().split(' ');
            if (argsArray[0] && argsArray[0].match(/^\d{10,15}$/)) {
                // If first argument is a phone number (10-15 digits)
                targetUser = argsArray[0] + '@s.whatsapp.net';
                tradePokemonNumbers = argsArray.slice(1, 3); // Get next two numbers
            }
        }
        
        if (!targetUser) {
            await sock.sendMessage(from, {
                text: '❌ Please specify who to trade with!\n\n📝 **Methods:**\n• Reply to their message: .trade 1 2\n• Mention them: .trade @username 1 2\n• Use their number: .trade 2347049044897 1 2\n\n💡 Format: your_pokemon_# their_pokemon_#'
            });
            return;
        }
        
        if (tradePokemonNumbers.length < 2) {
            await sock.sendMessage(from, {
                text: '❌ Please specify Pokemon numbers!\n\n📝 **Example:** .trade @username 1 2\n💡 Your Pokemon #1 for their Pokemon #2'
            });
            return;
        }
        
        const mentioned = targetUser;
        const yourPokemonNumber = parseInt(tradePokemonNumbers[0]);
        const theirPokemonNumber = parseInt(tradePokemonNumbers[1]);
        
        if (mentioned === sender) {
            await sock.sendMessage(from, {
                text: '❌ You cannot trade Pokemon with yourself!'
            });
            return;
        }
        
        
        
        if (isNaN(yourPokemonNumber) || isNaN(theirPokemonNumber)) {
            await sock.sendMessage(from, {
                text: '❌ Please provide valid Pokemon numbers!\n\n📝 **Example:** .trade @username 1 2'
            });
            return;
        }
        
        // Check your Pokemon
        const yourParty = getPlayerParty(sender);
        if (yourPokemonNumber < 1 || yourPokemonNumber > yourParty.length) {
            await sock.sendMessage(from, {
                text: `❌ You don't have a Pokemon at position ${yourPokemonNumber}! Your party has ${yourParty.length} Pokemon.`
            });
            return;
        }
        
        // Check their Pokemon
        const theirParty = getPlayerParty(mentioned);
        if (theirPokemonNumber < 1 || theirPokemonNumber > theirParty.length) {
            await sock.sendMessage(from, {
                text: `❌ @${mentioned.split('@')[0]} doesn't have a Pokemon at position ${theirPokemonNumber}!`,
                mentions: [mentioned]
            });
            return;
        }
        
        const yourPokemon = yourParty[yourPokemonNumber - 1];
        const theirPokemon = theirParty[theirPokemonNumber - 1];
        
        // Initialize trade storage
        if (!global.trades) global.trades = new Map();
        
        const tradeId = `${from}_${Date.now()}`;
        global.trades.set(tradeId, {
            initiator: sender,
            receiver: mentioned,
            initiatorPokemon: yourPokemon,
            receiverPokemon: theirPokemon,
            initiatorPosition: yourPokemonNumber,
            receiverPosition: theirPokemonNumber,
            groupId: from,
            timestamp: Date.now(),
            status: 'pending'
        });
        
        // Set trade ID for the users
        global.trades.set(`pending_${mentioned}`, tradeId);
        
        const senderName = msg.pushName || sender.split('@')[0];
        const receiverName = mentioned.split('@')[0];
        
        await sock.sendMessage(from, {
            text: `🔄 **POKEMON TRADE PROPOSAL**\n\n👤 **${senderName}** wants to trade with **@${receiverName}**\n\n**Trade Details:**\n🎯 **${senderName}'s Pokemon:** ${yourPokemon.nickname} (${yourPokemon.name}) - Level ${yourPokemon.level}\n🎯 **${receiverName}'s Pokemon:** ${theirPokemon.nickname} (${theirPokemon.name}) - Level ${theirPokemon.level}\n\n⏰ **@${receiverName}** has 2 minutes to respond:\n• `.trade-confirm` - Accept the trade\n• `.trade-delete` - Decline the trade\n\n💡 Trade will expire automatically if not confirmed!`,
            mentions: [mentioned],
            contextInfo: {
                externalAdReply: {
                    title: 'Pokemon Trade Proposal',
                    body: `${yourPokemon.nickname} ↔️ ${theirPokemon.nickname}`,
                    thumbnailUrl: yourPokemon.image,
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
        
        // Auto-expire trade after 2 minutes
        setTimeout(() => {
            if (global.trades.has(tradeId)) {
                global.trades.delete(tradeId);
                global.trades.delete(`pending_${mentioned}`);
                sock.sendMessage(from, {
                    text: `⏰ Trade proposal between **${senderName}** and **@${receiverName}** has expired!`,
                    mentions: [mentioned]
                });
            }
        }, 120000); // 2 minutes
        
        function getPlayerParty(playerId) {
            const stats = dataManager.getPlayerStats(playerId);
            if (!stats.party) stats.party = [];
            
            const allPokemon = dataManager.getPlayerPokemon(playerId);
            return allPokemon.filter(pokemon => stats.party.includes(pokemon.id));
        }
    }
};

export { command };
