
export const command = {
    name: 'group',
    aliases: ['grp', 'groupinfo'],
    description: 'Group management and information commands',
    usage: 'group info | stats | members | admins | settings',
    category: 'group',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup, isAdmin, isOwner } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!isGroup && !from.includes('@newsletter')) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups and channels!'
            });
            return;
        }
        
        const action = args.trim().toLowerCase();
        
        try {
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
            const members = participants.filter(p => !p.admin);
            const owner = participants.find(p => p.admin === 'superadmin');
            
            switch (action) {
                case 'info':
                    await showGroupInfo(sock, from, groupMetadata, participants, admins, members, owner);
                    break;
                    
                case 'stats':
                    await showGroupStats(sock, from, groupMetadata, participants);
                    break;
                    
                case 'members':
                    await showGroupMembers(sock, from, members, participants.length);
                    break;
                    
                case 'admins':
                    await showGroupAdmins(sock, from, admins, owner);
                    break;
                    
                case 'settings':
                    if (!isOwner && !isAdmin) {
                        await sock.sendMessage(from, {
                            text: '❌ Only group admins or bot owners can view settings!'
                        });
                        return;
                    }
                    await showGroupSettings(sock, from, groupMetadata);
                    break;
                    
                default:
                    await showGroupHelp(sock, from);
                    break;
            }
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Error fetching group information. Please try again.'
            });
        }
        
        async function showGroupInfo(sock, from, metadata, participants, admins, members, owner) {
            const creationDate = new Date(metadata.creation * 1000).toLocaleDateString();
            const description = metadata.desc || 'No description set';
            
            await sock.sendMessage(from, {
                text: `📋 **Group Information**\n\n**📌 Name:** ${metadata.subject}\n**👥 Members:** ${participants.length}\n**🛡️ Admins:** ${admins.length}\n**👤 Regular Members:** ${members.length}\n**👑 Owner:** ${owner ? `@${owner.id.split('@')[0]}` : 'Unknown'}\n**📅 Created:** ${creationDate}\n\n**📝 Description:**\n${description}\n\n**🔧 Group ID:** ${metadata.id}\n**🔒 Join Approval:** ${metadata.joinApprovalMode ? 'Required' : 'Not Required'}\n**📢 Announce:** ${metadata.announce ? 'Only Admins' : 'Everyone'}\n**🔗 Invite Link:** ${metadata.inviteCode ? 'Available' : 'Disabled'}`,
                mentions: owner ? [owner.id] : [],
                contextInfo: {
                    externalAdReply: {
                        title: metadata.subject,
                        body: `${participants.length} members • ${admins.length} admins`,
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1
                    }
                }
            });
        }
        
        async function showGroupStats(sock, from, metadata, participants) {
            const dataManager = global.dataManager;
            let totalPokemon = 0;
            let totalBattles = 0;
            let activeTrainers = 0;
            
            participants.forEach(participant => {
                const playerId = participant.id;
                const pokemon = dataManager.getPlayerPokemon(playerId);
                const stats = dataManager.getPlayerStats(playerId);
                
                totalPokemon += pokemon.length;
                totalBattles += stats.battles;
                if (pokemon.length > 0) activeTrainers++;
            });
            
            await sock.sendMessage(from, {
                text: `📊 **Group Pokemon Statistics**\n\n**🏆 Group:** ${metadata.subject}\n**👥 Total Members:** ${participants.length}\n\n**🎮 Pokemon Activity:**\n• **Active Trainers:** ${activeTrainers}\n• **Total Pokemon Caught:** ${totalPokemon}\n• **Total Battles Fought:** ${totalBattles}\n• **Average Pokemon per Trainer:** ${activeTrainers > 0 ? (totalPokemon / activeTrainers).toFixed(1) : 0}\n\n**📈 Group Engagement:**\n• **Pokemon Participation Rate:** ${((activeTrainers / participants.length) * 100).toFixed(1)}%\n• **Average Battles per Trainer:** ${activeTrainers > 0 ? (totalBattles / activeTrainers).toFixed(1) : 0}\n\n🎯 **Encourage more members to join Pokemon battles!**\n💡 Use .spawnpokemon to get everyone started!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Group Pokemon Stats',
                        body: `${activeTrainers} active trainers`,
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
        
        async function showGroupMembers(sock, from, members, totalCount) {
            const memberList = members.slice(0, 50).map((member, index) => {
                const phone = member.id.split('@')[0];
                return `${index + 1}. +${phone}`;
            }).join('\n');
            
            const hasMore = members.length > 50;
            
            await sock.sendMessage(from, {
                text: `👥 **Group Members** (${members.length}/${totalCount})\n\n${memberList}${hasMore ? `\n\n... and ${members.length - 50} more members` : ''}\n\n💡 Use .group admins to see group administrators`
            });
        }
        
        async function showGroupAdmins(sock, from, admins, owner) {
            let adminText = `🛡️ **Group Administrators**\n\n`;
            
            if (owner) {
                adminText += `👑 **Owner:**\n• @${owner.id.split('@')[0]}\n\n`;
            }
            
            const regularAdmins = admins.filter(a => a.admin === 'admin');
            if (regularAdmins.length > 0) {
                adminText += `🛡️ **Admins:**\n`;
                regularAdmins.forEach((admin, index) => {
                    adminText += `• @${admin.id.split('@')[0]}\n`;
                });
            }
            
            const mentions = admins.map(a => a.id);
            
            await sock.sendMessage(from, {
                text: adminText,
                mentions: mentions
            });
        }
        
        async function showGroupSettings(sock, from, metadata) {
            await sock.sendMessage(from, {
                text: `⚙️ **Group Settings**\n\n**📋 Basic Settings:**\n• **Group Name:** ${metadata.subject}\n• **Members Count:** ${metadata.participants.length}\n• **Creation Date:** ${new Date(metadata.creation * 1000).toLocaleDateString()}\n\n**🔐 Privacy Settings:**\n• **Join Approval:** ${metadata.joinApprovalMode ? '✅ Required' : '❌ Not Required'}\n• **Who Can Send Messages:** ${metadata.announce ? 'Only Admins' : 'Everyone'}\n• **Invite Link:** ${metadata.inviteCode ? '✅ Enabled' : '❌ Disabled'}\n\n**📝 Description:**\n${metadata.desc || 'No description set'}\n\n💡 Contact group admins to modify these settings`
            });
        }
        
        async function showGroupHelp(sock, from) {
            await sock.sendMessage(from, {
                text: `📋 **Group Commands Help**\n\n**🔍 Available Commands:**\n• .group info - Show group information\n• .group stats - Show Pokemon statistics\n• .group members - List group members\n• .group admins - Show administrators\n• .group settings - View group settings (Admin only)\n\n**🎮 Pokemon Features:**\n• View group-wide Pokemon statistics\n• See active trainers in the group\n• Track battle participation\n• Monitor group engagement\n\n**💡 Tips:**\n• Use .spawnpokemon to encourage Pokemon activity\n• Challenge members with .pvp challenge @user\n• Check .pvp leaderboard for top trainers`
            });
        }
    }
};
