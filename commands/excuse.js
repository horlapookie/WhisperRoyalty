
export const command = {
    name: 'excuse',
    description: 'Generate random excuses',
    category: 'fun',
    usage: '.excuse [type]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const excuses = {
                work: [
                    "My internet connection was unstable all morning.",
                    "I had to take my pet to the emergency vet.",
                    "There was a power outage in my neighborhood.",
                    "My alarm clock mysteriously stopped working.",
                    "I got stuck in unexpected traffic for 2 hours."
                ],
                school: [
                    "My computer crashed and I lost all my homework.",
                    "I was sick with a mysterious 24-hour bug.",
                    "My printer ran out of ink at the last minute.",
                    "There was a family emergency I had to attend to.",
                    "The assignment file got corrupted somehow."
                ],
                general: [
                    "I was helping an elderly neighbor with groceries.",
                    "My phone battery died and I couldn't find my charger.",
                    "I got locked out of my house this morning.",
                    "There was a water leak I had to deal with urgently.",
                    "I was volunteering at a local charity event."
                ]
            };
            
            const type = args && excuses[args.toLowerCase()] ? args.toLowerCase() : 'general';
            const excuseList = excuses[type];
            const randomExcuse = excuseList[Math.floor(Math.random() * excuseList.length)];
            
            await sock.sendMessage(from, {
                text: `🤥 *Excuse Generator*\n\n📝 Category: ${type}\n\n💬 Your excuse:\n"${randomExcuse}"\n\n⚠️ Use responsibly! 😉`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Excuse Generator',
                        body: 'Creative excuses',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=122',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate excuse!'
            });
        }
    }
};
