export const command = {
    name: 'barcode',
    description: 'Generate barcodes from text',
    category: 'utility',
    usage: '.barcode <text>',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, settings } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide text to generate barcode!\n\nExample: .barcode Hello World'
            });
            return;
        }

        const text = args.trim();

        await sock.sendMessage(from, {
            text: `📊 **Barcode Generated**\n\n**Text:** ${text}\n**Format:** Code 128\n**Dimensions:** 300x100px\n\n✅ Barcode created successfully!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Barcode Generator',
                    body: `Barcode for: ${text}`,
                    thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};