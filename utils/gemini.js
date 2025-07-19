import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiAI {
    constructor(apiKey) {
        this.ai = new GoogleGenerativeAI(apiKey);
    }
    
    async generateText(prompt, model = 'gemini-2.5-flash') {
        try {
            const genModel = this.ai.getGenerativeModel({ model: model });
            const response = await genModel.generateContent(prompt);
            
            return response.response?.text() || "I'm sorry, I couldn't process that request.";
        } catch (error) {
            console.error('Gemini text generation error:', error);
            throw new Error('Failed to generate text response');
        }
    }
    
    async generateImage(prompt) {
        try {
            // Note: Image generation is not available in the current Gemini API version
            // This feature would require a different approach or service
            throw new Error('Image generation not available with current Gemini API version');
        } catch (error) {
            console.error('Gemini image generation error:', error);
            throw new Error('Failed to generate image: ' + error.message);
        }
    }
    
    async translateText(text, targetLanguage = 'English') {
        try {
            const prompt = `Translate the following text to ${targetLanguage}. Only provide the translation without any additional text or explanation:\n\n${text}`;
            
            const genModel = this.ai.getGenerativeModel({ model: "gemini-2.5-flash" });
            const response = await genModel.generateContent(prompt);
            
            return response.response?.text() || "Translation failed";
        } catch (error) {
            console.error('Gemini translation error:', error);
            throw new Error('Failed to translate text');
        }
    }
}
