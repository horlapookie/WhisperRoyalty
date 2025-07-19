
export const command = {
    name: 'aicontext',
    aliases: ['contextai', 'smartai'],
    description: 'Context-aware AI conversations with memory',
    usage: 'aicontext <message> | aicontext clear | aicontext history',
    category: 'ai',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from, sender, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🤖 **Context-Aware AI Assistant**\n\nUsage:\n• .aicontext <your message> - Chat with memory\n• .aicontext clear - Clear conversation history\n• .aicontext history - View conversation log\n\nExample: .aicontext Tell me about quantum physics',
                contextInfo: {
                    externalAdReply: {
                        title: 'Context AI Assistant',
                        body: 'Smart conversations with memory',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }
        
        const argsArray = args.trim().split(' ');
        const command = argsArray[0]?.toLowerCase();
        
        // Initialize conversation context
        if (!global.aiContexts) {
            global.aiContexts = {};
        }
        
        if (!global.aiContexts[sender]) {
            global.aiContexts[sender] = {
                history: [],
                personality: 'helpful',
                lastInteraction: Date.now()
            };
        }
        
        const userContext = global.aiContexts[sender];
        
        try {
            switch (command) {
                case 'clear':
                    userContext.history = [];
                    await sock.sendMessage(from, {
                        text: '🧹 **Context Cleared**\n\nYour conversation history has been reset. I\'m ready for a fresh start!',
                        contextInfo: {
                            externalAdReply: {
                                title: 'Context Cleared',
                                body: 'Fresh conversation started',
                                thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    break;
                    
                case 'history':
                    const historyText = userContext.history.length > 0 
                        ? userContext.history.slice(-10).map((entry, index) => 
                            `${index + 1}. **${entry.role === 'user' ? 'You' : 'AI'}:** ${entry.content.substring(0, 50)}...`
                        ).join('\n')
                        : 'No conversation history yet.';
                    
                    await sock.sendMessage(from, {
                        text: `📚 **Conversation History**\n\n${historyText}\n\n💡 Showing last 10 interactions`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Conversation History',
                                body: `${userContext.history.length} total interactions`,
                                thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                    break;
                    
                default:
                    await handleContextualConversation(sock, from, sender, args, userContext, settings);
                    break;
            }
        } catch (error) {
            console.error('AI context error:', error);
            await sock.sendMessage(from, {
                text: '❌ Error processing your request. Please try again.'
            });
        }
        
        async function handleContextualConversation(sock, from, sender, message, userContext, settings) {
            // Add user message to context
            userContext.history.push({
                role: 'user',
                content: message,
                timestamp: Date.now()
            });
            
            // Keep only last 20 interactions to manage memory
            if (userContext.history.length > 20) {
                userContext.history = userContext.history.slice(-20);
            }
            
            // Generate contextual response
            const contextPrompt = generateContextPrompt(userContext, message);
            
            try {
                if (settings.geminiApiKey) {
                    const { GoogleGenerativeAI } = await import('@google/generative-ai');
                    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    
                    const result = await model.generateContent(contextPrompt);
                    const response = result.response;
                    const aiReply = response.text();
                    
                    // Add AI response to context
                    userContext.history.push({
                        role: 'assistant',
                        content: aiReply,
                        timestamp: Date.now()
                    });
                    
                    userContext.lastInteraction = Date.now();
                    
                    await sock.sendMessage(from, {
                        text: `🧠 **Context AI Assistant**\n\n${aiReply}\n\n💭 *Remembering our conversation...*`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Context AI Response',
                                body: `${userContext.history.length} interactions recorded`,
                                thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                } else {
                    await sock.sendMessage(from, {
                        text: '❌ Gemini API key not configured. Please set up the API key to use contextual AI features.'
                    });
                }
            } catch (error) {
                console.error('Context AI generation error:', error);
                await sock.sendMessage(from, {
                    text: '❌ Error generating contextual response. Please try again.'
                });
            }
        }
        
        function generateContextPrompt(userContext, currentMessage) {
            const recentHistory = userContext.history.slice(-10);
            const contextSummary = recentHistory.map(entry => 
                `${entry.role === 'user' ? 'Human' : 'Assistant'}: ${entry.content}`
            ).join('\n');
            
            return `You are a helpful AI assistant with memory of our conversation. Here's our recent chat history:

${contextSummary}

Current message: ${currentMessage}

Based on our conversation history, provide a helpful, contextual response that acknowledges our previous interactions. Keep responses concise but informative. If this is about a topic we've discussed before, reference that context appropriately.`;
        }
    }
};
