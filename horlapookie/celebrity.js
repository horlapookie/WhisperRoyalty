
import fetch from 'node-fetch';

export const command = {
    name: 'imgd',
    aliases: ['imgdownloader', 'imgsearch', 'searchimg'],
    description: 'Search and download images from the internet',
    usage: 'imgd <search term>',
    category: 'media',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a search term!\n\n📝 **Examples:**\n• .imgd gun\n• .imgd house\n• .imgd beautiful sunset\n• .imgd sports car\n• .imgd nature landscape\n• .imgd cat cute',
                contextInfo: {
                    externalAdReply: {
                        title: 'Image Downloader',
                        body: 'Search and download any images',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=300&h=300&fit=crop',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            // Send searching message
            await sock.sendMessage(from, {
                text: `🔍 Searching for "${query}" images... Please wait!`
            });
            
            // Use multiple image sources for better results
            let selectedImages = [];
            
            // Primary source: Unsplash API
            const unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // You can get this free from unsplash.com/developers
            
            try {
                const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=all`;
                
                const response = await fetch(unsplashUrl, {
                    headers: {
                        'Authorization': `Client-ID ${unsplashAccessKey}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const images = data.results || [];
                    
                    if (images.length > 0) {
                        // Get 3 random images from results
                        const shuffled = images.sort(() => 0.5 - Math.random());
                        selectedImages = shuffled.slice(0, 3).map(img => ({
                            url: img.urls.regular,
                            description: img.description || img.alt_description || query,
                            photographer: img.user.name,
                            source: 'Unsplash'
                        }));
                    }
                }
            } catch (apiError) {
                console.log('Unsplash API failed, using fallback sources');
            }
            
            // Fallback source: Direct Unsplash random images
            if (selectedImages.length === 0) {
                selectedImages = [
                    {
                        url: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`,
                        description: `${query} image`,
                        photographer: 'Unsplash',
                        source: 'Unsplash Random'
                    },
                    {
                        url: `https://source.unsplash.com/900x700/?${encodeURIComponent(query)},HD`,
                        description: `HD ${query} image`,
                        photographer: 'Unsplash',
                        source: 'Unsplash Random'
                    },
                    {
                        url: `https://source.unsplash.com/1024x768/?${encodeURIComponent(query)},quality`,
                        description: `High quality ${query} image`,
                        photographer: 'Unsplash',
                        source: 'Unsplash Random'
                    }
                ];
            }
            
            // Additional fallback: Picsum with query-based seeding
            if (selectedImages.length < 3) {
                const queryHash = query.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
                
                selectedImages.push({
                    url: `https://picsum.photos/800/600?random=${Math.abs(queryHash)}`,
                    description: `Random ${query} style image`,
                    photographer: 'Lorem Picsum',
                    source: 'Picsum'
                });
            }
            
            // Send images
            for (let i = 0; i < selectedImages.length; i++) {
                const image = selectedImages[i];
                
                try {
                    await sock.sendMessage(from, {
                        image: { url: image.url },
                        caption: `📸 **${image.description}**\n\n🔍 **Search:** ${query}\n📷 **Source:** ${image.source}\n👤 **Credit:** ${image.photographer}\n📊 **Result:** ${i + 1}/${selectedImages.length}\n\n✨ **yourhïghness Image Downloader**`,
                        contextInfo: {
                            externalAdReply: {
                                title: `${query} - Image ${i + 1}`,
                                body: `Found by yourhïghness Image Downloader`,
                                thumbnailUrl: image.url,
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    
                    // Small delay between images
                    if (i < selectedImages.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (sendError) {
                    console.error(`Failed to send image ${i + 1}:`, sendError);
                }
            }
            
        } catch (error) {
            console.error('Image search error:', error);
            await sock.sendMessage(from, {
                text: `❌ Failed to search for "${query}" images.\n\n🔄 **Please try again with:**\n• Different search terms\n• More specific keywords\n• Check your internet connection\n\n**Popular searches:**\n• .imgd nature\n• .imgd technology\n• .imgd animals\n• .imgd architecture`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Image Search Failed',
                        body: 'Try different keywords',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=300&h=300&fit=crop',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
