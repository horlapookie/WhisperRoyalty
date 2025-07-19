
export const command = {
    name: 'temp',
    aliases: ['temporary', 'selfdelete'],
    description: 'Send a temporary message that deletes after specified time',
    usage: 'temp <seconds> <message>',
    category: 'utility',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const argsArray = args.trim().split(' ');
        const seconds = parseInt(argsArray[0]);
        
        if (!seconds || seconds < 1 || seconds > 300) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a valid time (1-300 seconds)!\n\n📝 **Usage:** .temp <seconds> <message>\n\n**Examples:**\n• .temp 10 This message will disappear in 10 seconds\n• .temp 60 Secret message for 1 minute'
            });
            return;
        }
        
        const message = argsArray.slice(1).join(' ');
        if (!message.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a message to send!'
            });
            return;
        }
        
        const sentMessage = await sock.sendMessage(from, {
            text: `⏰ **Temporary Message** ⏰\n\n💬 ${message}\n\n🕒 **This message will self-delete in ${seconds} seconds**\n⏳ **Countdown active...**`,
            contextInfo: {
                externalAdReply: {
                    title: 'Temporary Message',
                    body: `Deletes in ${seconds}s`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=528',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
        
        // Update countdown every 10 seconds for messages longer than 30 seconds
        if (seconds > 30) {
            const updateInterval = setInterval(async () => {
                const remaining = seconds - Math.floor((Date.now() - Date.now()) / 1000);
                
                if (remaining <= 0) {
                    clearInterval(updateInterval);
                    return;
                }
                
                if (remaining % 30 === 0 || remaining <= 10) {
                    try {
                        await sock.sendMessage(from, {
                            text: `⏰ **Message Update**\n\n⏳ Temporary message deletes in ${remaining} seconds`,
                            edit: sentMessage.key
                        });
                    } catch (error) {
                        clearInterval(updateInterval);
                    }
                }
            }, 1000);
        }
        
        // Delete the message after specified time
        setTimeout(async () => {
            try {
                await sock.sendMessage(from, {
                    delete: sentMessage.key
                });
                
                await sock.sendMessage(from, {
                    text: `🗑️ **Message Deleted**\n\n⏰ The temporary message has been automatically deleted after ${seconds} seconds.`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Message Auto-Deleted',
                            body: `Deleted after ${seconds}s`,
                            thumbnailUrl: 'https://picsum.photos/300/300?random=529',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } catch (error) {
                console.log('Failed to delete temporary message:', error);
            }
        }, seconds * 1000);
    }
};
