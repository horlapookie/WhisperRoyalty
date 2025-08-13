
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export const command = {
    name: 'sticker2video',
    aliases: ['s2vid', 'stickertovideo', 'sticker2vid'],
    description: 'Convert animated sticker to video',
    usage: 'sticker2video (reply to animated sticker)',
    category: 'tools',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            let stickerMessage = null;
            
            // Check if replying to a message
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                if (quotedMsg.stickerMessage) {
                    stickerMessage = quotedMsg.stickerMessage;
                }
            }
            // Check if current message has sticker
            else if (msg.message?.stickerMessage) {
                stickerMessage = msg.message.stickerMessage;
            }
            
            if (!stickerMessage) {
                await sock.sendMessage(from, {
                    text: '❌ Please reply to an animated sticker to convert to video!\n\n📝 **Usage:**\n• Reply to animated sticker: .s2vid\n• Reply to animated sticker: .sticker2video\n\n💡 **Tip:** Only works with animated stickers',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Sticker to Video Converter',
                            body: 'Reply to animated sticker to convert',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=803',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            // Check if sticker is animated
            if (!stickerMessage.isAnimated) {
                await sock.sendMessage(from, {
                    text: '❌ This sticker is not animated!\n\n💡 **Tip:** Only animated stickers can be converted to video. Static stickers can be converted to images using .s2img'
                });
                return;
            }
            
            // Send processing message
            await sock.sendMessage(from, {
                text: '🔄 Converting animated sticker to video... Please wait!'
            });
            
            try {
                // Download the sticker
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
                
                if (!buffer) {
                    throw new Error('Failed to download sticker');
                }
                
                // Send as video (animated stickers are usually in WebM format)
                // Try multiple formats for better compatibility
                try {
                    // First try as MP4 video
                    await sock.sendMessage(from, {
                        video: buffer,
                        caption: '✅ Animated sticker converted to video!',
                        mimetype: 'video/mp4',
                        gifPlayback: false
                    });
                } catch (videoError) {
                    console.log('MP4 failed, trying GIF:', videoError.message);
                    try {
                        // Try as GIF playback
                        await sock.sendMessage(from, {
                            video: buffer,
                            caption: '✅ Animated sticker converted to video!',
                            gifPlayback: true
                        });
                    } catch (gifError) {
                        console.log('GIF failed, trying WebM:', gifError.message);
                        try {
                            // Try as WebM video
                            await sock.sendMessage(from, {
                                video: buffer,
                                caption: '✅ Animated sticker converted to video!',
                                mimetype: 'video/webm'
                            });
                        } catch (webmError) {
                            console.log('WebM failed, sending as document:', webmError.message);
                            // Final fallback as document
                            await sock.sendMessage(from, {
                                document: buffer,
                                fileName: 'animated_sticker.mp4',
                                mimetype: 'video/mp4',
                                caption: '✅ Animated sticker converted to video!\n\n📱 **Note:** Download and view the video file.'
                            });
                        }
                    }
                }
                
            } catch (downloadError) {
                console.error('Sticker download error:', downloadError);
                await sock.sendMessage(from, {
                    text: '❌ Failed to process sticker. Please try again.\n\n**Possible issues:**\n• Invalid sticker format\n• Network error\n• Processing error'
                });
            }
            
        } catch (error) {
            console.error('Sticker2Video command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error converting sticker. Please try again.'
            });
        }
    }
};
