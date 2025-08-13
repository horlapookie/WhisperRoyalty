
export const command = {
    name: '2048',
    aliases: ['2048game', 'game2048', 'puzzle2048'],
    description: 'Play the classic 2048 puzzle game',
    usage: '2048',
    category: 'fun',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        const gameInfo = `
╭━━━━《 *2048 𝗣𝗨𝗭𝗭𝗟𝗘 𝗚𝗔𝗠𝗘* 》━━┈⊷
┃❍╭──────────────
┃❍┃•  *ɢᴀᴍᴇ* : 2048 Classic
┃❍┃•  *ᴅᴇᴠᴇʟᴏᴘᴇʀ* : horlapookie
┃❍┃•  *ᴛʏᴘᴇ* : Number Puzzle
┃❍┃•  *ᴘʟᴀᴛғᴏʀᴍ* : Web Browser
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

🎮 **How to Play:**

🎯 **Objective:**
• Combine tiles to reach 2048
• Slide tiles in any direction
• When two tiles with same number touch, they merge!

🎲 **Game Rules:**
• Start with two 2s
• Use arrow keys or swipe to move
• New tile appears after each move
• Game over when board is full

🏆 **Tips for Success:**
• Keep highest tile in corner
• Build up numbers systematically
• Don't rush - think strategically
• Practice makes perfect!

🌟 **Features:**
• Smooth animations
• Score tracking
• Responsive design
• Mobile friendly

🚀 **Ready to Challenge Your Mind?**
Click the link below to start playing!

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

        await sock.sendMessage(from, {
            text: gameInfo,
            contextInfo: {
                externalAdReply: {
                    title: '🎮 Play 2048 Puzzle Game',
                    body: 'Classic number puzzle - Can you reach 2048?',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=2048',
                    sourceUrl: 'https://2048-git-master-horlapookie.vercel.app/',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }
};
