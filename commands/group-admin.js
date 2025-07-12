
export const command = {
    name: 'group-admin',
    aliases: ['gadmin', 'groupadmin'],
    description: 'Group administration commands - add and kick members',
    usage: 'group-admin add @user | group-admin kick @user',
    category: 'group',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin, isBotAdmin } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!isGroup) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Admin Commands',
                        body: 'Groups only feature',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=601',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (!isAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins can use this command!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Admin Required',
                        body: 'Insufficient permissions',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=602',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (!isBotAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Bot needs admin privileges to manage group members!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Bot Admin Required',
                        body: 'Make bot an admin first',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=603',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const action = argsArray[0]?.toLowerCase();
        
        try {
            switch (action) {
                case 'add':
                    await handleAddMember(sock, msg, context);
                    break;
                    
                case 'kick':
                case 'remove':
                    await handleKickMember(sock, msg, context);
                    break;
                    
                default:
                    await showGroupAdminHelp(sock, from);
                    break;
            }
        } catch (error) {
            console.error('Group admin error:', error);
            await sock.sendMessage(from, {
                text: '❌ An error occurred while executing the command. Please try again.'
            });
        }
        
        async function handleAddMember(sock, msg, context) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                await sock.sendMessage(from, {
                    text: '❌ Please mention a user to add!\n\n📝 **Example:** .group-admin add @username',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Add Group Member',
                            body: 'Mention user to add',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=604',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            try {
                const groupMetadata = await sock.groupMetadata(from);
                const participants = groupMetadata.participants;
                const isAlreadyMember = participants.some(p => p.id === mentioned);
                
                if (isAlreadyMember) {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is already a member of this group!`,
                        mentions: [mentioned]
                    });
                    return;
                }
                
                // Add member to group
                await sock.groupParticipantsUpdate(from, [mentioned], 'add');
                
                await sock.sendMessage(from, {
                    text: `✅ **Member Added Successfully!**\n\n👥 @${mentioned.split('@')[0]} has been added to the group!\n\n🎉 Welcome to the group!`,
                    mentions: [mentioned, sender],
                    contextInfo: {
                        externalAdReply: {
                            title: 'Member Added',
                            body: 'Successfully added to group',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=605',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                
            } catch (error) {
                console.error('Add member error:', error);
                await sock.sendMessage(from, {
                    text: `❌ Failed to add @${mentioned.split('@')[0]} to the group.\n\n**Possible reasons:**\n• User has privacy settings preventing group adds\n• User number doesn't exist\n• Bot lacks sufficient permissions`,
                    mentions: [mentioned]
                });
            }
        }
        
        async function handleKickMember(sock, msg, context) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                await sock.sendMessage(from, {
                    text: '❌ Please mention a user to kick!\n\n📝 **Example:** .group-admin kick @username',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Kick Group Member',
                            body: 'Mention user to remove',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=606',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }
            
            if (mentioned === sender) {
                await sock.sendMessage(from, {
                    text: '❌ You cannot kick yourself! Use the leave group option instead.'
                });
                return;
            }
            
            // Check if the bot is trying to kick itself
            const botJid = sock.user?.id;
            if (mentioned === botJid) {
                await sock.sendMessage(from, {
                    text: '🤖 I cannot kick myself from the group!'
                });
                return;
            }
            
            try {
                const groupMetadata = await sock.groupMetadata(from);
                const participants = groupMetadata.participants;
                const targetMember = participants.find(p => p.id === mentioned);
                
                if (!targetMember) {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is not a member of this group!`,
                        mentions: [mentioned]
                    });
                    return;
                }
                
                // Check if target is admin/owner
                if (targetMember.admin === 'admin' || targetMember.admin === 'superadmin') {
                    await sock.sendMessage(from, {
                        text: `❌ Cannot kick @${mentioned.split('@')[0]} because they are a group admin!`,
                        mentions: [mentioned]
                    });
                    return;
                }
                
                // Remove member from group
                await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
                
                await sock.sendMessage(from, {
                    text: `✅ **Member Removed Successfully!**\n\n👤 @${mentioned.split('@')[0]} has been removed from the group by @${sender.split('@')[0]}`,
                    mentions: [mentioned, sender],
                    contextInfo: {
                        externalAdReply: {
                            title: 'Member Kicked',
                            body: 'Successfully removed from group',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=607',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                
            } catch (error) {
                console.error('Kick member error:', error);
                await sock.sendMessage(from, {
                    text: `❌ Failed to kick @${mentioned.split('@')[0]} from the group.\n\n**Possible reasons:**\n• User is a group admin\n• Bot lacks sufficient permissions\n• Technical error occurred`,
                    mentions: [mentioned]
                });
            }
        }
        
        async function showGroupAdminHelp(sock, from) {
            await sock.sendMessage(from, {
                text: `👥 **Group Administration Commands**\n\n**🔧 Available Commands:**\n• .group-admin add @user - Add member to group\n• .group-admin kick @user - Remove member from group\n\n**⚠️ Requirements:**\n• You must be a group admin\n• Bot must be a group admin\n• Target user must not be an admin (for kick)\n\n**💡 Usage Examples:**\n• .group-admin add @1234567890\n• .group-admin kick @1234567890\n\n**🛡️ Safety Features:**\n• Cannot kick group admins\n• Cannot kick yourself\n• Bot cannot kick itself\n• Proper permission checks`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Admin Help',
                        body: 'Manage group members',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=608',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
