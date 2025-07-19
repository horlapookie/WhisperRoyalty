
export const command = {
    name: 'rob',
    aliases: ['steal', 'heist'],
    description: 'Attempt to rob another user',
    usage: 'rob @user',
    category: 'games',
    cooldown: 30,

    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        const dataManager = global.dataManager;

        // Extract target from mention or reply
        let target = null;
        
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
        } else if (args.trim().match(/\d+/)) {
            const phoneNumber = args.trim().match(/\d+/)[0];
            target = phoneNumber + '@s.whatsapp.net';
        }

        if (!target || target === sender) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid target!**\n\n📝 **Usage:**\n• .rob @user\n• Reply to a message with .rob\n• .rob 1234567890\n\n💡 You cannot rob yourself!'
            });
            return;
        }

        const robberStats = dataManager.getPlayerStats(sender);
        const victimStats = dataManager.getPlayerStats(target);

        const robberGold = robberStats.gold || 0;
        const victimGold = victimStats.gold || 0;

        if (robberGold < 100) {
            await sock.sendMessage(from, {
                text: '❌ **You need at least 100 gold to attempt a robbery!**\n\n💰 **Your Gold:** ' + robberGold + ' gold\n💡 Use .daily to earn more gold!'
            });
            return;
        }

        if (victimGold < 50) {
            await sock.sendMessage(from, {
                text: '❌ **Target has less than 50 gold!**\n\n💸 **Not worth the risk!**\n🎯 Find a richer target!'
            });
            return;
        }

        // 40% success rate
        const success = Math.random() < 0.4;
        const attemptCost = 50; // Cost to attempt robbery

        if (success) {
            const maxSteal = Math.min(Math.floor(victimGold * 0.3), 500); // Max 30% or 500 gold
            const stolenAmount = Math.floor(Math.random() * maxSteal) + 10;

            // Update balances
            robberStats.gold = robberGold + stolenAmount - attemptCost;
            victimStats.gold = victimGold - stolenAmount;
            
            robberStats.robsSuccess = (robberStats.robsSuccess || 0) + 1;
            robberStats.robsAttempted = (robberStats.robsAttempted || 0) + 1;

            dataManager.savePlayerStats(sender, robberStats);
            dataManager.savePlayerStats(target, victimStats);

            const extractPhoneNumber = (jid) => {
                if (jid.includes('@lid')) {
                    const match = jid.match(/:(\d+)@/);
                    return match ? match[1] : jid.replace(/@.*/, '');
                }
                return jid.replace(/@.*/, '');
            };

            await sock.sendMessage(from, {
                text: `🎉 **ROBBERY SUCCESSFUL!**\n\n💰 **Stolen:** ${stolenAmount} gold\n💸 **Attempt Cost:** ${attemptCost} gold\n📊 **Net Gain:** ${stolenAmount - attemptCost} gold\n\n🎯 **Target:** @${extractPhoneNumber(target)}\n💳 **Your Balance:** ${robberStats.gold} gold\n\n🕵️ **Success Rate:** ${robberStats.robsSuccess}/${robberStats.robsAttempted}`,
                mentions: [target],
                contextInfo: {
                    externalAdReply: {
                        title: 'Robbery Successful!',
                        body: `Stole ${stolenAmount} gold`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=heist',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });

            // Notify victim
            try {
                await sock.sendMessage(target, {
                    text: `🚨 **YOU'VE BEEN ROBBED!**\n\n💸 **Lost:** ${stolenAmount} gold\n🕵️ **Robber:** @${extractPhoneNumber(sender)}\n💳 **Remaining:** ${victimStats.gold} gold\n\n🛡️ **Tip:** Store gold in bank to prevent robberies! Use .deposit`,
                    mentions: [sender]
                });
            } catch (error) {
                console.log('Could not notify victim:', error);
            }

        } else {
            // Failed robbery
            robberStats.gold = robberGold - attemptCost;
            robberStats.robsAttempted = (robberStats.robsAttempted || 0) + 1;
            dataManager.savePlayerStats(sender, robberStats);

            await sock.sendMessage(from, {
                text: `💸 **ROBBERY FAILED!**\n\n❌ **You were caught!**\n💸 **Lost:** ${attemptCost} gold (attempt cost)\n💳 **Balance:** ${robberStats.gold} gold\n\n🕵️ **Success Rate:** ${robberStats.robsSuccess || 0}/${robberStats.robsAttempted}\n💡 Better luck next time!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Robbery Failed',
                        body: `Lost ${attemptCost} gold`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=fail',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
