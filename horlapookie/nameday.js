
export const command = {
    name: 'nameday',
    description: 'Check name day celebrations',
    category: 'info',
    usage: '.nameday [name]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const nameDays = {
                january: { 1: "Mary, Jesus", 7: "Raymond", 15: "Paul", 25: "Paul" },
                february: { 2: "Candlemas", 14: "Valentine", 22: "Margaret", 29: "Leap Day" },
                march: { 17: "Patrick", 19: "Joseph", 25: "Annunciation" },
                april: { 23: "George", 25: "Mark" },
                may: { 1: "Joseph", 31: "Mary" },
                june: { 24: "John", 29: "Peter, Paul" },
                july: { 22: "Mary Magdalene", 25: "James", 26: "Anne" },
                august: { 15: "Mary", 24: "Bartholomew" },
                september: { 21: "Matthew", 29: "Michael" },
                october: { 4: "Francis", 31: "All Saints' Eve" },
                november: { 1: "All Saints", 30: "Andrew" },
                december: { 6: "Nicholas", 25: "Christmas", 26: "Stephen" }
            };
            
            if (!args) {
                const today = new Date();
                const month = today.toLocaleDateString('en', { month: 'long' }).toLowerCase();
                const day = today.getDate();
                
                const todaysNames = nameDays[month] && nameDays[month][day] 
                    ? nameDays[month][day] 
                    : "No special name day today";
                
                return await sock.sendMessage(from, {
                    text: `📅 *Today's Name Day*\n\n🗓️ Date: ${today.toLocaleDateString()}\n👥 Names: ${todaysNames}\n\n🎉 Happy name day to those celebrating!`
                });
            }
            
            // Search for name in all months
            let found = [];
            for (const [month, days] of Object.entries(nameDays)) {
                for (const [day, names] of Object.entries(days)) {
                    if (names.toLowerCase().includes(args.toLowerCase())) {
                        found.push(`${month.charAt(0).toUpperCase() + month.slice(1)} ${day}`);
                    }
                }
            }
            
            const result = found.length > 0 
                ? `🎊 Name day(s) for "${args}":\n${found.join(', ')}`
                : `❌ No name day found for "${args}"`;
            
            await sock.sendMessage(from, {
                text: `📅 *Name Day Search*\n\n${result}\n\n💡 Use .nameday without arguments to see today's names!`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to check name day!'
            });
        }
    }
};
