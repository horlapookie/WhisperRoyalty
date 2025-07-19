
export const command = {
    name: 'reverse',
    aliases: ['flip', 'backwards'],
    description: 'Reverse text in different ways (characters, words, upside down)',
    usage: 'reverse <type> <text> | reverse chars Hello | reverse words Hello World',
    category: 'fun',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🔄 **Text Reversal Tool**\n\n📝 **Usage:** .reverse <type> <text>\n\n**Types:**\n• **chars** - Reverse characters\n• **words** - Reverse word order\n• **upside** - Upside down text\n• **mirror** - Mirror effect\n\n**Examples:**\n• .reverse chars Hello World\n• .reverse words Hello World\n• .reverse upside Hello World'
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const type = argsArray[0].toLowerCase();
        const text = argsArray.slice(1).join(' ');
        
        if (!text.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide text to reverse!\n\nExample: .reverse chars Hello World'
            });
            return;
        }
        
        let result = '';
        let description = '';
        
        switch (type) {
            case 'chars':
            case 'characters':
                result = text.split('').reverse().join('');
                description = 'Characters reversed';
                break;
                
            case 'words':
                result = text.split(' ').reverse().join(' ');
                description = 'Word order reversed';
                break;
                
            case 'upside':
            case 'upsidedown':
                const upsideMap = {
                    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
                    'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
                    'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
                    'y': 'ʎ', 'z': 'z', '?': '¿', '!': '¡', '.': '˙', ',': "'", "'": '‛', '"': '„',
                    '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0'
                };
                result = text.toLowerCase().split('').map(char => upsideMap[char] || char).reverse().join('');
                description = 'Upside down text';
                break;
                
            case 'mirror':
                result = text + ' | ' + text.split('').reverse().join('');
                description = 'Mirror effect';
                break;
                
            case 'leetspeak':
            case 'leet':
                const leetMap = {
                    'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1', 'g': '9'
                };
                result = text.toLowerCase().split('').map(char => leetMap[char] || char).join('');
                description = 'Leet speak conversion';
                break;
                
            default:
                await sock.sendMessage(from, {
                    text: '❌ Invalid type! Available types:\n• chars - Reverse characters\n• words - Reverse words\n• upside - Upside down\n• mirror - Mirror effect\n• leet - Leet speak'
                });
                return;
        }
        
        await sock.sendMessage(from, {
            text: `🔄 **Text Reversal Complete** 🔄\n\n📝 **Original Text:**\n${text}\n\n🔀 **${description}:**\n${result}\n\n📋 **Type:** ${type}\n💡 Try different reversal types!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Text Reversed',
                    body: description,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=532',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
