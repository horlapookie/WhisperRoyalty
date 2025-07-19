
import axios from 'axios';

export const command = {
    name: 'clap',
    aliases: ['applaud'],
    description: 'Clap for someone with a GIF',
    usage: 'clap @user',
    category: 'fun',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, sender, isGroup } = context;

        if (!isGroup) {
            return await sock.sendMessage(from, {
                text: '❌ This command only works in groups!'
            });
        }

        try {
            let targetUser = null;
            let targetName = 'someone';

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                targetUser = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
                targetName = targetUser.split('@')[0];
            } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                targetUser = msg.message.extendedTextMessage.contextInfo.participant;
                targetName = targetUser ? targetUser.split('@')[0] : 'someone';
            }

            if (!targetUser) {
                return await sock.sendMessage(from, {
                    text: '❌ Please mention or reply to someone to clap for them!\n\n📝 Example: .clap @user'
                });
            }

            const senderName = sender.split('@')[0];
            const gifUrl = await getReactionGif('clap');

            if (gifUrl) {
                await sock.sendMessage(from, {
                    video: { url: gifUrl },
                    gifPlayback: true,
                    caption: `👏 *${senderName}* clapped for *${targetName}*! 🎉\n\n🌟 Well done! Amazing performance! ✨`,
                    mentions: [targetUser, sender]
                });
            } else {
                await sock.sendMessage(from, {
                    text: `👏 *${senderName}* clapped for *${targetName}*! 🎉\n\n🌟 Well done! Amazing performance! ✨`,
                    mentions: [targetUser, sender]
                });
            }

        } catch (error) {
            console.error('Clap command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to clap! Try again later.'
            });
        }
    }
};

async function getReactionGif(reaction) {
    try {
        const apis = [
            `https://api.waifu.pics/sfw/${reaction}`,
            `https://nekos.life/api/v2/img/${reaction}`
        ];

        for (const api of apis) {
            try {
                const response = await axios.get(api);
                if (response.data.url) {
                    return response.data.url;
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    } catch (error) {
        console.error('GIF fetch error:', error);
        return null;
    }
}
