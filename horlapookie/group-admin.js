export const command = {
    name: 'group-admin',
    aliases: ['gadmin', 'groupadmin'],
    description: 'Group administration commands - add, kick, promote and demote members',
    usage: 'group-admin add @user/number | group-admin kick @user | group-admin promote @user | group-admin demote @user',
    category: 'group',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin, isBotAdmin, isOwner } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Allow usage in channels and groups, and for bot owners
        if (!isGroup && !from.includes('@newsletter')) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups and channels!',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420639943950@newsletter',
                        newsletterName: `${context.settings.botName} Updates`,
                        serverMessageId: Math.floor(Math.random() * 1000000)
                    },
                    externalAdReply: {
                        title: 'Group Admin Commands',
                        body: 'Groups and channels only',
                        thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
            return;
        }

        // Enhanced owner detection including auto-detected owners and bot self
        let enhancedIsOwner = isOwner;

        // Check if sender is in auto-detected owners list
        if (!enhancedIsOwner && global.botState?.ownerJids) {
            const senderPhone = context.extractPhoneNumber ? context.extractPhoneNumber(sender) : null;
            enhancedIsOwner = global.botState.ownerJids.some(ownerJid => {
                const ownerPhone = context.extractPhoneNumber ? context.extractPhoneNumber(ownerJid) : null;
                return sender === ownerJid || (senderPhone && senderPhone === ownerPhone);
            });
        }

        // Check if sender is the bot itself
        if (!enhancedIsOwner && context.sock?.user?.id) {
            const botJid = context.sock.user.id;
            const botPhone = context.extractPhoneNumber ? context.extractPhoneNumber(botJid) : null;
            const senderPhone = context.extractPhoneNumber ? context.extractPhoneNumber(sender) : null;
            enhancedIsOwner = (sender === botJid) || (senderPhone && senderPhone === botPhone);
        }

        // Allow bot owners (including auto-detected) to use command regardless of admin status
        if (!enhancedIsOwner && !isAdmin) {
            await sock.sendMessage(from, {
                text: '❌ Only group admins or bot owners can use this command!',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420639943950@newsletter',
                        newsletterName: `${context.settings.botName} Updates`,
                        serverMessageId: Math.floor(Math.random() * 1000000)
                    },
                    externalAdReply: {
                        title: 'Admin Required',
                        body: 'Insufficient permissions',
                        thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
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
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420639943950@newsletter',
                        newsletterName: `${context.settings.botName} Updates`,
                        serverMessageId: Math.floor(Math.random() * 1000000)
                    },
                    externalAdReply: {
                        title: 'Bot Admin Required',
                        body: 'Make bot an admin first',
                        thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
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

                case 'promote':
                    await handlePromoteMember(sock, msg, context);
                    break;

                case 'demote':
                    await handleDemoteMember(sock, msg, context);
                    break;

                default:
                    await showGroupAdminHelp(sock, from, context);
                    break;
            }
        } catch (error) {
            console.error('Group admin error:', error);
            await sock.sendMessage(from, {
                text: '❌ An error occurred while executing the command. Please try again.',
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420639943950@newsletter',
                        newsletterName: `${context.settings.botName} Updates`,
                        serverMessageId: Math.floor(Math.random() * 1000000)
                    },
                    externalAdReply: {
                        title: 'Command Error',
                        body: 'An internal error occurred',
                        thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }

        async function handleAddMember(sock, msg, context) {
            let mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

            // If no mention, check if args contains a phone number
            if (!mentioned) {
                const argsArray = args.trim().split(' ');
                const numberArg = argsArray[1];

                if (numberArg && /^\d+$/.test(numberArg)) {
                    // Format phone number to JID
                    mentioned = numberArg + '@s.whatsapp.net';
                } else {
                    await sock.sendMessage(from, {
                        text: '❌ Please mention a user or provide a phone number!\n\n📝 **Examples:**\n• .group-admin add @username\n• .group-admin add 1234567890',
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'Add Group Member',
                                body: 'Mention user or provide number',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }
            }

            try {
                const groupMetadata = await sock.groupMetadata(from);
                const participants = groupMetadata.participants;
                const isAlreadyMember = participants.some(p => p.id === mentioned);

                if (isAlreadyMember) {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is already a member of this group!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'Member Already Exists',
                                body: 'User is already in the group',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                // Add member to group
                await sock.groupParticipantsUpdate(from, [mentioned], 'add');

                await sock.sendMessage(from, {
                    text: `✅ **Member Added Successfully!**\n\n👥 @${mentioned.split('@')[0]} has been added to the group!\n\n🎉 Welcome to the group!`,
                    mentions: [mentioned, sender],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Member Added',
                            body: 'Successfully added to group',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });

            } catch (error) {
                console.error('Add member error:', error);
                await sock.sendMessage(from, {
                    text: `❌ Failed to add @${mentioned.split('@')[0]} to the group.\n\n**Possible reasons:**\n• User has privacy settings preventing group adds\n• User number doesn\'t exist\n• Bot lacks sufficient permissions`,
                    mentions: [mentioned],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Add Member Failed',
                            body: 'Failed to add user to group',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }

        async function handleKickMember(sock, msg, context) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

            if (!mentioned) {
                await sock.sendMessage(from, {
                    text: '❌ Please mention a user to kick!\n\n📝 **Example:** .group-admin kick @username',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Kick Group Member',
                            body: 'Mention user to remove',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }

            if (mentioned === sender) {
                await sock.sendMessage(from, {
                    text: '❌ You cannot kick yourself! Use the leave group option instead.',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Cannot Kick Yourself',
                            body: 'Use leave command instead',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
                return;
            }

            // Check if the bot is trying to kick itself
            const botJid = sock.user?.id;
            if (mentioned === botJid) {
                await sock.sendMessage(from, {
                    text: '🤖 I cannot kick myself from the group!',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Cannot Kick Self',
                            body: 'Bot cannot remove itself',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
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
                const targetMember = participants.find(p => p.id === mentioned);

                if (!targetMember) {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is not a member of this group!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'User Not Found',
                                body: 'User is not in the group',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                // Check if target is admin/owner
                if (targetMember.admin === 'admin' || targetMember.admin === 'superadmin') {
                    await sock.sendMessage(from, {
                        text: `❌ Cannot kick @${mentioned.split('@')[0]} because they are a group admin!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'Cannot Kick Admin',
                                body: 'Admins cannot be kicked',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                // Remove member from group
                await sock.groupParticipantsUpdate(from, [mentioned], 'remove');

                await sock.sendMessage(from, {
                    text: `✅ **Member Removed Successfully!**\n\n👤 @${mentioned.split('@')[0]} has been removed from the group by @${sender.split('@')[0]}`,
                    mentions: [mentioned, sender],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Member Kicked',
                            body: 'Successfully removed from group',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });

            } catch (error) {
                console.error('Kick member error:', error);
                await sock.sendMessage(from, {
                    text: `❌ Failed to kick @${mentioned.split('@')[0]} from the group.\n\n**Possible reasons:**\n• User is a group admin\n• Bot lacks sufficient permissions\n• Technical error occurred`,
                    mentions: [mentioned],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Kick Member Failed',
                            body: 'Failed to remove user from group',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }

        async function handlePromoteMember(sock, msg, context) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

            if (!mentioned) {
                await sock.sendMessage(from, {
                    text: '❌ Please mention a user to promote!\n\n📝 **Example:** .group-admin promote @username',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Promote Group Member',
                            body: 'Mention user to promote',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
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
                const targetMember = participants.find(p => p.id === mentioned);

                if (!targetMember) {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is not a member of this group!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'User Not Found',
                                body: 'User is not in the group',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                if (targetMember.admin === 'admin' || targetMember.admin === 'superadmin') {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is already an admin!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'Already Admin',
                                body: 'User is already an admin',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                await sock.groupParticipantsUpdate(from, [mentioned], 'promote');

                await sock.sendMessage(from, {
                    text: `✅ **Member Promoted Successfully!**\n\n👑 @${mentioned.split('@')[0]} has been promoted to admin by @${sender.split('@')[0]}`,
                    mentions: [mentioned, sender],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Member Promoted',
                            body: 'Successfully promoted to admin',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });

            } catch (error) {
                console.error('Promote member error:', error);
                await sock.sendMessage(from, {
                    text: `❌ Failed to promote @${mentioned.split('@')[0]}.\n\n**Possible reasons:**\n• Bot lacks sufficient permissions\n• Technical error occurred`,
                    mentions: [mentioned],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Promote Member Failed',
                            body: 'Failed to promote user',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }

        async function handleDemoteMember(sock, msg, context) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

            if (!mentioned) {
                await sock.sendMessage(from, {
                    text: '❌ Please mention a user to demote!\n\n📝 **Example:** .group-admin demote @username',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Demote Group Member',
                            body: 'Mention user to demote',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
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
                const targetMember = participants.find(p => p.id === mentioned);

                if (!targetMember) {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is not a member of this group!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'User Not Found',
                                body: 'User is not in the group',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                if (targetMember.admin === 'superadmin') {
                    await sock.sendMessage(from, {
                        text: `❌ Cannot demote @${mentioned.split('@')[0]} because they are the group owner!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'Cannot Demote Owner',
                                body: 'Group owner cannot be demoted',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                if (!targetMember.admin || targetMember.admin === 'participant') {
                    await sock.sendMessage(from, {
                        text: `❌ @${mentioned.split('@')[0]} is not an admin!`,
                        mentions: [mentioned],
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420639943950@newsletter',
                                newsletterName: `${context.settings.botName} Updates`,
                                serverMessageId: Math.floor(Math.random() * 1000000)
                            },
                            externalAdReply: {
                                title: 'Not an Admin',
                                body: 'User is not an admin',
                                thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    return;
                }

                await sock.groupParticipantsUpdate(from, [mentioned], 'demote');

                await sock.sendMessage(from, {
                    text: `✅ **Member Demoted Successfully!**\n\n👤 @${mentioned.split('@')[0]} has been demoted by @${sender.split('@')[0]}`,
                    mentions: [mentioned, sender],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Member Demoted',
                            body: 'Successfully demoted from admin',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });

            } catch (error) {
                console.error('Demote member error:', error);
                await sock.sendMessage(from, {
                    text: `❌ Failed to demote @${mentioned.split('@')[0]}.\n\n**Possible reasons:**\n• Bot lacks sufficient permissions\n• Technical error occurred`,
                    mentions: [mentioned],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363420639943950@newsletter',
                            newsletterName: `${context.settings.botName} Updates`,
                            serverMessageId: Math.floor(Math.random() * 1000000)
                        },
                        externalAdReply: {
                            title: 'Demote Member Failed',
                            body: 'Failed to demote user',
                            thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            }
        }

        async function showGroupAdminHelp(sock, from, context) {
            await sock.sendMessage(from, {
                text: `👥 **Group Administration Commands**\n\n**🔧 Available Commands:**\n• .group-admin add @user/number - Add member to group\n• .group-admin kick @user - Remove member from group\n• .group-admin promote @user - Promote to admin\n• .group-admin demote @user - Demote from admin\n\n**⚠️ Requirements:**\n• You must be a group admin\n• Bot must be a group admin\n• Target user must not be an admin (for kick)\n\n**💡 Usage Examples:**\n• .group-admin add @1234567890\n• .group-admin add 1234567890\n• .group-admin kick @1234567890\n• .group-admin promote @1234567890\n• .group-admin demote @1234567890\n\n**🛡️ Safety Features:**\n• Cannot kick/demote group owner\n• Cannot kick yourself\n• Bot cannot kick itself\n• Proper permission checks`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420639943950@newsletter',
                        newsletterName: `${context.settings.botName} Updates`,
                        serverMessageId: Math.floor(Math.random() * 1000000)
                    },
                    externalAdReply: {
                        title: 'Group Admin Help',
                        body: 'Manage group members',
                        thumbnailUrl: context.settings.profilePics[Math.floor(Math.random() * context.settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};