
import { settings } from '../settings.js';

function extractPhoneNumber(jid) {
    if (!jid) return null;
    return jid.split('@')[0];
}

export const command = {
    name: 'save',
    aliases: ['savestatus', 'dl'],
    description: 'Save a status/photo/video and send it to your private chat',
    usage: 'save (reply to status/photo/video)',
    category: 'tools',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Allow everyone to use the save command
        // (Removed owner-only restriction)

        try {
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quotedMsg) {
                await sock.sendMessage(from, {
                    react: { text: '❌', key: msg.key }
                });
                return;
            }

            // Extract the mimetype from the quoted message
            let mime = (quotedMsg.imageMessage?.mimetype || 
                       quotedMsg.videoMessage?.mimetype || 
                       quotedMsg.audioMessage?.mimetype || "");
            
            console.log("Extracted mimetype:", mime);

            let mediaType = "";
            let mediaMessage = null;
            
            if (quotedMsg.imageMessage) {
                mediaType = "image";
                mediaMessage = quotedMsg.imageMessage;
                mime = mediaMessage.mimetype || "image/jpeg";
            } else if (quotedMsg.videoMessage) {
                mediaType = "video";
                mediaMessage = quotedMsg.videoMessage;
                mime = mediaMessage.mimetype || "video/mp4";
            } else if (quotedMsg.audioMessage) {
                mediaType = "audio";
                mediaMessage = quotedMsg.audioMessage;
                mime = mediaMessage.mimetype || "audio/ogg";
            } else {
                console.log("Unsupported message type");
                await sock.sendMessage(from, {
                    react: { text: '❌', key: msg.key }
                });
                return;
            }

            // Download the media
            const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
            const stream = await downloadContentFromMessage(mediaMessage, mediaType);
            
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (!buffer || buffer.length === 0) {
                await sock.sendMessage(from, {
                    react: { text: '❌', key: msg.key }
                });
                return;
            }

            // Prepare the message options based on the media type
            let messageOptions = {};
            const caption = `✅ **Media Saved Successfully!**\n\n📱 **Type:** ${mediaType.toUpperCase()}\n📏 **Size:** ${(buffer.length / 1024 / 1024).toFixed(2)} MB\n⏰ **Saved:** ${new Date().toLocaleString()}\n\n💾 Downloaded via ${settings.botName}`;
            
            if (mediaType === "image") {
                messageOptions = { 
                    image: buffer, 
                    mimetype: mime,
                    caption: caption
                };
            } else if (mediaType === "video") {
                messageOptions = { 
                    video: buffer, 
                    mimetype: mime,
                    caption: caption
                };
            } else if (mediaType === "audio") {
                messageOptions = { 
                    audio: buffer, 
                    mimetype: mime,
                    caption: caption
                };
            }

            // Send the media to the owner's private chat
            await sock.sendMessage(sender, messageOptions);
            
            // React with success emoji
            await sock.sendMessage(from, {
                react: { text: '✅', key: msg.key }
            });

        } catch (error) {
            console.error("Error in save command:", error);
            await sock.sendMessage(from, {
                react: { text: '❌', key: msg.key }
            });
        }
    }
};
