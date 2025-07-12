
export const command = {
    name: 'color',
    aliases: ['hex'],
    description: 'Get random color or convert hex to RGB',
    usage: 'color [hex_code]',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (!args.trim()) {
                // Generate random color
                const randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                const hex = `#${randomColor}`;
                
                // Convert to RGB
                const r = parseInt(randomColor.substr(0, 2), 16);
                const g = parseInt(randomColor.substr(2, 2), 16);
                const b = parseInt(randomColor.substr(4, 2), 16);
                
                await sock.sendMessage(from, {
                    text: `🎨 **Random Color**\n\nHEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Random Color',
                            body: 'Color generator',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=111',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                // Convert provided hex to RGB
                let hex = args.trim().replace('#', '');
                
                if (hex.length !== 6 || !/^[0-9A-Fa-f]+$/.test(hex)) {
                    await sock.sendMessage(from, {
                        text: '❌ Invalid hex color code! Use format: #FFFFFF or FFFFFF',
                        quoted: msg
                    });
                    return;
                }
                
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                
                await sock.sendMessage(from, {
                    text: `🎨 **Color Conversion**\n\nHEX: #${hex}\nRGB: rgb(${r}, ${g}, ${b})`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Color Converter',
                            body: 'HEX to RGB',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=112',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Error processing color. Try again.',
                quoted: msg
            });
        }
    }
};
