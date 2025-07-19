
import axios from 'axios';

export const command = {
    name: 'react',
    aliases: ['r', 'reaction'],
    description: 'Send anime reaction GIFs',
    usage: '?r <reaction> @user or reply to message',
    category: 'fun',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        
        if (!args.trim()) {
            const helpText = `
╭━━━━《 *𝗔𝗡𝗜𝗠𝗘 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ Available reactions:
┃ ◉ slap, hug, kiss, pat, punch
┃ ◉ bonk, wave, dance, cry, bite
┃ ◉ angry, happy, sad, love, laugh
┃ ◉ wink, lick, poke, tickle, cuddle
┃ ◉ blush, smile, stare, smirk
┃ ◉ highfive, facepalm, confused
┃ ◉ shocked, amazed, embarrassed
┗━━━━━━━━━━━━━━

📝 **Usage:**
• ?r slap @user
• Reply to message: ?r hug
• ?r kiss (random target)

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪᴍᴇ ᴀᴘɪ*`;

            return await sock.sendMessage(from, { text: helpText });
        }

        const reactionType = args.split(' ')[0].toLowerCase();
        const restArgs = args.split(' ').slice(1).join(' ');
        
        // Map reactions to API endpoints
        const reactionMap = {
            slap: 'slap',
            hug: 'hug', 
            kiss: 'kiss',
            pat: 'pat',
            punch: 'punch',
            bonk: 'bonk',
            wave: 'wave',
            dance: 'dance',
            cry: 'cry',
            bite: 'bite',
            angry: 'angry',
            happy: 'happy',
            sad: 'sad',
            love: 'love',
            laugh: 'laugh',
            wink: 'wink',
            lick: 'lick',
            poke: 'poke',
            tickle: 'tickle',
            cuddle: 'cuddle',
            blush: 'blush',
            smile: 'smile',
            stare: 'stare',
            smirk: 'smirk',
            highfive: 'highfive',
            facepalm: 'facepalm',
            confused: 'confused',
            shocked: 'shocked',
            amazed: 'amazed',
            embarrassed: 'embarrassed'
        };

        if (!reactionMap[reactionType]) {
            return await sock.sendMessage(from, {
                text: `❌ Unknown reaction: ${reactionType}\nUse: ?r help for available reactions`
            });
        }

        try {
            // Try multiple API sources for better reliability
            let gifUrl = null;
            let apiUsed = '';

            // Primary API: waifu.pics
            try {
                const waifuResponse = await axios.get(`https://api.waifu.pics/sfw/${reactionMap[reactionType]}`);
                if (waifuResponse.data && waifuResponse.data.url) {
                    gifUrl = waifuResponse.data.url;
                    apiUsed = 'waifu.pics';
                }
            } catch (waifuError) {
                console.log('Waifu.pics API failed, trying alternatives...');
            }

            // Fallback API: nekos.life (for some reactions)
            if (!gifUrl && ['hug', 'kiss', 'pat', 'slap', 'cuddle', 'poke', 'tickle'].includes(reactionType)) {
                try {
                    const nekosResponse = await axios.get(`https://nekos.life/api/v2/img/${reactionType}`);
                    if (nekosResponse.data && nekosResponse.data.url) {
                        gifUrl = nekosResponse.data.url;
                        apiUsed = 'nekos.life';
                    }
                } catch (nekosError) {
                    console.log('Nekos.life API failed...');
                }
            }

            if (!gifUrl) {
                throw new Error('All APIs failed');
            }

            // Determine target user and create action text
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            let targetUser = null;
            let actionText = '';
            let senderName = sender.split('@')[0];

            if (quotedMsg) {
                // Get the quoted message sender
                const quotedSender = msg.message.extendedTextMessage.contextInfo.participant;
                if (quotedSender) {
                    const quotedNumber = quotedSender.split('@')[0];
                    actionText = `@${senderName} ${reactionType}ped @${quotedNumber}! 💫`;
                    targetUser = quotedSender;
                }
            } else if (mentionedJid && mentionedJid.length > 0) {
                const mentionedNumber = mentionedJid[0].split('@')[0];
                actionText = `@${senderName} ${reactionType}ped @${mentionedNumber}! 💫`;
                targetUser = mentionedJid[0];
            } else if (restArgs.trim()) {
                // Check if args contains a phone number pattern or mention
                const phoneMatch = restArgs.match(/(\+?\d{10,15})/);
                const mentionMatch = restArgs.match(/@(\d+)/);
                
                if (mentionMatch) {
                    targetUser = `${mentionMatch[1]}@s.whatsapp.net`;
                    actionText = `@${senderName} ${reactionType}ped @${mentionMatch[1]}! 💫`;
                } else if (phoneMatch) {
                    const cleanNumber = phoneMatch[1].replace(/\+/g, '');
                    targetUser = `${cleanNumber}@s.whatsapp.net`;
                    actionText = `@${senderName} ${reactionType}ped @${cleanNumber}! 💫`;
                } else {
                    actionText = `@${senderName} ${reactionType}ped ${restArgs.trim()}! 💫`;
                }
            } else {
                actionText = `@${senderName} did a ${reactionType} reaction! 💫`;
            }

            // Get reaction emoji based on type
            const reactionEmojis = {
                slap: '👋💥', hug: '🤗💕', kiss: '😘💋', pat: '👋😊', punch: '👊💥',
                bonk: '🔨😤', wave: '👋😊', dance: '💃🕺', cry: '😭💧', bite: '😬🦷',
                angry: '😡💢', happy: '😊🌟', sad: '😢💙', love: '❤️💕', laugh: '😂🤣',
                wink: '😉✨', lick: '👅😋', poke: '👉😄', tickle: '🤭👆', cuddle: '🤗💝',
                blush: '😊💗', smile: '😊🌸', stare: '👀😳', smirk: '😏✨',
                highfive: '🙏⭐', facepalm: '🤦‍♂️💫', confused: '🤔❓', shocked: '😱⚡',
                amazed: '🤩✨', embarrassed: '😳🌸'
            };

            const emoji = reactionEmojis[reactionType] || '💫✨';
            actionText = `${emoji} ${actionText}`;

            const mentions = targetUser ? [sender, targetUser] : [sender];
            
            await sock.sendMessage(from, {
                video: { url: gifUrl },
                caption: actionText,
                mentions: mentions,
                gifPlayback: true,
                contextInfo: {
                    externalAdReply: {
                        title: `${emoji} Anime ${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)} Reaction`,
                        body: `Powered by ${apiUsed}`,
                        thumbnailUrl: gifUrl,
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            console.error('Reaction GIF error:', error);
            
            // Fallback with text message and emoji
            const reactionEmojis = {
                slap: '👋💥', hug: '🤗💕', kiss: '😘💋', pat: '👋😊', punch: '👊💥',
                bonk: '🔨😤', wave: '👋😊', dance: '💃🕺', cry: '😭💧', bite: '😬🦷',
                angry: '😡💢', happy: '😊🌟', sad: '😢💙', love: '❤️💕', laugh: '😂🤣'
            };
            
            const emoji = reactionEmojis[reactionType] || '💫';
            
            await sock.sendMessage(from, {
                text: `${emoji} @${sender.split('@')[0]} did a ${reactionType} reaction! ${emoji}\n\n⚠️ GIF service temporarily unavailable`,
                mentions: [sender]
            });
        }
    }
};
