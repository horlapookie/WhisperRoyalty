export const command = {
    name: 'setgroupicon',
    aliases: ['setgrouppp', 'changegroupicon'],
    description: 'Set group profile picture (reply to image)',
    usage: 'setgroupicon (reply to image)',
    category: 'group',
    cooldown: 10,

    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin, isBotAdmin, isOwner } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!isGroup && !from.includes('@newsletter')) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups and channels!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Set Group Icon',
                        body: 'Groups and channels only',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=701',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        if (!isOwner && !isAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins or bot owners can change group icon!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Admin Required',
                        body: 'Insufficient permissions',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=702',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        if (!isBotAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Bot needs admin privileges to change group settings!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Bot Admin Required',
                        body: 'Make bot an admin first',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=703',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Check if replying to an image
        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isImage = quotedMessage?.imageMessage || msg.message?.imageMessage;

        if (!isImage) {
            await sock.sendMessage(from, {
                text: '❌ Please reply to an image to set as group icon!\n\n📝 **Usage:** Reply to an image with .setgroupicon',
                contextInfo: {
                    externalAdReply: {
                        title: 'Set Group Icon',
                        body: 'Reply to image required',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=704',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        try {
            await sock.sendMessage(from, {
                text: '🔄 Updating group icon... Please wait!'
            });

            // Download the image
            const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');

            let downloadFilePath;
            if (quotedMessage?.imageMessage) {
                downloadFilePath = quotedMessage.imageMessage;
            } else {
                downloadFilePath = msg.message.imageMessage;
            }

            const stream = await downloadContentFromMessage(downloadFilePath, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Update group picture
            await sock.updateProfilePicture(from, buffer);

            await sock.sendMessage(from, {
                text: `✅ **Group Icon Updated Successfully!**\n\n🎨 **Changed by:** @${sender.split('@')[0]}\n⏰ **Time:** ${new Date().toLocaleString()}\n\n🎉 **The new group icon looks great!**`,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Icon Updated',
                        body: 'Successfully changed group picture',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=705',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });

        } catch (error) {
            console.error('Set group icon error:', error);
            await sock.sendMessage(from, {
                text: `❌ Failed to update group icon!\n\n**Possible reasons:**\n• Image file too large\n• Invalid image format\n• Bot lacks sufficient permissions\n• Technical error occurred\n\n💡 Try using a smaller image (< 2MB) in JPG/PNG format.`
            });
        }
    }
};