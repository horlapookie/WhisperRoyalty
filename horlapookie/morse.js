
export const command = {
    name: 'morse',
    aliases: ['dot'],
    description: 'Convert text to Morse code or Morse to text',
    usage: 'morse <text>',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide text to convert!\n\nExample: .morse Hello'
            });
            return;
        }
        
        const morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.', ' ': '/'
        };
        
        const reverseMorse = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));
        
        const input = args.trim().toUpperCase();
        
        if (input.includes('.') || input.includes('-')) {
            // Morse to text
            const words = input.split('/');
            const result = words.map(word => 
                word.split(' ').map(code => reverseMorse[code] || '?').join('')
            ).join(' ');
            
            await sock.sendMessage(from, {
                text: `📡 **Morse to Text**\n\nInput: ${input}\nResult: ${result}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Morse Code Converter',
                        body: 'Morse to Text',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=7',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        } else {
            // Text to Morse
            const result = input.split('').map(char => morseCode[char] || '?').join(' ');
            
            await sock.sendMessage(from, {
                text: `📡 **Text to Morse**\n\nInput: ${input}\nResult: ${result}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Morse Code Converter',
                        body: 'Text to Morse',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=7',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
