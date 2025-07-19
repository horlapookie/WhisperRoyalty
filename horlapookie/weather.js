
export const command = {
    name: 'weather',
    aliases: ['temp'],
    description: 'Get weather information for a city',
    usage: 'weather <city>',
    category: 'misc',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🌤️ Please provide a city name!\n\nExample: .weather London',
                quoted: msg
            });
            return;
        }
        
        try {
            const city = args.trim();
            const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
            const weather = await response.text();
            
            await sock.sendMessage(from, {
                text: `🌤️ **Weather in ${city}**\n\n${weather.trim()}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Could not get weather data. Please check the city name.',
                quoted: msg
            });
        }
    }
};
