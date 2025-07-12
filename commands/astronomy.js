
export const command = {
    name: 'astronomy',
    aliases: ['space', 'apod'],
    description: 'Get astronomy picture of the day and space facts',
    category: 'info',
    usage: '.astronomy',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        const facts = [
            "One day on Venus is longer than its year",
            "Jupiter has 79 known moons",
            "The Sun makes up 99.86% of our solar system's mass",
            "Saturn's density is less than water",
            "A neutron star's density is so great that a teaspoon would weigh 6 billion tons"
        ];
        
        const fact = facts[Math.floor(Math.random() * facts.length)];
        
        await sock.sendMessage(from, {
            text: `🌌 **Astronomy Daily**\n\n🔭 **Space Fact:**\n${fact}\n\n🌟 **Today's Sky:**\n• Venus: Visible at dawn\n• Mars: Rising at midnight\n• Jupiter: High in sky\n• Saturn: Setting at dusk\n\n✨ Keep looking up!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Astronomy Picture of the Day',
                    body: 'Space facts and celestial events',
                    thumbnailUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
                    sourceUrl: 'https://nasa.gov',
                    mediaType: 1
                }
            }
        });
    }
};
