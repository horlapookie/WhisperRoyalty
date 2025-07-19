
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile } from 'fs/promises';

const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;

export const command = {
    name: 'mp3',
    aliases: ['mp4audio', 'tomp3'],
    description: 'Convert video to MP3 audio',
    usage: 'mp3 (reply to video)',
    category: 'tools',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        // Check if replying to a message
        if (msg.message.extendedTextMessage) {
            msg['message'] = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        }
        
        const messageType = Object.keys(msg.message || {})[0];
        const isMedia = messageType === "imageMessage" || messageType === "videoMessage";
        const isTaggedVideo = messageType === "extendedTextMessage" && 
                             JSON.stringify(msg.message).includes("videoMessage");
        
        if (!isMedia && !isTaggedVideo) {
            return await sock.sendMessage(from, {
                text: `*Reply to video only*`
            }, { quoted: msg });
        }
        
        if (messageType === "imageMessage") {
            return await sock.sendMessage(from, {
                text: `*Reply to video only, not image*`
            }, { quoted: msg });
        }
        
        try {
            await sock.sendMessage(from, {
                text: `🔄 Converting video to MP3... Please wait!`
            }, { quoted: msg });
            
            const media = getRandom('.mp4');
            const path = getRandom('.mp3');
            
            const buffer = await downloadMediaMessage(msg, 'buffer', {});
            await writeFile(media, buffer);
            
            ffmpeg()
                .input(media)
                .audioCodec('libmp3lame')
                .audioBitrate('320k')
                .noVideo()
                .outputOptions(['-preset ultrafast'])
                .on('end', async () => {
                    console.log('Conversion finished');
                    await sock.sendMessage(from, {
                        audio: fs.readFileSync(path),
                        mimetype: "audio/mpeg",
                        fileName: path,
                    }, { quoted: msg }).then(() => {
                        try {
                            fs.unlinkSync(media);
                            fs.unlinkSync(path);
                        } catch (cleanupError) {
                            console.error('Cleanup error:', cleanupError);
                        }
                    });
                })
                .on('error', (err) => {
                    console.error('FFmpeg Error:', err);
                    sock.sendMessage(from, {
                        text: `❌ Error while converting: ${err.message}`
                    }, { quoted: msg });
                })
                .save(path);
                
        } catch (error) {
            console.error('MP3 conversion error:', error);
            await sock.sendMessage(from, {
                text: `❌ Error converting video: ${error.message}`
            }, { quoted: msg });
        }
    }
};
