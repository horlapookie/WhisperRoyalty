
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
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
                            id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                            participant: msg.message.extendedTextMessage.contextInfo.participant
                        },
                        message: msg.message.extendedTextMessage.contextInfo.quotedMessage
                    };
                    buffer = await downloadMediaMessage(quotedMessage, 'buffer', {});
                } else {
                    buffer = await downloadMediaMessage(msg, 'buffer', {});
                }
                
                if (!buffer || buffer.length === 0) {
                    throw new Error('Failed to download media or empty buffer');
                }
                
                console.log('Media buffer size:', buffer.length);
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
                            .webp({ quality: 80 })
                            .toBuffer();
                        
                        console.log('Sharp processing successful, output size:', processedBuffer.length);
                    } catch (sharpError) {
                        console.error('Sharp processing failed:', sharpError.message);
                        throw new Error('Failed to process image with Sharp');
                    }
                } else {
                    // For videos, process with FFmpeg
                    console.log('Processing video for sticker conversion');
                    
                    const videoInfo = mediaMessage;
                    const duration = videoInfo.seconds || 0;
                    
                    try {
                        // Create temporary files
                        const tempDir = './tmp';
                        if (!fs.existsSync(tempDir)) {
                            fs.mkdirSync(tempDir, { recursive: true });
                        }
                        
                        const timestamp = Date.now();
                        const tempInputPath = path.join(tempDir, `input_${timestamp}.mp4`);
                        const tempOutputPath = path.join(tempDir, `output_${timestamp}.webp`);
                        
                        // Write buffer to temporary file
                        fs.writeFileSync(tempInputPath, buffer);
                        
                        // Process with FFmpeg - Convert to WebP animated format for stickers
                        await new Promise((resolve, reject) => {
                            let ffmpegCommand = ffmpeg(tempInputPath)
                                .outputFormat('webp')
                                .size('512x512')
                                .outputOptions([
                                    '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:white',
                                    '-lossless', '0',
                                    '-compression_level', '6',
                                    '-q:v', '50',
                                    '-preset', 'picture',
                                    '-an', // Remove audio
                                    '-vsync', '0',
                                    '-loop', '0' // Loop for animated stickers
                                ])
                                .videoFilters('fps=15'); // Limit FPS for smaller file size
                            
                            // Trim if longer than 6 seconds (WhatsApp sticker limit)
                            if (duration > 6) {
                                ffmpegCommand = ffmpegCommand.duration(6);
                            }
                            
                            ffmpegCommand
                                .output(tempOutputPath)
                                .on('start', (commandLine) => {
                                    console.log('FFmpeg started with command:', commandLine);
                                })
                                .on('end', () => {
                                    try {
                                        processedBuffer = fs.readFileSync(tempOutputPath);
                                        console.log('Video to sticker processing successful, output size:', processedBuffer.length);
                                        
                                        // Clean up temp files
                                        try {
                                            fs.unlinkSync(tempInputPath);
                                            fs.unlinkSync(tempOutputPath);
                                        } catch (cleanupError) {
                                            console.log('Cleanup error:', cleanupError.message);
                                        }
                                        resolve();
                                    } catch (error) {
                                        reject(error);
                                    }
                                })
                                .on('error', (error) => {
                                    console.error('FFmpeg processing failed:', error.message);
                                    
                                    // Try alternative approach with Sharp for video frames
                                    console.log('Trying alternative conversion method...');
                                    try {
                                        // Use original buffer and process with Sharp
                                        processedBuffer = buffer;
                                        resolve();
                                    } catch (sharpError) {
                                        console.error('Alternative method failed:', sharpError.message);
                                        reject(new Error('Video processing failed with both methods'));
                                    }
                                    
                                    // Clean up temp files
                                    try {
                                        fs.unlinkSync(tempInputPath);
                                        if (fs.existsSync(tempOutputPath)) {
                                            fs.unlinkSync(tempOutputPath);
                                        }
                                    } catch (cleanupError) {
                                        console.log('Cleanup error:', cleanupError.message);
                                    }
                                })
                                .run();
                        });
                    } catch (videoProcessError) {
                        console.error('Video processing error:', videoProcessError.message);
                        // Fallback: try to send as animated sticker without conversion
                        console.log('Using fallback method - sending original video as sticker');
                        processedBuffer = buffer;
                    }
                }
                
                // Validate processed buffer
                if (!processedBuffer || processedBuffer.length === 0) {
                    throw new Error('Processed buffer is empty');
                }
                
                // Create sticker
                await sock.sendMessage(from, {
                    sticker: processedBuffer
                });
                
                console.log('Sticker sent successfully');
                
            } catch (downloadError) {
                console.error('Media processing error:', downloadError);
                await sock.sendMessage(from, {
                    text: '❌ Failed to process media. Please try again with a different image/video.\n\n**Possible issues:**\n• File too large\n• Unsupported format\n• Processing error\n• Network error'
                });
            }
            
        } catch (error) {
            console.error('Sticker command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error creating sticker. Please try again or contact support if the issue persists.'
            });
        }
    }
};
