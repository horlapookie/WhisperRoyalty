
export const command = {
    name: 'coinflip',
    aliases: ['flip', 'coin'],
    description: 'Flip a coin',
    usage: 'coinflip',
    category: 'games',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🥈';
        
        await sock.sendMessage(from, {
            text: `${emoji} **Coin Flip**\n\nResult: **${result}**`,
            contextInfo: {
                externalAdReply: {
                    title: 'Coin Flip',
                    body: 'Random chance',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=110',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
