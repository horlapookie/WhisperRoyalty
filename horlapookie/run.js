
export const command = {
    name: 'run',
    aliases: ['flee', 'escape'],
    description: 'Run away from a wild Pokemon battle',
    category: 'pokemon',
    usage: '.run',
    cooldown: 1,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Check if user is owner (for DM access)
        const { settings } = await import('../settings.js');

        const extractPhoneNumber = (jid) => {
            if (!jid) return null;

            if (jid.includes('@lid')) {
                const match = jid.match(/:(\d+)@/);
                return match ? match[1] : null;
            } 
            else if (jid.includes('@s.whatsapp.net')) {
                const match = jid.match(/^(\d+)@/);
                return match ? match[1] : null;
            } 
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

        if (!isGroup && !isOwner) {
            await sock.sendMessage(from, {
                text: '❌ Pokemon battles only work in groups!'
            });
            return;
        }

        // Initialize storage
        if (!global.catchBattles) global.catchBattles = new Map();

        // Find active catch battle for this group
        const activeBattle = global.catchBattles.get(from);

        if (!activeBattle) {
            await sock.sendMessage(from, {
                text: '❌ **No active battle!**\n\n💡 Use .catch <pokemon> to start a battle'
            });
            return;
        }

        // Check if it's the player's turn or if they're in the battle
        if (activeBattle.trainer.id !== sender) {
            await sock.sendMessage(from, {
                text: '❌ **Not your battle!**\n\n💡 Only the trainer who started this battle can run away'
            });
            return;
        }

        // Remove the battle
        global.catchBattles.delete(from);

        const wildPokemon = activeBattle.wildPokemon;

        await sock.sendMessage(from, {
            text: `🏃‍♂️ **FLED FROM BATTLE!**\n\n💨 You successfully ran away from **${wildPokemon.name}**!\n\n🐾 The wild **${wildPokemon.name}** remains in the area.\n\n💡 You can try to .catch it again later!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Fled from Battle',
                    body: `Escaped from ${wildPokemon.name}`,
                    thumbnailUrl: wildPokemon.image,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
