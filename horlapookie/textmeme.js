import { writeFile } from 'fs/promises';
import fs from 'fs';
const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;

export const command = {
    name: 'textmeme',
    aliases: ['text', 'txt', 'texmeme'],
    description: 'Create a meme with text on image',
    usage: 'textmeme TopText;BottomText;FontSize;FontColor;StrokeColor (reply to image)',
    category: 'fun',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from, settings } = context;

        if (!args.trim()) {
            return await sock.sendMessage(from, {
                text: `*Use:* .textmeme TopText;BottomText;FontSize;FontColor;FontStrokeColor\n\n*Example:* .textmeme Hello;World;50;White;Black`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Text Meme Generator',
                        body: 'Create funny text memes',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            }, { quoted: msg });
        }

        // Check if replying to a message
        if (msg.message.extendedTextMessage) {
            msg['message'] = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        }

        const messageType = Object.keys(msg.message || {})[0];
        const isMedia = messageType === "imageMessage";
        const isTaggedImage = messageType === "extendedTextMessage" && 
                             JSON.stringify(msg.message).includes("imageMessage");

        if (!isMedia && !isTaggedImage) {
            return await sock.sendMessage(from, {
                text: `*Reply to Image Only*`
            }, { quoted: msg });
        }

        let TopText = '', BottomText = '', FontColor = 'White', FontStroke = 'Black', FontSize = 50;

        const textParts = args.trim().split(";").map(part => part.trim());
        const partsLength = textParts.length;

        if (partsLength >= 1) {
            if (partsLength === 1) {
                BottomText = textParts[0];
            } else if (partsLength >= 2) {
                TopText = textParts[0];
                BottomText = textParts[1];
            }

            if (partsLength >= 3) {
                const parsedFontSize = parseInt(textParts[2]);
                if (!isNaN(parsedFontSize)) {
                    FontSize = parsedFontSize;
                }
            }

            if (partsLength >= 4) {
                FontColor = textParts[3];
            }

            if (partsLength >= 5) {
                FontStroke = textParts[4].replace(/[`'"]/g, '');
            }
        }

        // Clean text for shell commands
        const cleanText = (text) => {
            return decodeURIComponent(text)
                .replace(/['"]/g, '')
                .replace(/[`]/g, '')
                .replace(/[\\]/g, '')
                .trim();
        };

        try {
            await sock.sendMessage(from, {
                text: `🎨 Creating meme... Please wait!`
            }, { quoted: msg });

            let downloadFilePath;
            if (msg.message.imageMessage) {
                downloadFilePath = msg.message.imageMessage;
            } else {
                downloadFilePath = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
            }

            const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
            const stream = await downloadContentFromMessage(downloadFilePath, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const media = getRandom('.jpeg');
            await writeFile(media, buffer);
            const MemePath = getRandom('.png');

            const { default: memeMaker } = await import('@erickwendel/meme-maker');

            const options = {
                image: media,
                outfile: MemePath,
                topText: cleanText(TopText),
                bottomText: cleanText(BottomText),
                fontSize: FontSize,
                fontFill: FontColor.replace(/[`'"]/g, ''),
                strokeColor: FontStroke.replace(/[`'"]/g, ''),
                strokeWeight: 1
            };

            memeMaker(options).then(async () => {
                await sock.sendMessage(from, {
                    image: fs.readFileSync(MemePath),
                    caption: `🎭 *Meme Created!*\n\n📝 Top: ${cleanText(TopText) || 'None'}\n📝 Bottom: ${cleanText(BottomText) || 'None'}\n🎨 Font Size: ${FontSize}\n🌈 Color: ${FontColor}`
                }, { quoted: msg }).then(() => {
                    try {
                        fs.unlinkSync(MemePath);
                        fs.unlinkSync(media);
                    } catch (cleanupError) {
                        console.error('Cleanup error:', cleanupError);
                    }
                });
                console.log('Meme created and sent');
            }).catch((error) => {
                console.error('Meme creation error:', error);
                sock.sendMessage(from, {
                    text: `❌ Error creating meme: ${error.message}`
                }, { quoted: msg });
            });

        } catch (error) {
            console.error('Text meme error:', error);
            await sock.sendMessage(from, {
                text: `❌ Error processing image: ${error.message}`
            }, { quoted: msg });
        }
    }
};