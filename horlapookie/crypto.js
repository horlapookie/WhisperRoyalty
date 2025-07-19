
export const command = {
    name: 'crypto',
    aliases: ['coin', 'price'],
    description: 'Get cryptocurrency price',
    usage: 'crypto <coin_symbol>',
    category: 'misc',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '💰 Please provide a cryptocurrency symbol!\n\nExample: .crypto BTC',
                quoted: msg
            });
            return;
        }
        
        try {
            const coin = args.trim().toUpperCase();
            const response = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${coin}.json`);
            
            if (coin === 'BTC') {
                const data = await response.json();
                const price = data.bpi.USD.rate;
                
                await sock.sendMessage(from, {
                    text: `₿ **Bitcoin Price**\n\n💵 USD: $${price}\n\nLast updated: ${data.time.updated}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Bitcoin Price',
                            body: 'Cryptocurrency tracker',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=115',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, {
                    text: '💰 Currently only BTC is supported. More coins coming soon!',
                    quoted: msg
                });
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get cryptocurrency price. Try again later.',
                quoted: msg
            });
        }
    }
};
