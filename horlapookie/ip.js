
import axios from 'axios';

export const command = {
    name: 'ip',
    aliases: ['ipinfo'],
    description: 'Get IP address information',
    usage: 'ip [ip_address]',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            let ip = args.trim();
            if (!ip) {
                // Get user's IP
                const response = await axios.get('https://api.ipify.org?format=json');
                ip = response.data.ip;
            }
            
            const ipInfo = await axios.get(`http://ip-api.com/json/${ip}`);
            const data = ipInfo.data;
            
            if (data.status === 'fail') {
                await sock.sendMessage(from, {
                    text: '❌ Invalid IP address!'
                });
                return;
            }
            
            await sock.sendMessage(from, {
                text: `🌐 **IP Information**\n\n**IP:** ${data.query}\n**Country:** ${data.country}\n**Region:** ${data.regionName}\n**City:** ${data.city}\n**ISP:** ${data.isp}\n**Timezone:** ${data.timezone}\n**Coordinates:** ${data.lat}, ${data.lon}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'IP Information',
                        body: 'Geolocation data',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=5',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get IP information!'
            });
        }
    }
};
