
export const command = {
    name: 'battle',
    aliases: ['fight', 'attack'],
    description: 'Enhanced battle system with visual field',
    usage: 'battle <action> [target]',
    category: 'pokemon',
    cooldown: 1,
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        if (!global.battles) global.battles = new Map();
        if (!global.catchBattles) global.catchBattles = new Map();
        
        const battleKey = from;
        let currentBattle = global.battles.get(battleKey) || global.catchBattles.get(battleKey);
        
        if (!currentBattle) {
            await sock.sendMessage(from, {
                text: '❌ No active battle found!\n\n💡 Use .pvp challenge @user to start a battle\n💡 Use .catch <pokemon> to battle wild Pokemon'
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const action = argsArray[0].toLowerCase();
        
        if (currentBattle.currentTurn !== sender) {
            await sock.sendMessage(from, {
                text: '⏰ **Not your turn!**\n\nWait for your opponent to make their move.'
            });
            return;
        }
        
        switch(action) {
            case 'fight':
                await handleFightAction(sock, msg, currentBattle, argsArray);
                break;
            case 'items':
                await handleItemsAction(sock, msg, currentBattle);
                break;
            case 'switch':
                await handleSwitchAction(sock, msg, currentBattle, argsArray);
                break;
            case 'forfeit':
                await handleForfeitAction(sock, msg, currentBattle);
                break;
            default:
                await showBattleOptions(sock, from, currentBattle);
        }
        
        async function showBattleOptions(sock, from, battle) {
            const playerPokemon = battle.player1.id === sender ? battle.player1Pokemon : battle.player2Pokemon;
            const opponentPokemon = battle.player1.id === sender ? battle.player2Pokemon : battle.player1Pokemon;
            
            await sock.sendMessage(from, {
                text: `⚔️ **Battle Options**\n\nUse one of the options given below *@${sender.split('@')[0]}*\n\n- To fight use *-battle fight*\n- To browse the items (and probably use it) in your bag. Use *-battle items*\n- To switch pokemon use *-battle switch*\n- To forfeit this battle use *-battle forfeit*`,
                mentions: [sender]
            });
        }
        
        async function handleFightAction(sock, msg, battle, argsArray) {
            const playerPokemon = battle.player1.id === sender ? battle.player1Pokemon : battle.player2Pokemon;
            const opponentPokemon = battle.player1.id === sender ? battle.player2Pokemon : battle.player1Pokemon;
            const opponent = battle.player1.id === sender ? battle.player2.id : battle.player1.id;
            
            if (argsArray.length === 1) {
                // Show moves
                let movesList = `⚔️ **Moves | ${playerPokemon.nickname}**\n\n`;
                playerPokemon.moves.forEach((move, index) => {
                    const pp = move.pp || move.maxPP || 20;
                    movesList += `**#${index + 1}**\n❓ *Move:* ${move.name}\n〽 *PP:* ${pp} / ${move.maxPP || 20}\n🎗 *Type:* ${move.type}\n🎃 *Power:* ${move.power}\n🎐 *Accuracy:* ${move.accuracy}\n🧧 *Description:* ${move.description || 'A Pokemon move.'}\nUse *-battle fight ${index + 1}* to use this move.\n\n`;
                });
                
                await sock.sendMessage(from, { text: movesList });
                return;
            }
            
            const moveIndex = parseInt(argsArray[1]) - 1;
            if (isNaN(moveIndex) || moveIndex < 0 || moveIndex >= playerPokemon.moves.length) {
                await sock.sendMessage(from, {
                    text: '❌ **Invalid move number!**\n\nUse .battle fight to see available moves.'
                });
                return;
            }
            
            const move = playerPokemon.moves[moveIndex];
            
            // Calculate damage
            const damage = calculateDamage(playerPokemon, opponentPokemon, move);
            opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage);
            
            // Create battle field image URL (you can replace with actual image generation)
            const battleFieldUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
            
            await sock.sendMessage(from, {
                text: `*@${sender.split('@')[0]}*'s *${playerPokemon.nickname}* used *${move.name}* at *${opponentPokemon.nickname}*`,
                mentions: [sender]
            });
            
            await sock.sendMessage(from, {
                text: `*@${sender.split('@')[0]}*'s *${playerPokemon.nickname}* dealt a damage of *${damage}* to *@${opponent.split('@')[0]}*'s *${opponentPokemon.nickname}*`,
                mentions: [sender, opponent]
            });
            
            // Send battle field visualization
            await sock.sendMessage(from, {
                image: { url: battleFieldUrl },
                caption: `🌀 *Pokemon Battle Field* 🌀\n\n*@${sender.split('@')[0]} - ${playerPokemon.nickname}* (HP: ${playerPokemon.hp} / ${playerPokemon.maxHp} | Level: ${playerPokemon.level} | Moves: ${playerPokemon.moves.length} | Type: ${playerPokemon.type})\n\n*${battle.isWildBattle ? 'Wild' : '@' + opponent.split('@')[0]} ${opponentPokemon.nickname}* - ${opponentPokemon.nickname} (HP: ${opponentPokemon.hp} / ${opponentPokemon.maxHp} | Level: ${opponentPokemon.level} | Moves: ${opponentPokemon.moves.length} | Type: ${opponentPokemon.type})`,
                mentions: [sender, opponent]
            });
            
            // Check if battle is over
            if (opponentPokemon.hp <= 0) {
                await handleBattleEnd(sock, from, battle, sender);
                return;
            }
            
            // Switch turns
            battle.currentTurn = opponent;
            
            // AI turn for wild battles
            if (battle.isWildBattle) {
                setTimeout(async () => {
                    await handleAITurn(sock, from, battle);
                }, 2000);
            }
        }
        
        async function handleBattleEnd(sock, from, battle, winner) {
            const winnerPokemon = battle.player1.id === winner ? battle.player1Pokemon : battle.player2Pokemon;
            const loser = battle.player1.id === winner ? battle.player2.id : battle.player1.id;
            
            if (battle.isWildBattle) {
                // Wild battle won - Pokemon levels up and player gets gold
                const dataManager = global.dataManager;
                const expGained = Math.floor(Math.random() * 100) + 50;
                const goldEarned = Math.floor(Math.random() * 200) + 100;
                
                winnerPokemon.exp = (winnerPokemon.exp || 0) + expGained;
                if (winnerPokemon.exp >= winnerPokemon.expToNext) {
                    winnerPokemon.level++;
                    winnerPokemon.exp = 0;
                    winnerPokemon.expToNext = winnerPokemon.level * 100;
                    winnerPokemon.hp = winnerPokemon.maxHp = Math.floor(winnerPokemon.maxHp * 1.1);
                    winnerPokemon.attack = Math.floor(winnerPokemon.attack * 1.05);
                    winnerPokemon.defense = Math.floor(winnerPokemon.defense * 1.05);
                }
                
                const playerStats = dataManager.getPlayerStats(winner);
                playerStats.gold = (playerStats.gold || 0) + goldEarned;
                dataManager.savePlayerStats(winner, playerStats);
                
                await sock.sendMessage(from, {
                    text: `🎉 **Victory!**\n\n*@${winner.split('@')[0]}* won the battle!\n\n📈 **Rewards:**\n• ${expGained} EXP gained\n• ${goldEarned} gold earned\n• ${winnerPokemon.nickname} ${winnerPokemon.level > (winnerPokemon.level - 1) ? 'leveled up!' : ''}`,
                    mentions: [winner]
                });
                
                global.catchBattles.delete(from);
            } else {
                // PvP battle
                const goldWon = Math.floor(Math.random() * 1000) + 500;
                
                await sock.sendMessage(from, {
                    text: `🎉 Congrats! *@${winner.split('@')[0]}*, you won this battle and got *${goldWon}* gold from *@${loser.split('@')[0]}*`,
                    mentions: [winner, loser]
                });
                
                global.battles.delete(from);
            }
        }
        
        function calculateDamage(attacker, defender, move) {
            const baseDamage = move.power || 40;
            const level = attacker.level || 1;
            const attack = attacker.attack || 50;
            const defense = defender.defense || 50;
            
            // Type effectiveness
            const effectiveness = getTypeEffectiveness(move.type, defender.type);
            
            // Random factor
            const randomFactor = 0.85 + Math.random() * 0.3;
            
            const damage = Math.floor(((((2 * level + 10) / 250) * (attack / defense) * baseDamage) + 2) * effectiveness * randomFactor);
            
            return Math.max(1, damage);
        }
        
        function getTypeEffectiveness(attackType, defenderType) {
            // Simplified type chart
            const typeChart = {
                'Fire': { 'Grass': 2, 'Water': 0.5, 'Fire': 0.5 },
                'Water': { 'Fire': 2, 'Grass': 0.5, 'Water': 0.5 },
                'Grass': { 'Water': 2, 'Fire': 0.5, 'Grass': 0.5 },
                'Electric': { 'Water': 2, 'Ground': 0, 'Electric': 0.5 },
                'Fighting': { 'Normal': 2, 'Flying': 0.5, 'Psychic': 0.5 }
            };
            
            const defenderTypes = defenderType.split('/');
            let effectiveness = 1;
            
            for (const type of defenderTypes) {
                if (typeChart[attackType] && typeChart[attackType][type] !== undefined) {
                    effectiveness *= typeChart[attackType][type];
                }
            }
            
            return effectiveness;
        }
    }
};
