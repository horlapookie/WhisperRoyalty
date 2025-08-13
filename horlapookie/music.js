
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export const command = {
    name: 'music',
    aliases: ['song', 'track', 'download', 'ytmp3'],
    description: 'Download music from YouTube and other platforms',
    usage: 'music <song name or URL>',
    category: 'media',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a song name or URL!\n\n📝 **Usage:**\n• .music Despacito\n• .music https://youtube.com/watch?v=...\n• .music https://open.spotify.com/track/...\n\n🎵 **Supported platforms:**\n• YouTube\n• Spotify\n• SoundCloud\n• Apple Music',
                contextInfo: {
                    externalAdReply: {
                        title: '🎵 Music Downloader',
                        body: 'Download music from multiple platforms',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=music',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        const query = args.trim();

        // Send processing message
        const processingMsg = await sock.sendMessage(from, {
            text: '🔍 Searching for music... Please wait!'
        });

        try {
            // Create temp directory
            const tempDir = './tmp';
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Use ytdl-core or youtube-search-api to find and download
            const searchResult = await searchYouTube(query);
            
            if (!searchResult) {
                throw new Error('No results found');
            }

            // Download using ytdl-core
            const audioBuffer = await downloadAudio(searchResult.url);
            
            if (!audioBuffer) {
                throw new Error('Failed to download audio');
            }

            // Get file size
            const fileSizeKB = Math.round(audioBuffer.length / 1024);
            const fileSizeMB = (fileSizeKB / 1024).toFixed(2);

            // Send the audio file
            await sock.sendMessage(from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${searchResult.title.slice(0, 50)}.mp3`,
                caption: `🎵 **Music Downloaded Successfully!**\n\n🎧 **Title:** ${searchResult.title}\n👤 **Artist:** ${searchResult.artist || 'Unknown'}\n📁 **File Size:** ${fileSizeMB} MB\n⏱️ **Duration:** ${searchResult.duration || 'Unknown'}\n\n🤖 Downloaded by yourhïghness bot`,
                contextInfo: {
                    externalAdReply: {
                        title: '🎵 Music Download Complete',
                        body: `${fileSizeMB} MB • MP3 Format`,
                        thumbnailUrl: searchResult.thumbnail || 'https://picsum.photos/300/300?random=music2',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });

        } catch (error) {
            console.error('Music download error:', error);

            await sock.sendMessage(from, {
                text: `❌ **Download Failed**\n\n**Error:** ${error.message}\n\n💡 **Try:**\n• Different search terms\n• Direct YouTube URL\n• Checking your internet connection\n• Using .linkdl for direct links`,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Download Failed',
                        body: 'Music download error',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=error',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};

async function searchYouTube(query) {
    try {
        // Use YouTube search API alternative
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=YOUR_API_KEY`;
        
        // Alternative: Use ytsr for searching
        const { default: ytsr } = await import('ytsr');
        const searchResults = await ytsr(query, { limit: 1 });
        
        if (searchResults.items.length > 0) {
            const video = searchResults.items[0];
            return {
                url: video.url,
                title: video.title,
                duration: video.duration,
                thumbnail: video.bestThumbnail?.url,
                artist: video.author?.name
            };
        }
        
        return null;
    } catch (error) {
        console.error('YouTube search error:', error);
        return null;
    }
}

async function downloadAudio(url) {
    try {
        const { default: ytdl } = await import('ytdl-core');
        
        const info = await ytdl.getInfo(url);
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        
        if (!audioFormat) {
            throw new Error('No audio format available');
        }

        const chunks = [];
        const stream = ytdl(url, { format: audioFormat });
        
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
        
    } catch (error) {
        console.error('Audio download error:', error);
        return null;
    }
}
