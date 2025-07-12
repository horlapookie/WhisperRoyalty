
export const command = {
    name: 'emoji',
    aliases: ['emote'],
    description: 'Convert text to emoji or get random emoji',
    usage: 'emoji [text]',
    category: 'misc',
    cooldown: 2,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'];
        
        if (!args.trim()) {
            // Return random emoji
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await sock.sendMessage(from, {
                text: `🎲 **Random Emoji**\n\n${randomEmoji}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Random Emoji',
                        body: 'Fun emoji generator',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=120',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const text = args.trim().toLowerCase();
        let result = '';
        
        // Simple text to emoji mapping
        const emojiMap = {
            'happy': '😊', 'sad': '😢', 'love': '❤️', 'angry': '😠', 'cool': '😎',
            'fire': '🔥', 'water': '💧', 'food': '🍕', 'music': '🎵', 'cat': '🐱',
            'dog': '🐶', 'heart': '💖', 'star': '⭐', 'moon': '🌙', 'sun': '☀️',
            'rain': '🌧️', 'snow': '❄️', 'flower': '🌸', 'tree': '🌳', 'car': '🚗'
        };
        
        for (const [word, emoji] of Object.entries(emojiMap)) {
            if (text.includes(word)) {
                result += emoji + ' ';
            }
        }
        
        if (!result) {
            result = emojis[Math.floor(Math.random() * emojis.length)];
        }
        
        await sock.sendMessage(from, {
            text: `😊 **Emoji Converter**\n\nInput: ${text}\nResult: ${result}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Emoji Converter',
                    body: 'Text to emoji',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=121',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
