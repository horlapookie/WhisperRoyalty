import axios from 'axios';
import FormData from 'form-data';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export const command = {
    name: 'shazam',
    aliases: ['identify', 'song', 'whatmusic'],
    description: 'Identify song from audio - reply to voice/video message',
    usage: 'shazam (reply to audio/video)',
    category: 'tools',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from, settings } = context;

        // Check if replying to a message
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMsg) {
            return await sock.sendMessage(from, {
                text: '❌ Please reply to an audio message, voice note, or video to identify the song!\n\n📝 **How to use:**\n• Reply to voice message: .shazam\n• Reply to audio file: .shazam\n• Reply to video: .shazam'
            });
        }

        const messageType = Object.keys(quotedMsg)[0];

        if (!['audioMessage', 'videoMessage', 'documentMessage'].includes(messageType)) {
            return await sock.sendMessage(from, {
                text: '❌ Please reply to an audio message, voice note, or video file!'
            });
        }

        const processingMsg = await sock.sendMessage(from, {
            text: '🎵 Analyzing audio... Please wait while I identify the song! 🔍'
        });

        try {
            // Download the media using proper Baileys method
            let media;
            const mediaMessage = quotedMsg[messageType];
            
            if (messageType === 'audioMessage' || messageType === 'videoMessage') {
                const stream = await downloadContentFromMessage(mediaMessage, messageType.replace('Message', ''));
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                media = buffer;
            } else if (messageType === 'documentMessage') {
                const doc = quotedMsg.documentMessage;
                if (doc.mimetype && (doc.mimetype.includes('audio') || doc.mimetype.includes('video'))) {
                    const stream = await downloadContentFromMessage(doc, 'document');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                    media = buffer;
                } else {
                    throw new Error('Unsupported file type');
                }
            }

            if (!media || media.length === 0) {
                throw new Error('Failed to download media or empty buffer');
            }

            // Use AudD API for song identification
            const formData = new FormData();
            formData.append('api_token', settings.auddApiKey);
            formData.append('file', media, 'audio.mp3');
            formData.append('return', 'apple_music,spotify');

            const response = await axios.post('https://api.audd.io/', formData, {
                headers: {
                    ...formData.getHeaders()
                },
                timeout: 30000
            });

            const result = response.data;

            // Delete the processing message
            try {
                await sock.sendMessage(from, { delete: processingMsg.key });
            } catch {}

            if (result.status === 'success' && result.result) {
                const track = result.result;
                let songInfo = `🎵 **Song Identified!**\n\n🎤 **Title:** ${track.title}\n👨‍🎤 **Artist:** ${track.artist}\n💿 **Album:** ${track.album || 'Unknown'}\n📅 **Release Date:** ${track.release_date || 'Unknown'}`;

                let links = '';
                if (track.apple_music?.url) {
                    links += `\n🍎 Apple Music: ${track.apple_music.url}`;
                }
                if (track.spotify?.external_urls?.spotify) {
                    links += `\n🟢 Spotify: ${track.spotify.external_urls.spotify}`;
                }

                if (links) {
                    songInfo += `\n\n🔗 **Listen on:**${links}`;
                }

                await sock.sendMessage(from, {
                    image: { url: track.spotify?.album?.images?.[0]?.url || 'https://picsum.photos/300/300?random=music' },
                    caption: songInfo,
                    contextInfo: {
                        externalAdReply: {
                            title: track.title,
                            body: `by ${track.artist}`,
                            thumbnailUrl: track.spotify?.album?.images?.[0]?.url || 'https://picsum.photos/300/300?random=music',
                            sourceUrl: track.apple_music?.url || track.spotify?.external_urls?.spotify || 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: '❌ **Song Not Found**\n\nI couldn\'t identify this song. This might be because:\n• Audio quality is too low\n• Song is not in the database\n• Background noise is too loud\n• Audio is too short\n\n💡 Try with a clearer audio clip!'
                });
            }

        } catch (error) {
            console.error('Shazam error:', error);

            // Delete the processing message
            try {
                await sock.sendMessage(from, { delete: processingMsg.key });
            } catch {}

            await sock.sendMessage(from, {
                text: `❌ **Error Identifying Song**\n\nError: ${error.message}\n\nPlease try again with:\n• Better audio quality\n• Longer audio clip (at least 10 seconds)\n• Less background noise`
            });
        }
    }
};