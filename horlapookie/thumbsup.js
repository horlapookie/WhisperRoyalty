
export const command = {
    name: 'thumbsup',
    aliases: ['approve', 'good'],
    description: 'Send a thumbs up reaction GIF',
    usage: '.thumbsup @user or reply to a message',
    category: 'reactions',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from, sender, isGroup, settings } = context;
        
        const thumbsUpGifs = [
            'https://media.tenor.com/images/thumbsup1234567890/tenor.gif',
            'https://media.giphy.com/media/111eboneh9VfiGFe6/giphy.gif',
            'https://media.tenor.com/images/abcdefthumbsup/tenor.gif',
            'https://media.giphy.com/media/3o6MbtsCtmGS6DKx4k/giphy.gif'
        ];
        
        const randomGif = thumbsUpGifs[Math.floor(Math.random() * thumbsUpGifs.length)];
        
        // Check if replying to a message or mentioning someone
        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        let targetUser = null;
        let actionText = '';
        
        if (quotedMessage) {
            const quotedParticipant = msg.message.extendedTextMessage.contextInfo.participant;
            const targetPhone = context.extractPhoneNumber(quotedParticipant);
            targetUser = targetPhone ? `+${targetPhone}` : quotedParticipant;
            actionText = `👍 @${sender.split('@')[0]} gives thumbs up to @${quotedParticipant.split('@')[0]}! 👍`;
        } else if (args.includes('@')) {
            const mentionedUser = args.match(/@(\d+)/);
            if (mentionedUser) {
                targetUser = `+${mentionedUser[1]}`;
                actionText = `👍 @${sender.split('@')[0]} gives thumbs up to @${mentionedUser[1]}! 👍`;
            }
        } else {
            actionText = `👍 @${sender.split('@')[0]} gives a thumbs up! 👍`;
        }
        
        const mentions = targetUser ? [sender, `${targetUser.replace('+', '')}@s.whatsapp.net`] : [sender];
        
        await sock.sendMessage(from, {
            video: { url: randomGif },
            caption: actionText,
            mentions: mentions,
            gifPlayback: true,
            contextInfo: {
                externalAdReply: {
                    title: '👍 Thumbs Up',
                    body: 'Good job! Well done!',
                    thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
