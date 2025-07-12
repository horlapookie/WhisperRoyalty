
export const command = {
    name: 'translate-lang',
    aliases: ['tr', 'lang'],
    description: 'Translate text to different languages',
    usage: 'translate-lang <language> <text>',
    category: 'utility',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide language and text!\n\nExample: .translate-lang spanish Hello world\n\nSupported: spanish, french, german, japanese, korean, chinese, etc.'
            });
            return;
        }
        
        const parts = args.trim().split(' ');
        if (parts.length < 2) {
            await sock.sendMessage(from, {
                text: '❌ Please provide both language and text!'
            });
            return;
        }
        
        const targetLang = parts[0].toLowerCase();
        const text = parts.slice(1).join(' ');
        
        try {
            // Sample translations for demonstration
            const translations = {
                spanish: 'Hola mundo',
                french: 'Bonjour le monde',
                german: 'Hallo Welt',
                japanese: 'こんにちは世界',
                korean: '안녕하세요 세계',
                chinese: '你好世界',
                italian: 'Ciao mondo',
                portuguese: 'Olá mundo',
                russian: 'Привет мир',
                arabic: 'مرحبا بالعالم'
            };
            
            const translation = translations[targetLang] || `[${targetLang}] ${text}`;
            
            const result = `🌐 **Translation Result**

**Original:** ${text}
**Language:** ${targetLang.charAt(0).toUpperCase() + targetLang.slice(1)}
**Translation:** ${translation}

💡 **Note:** This is a demonstration. For accurate translations, use Google Translate or similar services.`;

            await sock.sendMessage(from, {
                text: result
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to translate text!'
            });
        }
    }
};
