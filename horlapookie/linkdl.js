
import axios from 'axios';
import fs from 'fs';

export const command = {
    name: 'linkdl',
    aliases: ['download', 'dl', 'socialdl'],
    description: 'Download videos from various social media platforms',
    usage: 'linkdl <social_media_url>',
    category: 'media',
    cooldown: 15,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '📥 **Universal Link Downloader**\n\n🔗 **Supported platforms:**\n• Instagram (posts, reels, stories)\n• TikTok (videos, slideshows)\n• Twitter/X (videos, images)\n• Facebook (videos, posts)\n• YouTube (shorts, videos)\n• Snapchat (videos)\n\n📝 **Usage:** `.linkdl <url>`\n\n**Example:** `.linkdl https://instagram.com/p/xyz123`',
                contextInfo: {
                    externalAdReply: {
                        title: 'Universal Link Downloader',
                        body: 'Download from any social media',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const url = args.trim();
        
        // Validate URL
        if (!url.includes('http://') && !url.includes('https://')) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a valid URL starting with http:// or https://'
            });
            return;
        }
        
        try {
            const initialMsg = await sock.sendMessage(from, {
                text: '📥 Analyzing link and preparing download...'
            });
            
            // Detect platform
            let platform = 'unknown';
            if (url.includes('instagram.com')) {
                platform = 'instagram';
            } else if (url.includes('tiktok.com')) {
                platform = 'tiktok';
            } else if (url.includes('twitter.com') || url.includes('x.com')) {
                platform = 'twitter';
            } else if (url.includes('facebook.com') || url.includes('fb.com')) {
                platform = 'facebook';
            } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                platform = 'youtube';
            } else if (url.includes('snapchat.com')) {
                platform = 'snapchat';
            }
            
            // For demonstration, we'll simulate the download process
            await sock.sendMessage(from, {
                text: `📥 **Link Download**\n\n🔍 **Platform:** ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n📎 **URL:** ${url}\n\n✅ **Status:** Processing...\n\n⚠️ **Note:** This is a demonstration. Real implementation would require specific API endpoints or web scraping libraries for each platform.\n\n💡 **Recommended:** Use platform-specific commands like:\n• .instagram <url>\n• .tiktok <url>\n• .twitter <url>`,
                contextInfo: {
                    externalAdReply: {
                        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Download`,
                        body: 'Processing download request',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: url,
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            console.error('Link download error:', error);
            await sock.sendMessage(from, {
                text: `❌ Download failed: ${error.message}\n\n💡 **Tips:**\n• Make sure the URL is valid and accessible\n• Try using platform-specific commands\n• Some content may be private or restricted`
            });
        }
    }
};
