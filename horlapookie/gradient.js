
export const command = {
    name: 'gradient',
    description: 'Generate CSS gradient colors',
    category: 'utility',
    usage: '.gradient [color1] [color2]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const colors = args ? args.split(' ') : [];
            const color1 = colors[0] || '#' + Math.floor(Math.random()*16777215).toString(16);
            const color2 = colors[1] || '#' + Math.floor(Math.random()*16777215).toString(16);
            
            const gradients = [
                `linear-gradient(45deg, ${color1}, ${color2})`,
                `linear-gradient(to right, ${color1}, ${color2})`,
                `linear-gradient(to bottom, ${color1}, ${color2})`,
                `radial-gradient(circle, ${color1}, ${color2})`,
                `conic-gradient(${color1}, ${color2})`
            ];
            
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
            
            await sock.sendMessage(from, {
                text: `🌈 *CSS Gradient Generator*\n\n🎨 Color 1: ${color1}\n🎨 Color 2: ${color2}\n\n📝 CSS Code:\n\`\`\`css\nbackground: ${randomGradient};\n\`\`\`\n\n💡 Copy and paste this into your CSS file!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'CSS Gradient Generator',
                        body: 'Web design tool',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=126',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate gradient!'
            });
        }
    }
};
