
import sharp from 'sharp';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const command = {
    name: 'sticker',
    aliases: ['s', 'stick', 'toSticker'],
    description: 'Convert image or video to sticker (supports images and short videos)',
    usage: 'sticker (reply to image/video)',
    category: 'tools',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            let mediaMessage = null;
            let isVideo = false;
            
            // Check if replying to a message
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                if (quotedMsg.imageMessage) {
                    mediaMessage = quotedMsg.imageMessage;
                } else if (quotedMsg.videoMessage) {
                    mediaMessage = quotedMsg.videoMessage;
                    isVideo = true;
                }
            }
            // Check if current message has media
            else if (msg.message?.imageMessage) {
                mediaMessage = msg.message.imageMessage;
            } else if (msg.message?.videoMessage) {
                mediaMessage = msg.message.videoMessage;
                isVideo = true;
            }
            
            if (!mediaMessage) {
                await sock.sendMessage(from, {
                    text: '❌ Please reply to an image or video to convert to sticker!\n\n📝 **Usage:**\n• Reply to image: .sticker\n• Reply to video: .sticker\n\n💡 **Tip:** Videos should be short (max 10 seconds)',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Sticker Converter',
                            body: 'Reply to media to convert',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=801',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            // Send processing message
            await sock.sendMessage(from, {
                text: '🔄 Converting to sticker... Please wait!'
            });
            
            try {
                // Download the media using proper Baileys method
                let buffer;
                if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                    // Create proper message object for quoted message
                    const quotedMessage = {
                        key: {
                            remoteJid: from,
                            id: msg.message.extendedTextMessage.contextInfo.stanzaId
                        },
                        message: msg.message.extendedTextMessage.contextInfo.quotedMessage
                    };
                    buffer = await downloadMediaMessage(quotedMessage, 'buffer', {});
                } else {
                    buffer = await downloadMediaMessage(msg, 'buffer', {});
                }
                
                if (!buffer) {
                    throw new Error('Failed to download media');
                }
                
                let processedBuffer = buffer;
                
                // Process media based on type
                if (!isVideo) {
                    // Process image with Sharp
                    try {
                        processedBuffer = await sharp(buffer)
                            .resize(512, 512, {
                                fit: 'contain',
                                background: { r: 0, g: 0, b: 0, alpha: 0 }
                            })
                            .webp()
                            .toBuffer();
                    } catch (sharpError) {
                        console.log('Sharp processing failed, using original buffer:', sharpError.message);
                        // Fall back to original buffer if Sharp fails
                    }
                } else {
                    // For videos, process and trim if needed
                    console.log('Processing video for sticker conversion');
                    
                    const videoInfo = mediaMessage;
                    const duration = videoInfo.seconds || 0;
                    
                    try {
                        // Create temporary files
                        const tempInputPath = path.join('./tmp', `input_${Date.now()}.mp4`);
                        const tempOutputPath = path.join('./tmp', `output_${Date.now()}.webm`);
                        
                        // Create tmp directory if it doesn't exist
                        if (!fs.existsSync('./tmp')) {
                            fs.mkdirSync('./tmp', { recursive: true });
                        }
                        
                        // Write buffer to temporary file
                        fs.writeFileSync(tempInputPath, buffer);
                        
                        // Process with FFmpeg
                        await new Promise((resolve, reject) => {
                            let ffmpegCommand = ffmpeg(tempInputPath)
                                .outputFormat('webm')
                                .videoCodec('libvpx-vp9')
                                .size('512x512')
                                .aspect('1:1')
                                .outputOptions([
                                    '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2',
                                    '-an' // Remove audio
                                ]);
                            
                            // Trim if longer than 5 seconds
                            if (duration > 5) {
                                ffmpegCommand = ffmpegCommand.duration(5);
                            }
                            
                            ffmpegCommand
                                .output(tempOutputPath)
                                .on('end', () => {
                                    try {
                                        processedBuffer = fs.readFileSync(tempOutputPath);
                                        // Clean up temp files
                                        fs.unlinkSync(tempInputPath);
                                        fs.unlinkSync(tempOutputPath);
                                        resolve();
                                    } catch (error) {
                                        reject(error);
                                    }
                                })
                                .on('error', (error) => {
                                    console.log('FFmpeg processing failed:', error.message);
                                    // Clean up temp files
                                    try {
                                        fs.unlinkSync(tempInputPath);
                                        fs.unlinkSync(tempOutputPath);
                                    } catch (cleanupError) {
                                        console.log('Cleanup error:', cleanupError.message);
                                    }
                                    // Use original buffer as fallback
                                    processedBuffer = buffer;
                                    resolve();
                                })
                                .run();
                        });
                    } catch (videoProcessError) {
                        console.log('Video processing error:', videoProcessError.message);
                        processedBuffer = buffer;
                    }
                }
                
                // Create sticker
                await sock.sendMessage(from, {
                    sticker: processedBuffer
                });
                
            } catch (downloadError) {
                console.error('Media download error:', downloadError);
                await sock.sendMessage(from, {
                    text: '❌ Failed to process media. Please try again with a different image/video.\n\n**Possible issues:**\n• File too large\n• Unsupported format\n• Network error'
                });
            }
            
        } catch (error) {
            console.error('Sticker command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error creating sticker. Please try again.'
            });
        }
    }
};
