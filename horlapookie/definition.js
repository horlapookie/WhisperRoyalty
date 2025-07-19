
export const command = {
    name: 'definition',
    aliases: ['define', 'meaning'],
    description: 'Get word definitions',
    category: 'info',
    usage: '.definition <word>',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args) {
            return await sock.sendMessage(from, {
                text: '❌ Please provide a word to define!\n\nUsage: .definition happiness'
            });
        }

        try {
            // Mock definitions - in real implementation, you'd use a dictionary API
            const definitions = {
                happiness: "A feeling of joy, satisfaction, contentment, and fulfillment.",
                love: "An intense feeling of deep affection or a great interest and pleasure in something.",
                wisdom: "The quality of having experience, knowledge, and good judgment.",
                courage: "The ability to do something that frightens one; bravery.",
                peace: "A state of tranquility or quiet; freedom from disturbance.",
                success: "The accomplishment of an aim or purpose; the attainment of popularity or profit.",
                friendship: "The emotions or conduct of friends; the state of being friends.",
                creativity: "The use of imagination or original ideas to create something.",
                resilience: "The capacity to recover quickly from difficulties; toughness.",
                gratitude: "The quality of being thankful; readiness to show appreciation."
            };
            
            const word = args.toLowerCase();
            const definition = definitions[word] || `Definition not found. Try searching online for "${args}".`;
            
            await sock.sendMessage(from, {
                text: `📚 *Word Definition*\n\n🔤 Word: ${args}\n\n📖 Definition:\n${definition}\n\n💡 Tip: Use .wikipedia ${args} for more detailed information!`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Word Definition',
                        body: 'Dictionary lookup',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=117',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get definition!'
            });
        }
    }
};
