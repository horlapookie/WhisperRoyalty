
import { settings } from '../settings.js';

export const command = {
    name: 'restart',
    aliases: ['reboot', 'reload'],
    description: 'Restart the bot and resend connection message (Owner only)',
    usage: 'restart',
    category: 'owner',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, sender, isOwner } = context;
        
        if (!isOwner) {
            await sock.sendMessage(from, {
                react: { text: '❌', key: msg.key }
            });
            return;
        }

        try {
            // Send restart notification
            await sock.sendMessage(from, {
                text: '🔄 *BOT RESTART INITIATED*\n\n⏳ Restarting in 3 seconds...\n\n🤖 I\'ll be back online shortly!',
                contextInfo: {
                    externalAdReply: {
                        title: '🔄 Bot Restart',
                        body: 'Restarting yourhïghness v1.0',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

            // Wait 3 seconds then restart
            setTimeout(() => {
                console.log('🔄 Restart command executed by owner');
                
                if (global.restartBot) {
                    global.restartBot();
                } else {
                    // Fallback to process exit
                    process.exit(0);
                }
            }, 3000);

        } catch (error) {
            console.error('Error during restart:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to restart bot: ' + error.message,
                contextInfo: {
                    externalAdReply: {
                        title: 'Restart Failed',
                        body: 'Error during restart',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        }
    }
};
