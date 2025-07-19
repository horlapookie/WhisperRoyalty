
export const command = {
    name: 'autogroup',
    aliases: ['creategroup', 'dyngroup'],
    description: 'Automatically create groups with specific configurations',
    usage: 'autogroup create <name> | autogroup invite <toggle> | autogroup assign @user',
    category: 'group',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup, isOwner, isAdmin, settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!isOwner && !isAdmin) {
            await sock.sendMessage(sender, {
                text: '❌ Only owners and admins can use this command!',
                contextInfo: {
                    externalAdReply: {
                        title: 'Auto Group Management',
                        body: 'Admin access required',
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
        const action = argsArray[0]?.toLowerCase();
        
        try {
            switch (action) {
                case 'create':
                    await handleGroupCreation(sock, msg, context, argsArray.slice(1).join(' '));
                    break;
                    
                case 'invite':
                    await handleInviteToggle(sock, msg, context, argsArray[1]);
                    break;
                    
                case 'assign':
                    await handleAssignAdmin(sock, msg, context);
                    break;
                    
                default:
                    await showAutoGroupHelp(sock, sender, settings);
                    break;
            }
        } catch (error) {
            console.error('Auto group error:', error);
            await sock.sendMessage(sender, {
                text: '❌ Error executing auto group command. Please try again.'
            });
        }
        
        async function handleGroupCreation(sock, msg, context, groupName) {
            if (!groupName) {
                await sock.sendMessage(sender, {
                    text: '❌ Please provide a group name!\n\nExample: .autogroup create My New Group'
                });
                return;
            }
            
            try {
                const groupId = await sock.groupCreate(groupName, []);
                await sock.sendMessage(sender, {
                    text: `✅ Group "${groupName}" created successfully!\n\n🆔 Group ID: ${groupId}\n\n📋 Next steps:\n• Add members using .group-admin add\n• Configure settings using .groupconfig\n• Set invite link using .autogroup invite on`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Group Created',
                            body: `${groupName} ready to use`,
                            thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } catch (error) {
                await sock.sendMessage(sender, {
                    text: '❌ Failed to create group. Please try again.'
                });
            }
        }
        
        async function handleInviteToggle(sock, msg, context, toggle) {
            if (!isGroup) {
                await sock.sendMessage(sender, {
                    text: '❌ This command only works in groups!'
                });
                return;
            }
            
            try {
                if (toggle === 'on') {
                    const inviteCode = await sock.groupInviteCode(from);
                    await sock.sendMessage(from, {
                        text: `✅ Group invite link activated!\n\n🔗 Link: https://chat.whatsapp.com/${inviteCode}\n\n⚠️ Share responsibly!`
                    });
                } else if (toggle === 'off') {
                    await sock.groupRevokeInvite(from);
                    await sock.sendMessage(from, {
                        text: '✅ Group invite link disabled!'
                    });
                }
            } catch (error) {
                await sock.sendMessage(from, {
                    text: '❌ Failed to toggle invite link. Make sure bot is admin.'
                });
            }
        }
        
        async function handleAssignAdmin(sock, msg, context) {
            if (!isGroup) {
                await sock.sendMessage(sender, {
                    text: '❌ This command only works in groups!'
                });
                return;
            }
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!mentioned) {
                await sock.sendMessage(from, {
                    text: '❌ Please mention a user to promote!\n\nExample: .autogroup assign @user'
                });
                return;
            }
            
            try {
                await sock.groupParticipantsUpdate(from, [mentioned], 'promote');
                await sock.sendMessage(from, {
                    text: `✅ @${mentioned.split('@')[0]} has been promoted to admin!`,
                    mentions: [mentioned]
                });
            } catch (error) {
                await sock.sendMessage(from, {
                    text: '❌ Failed to promote user. Make sure bot is admin.'
                });
            }
        }
        
        async function showAutoGroupHelp(sock, sender, settings) {
            await sock.sendMessage(sender, {
                text: `🤖 **Auto Group Management**\n\n**📋 Commands:**\n• .autogroup create <name> - Create new group\n• .autogroup invite on/off - Toggle invite link\n• .autogroup assign @user - Promote to admin\n\n**⚠️ Requirements:**\n• Owner/Admin permissions\n• Bot must be admin (for group functions)\n\n**💡 Examples:**\n• .autogroup create Study Group\n• .autogroup invite on\n• .autogroup assign @1234567890`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Auto Group Help',
                        body: 'Dynamic group management',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
