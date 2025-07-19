
export const command = {
    name: 'owner',
    aliases: ['creator', 'developer', 'dev', 'contact'],
    description: 'Get owner contact information and details',
    usage: 'owner',
    category: 'info',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        const ownerInfo = `
╭━━━━《 *𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢* 》━━┈⊷
┃❍╭──────────────
┃❍┃•  *ɴᴀᴍᴇ* : horlapookie
┃❍┃•  *ʀᴏʟᴇ* : Bot Developer
┃❍┃•  *sᴛᴀᴛᴜs* : Active Developer
┃❍┃•  *ʟᴏᴄᴀᴛɪᴏɴ* : Nigeria 🇳🇬
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

📱 **Contact Information:**

📞 **WhatsApp:**
   wa.me/2349122222622

📧 **Telegram:**
   t.me/horlapookie

🌐 **Social Platforms:**
   • GitHub: github.com/horlapookie
   • Telegram: @horlapookie

💼 **About the Developer:**

🚀 **Expertise:**
   • WhatsApp Bot Development
   • AI Integration (Gemini AI)
   • Web Development
   • Game Development

🎮 **Projects:**
   • yourhïghness Bot (WhatsApp)
   • 2048 Puzzle Game
   • Various Web Applications

🏆 **Achievements:**
   • 135+ Bot Commands Created
   • Pokemon Battle System
   • Multi-Platform Deployment
   • Advanced AI Features

📝 **Services Offered:**
   • Custom Bot Development
   • AI Integration Solutions
   • Web Application Development
   • Technical Consultation

💡 **Vision:**
   Creating innovative digital solutions
   that enhance user experience and
   bring communities together.

🤝 **Support:**
   For technical support, feature requests,
   or collaboration opportunities, feel free
   to reach out via WhatsApp or Telegram!

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

        await sock.sendMessage(from, {
            text: ownerInfo,
            contextInfo: {
                externalAdReply: {
                    title: '👨‍💻 Meet the Developer',
                    body: 'horlapookie - Bot Creator & Developer',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=dev',
                    sourceUrl: 'https://wa.me/2349122222622',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }
};
