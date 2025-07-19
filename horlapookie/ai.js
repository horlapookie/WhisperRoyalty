import { GoogleGenerativeAI } from '@google/generative-ai';

export const command = {
    name: 'ai',
    aliases: ['gemini', 'ask'],
    description: 'Chat with Gemini AI',
    usage: 'ai <your question>',
    category: 'AI',

    async execute(sock, msg, args, context) {
        const { settings } = context;
        const sender = msg.key.remoteJid;

        if (!args.trim()) {
            await sock.sendMessage(sender, {
                text: `🤖 **AI Models Available**

**Usage:** .ai <model> <question>

**Available Models:**
• .ai gemini <question> - Google Gemini (default)
• .ai gpt <question> - GPT-style responses
• .ai claude <question> - Claude-style responses
• .ai creative <question> - Creative writing AI
• .ai code <question> - Programming assistant
• .ai translate <text> - Translation AI
• .ai summarize <text> - Text summarizer
• .ai explain <topic> - Educational AI
• .ai story <prompt> - Story generator
• .ai poem <theme> - Poetry generator

**Example:** .ai gemini What is quantum physics?`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Multi-AI Assistant',
                        body: '10 AI models available',
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
            const parts = args.trim().split(' ');
            const modelType = parts[0].toLowerCase();
            const question = parts.slice(1).join(' ');

            let reply;
            let modelName = 'Gemini AI';

            // Route to different AI models
            switch (modelType) {
                case 'gpt':
                    modelName = 'GPT-Style AI';
                    reply = await generateGPTStyleResponse(question);
                    break;
                case 'claude':
                    modelName = 'Claude-Style AI';
                    reply = await generateClaudeStyleResponse(question);
                    break;
                case 'creative':
                    modelName = 'Creative AI';
                    reply = await generateCreativeResponse(question);
                    break;
                case 'code':
                    modelName = 'Code Assistant';
                    reply = await generateCodeResponse(question);
                    break;
                case 'translate':
                    modelName = 'Translation AI';
                    reply = await generateTranslationResponse(question);
                    break;
                case 'summarize':
                    modelName = 'Text Summarizer';
                    reply = await generateSummaryResponse(question);
                    break;
                case 'explain':
                    modelName = 'Educational AI';
                    reply = await generateExplanationResponse(question);
                    break;
                case 'story':
                    modelName = 'Story Generator';
                    reply = await generateStoryResponse(question);
                    break;
                case 'poem':
                    modelName = 'Poetry Generator';
                    reply = await generatePoemResponse(question);
                    break;
                case 'gemini':
                default:
                    // Use Gemini as default
                    const ai = new GoogleGenerativeAI(settings.geminiApiKey);
                    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const response = await model.generateContent(question || args);
                    reply = response.response?.text() || "I'm sorry, I couldn't process that request.";
                    break;
            }

            await sock.sendMessage(sender, {
                text: `🤖 *${modelName}*\n\n${reply}`,
                contextInfo: {
                    externalAdReply: {
                        title: modelName,
                        body: 'AI Assistant',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        } catch (error) {
            console.error('AI command error:', error);
            await sock.sendMessage(sender, {
                text: '❌ Sorry, I encountered an error while processing your request. Please try again later.',
                contextInfo: {
                    externalAdReply: {
                        title: 'AI Error',
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

async function generateGPTStyleResponse(question) {
    // Replace with actual GPT-style AI call
    return `GPT-style response: ${question}`;
}

async function generateClaudeStyleResponse(question) {
    // Replace with actual Claude-style AI call
    return `Claude-style response: ${question}`;
}

async function generateCreativeResponse(question) {
    // Replace with actual Creative AI call
    return `Creative response: ${question}`;
}

async function generateCodeResponse(question) {
    // Replace with actual Code AI call
    return `Code response: ${question}`;
}

async function generateTranslationResponse(question) {
    // Replace with actual Translation AI call
    return `Translation response: ${question}`;
}

async function generateSummaryResponse(question) {
    // Replace with actual Summary AI call
    return `Summary response: ${question}`;
}

async function generateExplanationResponse(question) {
    // Replace with actual Explanation AI call
    return `Explanation response: ${question}`;
}

async function generateStoryResponse(question) {
    // Replace with actual Story AI call
    return `Story response: ${question}`;
}

async function generatePoemResponse(question) {
    // Replace with actual Poem AI call
    return `Poem response: ${question}`;
}