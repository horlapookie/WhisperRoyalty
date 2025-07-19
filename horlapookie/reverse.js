
export const command = {
    name: 'reverse',
    aliases: ['rev'],
    description: 'Reverse text or words',
    usage: 'reverse <text>',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🔄 Please provide text to reverse!\n\nExample: .reverse Hello World',
                quoted: msg
            });
            return;
        }
        
        const text = args.trim();
        const reversed = text.split('').reverse().join('');
        const wordsReversed = text.split(' ').reverse().join(' ');
        
        await sock.sendMessage(from, {
            text: `🔄 **Text Reversed**\n\nOriginal: ${text}\nCharacters: ${reversed}\nWords: ${wordsReversed}`,
            quoted: msg
        });
    }
};
