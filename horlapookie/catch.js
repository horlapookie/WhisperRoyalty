export const command = {
    name: 'catch',
    aliases: ['pokecatch', 'catchpokemon'],
    description: 'Catch wild Pokemon that have spawned',
    category: 'games',
    usage: '.catch [pokemon_name]',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Check if user is owner (for DM access)
        const { settings } = await import('../settings.js');

        const extractPhoneNumber = (jid) => {
            if (!jid) return null;

            // Handle LID format (participant JIDs): extract number after colon
            if (jid.includes('@lid')) {
                const match = jid.match(/:(\d+)@/);
                return match ? match[1] : null;
            } 
            // Handle standard WhatsApp format
            else if (jid.includes('@s.whatsapp.net')) {
                const match = jid.match(/^(\d+)@/);
                return match ? match[1] : null;
            } 
            // Generic @ format
            else if (jid.includes('@')) {
                const match = jid.match(/(\d+)@/);
                return match ? match[1] : null;
            }

            return jid;
        };

        const senderPhoneNumber = extractPhoneNumber(sender);
        const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
        const isOwner = ownerNumbers.some(num => {
            const ownerPhone = extractPhoneNumber(num);
            return senderPhoneNumber === ownerPhone || sender === num || sender.includes(ownerPhone);
        });

        // Allow owner to use in DMs, but restrict others to groups only
        if (!isGroup && !isOwner) {
            await sock.sendMessage(from, {
                text: '❌ Pokemon catching only works in groups!'
            });
            return;
        }

        // Initialize storage
        if (!global.wildPokemon) global.wildPokemon = new Map();
        if (!global.catchBattles) global.catchBattles = new Map();
        const dataManager = global.dataManager;

        // Get Pokemon name if provided
        const targetPokemon = args.trim().toLowerCase();

        // Find wild Pokemon in current group
        let wildPokemon;
        if (targetPokemon) {
            // Find specific Pokemon by name
            wildPokemon = Array.from(global.wildPokemon.entries())
                .find(([key, pokemon]) => pokemon.groupId === from && pokemon.name.toLowerCase() === targetPokemon);
        } else {
            // Find any Pokemon in the group
            wildPokemon = Array.from(global.wildPokemon.entries())
                .find(([key, pokemon]) => pokemon.groupId === from);
        }

        if (!wildPokemon) {
            const message = targetPokemon 
                ? `❌ No wild ${targetPokemon.charAt(0).toUpperCase() + targetPokemon.slice(1)} to catch! Use .spawnpokemon first.`
                : '❌ No wild Pokemon to catch! Use .spawnpokemon first.';

            await sock.sendMessage(from, {
                text: message,
                contextInfo: {
                    externalAdReply: {
                        title: 'No Wild Pokemon',
                        body: 'Spawn Pokemon first!',
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        const [spawnKey, pokemon] = wildPokemon;

        // Check if there's already an active battle
        const existingBattle = global.catchBattles.get(from);
        if (existingBattle) {
            await sock.sendMessage(from, {
                text: `⚔️ **Battle already in progress!**\n\n🎮 **Current Battle:** ${existingBattle.wildPokemon.name}\n💡 Use .attack, .pcatch, or .run to continue the battle!`
            });
            return;
        }

        // Get player's Pokemon for battle
        const playerPokemon = dataManager.getPlayerPokemon(sender);
        if (playerPokemon.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ **No Pokemon available for battle!**\n\n💡 You need at least one Pokemon to battle!\n🎁 Use .daily to get your starter Pokemon!'
            });
            return;
        }

        // Get player's strongest/first Pokemon for battle
        const battlePokemon = playerPokemon.find(p => p.hp > 0) || playerPokemon[0];
        if (battlePokemon.hp <= 0) {
            battlePokemon.hp = Math.floor(battlePokemon.maxHp * 0.1); // Emergency heal to 10%
        }

        // Create battle instance similar to PvP
        const battleId = `wild_${from}_${Date.now()}`;
        const battle = {
            battleId,
            type: 'wild',
            isWildBattle: true,
            groupId: from,
            trainer: {
                id: sender,
                pokemon: battlePokemon,
                name: context.senderPhoneNumber || sender.split('@')[0]
            },
            wildPokemon: {
                ...pokemon,
                moves: generatePokemonMoves(pokemon)
            },
            currentTurn: sender,
            battleStarted: Date.now(),
            spawnKey,
            round: 1
        };

        global.catchBattles.set(from, battle);

        // Send battle start message with proper format
        await sock.sendMessage(from, {
            text: `⚔️ **WILD POKEMON BATTLE STARTED!**\n\n🐾 **A wild ${pokemon.name} appeared!**\n\n**🔥 Your Pokemon:**\n• **${battlePokemon.nickname}** (Level ${battlePokemon.level})\n• **HP:** ${battlePokemon.hp}/${battlePokemon.maxHp}\n• **Type:** ${battlePokemon.type}\n\n**🌟 Wild Pokemon:**\n• **${pokemon.name}** (Level ${pokemon.level})\n• **HP:** ${pokemon.hp}/${pokemon.maxHp}\n• **Type:** ${pokemon.type}\n• **Rarity:** ${pokemon.rarity}\n\n**🎮 Battle Commands:**\n• \`.attack\` - Attack the wild Pokemon\n• \`.pcatch\` - Use pokeball to catch (if you have any)\n• \`.run\` - Flee from battle\n\n💡 **Tip:** Weaken the Pokemon first to increase catch chances!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Wild Pokemon Battle',
                    body: `${pokemon.name} Level ${pokemon.level} appeared!`,
                    thumbnailUrl: pokemon.image,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });

        function generatePokemonMoves(pokemon) {
            const movesByType = {
                'Electric': [
                    { name: 'Thunder Shock', power: 40, type: 'Electric', accuracy: 100 },
                    { name: 'Quick Attack', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Thunder Wave', power: 0, type: 'Electric', accuracy: 90 },
                    { name: 'Spark', power: 65, type: 'Electric', accuracy: 100 }
                ],
                'Fire': [
                    { name: 'Ember', power: 40, type: 'Fire', accuracy: 100 },
                    { name: 'Scratch', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Fire Spin', power: 35, type: 'Fire', accuracy: 85 },
                    { name: 'Flame Wheel', power: 60, type: 'Fire', accuracy: 100 }
                ],
                'Water': [
                    { name: 'Water Gun', power: 40, type: 'Water', accuracy: 100 },
                    { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Bubble', power: 40, type: 'Water', accuracy: 100 },
                    { name: 'Water Pulse', power: 60, type: 'Water', accuracy: 100 }
                ],
                'Grass': [
                    { name: 'Vine Whip', power: 45, type: 'Grass', accuracy: 100 },
                    { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                    { name: 'Razor Leaf', power: 55, type: 'Grass', accuracy: 95 },
                    { name: 'Absorb', power: 20, type: 'Grass', accuracy: 100 }
                ]
            };

            const primaryType = pokemon.type.split('/')[0];
            const availableMoves = movesByType[primaryType] || [
                { name: 'Tackle', power: 40, type: 'Normal', accuracy: 100 },
                { name: 'Growl', power: 0, type: 'Normal', accuracy: 100 },
                { name: 'Scratch', power: 40, type: 'Normal', accuracy: 100 },
                { name: 'Leer', power: 0, type: 'Normal', accuracy: 100 }
            ];

            return availableMoves.slice(0, 4);
        }
    }
};