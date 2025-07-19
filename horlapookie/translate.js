import { GoogleGenerativeAI } from '@google/generative-ai';

export const command = {
    name: 'translate',
    aliases: ['tr', 'trans'],
    description: 'Translate text to any language',
    usage: 'translate <text> | <target language>',
    category: 'AI',
    
    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;
        
        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: '🌐 Please provide text to translate!\n\nExample: .translate Hello world | Spanish\nExample: .translate Bonjour | English',
                contextInfo: {
                    externalAdReply: {
                        title: 'AI Translator',
                        body: 'Powered by Gemini',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        try {
            const ai = new GoogleGenerativeAI(settings.geminiApiKey);
            
            let text, targetLang;
            
            if (args.includes('|')) {
                [text, targetLang] = args.split('|').map(s => s.trim());
            } else {
                text = args.trim();
                targetLang = 'English';
            }
            
            const prompt = `Translate the following text to ${targetLang}. Only provide the translation without any additional text or explanation:\n\n${text}`;
            
            const genModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
            const response = await genModel.generateContent(prompt);
            
            const translation = response.response?.text() || "Translation failed";
            
            await sock.sendMessage(sender, {
                text: `🌐 *Translation Result*\n\n📝 Original: ${text}\n🎯 Target: ${targetLang}\n📖 Translation: ${translation}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'AI Translator',
                        body: 'Translation complete',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        } catch (error) {
            console.error('Translation error:', error);
            await sock.sendMessage(sender, {
                text: '❌ Sorry, I encountered an error while translating. Please try again later.',
                contextInfo: {
                    externalAdReply: {
                        title: 'Translation Error',
                        body: 'Processing failed',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        }
    }
};
