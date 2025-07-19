
import fetch from 'node-fetch';

export const command = {
    name: 'img-free',
    aliases: ['imgf', 'freeimg'],
    description: 'Generate/search images using free APIs',
    usage: 'img-free <search term> | img-free random | img-free placeholder <width>x<height>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🖼️ **Free Image Generator**\n\n**📝 Usage:**\n• `.img-free cat` - Search for cat images\n• `.img-free random` - Random high-quality image\n• `.img-free placeholder 500x300` - Generate placeholder\n• `.img-free nature landscape` - Search specific terms\n\n**🌟 Features:**\n• High-quality stock photos\n• No API key required\n• Fast and reliable\n• Multiple sources',
                contextInfo: {
                    externalAdReply: {
                        title: 'Free Image Generator',
                        body: 'No API key required',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=801',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const query = args.trim().toLowerCase();
        
        try {
            await sock.sendMessage(from, {
                text: '🔍 **Searching for images...**\n\n⏳ Please wait while I find the perfect image for you!'
            });
            
            let imageUrl = null;
            let imageSource = '';
            
            if (query === 'random') {
                // Random high-quality image from Lorem Picsum
                imageUrl = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
                imageSource = 'Lorem Picsum';
                
            } else if (query.includes('placeholder') && query.includes('x')) {
                // Custom placeholder
                const dimensions = query.split('placeholder')[1].trim();
                const [width, height] = dimensions.split('x').map(d => parseInt(d.trim()));
                
                if (width && height && width <= 2000 && height <= 2000) {
                    imageUrl = `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
                    imageSource = 'Lorem Picsum';
                } else {
                    await sock.sendMessage(from, {
                        text: '❌ Invalid dimensions! Use format: `.img-free placeholder 500x300`\n\n📏 Maximum size: 2000x2000'
                    });
                    return;
                }
                
            } else {
                // Try Unsplash API (free)
                try {
                    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
                    const response = await fetch(unsplashUrl, { method: 'HEAD' });
                    
                    if (response.ok) {
                        imageUrl = unsplashUrl;
                        imageSource = 'Unsplash';
                    }
                } catch (error) {
                    console.log('Unsplash failed, trying fallback...');
                }
                
                // Fallback to themed placeholder
                if (!imageUrl) {
                    const themes = ['nature', 'city', 'technology', 'abstract', 'architecture'];
                    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
                    imageUrl = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
                    imageSource = 'Lorem Picsum (Themed)';
                }
            }
            
            if (imageUrl) {
                await sock.sendMessage(from, {
                    image: { url: imageUrl },
                    caption: `🖼️ **Image Generated Successfully!**\n\n**📝 Query:** ${args.trim()}\n**🌐 Source:** ${imageSource}\n**📏 Resolution:** 800x600\n\n**💡 Tips:**\n• Try different search terms\n• Use \`.img-free random\` for surprises\n• Create placeholders with custom sizes\n\n🤖 **${global.settings?.botName || 'Bot'} v${global.settings?.version || '1.0'}**`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Free Image Generator',
                            body: `Generated from ${imageSource}`,
                            thumbnailUrl: imageUrl,
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: '❌ **Image Generation Failed**\n\n**🔄 Try:**\n• Different search terms\n• `.img-free random` for random image\n• `.img-free placeholder 500x300` for placeholder\n\n💡 This service uses free APIs and may have occasional limitations.'
                });
            }
            
        } catch (error) {
            console.error('Free image generation error:', error);
            await sock.sendMessage(from, {
                text: '❌ **Service Temporarily Unavailable**\n\n🔧 The image service is experiencing issues.\n\n**🔄 Please try:**\n• Again in a few moments\n• Different search terms\n• `.img-free random` for random images'
            });
        }
    }
};
