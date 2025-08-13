
import axios from 'axios';

export const command = {
    name: 'gpt-4',
    aliases: ['gpt4', 'chatgpt'],
    description: 'Chat with GPT-4 AI model',
    usage: 'gpt-4 <your message>',
    category: 'ai',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a message!\n\nExample: .gpt-4 What is artificial intelligence?'
            });
            return;
        }

        const text = args.trim();

        try {
            await sock.sendMessage(from, {
                react: { text: '🤖', key: msg.key }
            });

            // Send typing indicator
            await sock.sendPresenceUpdate('composing', from);

            const response = await axios.post("https://chateverywhere.app/api/chat/", {
                model: {
                    id: "gpt-4",
                    name: "GPT-4",
                    maxLength: 32000,
                    tokenLimit: 8000,
                    completionTokenLimit: 5000,
                    deploymentName: "gpt-4"
                },
                messages: [{
                    pluginId: null,
                    content: text,
                    role: "user"
                }],
                prompt: "ඔයාගෙ නම = මම SUPUN MD AI කෙනෙක්,කෑවද බන් = මම කෑවා ඔයා කෑවද?, බිව්ව ද බන් = මම බිව්වා ඔයා බිව්වද?, නම = SUPUN-MD-AI",
                temperature: 0.5
            }, {
                headers: {
                    Accept: "*/*",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                }
            });

            const result = response.data;

            await sock.sendMessage(from, {
                text: `🤖 *GPT-4 Response:*\n\n${result}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'GPT-4 AI Assistant',
                        body: 'Powered by OpenAI GPT-4',
                        thumbnailUrl: 'https://files.catbox.moe/bh2fpj.jpg',
                        sourceUrl: 'https://openai.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

        } catch (error) {
            console.error('GPT-4 Error:', error);
            await sock.sendMessage(from, {
                text: `❌ Failed to get GPT-4 response: ${error.message}\n\nPlease try again later.`
            });
        } finally {
            await sock.sendPresenceUpdate('paused', from);
        }
    }
};
