
import { settings } from '../settings.js';

import tts from "google-tts-api";

export const command = {
    name: 'tts',
    aliases: ['say', 'speak'],
    description: 'Convert text to speech',
    usage: 'tts <text> or tts hin <text> for Hindi',
    category: 'tools',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        let lang = "en";
        let text = args.trim();
        
        // Check if replying to a message
        if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
            text = msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
        }
        
        if (!text && !args.trim()) {
            return await sock.sendMessage(from, {
                text: `❎ Text is empty! \nSend .tts <text>`
            }, { quoted: msg });
        }
        
        // Check for Hindi language
        if (args.startsWith('hin ')) {
            lang = "hi-IN";
            text = args.replace('hin ', '').trim();
        }
        
        if (!text || text === "") {
            return await sock.sendMessage(from, {
                text: `❎ Text is empty! \nSend .tts <text>`
            }, { quoted: msg });
        }
        
        if (text.length >= 200) {
            return await sock.sendMessage(from, {
                text: `❎ Word Limit: ${text.length}/200 \nSend .tts <text>`
            }, { quoted: msg });
        }
        
        try {
            const url = tts.getAudioUrl(text, {
                lang: lang,
                slow: false,
                host: "https://translate.google.com",
            });
            
            if (!url) {
                return await sock.sendMessage(from, {
                    text: `❎ Error generating audio!`
                }, { quoted: msg });
            }
            
            await sock.sendMessage(from, {
                audio: { url: url },
                mimetype: "audio/mpeg",
                fileName: "tts.mp3",
            }, { quoted: msg });
            
        } catch (error) {
            console.error('TTS Error:', error);
            await sock.sendMessage(from, {
                text: `❎ Error generating speech!`
            }, { quoted: msg });
        }
    }
};
