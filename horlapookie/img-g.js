
import OpenAI from 'openai';

export const command = {
    name: 'img-g',
    aliases: ['imagegenerator', 'dalle', 'generate-image'],
    description: 'Generate images using OpenAI DALL-E',
    usage: 'img-g <prompt>',
    category: 'ai',
    cooldown: 30,
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🎨 Please provide a description for the image!\n\n📝 **Examples:**\n• `.img-g a guy standing watching his face`\n• `.img-g a beautiful sunset over mountains`\n• `.img-g a futuristic city with flying cars`',
                contextInfo: {
                    externalAdReply: {
                        title: 'DALL-E Image Generator',
                        body: 'OpenAI Image Generation',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://openai.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        const prompt = args.trim();
        
        if (!settings.openaiApiKey || settings.openaiApiKey === "YOUR_VALID_OPENAI_API_KEY_HERE" || settings.openaiApiKey.trim() === "") {
            await sock.sendMessage(from, {
                text: '❌ **OpenAI API Key Missing**\n\n🔑 The bot owner needs to configure a valid OpenAI API key in settings.js\n\n💡 Get your API key from: https://platform.openai.com/account/api-keys'
            });
            return;
        }
        
        // Check if the API key looks valid
        if (!settings.openaiApiKey.startsWith('sk-')) {
            await sock.sendMessage(from, {
                text: '❌ **Invalid OpenAI API Key Format**\n\n🔑 OpenAI API keys should start with "sk-"\n\n💡 Please check your API key in settings.js'
            });
            return;
        }
        
        try {
            const initialMsg = await sock.sendMessage(from, {
                text: `🎨 Generating image...\n\n📝 **Prompt:** ${prompt}\n\n⏳ This may take 10-30 seconds...`
            });
            
            const openai = new OpenAI({
                apiKey: settings.openaiApiKey,
            });
            
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                style: "vivid"
            });
            
            const imageUrl = response.data[0].url;
            const revisedPrompt = response.data[0].revised_prompt;
            
            // Download the image
            const fetch = (await import('node-fetch')).default;
            const imageResponse = await fetch(imageUrl);
            const imageBuffer = await imageResponse.buffer();
            
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `🎨 **Generated Image**\n\n📝 **Original Prompt:** ${prompt}\n\n🔄 **Revised Prompt:** ${revisedPrompt}\n\n✨ Generated via OpenAI DALL-E 3`,
                contextInfo: {
                    externalAdReply: {
                        title: 'DALL-E Generated Image',
                        body: 'OpenAI Image Generation',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://openai.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            console.error('OpenAI image generation error:', error);
            let errorMessage = '❌ Failed to generate image';
            
            if (error.status === 400) {
                if (error.code === 'billing_hard_limit_reached') {
                    errorMessage += '\n\n💳 **Billing Limit Reached**\nThe OpenAI account has reached its billing limit. Please contact the bot owner to add credits to the OpenAI account.';
                } else {
                    errorMessage += '\n\n💡 Your prompt may violate OpenAI\'s usage policies. Try a different description.';
                }
            } else if (error.status === 401) {
                errorMessage += '\n\n🔑 Invalid API key. Please contact the bot owner.';
            } else if (error.status === 429) {
                errorMessage += '\n\n⏰ Rate limit exceeded. Please try again later.';
            } else {
                errorMessage += `\n\n🐛 Error: ${error.message}`;
            }
            
            await sock.sendMessage(from, {
                text: errorMessage,
                contextInfo: {
                    externalAdReply: {
                        title: 'Generation Failed',
                        body: 'OpenAI Image Generation Error',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://openai.com',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
