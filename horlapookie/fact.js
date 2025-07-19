
export const command = {
    name: 'fact',
    aliases: ['randomfact'],
    description: 'Get a random interesting fact',
    usage: 'fact',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const facts = [
            "Octopuses have three hearts and blue blood.",
            "A group of flamingos is called a 'flamboyance'.",
            "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
            "Bananas are berries, but strawberries aren't.",
            "A single cloud can weigh more than a million pounds.",
            "Sharks have been around longer than trees.",
            "There are more possible games of chess than atoms in the observable universe.",
            "Wombat poop is cube-shaped.",
            "A day on Venus is longer than its year.",
            "The human brain contains about 86 billion neurons."
        ];
        
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        
        await sock.sendMessage(from, {
            text: `🧠 **Random Fact**\n\n${randomFact}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Random Fact',
                    body: 'Interesting facts',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=123',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
