
let afkUsers = new Map();

export const command = {
    name: 'afk',
    aliases: ['away'],
    description: 'Set or remove AFK status with optional reason',
    usage: 'afk [reason] | afk remove',
    category: 'utility',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from, sender, isGroup } = context;
        
        const action = args.trim().toLowerCase();
        
        if (action === 'remove' || action === 'off') {
            if (afkUsers.has(sender)) {
                const afkData = afkUsers.get(sender);
                const duration = Date.now() - afkData.timestamp;
                const hours = Math.floor(duration / 3600000);
                const minutes = Math.floor((duration % 3600000) / 60000);
                
                afkUsers.delete(sender);
                
                await sock.sendMessage(from, {
                    text: `✅ **Welcome Back!**\n\n👋 @${sender.split('@')[0]} is no longer AFK!\n\n⏰ **You were away for:** ${hours > 0 ? `${hours}h ` : ''}${minutes}m\n\n🎉 Welcome back to the conversation!`,
                    mentions: [sender],
                    contextInfo: {
                        externalAdReply: {
                            title: 'AFK Status Removed',
                            body: 'Welcome back!',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=524',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: '❌ You are not currently AFK!'
                });
            }
            return;
        }
        
        if (afkUsers.has(sender)) {
            await sock.sendMessage(from, {
                text: '⚠️ You are already AFK! Use .afk remove to come back.'
            });
            return;
        }
        
        const reason = args.trim() || 'No reason provided';
        afkUsers.set(sender, {
            reason: reason,
            timestamp: Date.now(),
            groupId: isGroup ? from : null
        });
        
        await sock.sendMessage(from, {
            text: `😴 **AFK Status Set**\n\n👤 @${sender.split('@')[0]} is now AFK\n\n💭 **Reason:** ${reason}\n⏰ **Since:** ${new Date().toLocaleTimeString()}\n\n💡 Use .afk remove when you're back!`,
            mentions: [sender],
            contextInfo: {
                externalAdReply: {
                    title: 'AFK Status Active',
                    body: reason,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=525',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};

// Export function to check AFK status (to be called from main bot)
export function checkAFK(sender, from, sock) {
    if (afkUsers.has(sender)) {
        const afkData = afkUsers.get(sender);
        const duration = Date.now() - afkData.timestamp;
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        
        sock.sendMessage(from, {
            text: `😴 **AFK Reminder**\n\n@${sender.split('@')[0]} is currently AFK\n\n💭 **Reason:** ${afkData.reason}\n⏰ **Away for:** ${hours > 0 ? `${hours}h ` : ''}${minutes}m\n\n💡 They'll see your message when they return!`,
            mentions: [sender]
        });
        
        return true;
    }
    return false;
}
