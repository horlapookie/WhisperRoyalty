import chalk from 'chalk';

export const command = {
    name: 'avatar',
    aliases: ['bending', 'airbender', 'atla'],
    description: 'Avatar: The Last Airbender bending game with full progression system',
    usage: 'avatar start <element> | profile | train | skills | challenge @user | accept | decline | attack <skill> | leaderboard',
    category: 'gaming',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Initialize avatar storage using data manager
        const dataManager = global.dataManager;
        if (!dataManager.playerData.avatarPlayers) {
            dataManager.playerData.avatarPlayers = {};
        }
        if (!dataManager.playerData.avatarBattles) {
            dataManager.playerData.avatarBattles = {};
        }

        const argsArray = args.trim().split(' ');
        const action = argsArray[0]?.toLowerCase();

        // Bending elements and skills
        const elements = {
            air: {
                name: 'Airbending',
                emoji: '💨',
                color: 'gray',
                image: 'https://static.wikia.nocookie.net/avatar/images/2/2a/Airbending_emblem.png',
                skills: {
                    'air-scooter': { name: 'Air Scooter', power: 45, type: 'mobility', description: 'Ride on a ball of air for swift movement and attack', chiCost: 15 },
                    'air-blast': { name: 'Air Blast', power: 55, type: 'offensive', description: 'Powerful gust of wind that knocks enemies back', chiCost: 18 },
                    'air-shield': { name: 'Air Shield', power: 35, type: 'defensive', description: 'Spinning air barrier that deflects attacks', chiCost: 12 },
                    'tornado': { name: 'Tornado', power: 80, type: 'ultimate', description: 'Massive spinning vortex of air (Ultimate Move)', chiCost: 30 },
                    'flight': { name: 'Flight', power: 60, type: 'special', description: 'Achieve true airbending mastery through flight', chiCost: 25 }
                }
            },
            water: {
                name: 'Waterbending',
                emoji: '🌊',
                color: 'blue',
                image: 'https://static.wikia.nocookie.net/avatar/images/f/f1/Waterbending_emblem.png',
                skills: {
                    'water-whip': { name: 'Water Whip', power: 50, type: 'offensive', description: 'Flexible water tendril for precise attacks', chiCost: 16 },
                    'ice-spikes': { name: 'Ice Spikes', power: 65, type: 'offensive', description: 'Sharp projectiles of frozen water', chiCost: 22 },
                    'healing': { name: 'Healing', power: 40, type: 'support', description: 'Restore health using water\'s life energy', chiCost: 20 },
                    'tsunami': { name: 'Tsunami', power: 90, type: 'ultimate', description: 'Overwhelming wave of destruction (Ultimate Move)', chiCost: 35 },
                    'bloodbending': { name: 'Bloodbending', power: 85, type: 'forbidden', description: 'Control the water in living beings (Forbidden Art)', chiCost: 40 }
                }
            },
            earth: {
                name: 'Earthbending',
                emoji: '🗿',
                color: 'green',
                image: 'https://static.wikia.nocookie.net/avatar/images/9/92/Earthbending_emblem.png',
                skills: {
                    'rock-throw': { name: 'Rock Throw', power: 55, type: 'offensive', description: 'Hurl chunks of stone at enemies', chiCost: 18 },
                    'earth-armor': { name: 'Earth Armor', power: 45, type: 'defensive', description: 'Cover body in protective rock coating', chiCost: 15 },
                    'seismic-sense': { name: 'Seismic Sense', power: 30, type: 'special', description: 'Feel vibrations through the earth', chiCost: 10 },
                    'earthquake': { name: 'Earthquake', power: 95, type: 'ultimate', description: 'Shake the very foundations of the earth (Ultimate Move)', chiCost: 38 },
                    'metalbending': { name: 'Metalbending', power: 70, type: 'advanced', description: 'Bend the earth within refined metals', chiCost: 28 }
                }
            },
            fire: {
                name: 'Firebending',
                emoji: '🔥',
                color: 'red',
                image: 'https://static.wikia.nocookie.net/avatar/images/2/28/Firebending_emblem.png',
                skills: {
                    'fire-blast': { name: 'Fire Blast', power: 60, type: 'offensive', description: 'Concentrated burst of flames', chiCost: 20 },
                    'fire-whips': { name: 'Fire Whips', power: 50, type: 'offensive', description: 'Extending streams of fire for ranged combat', chiCost: 17 },
                    'fire-shield': { name: 'Fire Shield', power: 40, type: 'defensive', description: 'Rotating fire barrier that burns attackers', chiCost: 13 },
                    'dragon-breath': { name: 'Dragon Breath', power: 100, type: 'ultimate', description: 'Massive cone of dragon fire (Ultimate Move)', chiCost: 40 },
                    'lightning': { name: 'Lightning', power: 85, type: 'advanced', description: 'Generate and redirect lightning bolts', chiCost: 35 }
                }
            }
        };

        try {
            switch (action) {
                case 'start':
                case 'begin':
                case 'journey':
                    if (dataManager.playerData.avatarPlayers[sender]) {
                        await sock.sendMessage(from, {
                            text: '🌟 You have already begun your bending journey! Use `.avatar profile` to see your progress.',
                            quoted: msg
                        });
                        return;
                    }

                    const elementChoice = argsArray[1]?.toLowerCase();
                    if (!elementChoice || !elements[elementChoice]) {
                        await sock.sendMessage(from, {
                            text: `🌍 **Choose Your Destiny**

Welcome to the world of Avatar! Choose your bending element:

💨 **AIR** - Masters of freedom and mobility
🌊 **WATER** - Healers and adaptable fighters  
🗿 **EARTH** - Defenders with unbreakable will
🔥 **FIRE** - Aggressive and powerful warriors

**Usage:** \`.avatar start <element>\`
**Example:** \`.avatar start fire\`

Each element has 5 unique skills to master!`,
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Avatar: The Last Airbender',
                                    body: 'Choose Your Bending Element',
                                    thumbnailUrl: 'https://static.wikia.nocookie.net/avatar/images/d/d8/Team_Avatar.png',
                                    sourceUrl: 'https://github.com',
                                    mediaType: 1
                                }
                            },
                            quoted: msg
                        });
                        return;
                    }

                    const element = elements[elementChoice];
                    const newPlayer = {
                        element: elementChoice,
                        level: 1,
                        experience: 0,
                        health: 100,
                        maxHealth: 100,
                        chi: 50,
                        maxChi: 50,
                        wins: 0,
                        losses: 0,
                        battles: 0,
                        skills: Object.keys(element.skills).slice(0, 2), // Start with 2 skills
                        createdAt: Date.now(),
                        lastTrain: 0,
                        name: msg.pushName || sender.split('@')[0]
                    };

                    dataManager.playerData.avatarPlayers[sender] = newPlayer;
                    dataManager.savePlayerData();

                    await sock.sendMessage(from, {
                        text: `${element.emoji} **Welcome, ${element.name} Master!**

🎭 **${newPlayer.name}** has chosen the path of **${element.name}**!

📊 **Starting Stats:**
❤️ Health: ${newPlayer.health}/${newPlayer.maxHealth}
⚡ Chi: ${newPlayer.chi}/${newPlayer.maxChi}
🌟 Level: ${newPlayer.level}
🏆 Experience: ${newPlayer.experience}/100

🥋 **Starting Skills:**
${newPlayer.skills.map(skill => `• **${element.skills[skill].name}** (${element.skills[skill].power} power)`).join('\n')}

**Commands:**
• \`.avatar profile\` - View your stats
• \`.avatar train\` - Train to gain experience  
• \`.avatar skills\` - View all skills
• \`.avatar challenge @user\` - Battle other benders!

Your bending journey begins now! 🌟`,
                        contextInfo: {
                            externalAdReply: {
                                title: `${element.name} Master`,
                                body: 'Your Avatar journey begins!',
                                thumbnailUrl: element.image,
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'profile':
                case 'stats':
                case 'me':
                    const player = dataManager.playerData.avatarPlayers[sender];
                    if (!player) {
                        await sock.sendMessage(from, {
                            text: '❌ You haven\'t started your bending journey! Use `.avatar start <element>` to begin.',
                            quoted: msg
                        });
                        return;
                    }

                    const playerElement = elements[player.element];
                    const winRate = player.battles > 0 ? ((player.wins / player.battles) * 100).toFixed(1) : 0;
                    const expToNext = 100 + (player.level * 50);

                    await sock.sendMessage(from, {
                        text: `${playerElement.emoji} **${player.name}** - ${playerElement.name} Master

📊 **Character Stats:**
🌟 Level: ${player.level}
🏆 Experience: ${player.experience}/${expToNext}
❤️ Health: ${player.health}/${player.maxHealth}
⚡ Chi: ${player.chi}/${player.maxChi}

⚔️ **Battle Record:**
🏅 Wins: ${player.wins}
💀 Losses: ${player.losses}  
🎯 Win Rate: ${winRate}%
⚡ Total Battles: ${player.battles}

🥋 **Mastered Skills (${player.skills.length}/5):**
${player.skills.map(skill => {
    const skillData = playerElement.skills[skill];
    return `• **${skillData.name}** (${skillData.power} power | ${skillData.chiCost} chi)`;
}).join('\n')}

${player.skills.length < 5 ? '\n🔮 Train more to unlock new skills!' : '\n✨ All skills mastered!'}`,
                        contextInfo: {
                            externalAdReply: {
                                title: `${playerElement.name} Master`,
                                body: `Level ${player.level} | ${winRate}% Win Rate`,
                                thumbnailUrl: playerElement.image,
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'train':
                case 'practice':
                    const trainPlayer = dataManager.playerData.avatarPlayers[sender];
                    if (!trainPlayer) {
                        await sock.sendMessage(from, {
                            text: '❌ You haven\'t started your bending journey! Use `.avatar start <element>` to begin.',
                            quoted: msg
                        });
                        return;
                    }

                    const cooldown = 300000; // 5 minutes
                    const timeSinceLastTrain = Date.now() - trainPlayer.lastTrain;

                    if (timeSinceLastTrain < cooldown) {
                        const timeLeft = Math.ceil((cooldown - timeSinceLastTrain) / 60000);
                        await sock.sendMessage(from, {
                            text: `⏳ You need to rest! Train again in ${timeLeft} minute(s).`,
                            quoted: msg
                        });
                        return;
                    }

                    const expGained = Math.floor(Math.random() * 30) + 10;
                    const healthGained = Math.floor(Math.random() * 20) + 5;
                    const chiGained = Math.floor(Math.random() * 15) + 5;

                    trainPlayer.experience += expGained;
                    trainPlayer.health = Math.min(trainPlayer.maxHealth, trainPlayer.health + healthGained);
                    trainPlayer.chi = Math.min(trainPlayer.maxChi, trainPlayer.chi + chiGained);
                    trainPlayer.lastTrain = Date.now();

                    let leveledUp = false;
                    let newSkillUnlocked = '';
                    const expNeeded = 100 + (trainPlayer.level * 50);

                    if (trainPlayer.experience >= expNeeded) {
                        trainPlayer.level++;
                        trainPlayer.experience -= expNeeded;
                        trainPlayer.maxHealth += 20;
                        trainPlayer.maxChi += 10;
                        trainPlayer.health = trainPlayer.maxHealth;
                        trainPlayer.chi = trainPlayer.maxChi;
                        leveledUp = true;

                        // Unlock new skill
                        const elementSkills = Object.keys(elements[trainPlayer.element].skills);
                        const availableSkills = elementSkills.filter(skill => !trainPlayer.skills.includes(skill));

                        if (availableSkills.length > 0 && trainPlayer.level % 2 === 0) {
                            const newSkill = availableSkills[0];
                            trainPlayer.skills.push(newSkill);
                            newSkillUnlocked = elements[trainPlayer.element].skills[newSkill].name;
                        }
                    }

                    dataManager.playerData.avatarPlayers[sender] = trainPlayer;
                    dataManager.savePlayerData();

                    const trainElement = elements[trainPlayer.element];

                    await sock.sendMessage(from, {
                        text: `${trainElement.emoji} **Training Complete!**

💪 **Progress:**
🏆 Experience: +${expGained}
❤️ Health: +${healthGained}
⚡ Chi: +${chiGained}

📊 **Current Stats:**
🌟 Level: ${trainPlayer.level}
❤️ Health: ${trainPlayer.health}/${trainPlayer.maxHealth}
⚡ Chi: ${trainPlayer.chi}/${trainPlayer.maxChi}

${leveledUp ? `\n🎉 **LEVEL UP!** You reached Level ${trainPlayer.level}!` : ''}
${newSkillUnlocked ? `\n🔮 **NEW SKILL UNLOCKED:** ${newSkillUnlocked}!` : ''}

⏳ Train again in 5 minutes to continue your journey!`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Training Session',
                                body: leveledUp ? `Level Up! Now Level ${trainPlayer.level}` : 'Keep training to grow stronger',
                                thumbnailUrl: trainElement.image,
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'skills':
                case 'abilities':
                    const skillPlayer = dataManager.playerData.avatarPlayers[sender];
                    if (!skillPlayer) {
                        await sock.sendMessage(from, {
                            text: '❌ You haven\'t started your bending journey! Use `.avatar start <element>` to begin.',
                            quoted: msg
                        });
                        return;
                    }

                    const skillElement = elements[skillPlayer.element];
                    const allSkills = Object.keys(skillElement.skills);

                    let skillText = `${skillElement.emoji} **${skillElement.name} Skills**\n\n`;

                    allSkills.forEach((skillKey, index) => {
                        const skill = skillElement.skills[skillKey];
                        const unlocked = skillPlayer.skills.includes(skillKey);
                        const status = unlocked ? '✅' : '🔒';
                        const power = unlocked ? skill.power : '???';
                        const chiCost = unlocked ? skill.chiCost : '???';

                        skillText += `${status} **${skill.name}** (${power} power | ${chiCost} chi)\n`;
                        skillText += `   ${unlocked ? skill.description : 'Locked - Train more to unlock!'}\n\n`;
                    });

                    skillText += `📊 **Mastered:** ${skillPlayer.skills.length}/${allSkills.length}`;

                    await sock.sendMessage(from, {
                        text: skillText,
                        contextInfo: {
                            externalAdReply: {
                                title: `${skillElement.name} Skills`,
                                body: `${skillPlayer.skills.length}/${allSkills.length} skills mastered`,
                                thumbnailUrl: skillElement.image,
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'challenge':
                case 'duel':
                case 'battle':
                    if (!isGroup) {
                        await sock.sendMessage(from, {
                            text: '⚔️ Avatar battles can only happen in groups!',
                            quoted: msg
                        });
                        return;
                    }

                    const challenger = dataManager.playerData.avatarPlayers[sender];
                    if (!challenger) {
                        await sock.sendMessage(from, {
                            text: '❌ You haven\'t started your bending journey! Use `.avatar start <element>` to begin.',
                            quoted: msg
                        });
                        return;
                    }

                    if (challenger.health < 30) {
                        await sock.sendMessage(from, {
                            text: '❤️ You need at least 30 health to challenge someone. Rest and recover first!',
                            quoted: msg
                        });
                        return;
                    }

                    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    if (!mentionedJid) {
                        await sock.sendMessage(from, {
                            text: '⚔️ **Challenge a Bender!**\n\nUsage: `.avatar challenge @username`\n\nTag someone to challenge them to an epic bending duel!',
                            quoted: msg
                        });
                        return;
                    }

                    if (mentionedJid === sender) {
                        await sock.sendMessage(from, {
                            text: '😅 You cannot challenge yourself! Find another bender to duel.',
                            quoted: msg
                        });
                        return;
                    }

                    const opponent = dataManager.playerData.avatarPlayers[mentionedJid];
                    if (!opponent) {
                        await sock.sendMessage(from, {
                            text: '❌ The challenged user hasn\'t started their bending journey yet!',
                            quoted: msg
                        });
                        return;
                    }

                    if (opponent.health < 30) {
                        await sock.sendMessage(from, {
                            text: '❤️ Your opponent doesn\'t have enough health to battle (minimum 30 required).',
                            quoted: msg
                        });
                        return;
                    }

                    // Check for existing battle
                    const challengeBattleId = `${from}_${sender}_${mentionedJid}`;
                    if (dataManager.playerData.avatarBattles[challengeBattleId] || dataManager.playerData.avatarBattles[`${from}_${mentionedJid}_${sender}`]) {
                        await sock.sendMessage(from, {
                            text: '⚔️ A battle between you two is already in progress!',
                            quoted: msg
                        });
                        return;
                    }

                    // Create challenge
                    dataManager.playerData.avatarBattles[challengeBattleId] = {
                        challenger: sender,
                        opponent: mentionedJid,
                        status: 'pending',
                        groupId: from,
                        timestamp: Date.now(),
                        expiresAt: Date.now() + 300000 // 5 minutes
                    };

                    dataManager.savePlayerData();

                    const challengerElement = elements[challenger.element];
                    const opponentElement = elements[opponent.element];

                    await sock.sendMessage(from, {
                        text: `⚔️ **BENDING DUEL CHALLENGE!**

${challengerElement.emoji} **${challenger.name}** (Level ${challenger.level} ${challengerElement.name})
                    ⚡ VS ⚡
${opponentElement.emoji} **${opponent.name}** (Level ${opponent.level} ${opponentElement.name})

@${mentionedJid.split('@')[0]}, you have been challenged to an epic bending duel!

🏆 **Battle Stakes:**
• Winner gains 50 experience
• Loser loses 20 health
• Battle for honor and glory!

**Commands:**
• \`.avatar accept\` - Accept the challenge
• \`.avatar decline\` - Decline the challenge

⏰ Challenge expires in 5 minutes!`,
                        mentions: [mentionedJid],
                        contextInfo: {
                            externalAdReply: {
                                title: 'Avatar Bending Duel',
                                body: `${challengerElement.name} vs ${opponentElement.name}`,
                                thumbnailUrl: 'https://static.wikia.nocookie.net/avatar/images/d/d8/Team_Avatar.png',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'accept':
                    const acceptBattles = Object.entries(dataManager.playerData.avatarBattles).filter(([id, battle]) => 
                        battle.opponent === sender && battle.status === 'pending' && battle.groupId === from
                    );

                    if (acceptBattles.length === 0) {
                        await sock.sendMessage(from, {
                            text: '❌ No pending challenges found for you in this group.',
                            quoted: msg
                        });
                        return;
                    }

                    const [acceptBattleId, acceptBattle] = acceptBattles[0];
                    const acceptChallenger = dataManager.playerData.avatarPlayers[acceptBattle.challenger];
                    const acceptOpponent = dataManager.playerData.avatarPlayers[acceptBattle.opponent];

                    // Start the battle
                    dataManager.playerData.avatarBattles[acceptBattleId] = {
                        ...acceptBattle,
                        status: 'active',
                        turn: acceptBattle.challenger,
                        round: 1,
                        challengerHealth: acceptChallenger.health,
                        opponentHealth: acceptOpponent.health,
                        challengerChi: acceptChallenger.chi,
                        opponentChi: acceptOpponent.chi
                    };

                    dataManager.savePlayerData();

                    const acceptChallengerElement = elements[acceptChallenger.element];
                    const acceptOpponentElement = elements[acceptOpponent.element];

                    await sock.sendMessage(from, {
                        text: `⚔️ **BATTLE BEGINS!**

${acceptChallengerElement.emoji} **${acceptChallenger.name}** vs ${acceptOpponentElement.emoji} **${acceptOpponent.name}**

📊 **Battle Stats:**
**${acceptChallenger.name}:**
❤️ Health: ${acceptChallenger.health}
⚡ Chi: ${acceptChallenger.chi}

**${acceptOpponent.name}:**
❤️ Health: ${acceptOpponent.health}
⚡ Chi: ${acceptOpponent.chi}

🎯 **${acceptChallenger.name}'s turn!**

Use \`.avatar attack <skill>\` to use a bending skill!
Available skills: ${acceptChallenger.skills.map(skill => acceptChallengerElement.skills[skill].name).join(', ')}`,
                        mentions: [acceptBattle.challenger, acceptBattle.opponent],
                        contextInfo: {
                            externalAdReply: {
                                title: 'Avatar Battle Started!',
                                body: 'The duel begins now!',
                                thumbnailUrl: 'https://static.wikia.nocookie.net/avatar/images/d/d8/Team_Avatar.png',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'decline':
                case 'reject':
                    const declineBattles = Object.entries(dataManager.playerData.avatarBattles).filter(([id, battle]) => 
                        battle.opponent === sender && battle.status === 'pending' && battle.groupId === from
                    );

                    if (declineBattles.length === 0) {
                        await sock.sendMessage(from, {
                            text: '❌ No pending challenges found for you in this group.',
                            quoted: msg
                        });
                        return;
                    }

                    const [declineBattleId] = declineBattles[0];
                    delete dataManager.playerData.avatarBattles[declineBattleId];
                    dataManager.savePlayerData();

                    await sock.sendMessage(from, {
                        text: '🚫 Challenge declined. The duel has been cancelled.',
                        quoted: msg
                    });
                    break;

                case 'attack':
                case 'skill':
                case 'use':
                    const skillName = argsArray.slice(1).join(' ').toLowerCase();
                    
                    const activeBattles = Object.entries(dataManager.playerData.avatarBattles).filter(([id, battle]) => 
                        (battle.challenger === sender || battle.opponent === sender) && 
                        battle.status === 'active' && 
                        battle.groupId === from
                    );

                    if (activeBattles.length === 0) {
                        await sock.sendMessage(from, {
                            text: '❌ You are not in an active battle.',
                            quoted: msg
                        });
                        return;
                    }

                    const [attackBattleId, battle] = activeBattles[0];
                    
                    if (battle.turn !== sender) {
                        await sock.sendMessage(from, {
                            text: '⏰ It\'s not your turn! Wait for your opponent to make their move.',
                            quoted: msg
                        });
                        return;
                    }

                    const attacker = dataManager.playerData.avatarPlayers[sender];
                    const defender = dataManager.playerData.avatarPlayers[sender === battle.challenger ? battle.opponent : battle.challenger];
                    const attackerElement = elements[attacker.element];
                    const defenderElement = elements[defender.element];

                    if (!skillName) {
                        await sock.sendMessage(from, {
                            text: `🥋 **Choose your bending skill:**\n\n${attacker.skills.map(skill => `• **${attackerElement.skills[skill].name}** (${attackerElement.skills[skill].power} power | ${attackerElement.skills[skill].chiCost} chi)`).join('\n')}\n\nUsage: \`.avatar attack <skill name>\``,
                            quoted: msg
                        });
                        return;
                    }

                    // Find the skill
                    const skillKey = Object.keys(attackerElement.skills).find(key => 
                        attackerElement.skills[key].name.toLowerCase().includes(skillName) ||
                        key.toLowerCase().includes(skillName)
                    );

                    if (!skillKey || !attacker.skills.includes(skillKey)) {
                        await sock.sendMessage(from, {
                            text: `❌ Unknown or unlearned skill! Available skills:\n${attacker.skills.map(skill => `• ${attackerElement.skills[skill].name}`).join('\n')}`,
                            quoted: msg
                        });
                        return;
                    }

                    const usedSkill = attackerElement.skills[skillKey];
                    const currentChi = sender === battle.challenger ? battle.challengerChi : battle.opponentChi;

                    if (currentChi < usedSkill.chiCost) {
                        await sock.sendMessage(from, {
                            text: `⚡ Not enough chi! You need ${usedSkill.chiCost} chi but only have ${currentChi}.`,
                            quoted: msg
                        });
                        return;
                    }

                    // Calculate damage
                    const baseDamage = usedSkill.power;
                    const levelBonus = Math.floor(attacker.level * 2);
                    const randomFactor = Math.random() * 0.4 + 0.8; // 80-120% damage
                    const totalDamage = Math.floor((baseDamage + levelBonus) * randomFactor);

                    // Update battle state
                    if (sender === battle.challenger) {
                        battle.challengerChi -= usedSkill.chiCost;
                        battle.opponentHealth -= totalDamage;
                    } else {
                        battle.opponentChi -= usedSkill.chiCost;
                        battle.challengerHealth -= totalDamage;
                    }

                    battle.turn = sender === battle.challenger ? battle.opponent : battle.challenger;
                    battle.round++;

                    let battleResult = '';
                    let battleEnded = false;

                    // Check for battle end
                    if (battle.challengerHealth <= 0 || battle.opponentHealth <= 0) {
                        battleEnded = true;
                        const winner = battle.challengerHealth > 0 ? battle.challenger : battle.opponent;
                        const loser = winner === battle.challenger ? battle.opponent : battle.challenger;
                        
                        // Update player stats
                        dataManager.playerData.avatarPlayers[winner].wins++;
                        dataManager.playerData.avatarPlayers[winner].battles++;
                        dataManager.playerData.avatarPlayers[winner].experience += 50;
                        
                        dataManager.playerData.avatarPlayers[loser].losses++;
                        dataManager.playerData.avatarPlayers[loser].battles++;
                        dataManager.playerData.avatarPlayers[loser].health = Math.max(10, dataManager.playerData.avatarPlayers[loser].health - 20);

                        const winnerData = dataManager.playerData.avatarPlayers[winner];
                        const winnerElement = elements[winnerData.element];

                        battleResult = `\n\n🏆 **${winnerData.name}** wins the duel!\n\n🎯 **Rewards:**\n• Winner: +50 experience\n• Loser: -20 health\n\n${winnerElement.emoji} Victory for ${winnerElement.name}!`;
                        
                        delete dataManager.playerData.avatarBattles[attackBattleId];
                    }

                    dataManager.savePlayerData();

                    const nextTurnPlayer = dataManager.playerData.avatarPlayers[battle.turn];
                    const nextElement = elements[nextTurnPlayer?.element];

                    await sock.sendMessage(from, {
                        text: `⚔️ **Round ${Math.floor(battle.round / 2)} - Battle Update**

${attackerElement.emoji} **${attacker.name}** used **${usedSkill.name}**!
💥 Dealt ${totalDamage} damage!

📊 **Current Status:**
**${dataManager.playerData.avatarPlayers[battle.challenger].name}:**
❤️ Health: ${battle.challengerHealth}/${dataManager.playerData.avatarPlayers[battle.challenger].maxHealth}
⚡ Chi: ${battle.challengerChi}/${dataManager.playerData.avatarPlayers[battle.challenger].maxChi}

**${dataManager.playerData.avatarPlayers[battle.opponent].name}:**
❤️ Health: ${battle.opponentHealth}/${dataManager.playerData.avatarPlayers[battle.opponent].maxHealth}
⚡ Chi: ${battle.opponentChi}/${dataManager.playerData.avatarPlayers[battle.opponent].maxChi}

${battleEnded ? battleResult : `🎯 **${nextTurnPlayer.name}'s turn!**\nUse \`.avatar attack <skill>\` to strike back!`}`,
                        mentions: battleEnded ? [battle.challenger, battle.opponent] : [battle.turn],
                        contextInfo: {
                            externalAdReply: {
                                title: battleEnded ? 'Battle Complete!' : 'Battle in Progress',
                                body: battleEnded ? 'A victor emerges!' : `Round ${Math.floor(battle.round / 2)}`,
                                thumbnailUrl: attackerElement.image,
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                case 'leaderboard':
                case 'ranking':
                    const allPlayers = Object.entries(dataManager.playerData.avatarPlayers)
                        .map(([id, player]) => ({ id, ...player }))
                        .sort((a, b) => {
                            const aWinRate = a.battles > 0 ? (a.wins / a.battles) : 0;
                            const bWinRate = b.battles > 0 ? (b.wins / b.battles) : 0;
                            return (b.level * 1000 + bWinRate * 100) - (a.level * 1000 + aWinRate * 100);
                        })
                        .slice(0, 10);

                    if (allPlayers.length === 0) {
                        await sock.sendMessage(from, {
                            text: '📊 No Avatar players yet! Use `.avatar start <element>` to begin your journey.',
                            quoted: msg
                        });
                        return;
                    }

                    let leaderboardText = '🏆 **Avatar Bending Masters Leaderboard**\n\n';

                    allPlayers.forEach((player, index) => {
                        const playerElement = elements[player.element];
                        const winRate = player.battles > 0 ? ((player.wins / player.battles) * 100).toFixed(1) : 0;
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

                        leaderboardText += `${medal} ${playerElement.emoji} **${player.name}**\n`;
                        leaderboardText += `   Level ${player.level} ${playerElement.name} | ${winRate}% WR (${player.wins}W/${player.losses}L)\n\n`;
                    });

                    await sock.sendMessage(from, {
                        text: leaderboardText,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Avatar Leaderboard',
                                body: 'Top Bending Masters',
                                thumbnailUrl: 'https://static.wikia.nocookie.net/avatar/images/d/d8/Team_Avatar.png',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;

                default:
                    await sock.sendMessage(from, {
                        text: `🌍 **Avatar: The Last Airbender Game**

**Available Commands:**

🌟 **JOURNEY COMMANDS:**
• \`.avatar start <element>\` - Begin your bending journey
• \`.avatar profile\` - View your character stats
• \`.avatar train\` - Train to gain experience
• \`.avatar skills\` - View all bending skills

⚔️ **BATTLE COMMANDS:**
• \`.avatar challenge @user\` - Challenge another bender to duel
• \`.avatar accept\` - Accept a battle challenge
• \`.avatar decline\` - Decline a battle challenge
• \`.avatar attack <skill>\` - Use a bending skill in battle

🏆 **LEADERBOARD:**
• \`.avatar leaderboard\` - View top bending masters

**Elements Available:**
💨 Air | 🌊 Water | 🗿 Earth | 🔥 Fire

**Game Features:**
✨ Progressive skill system (5 skills per element)
🎯 Level-based character progression
⚔️ Strategic PvP battle system with chi management
🏆 Global leaderboards and rankings
💎 Unique skills and abilities for each element
🥊 Real-time dueling with other players

Start your journey today! Choose your element and master all 5 unique skills!`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Avatar: The Last Airbender',
                                body: 'Master the Elements',
                                thumbnailUrl: 'https://static.wikia.nocookie.net/avatar/images/d/d8/Team_Avatar.png',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        },
                        quoted: msg
                    });
                    break;
            }
        } catch (error) {
            console.error(chalk.red('[Avatar Game Error]'), error);
            await sock.sendMessage(from, {
                text: '❌ An error occurred in the Avatar game. Please try again.',
                quoted: msg
            });
        }
    }
};