
export const command = {
    name: 'qr',
    aliases: ['qrcode'],
    description: 'Generate QR code from text',
    usage: 'qr <text>',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '📱 Please provide text to generate QR code!\n\nExample: .qr Hello World',
                quoted: msg
            });
            return;
        }
        
        try {
            const text = encodeURIComponent(args.trim());
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${text}`;
            
            await sock.sendMessage(from, {
                image: { url: qrUrl },
                caption: `📱 **QR Code Generated**\n\nText: ${args.trim()}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate QR code. Try again later.',
                quoted: msg
            });
        }
    }
};
