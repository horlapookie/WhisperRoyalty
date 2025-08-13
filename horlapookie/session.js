
export const command = {
    name: 'session',
    aliases: ['pair', 'qr', 'sessionpair'],
    description: 'Get session pairing link for WhatsApp bot setup',
    usage: 'session',
    category: 'info',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        const sessionInfo = `
╭━━━━《 *𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗣𝗔𝗜𝗥𝗜𝗡𝗚* 》━━┈⊷
┃❍╭──────────────
┃❍┃•  *ʟɪɴᴋ* : Session Pairing Portal
┃❍┃•  *ᴜʀʟ* : horlapair-olamilekans-projects-1c056653.vercel.app
┃❍┃•  *ᴍᴇᴛʜᴏᴅ* : 8-Digit Pairing Code
┃❍┃•  *ᴘᴜʀᴘᴏsᴇ* : Bot Authentication
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

📋 **How to Get Your Session:**

1️⃣ **Visit the Pairing Portal:**
   🔗 https://horlapair-olamilekans-projects-1c056653.vercel.app/

2️⃣ **Enter 8-Digit Code:**
   📱 Open WhatsApp on your phone
   ⚙️ Go to Settings → Linked Devices
   📲 Tap "Link a Device" → "Link with phone number instead"
   🔢 Enter the 8-digit code from the portal

3️⃣ **Copy Session Data:**
   📋 Copy the generated session string
   📝 Paste it in your \`settings.js\` file

4️⃣ **Start Your Bot:**
   🚀 Run your bot and enjoy!

⚠️ **Security Notes:**
• Never share your session data
• Keep it private and secure
• Regenerate if compromised

🔄 **Alternative Methods:**
• Message: wa.me/2349122222622?text=session+loading+link+for+your+bot
• Use official WhatsApp Web pairing

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

        await sock.sendMessage(from, {
            text: sessionInfo,
            contextInfo: {
                externalAdReply: {
                    title: 'Session Pairing Portal',
                    body: 'Get your WhatsApp bot session data',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=777',
                    sourceUrl: 'https://horlapair-olamilekans-projects-1c056653.vercel.app/',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }
};
