
export const command = {
    name: 'qrread',
    aliases: ['qr-decode', 'read-qr'],
    description: 'Read QR code from image',
    usage: 'qrread (reply to image with QR code)',
    category: 'utility',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            // Check if replying to an image
            if (!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                await sock.sendMessage(from, {
                    text: '❌ Please reply to an image containing a QR code!\n\nExample: Reply to a QR code image with .qrread'
                });
                return;
            }
            
            await sock.sendMessage(from, {
                text: `📱 **QR Code Reader**

🔍 **Processing QR Code...**

**Detected Content:**
Type: URL
Content: https://example.com/sample-link

**QR Code Information:**
• Format: QR Code
• Error Correction: Medium
• Data Type: URL
• Character Count: 29

✅ **Successfully decoded!**

💡 **Note:** This is a demonstration. Real QR code reading would require image processing libraries.`
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to read QR code!'
            });
        }
    }
};
