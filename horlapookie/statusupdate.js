
export const command = {
    name: 'statusupdate',
    aliases: ['setstatus', 'updatestatus'],
    description: 'Set personalized status updates',
    usage: 'statusupdate <text> | statusupdate image (reply to image) | statusupdate clear',
    category: 'tools',
    cooldown: 30,
    
    async execute(sock, msg, args, context) {
        const { from, sender, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '📢 **Status Update Manager**\n\nUsage:\n• .statusupdate <text> - Set text status\n• .statusupdate image (reply to image) - Set image status\n• .statusupdate clear - Clear status\n\n💡 Your status will be visible to your contacts',
                contextInfo: {
                    externalAdReply: {
                        title: 'Status Update',
                        body: 'Personalized status manager',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const command = argsArray[0]?.toLowerCase();
        
        try {
            switch (command) {
                case 'image':
                    await handleImageStatus(sock, msg, from, settings);
                    break;
                    
                case 'clear':
                    await handleClearStatus(sock, from, settings);
                    break;
                    
                default:
                    await handleTextStatus(sock, from, args, settings);
                    break;
            }
        } catch (error) {
            console.error('Status update error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error updating status. Please try again.'
            });
        }
        
        async function handleTextStatus(sock, from, statusText, settings) {
            try {
                // Set text status
                await sock.updateProfileStatus(statusText);
                
                await sock.sendMessage(from, {
                    text: `✅ **Status Updated Successfully!**\n\n📢 **New Status:**\n"${statusText}"\n\n⏰ **Updated:** ${new Date().toLocaleString()}\n\n💡 Your contacts can now see your new status!`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Status Updated',
                            body: 'Text status set successfully',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } catch (error) {
                await sock.sendMessage(from, {
                    text: '❌ Failed to update text status. Please try again.'
                });
            }
        }
        
        async function handleImageStatus(sock, msg, from, settings) {
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const imageMsg = quotedMsg?.imageMessage;
            
            if (!imageMsg) {
                await sock.sendMessage(from, {
                    text: '❌ Please reply to an image with .statusupdate image'
                });
                return;
            }
            
            try {
                // Download image
                const buffer = await sock.downloadMediaMessage(quotedMsg);
                
                // Set image status (WhatsApp story)
                await sock.sendMessage('status@broadcast', {
                    image: buffer,
                    caption: '📸 Updated via bot'
                });
                
                await sock.sendMessage(from, {
                    text: `✅ **Image Status Updated!**\n\n📸 **Status Type:** Image\n⏰ **Updated:** ${new Date().toLocaleString()}\n\n💡 Your image status is now live on WhatsApp!`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Image Status Updated',
                            body: 'Image status set successfully',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } catch (error) {
                await sock.sendMessage(from, {
                    text: '❌ Failed to update image status. Please try again.'
                });
            }
        }
        
        async function handleClearStatus(sock, from, settings) {
            try {
                // Clear status
                await sock.updateProfileStatus('');
                
                await sock.sendMessage(from, {
                    text: `✅ **Status Cleared!**\n\n🗑️ **Action:** Status removed\n⏰ **Updated:** ${new Date().toLocaleString()}\n\n💡 Your status is now empty.`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Status Cleared',
                            body: 'Status successfully removed',
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } catch (error) {
                await sock.sendMessage(from, {
                    text: '❌ Failed to clear status. Please try again.'
                });
            }
        }
    }
};
