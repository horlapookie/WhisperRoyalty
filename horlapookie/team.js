
export const command = {
    name: 'team',
    aliases: ['teams', 'group'],
    description: 'Randomly divide people into teams',
    category: 'utility',
    usage: '.team <names> | <team_count>',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '❌ Please provide names and team count!\n\nUsage: .team John,Mary,Bob,Alice | 2\n(This creates 2 random teams)'
            });
        }

        try {
            const [namesPart, teamCountPart] = args.split('|').map(s => s.trim());
            
            if (!namesPart || !teamCountPart) {
                return await sock.sendMessage(from, {
                    text: '❌ Invalid format!\n\nCorrect format: .team name1,name2,name3 | team_count'
                });
            }
            
            const names = namesPart.split(',').map(name => name.trim()).filter(name => name);
            const teamCount = parseInt(teamCountPart);
            
            if (names.length < 2) {
                return await sock.sendMessage(from, {
                    text: '❌ Need at least 2 people to make teams!'
                });
            }
            
            if (teamCount < 1 || teamCount > names.length) {
                return await sock.sendMessage(from, {
                    text: '❌ Invalid team count! Must be between 1 and number of people.'
                });
            }
            
            // Shuffle names
            const shuffled = [...names].sort(() => Math.random() - 0.5);
            
            // Create teams
            const teams = Array.from({ length: teamCount }, () => []);
            shuffled.forEach((name, index) => {
                teams[index % teamCount].push(name);
            });
            
            let result = `👥 *Team Generator*\n\n`;
            teams.forEach((team, index) => {
                result += `🏆 Team ${index + 1}: ${team.join(', ')}\n`;
            });
            
            result += `\n🎲 Total players: ${names.length}\n🏅 Number of teams: ${teamCount}`;
            
            await sock.sendMessage(from, { text: result });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to create teams!'
            });
        }
    }
};
