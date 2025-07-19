
import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';
import fs from 'fs';

export const command = {
    name: 'yt',
    aliases: ['youtube', 'ytdl'],
    description: 'Download YouTube videos or audio',
    usage: 'yt <video/audio> <search query or URL>',
    category: 'media',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please specify format and search query!\n\n📖 **Usage:**\n• `.yt video <song name>` - Download video\n• `.yt audio <song name>` - Download audio\n• `.yt video <YouTube URL>` - Download from URL\n• `.yt audio <YouTube URL>` - Download audio from URL\n\n📝 **Examples:**\n• `.yt video Imagine Dragons Believer`\n• `.yt audio https://youtube.com/watch?v=...`'
            });
            return;
        }
        
        const parts = args.trim().split(' ');
        const format = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ');
        
        if (!['video', 'audio'].includes(format)) {
            await sock.sendMessage(from, {
                text: '❌ Invalid format! Use `video` or `audio`\n\nExample: `.yt video Billie Eilish bad guy`'
            });
            return;
        }
        
        if (!query) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a search query or YouTube URL!'
            });
            return;
        }
        
        let videoUrl = '';
        let videoInfo = null;
        
        try {
            // Send initial message
            const initialMsg = await sock.sendMessage(from, {
                text: '🔍 Searching for your content...'
            });
            
            // Check if query is a URL
            if (query.includes('youtube.com') || query.includes('youtu.be')) {
                videoUrl = query;
                try {
                    videoInfo = await ytdl.getInfo(videoUrl);
                } catch (error) {
                    throw new Error('Invalid YouTube URL');
                }
            } else {
                // Search for the video
                const searchResults = await yts(query);
                
                if (!searchResults.videos.length) {
                    throw new Error('No results found for your search');
                }
                
                const video = searchResults.videos[0];
                videoUrl = video.url;
                videoInfo = await ytdl.getInfo(videoUrl);
            }
            
            const title = videoInfo.videoDetails.title;
            const duration = videoInfo.videoDetails.lengthSeconds;
            const thumbnail = videoInfo.videoDetails.thumbnails[0]?.url;
            
            // Update message with video info
            await sock.sendMessage(from, {
                text: `🎵 **Found:** ${title}\n⏱️ **Duration:** ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}\n\n📥 Downloading ${format}...`,
                edit: initialMsg.key
            });
            
            // Download the media
            const filename = `./tmp/${Date.now()}_${title.replace(/[^\w\s]/gi, '').substring(0, 50)}`;
            
            // Create tmp directory if it doesn't exist
            if (!fs.existsSync('./tmp')) {
                fs.mkdirSync('./tmp');
            }
            
            if (format === 'video') {
                const videoPath = `${filename}.mp4`;
                const videoStream = ytdl(videoUrl, { 
                    quality: 'highest',
                    filter: 'audioandvideo'
                });
                
                const writeStream = fs.createWriteStream(videoPath);
                videoStream.pipe(writeStream);
                
                await new Promise((resolve, reject) => {
                    writeStream.on('finish', resolve);
                    writeStream.on('error', reject);
                });
                
                // Send video
                await sock.sendMessage(from, {
                    video: fs.readFileSync(videoPath),
                    caption: `🎵 **${title}**\n\n📥 Downloaded via yourhïghness Bot\n🔗 ${videoUrl}`,
                    contextInfo: {
                        externalAdReply: {
                            title: title,
                            body: 'YouTube Video Download',
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl,
                            mediaType: 1
                        }
                    }
                });
                
                // Clean up
                fs.unlinkSync(videoPath);
                
            } else {
                const audioPath = `${filename}.mp3`;
                const audioStream = ytdl(videoUrl, { 
                    quality: 'highestaudio',
                    filter: 'audioonly'
                });
                
                const writeStream = fs.createWriteStream(audioPath);
                audioStream.pipe(writeStream);
                
                await new Promise((resolve, reject) => {
                    writeStream.on('finish', resolve);
                    writeStream.on('error', reject);
                });
                
                // Send audio
                await sock.sendMessage(from, {
                    audio: fs.readFileSync(audioPath),
                    mimetype: 'audio/mpeg',
                    caption: `🎵 **${title}**\n\n📥 Downloaded via yourhïghness Bot\n🔗 ${videoUrl}`,
                    contextInfo: {
                        externalAdReply: {
                            title: title,
                            body: 'YouTube Audio Download',
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl,
                            mediaType: 1
                        }
                    }
                });
                
                // Clean up
                fs.unlinkSync(audioPath);
            }
            
        } catch (error) {
            console.error('YouTube download error:', error);
            await sock.sendMessage(from, {
                text: `❌ Download failed: ${error.message}\n\n💡 Try:\n• Using a different search term\n• Checking if the URL is valid\n• Using a shorter video (under 10 minutes)`
            });
        }
    }
};
