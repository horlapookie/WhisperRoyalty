
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';

export const command = {
    name: 'sticker2image',
    aliases: ['s2img', 'stickertoimage', 'sticker2img'],
    description: 'Convert sticker to image',
    usage: 'sticker2image (reply to sticker)',
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
                    text: '❌ Please reply to a sticker to convert to image!\n\n📝 **Usage:**\n• Reply to sticker: .s2img\n• Reply to sticker: .sticker2image\n\n💡 **Tip:** Works with both animated and static stickers',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Sticker to Image Converter',
                            body: 'Reply to sticker to convert',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=802',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            // Send processing message
            await sock.sendMessage(from, {
                text: '🔄 Converting sticker to image... Please wait!'
            });
            
            try {
                // Download the sticker
                let buffer;
                if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                    // For quoted messages, use the quoted message directly
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
                    throw new Error('Failed to download sticker or empty buffer');
                }
                
                console.log('Sticker buffer size:', buffer.length);
                
                let processedBuffer;
                
                // Process sticker with Sharp
                try {
                    processedBuffer = await sharp(buffer)
                        .resize(512, 512, {
                            fit: 'contain',
                            background: { r: 255, g: 255, b: 255, alpha: 1 }
                        })
                        .jpeg({ quality: 90 })
                        .toBuffer();
                    
                    console.log('Sharp processing successful, output size:', processedBuffer.length);
                } catch (sharpError) {
                    console.error('Sharp processing failed:', sharpError.message);
                    
                    // Try to use original buffer if Sharp fails
                    try {
                        // Try basic Sharp conversion without resize
                        processedBuffer = await sharp(buffer)
                            .jpeg({ quality: 90 })
                            .toBuffer();
                        
                        console.log('Basic Sharp conversion successful');
                    } catch (basicSharpError) {
                        console.error('Basic Sharp conversion also failed:', basicSharpError.message);
                        throw new Error('Failed to process sticker with Sharp');
                    }
                }
                
                // Validate processed buffer
                if (!processedBuffer || processedBuffer.length === 0) {
                    throw new Error('Processed buffer is empty');
                }
                
                // Send as image
                await sock.sendMessage(from, {
                    image: processedBuffer,
                    caption: '✅ Sticker converted to image!',
                    mimetype: 'image/jpeg'
                });
                
                console.log('Image sent successfully');
                
            } catch (downloadError) {
                console.error('Sticker processing error:', downloadError);
                await sock.sendMessage(from, {
                    text: '❌ Failed to process sticker. Please try again.\n\n**Possible issues:**\n• Invalid sticker format\n• Corrupted sticker data\n• Network error\n• Processing error'
                });
            }
            
        } catch (error) {
            console.error('Sticker2Image command error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error converting sticker. Please try again or contact support if the issue persists.'
            });
        }
    }
};
