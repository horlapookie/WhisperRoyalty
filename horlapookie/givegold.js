
export const command = {
    name: 'givegold',
    aliases: ['give', 'sendgold', 'transfergold'],
    description: 'Give gold to another user',
    usage: 'givegold @user <amount> or reply to message with givegold <amount>',
    category: 'economy',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        let target, amount;

        // Check if it's a reply
        if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            const quotedParticipant = msg.message.extendedTextMessage.contextInfo.participant;
            target = quotedParticipant;
            amount = parseInt(args.trim());
        } else {
            // Check for mention
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned.length > 0) {
                target = mentioned[0];
                const argsArray = args.trim().split(' ');
                amount = parseInt(argsArray[argsArray.length - 1]); // Last argument should be amount
            } else {
                await sock.sendMessage(from, {
                    text: '❌ **Invalid usage!**\n\n📝 **Usage:**\n• .givegold @user <amount>\n• Reply to message: .givegold <amount>\n\n💡 **Example:** .givegold @user 100'
                });
                return;
            }
        }

        if (!target || !amount || amount <= 0) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid amount!**\n\n💡 Please specify a valid amount greater than 0'
            });
            return;
        }

        if (target === sender) {
            await sock.sendMessage(from, {
                text: '❌ **You cannot give gold to yourself!**'
            });
            return;
        }

        const senderStats = dataManager.getPlayerStats(sender);
        const senderGold = senderStats.gold || 0;

        if (amount > senderGold) {
            await sock.sendMessage(from, {
                text: `❌ **Insufficient gold!**\n\n💰 **Your Gold:** ${senderGold} gold\n💸 **Need:** ${amount} gold\n📉 **Short:** ${amount - senderGold} gold`
            });
            return;
        }

        // Transfer gold
        const targetStats = dataManager.getPlayerStats(target);
        
        senderStats.gold = senderGold - amount;
        targetStats.gold = (targetStats.gold || 0) + amount;

        dataManager.savePlayerStats(sender, senderStats);
        dataManager.savePlayerStats(target, targetStats);

        // Extract phone numbers for display
        const extractPhoneNumber = (jid) => {
            if (!jid) return 'Unknown';
            if (jid.includes('@s.whatsapp.net')) {
                return jid.split('@')[0];
            }
            return jid.split('@')[0];
        };

        const senderPhone = extractPhoneNumber(sender);
        const targetPhone = extractPhoneNumber(target);

        await sock.sendMessage(from, {
            text: `💰 **GOLD TRANSFER SUCCESSFUL!**\n\n👤 **From:** @${senderPhone}\n👤 **To:** @${targetPhone}\n💸 **Amount:** ${amount} gold\n\n💳 **Your Balance:** ${senderStats.gold} gold\n💳 **Their Balance:** ${targetStats.gold} gold`,
            mentions: [sender, target],
            contextInfo: {
                externalAdReply: {
                    title: 'Gold Transfer',
                    body: `Sent ${amount} gold to @${targetPhone}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=gold',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            },
            quoted: msg
        });

        // Notify recipient
        try {
            await sock.sendMessage(target, {
                text: `💰 **YOU RECEIVED GOLD!**\n\n🎁 **From:** @${senderPhone}\n💸 **Amount:** ${amount} gold\n💳 **New Balance:** ${targetStats.gold} gold\n\n💡 Thank them for their generosity!`,
                mentions: [sender]
            });
        } catch (error) {
            console.log('Could not notify recipient:', error);
        }
    }
};
