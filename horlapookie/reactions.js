
export const command = {
    name: 'reactions',
    aliases: ['reacts', 'gifs'],
    description: 'Show available anime reaction commands',
    usage: 'reactions',
    category: 'fun',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from } = context;

        const reactionsList = `
╭━━━━《 *𝗔𝗡𝗜𝗠𝗘 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ 🎭 **New Reaction System!**
┃ Use: \`?r <reaction>\` or \`.react <reaction>\`
┃ 
┃ 💥 **Action Reactions:**
┃ ◉ ?r slap @user - Slap someone
┃ ◉ ?r punch @user - Punch someone  
┃ ◉ ?r bonk @user - Bonk someone
┃ ◉ ?r bite @user - Bite someone
┃ ◉ ?r poke @user - Poke someone
┃ ◉ ?r tickle @user - Tickle someone
┃
┃ 💕 **Affection Reactions:**
┃ ◉ ?r hug @user - Give a warm hug
┃ ◉ ?r kiss @user - Kiss someone
┃ ◉ ?r pat @user - Pat someone's head
┃ ◉ ?r cuddle @user - Cuddle with someone
┃ ◉ ?r love @user - Show love
┃
┃ 😊 **Emotion Reactions:**
┃ ◉ ?r happy @user - Show happiness
┃ ◉ ?r sad @user - Show sadness
┃ ◉ ?r angry @user - Show anger
┃ ◉ ?r cry @user - Cry at someone
┃ ◉ ?r laugh @user - Laugh at someone
┃ ◉ ?r blush @user - Blush at someone
┃ ◉ ?r smile @user - Smile at someone
┃ ◉ ?r embarrassed @user - Be embarrassed
┃
┃ 🎪 **Gesture Reactions:**
┃ ◉ ?r wave @user - Wave at someone
┃ ◉ ?r dance @user - Dance with someone
┃ ◉ ?r wink @user - Wink at someone
┃ ◉ ?r stare @user - Stare at someone
┃ ◉ ?r smirk @user - Smirk at someone
┃ ◉ ?r highfive @user - High five someone
┃ ◉ ?r facepalm @user - Facepalm at someone
┃ ◉ ?r confused @user - Look confused
┃ ◉ ?r shocked @user - Be shocked
┃ ◉ ?r amazed @user - Be amazed
┗━━━━━━━━━━━━━━

📝 **How to use:**
• Reply to a message: \`?r slap\`
• Mention someone: \`?r hug @user\`
• Tag with number: \`?r kiss @1234567890\`

🎭 **Examples:**
\`?r slap\` (reply to someone's message)
\`?r hug @john\` 
\`?r dance\` (random target)

✨ **Features:**
• High-quality anime GIFs
• Multiple API sources for reliability
• Smart user targeting
• Emoji reactions included

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɴɪᴍᴇ ᴀᴘɪ ☆ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

        await sock.sendMessage(from, {
            text: reactionsList,
            contextInfo: {
                externalAdReply: {
                    title: '🎭 Anime Reactions Available',
                    body: 'New API-powered reaction system!',
                    thumbnailUrl: 'https://api.waifu.pics/sfw/pat',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
