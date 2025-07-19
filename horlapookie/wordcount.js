
export const command = {
    name: 'wordcount',
    aliases: ['textanalysis', 'analyze', 'wc'],
    description: 'Analyze text for word count, characters, and statistics',
    usage: 'wordcount <text>',
    category: 'utility',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '📝 **Text Analysis Tool**\n\n📋 **Usage:** .wordcount <your text>\n\n**Example:** .wordcount Hello world, this is a test message with multiple words!\n\n💡 I\'ll analyze word count, characters, sentences, and more!'
            });
            return;
        }
        
        const text = args.trim();
        
        // Basic counts
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
        
        // Advanced analysis
        const averageWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
        const averageCharsPerWord = words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0;
        const readingTimeMinutes = Math.ceil(words / 200); // Average reading speed
        
        // Most common words (excluding common stop words)
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
        
        const wordFreq = {};
        const cleanWords = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        cleanWords.forEach(word => {
            if (!stopWords.includes(word) && word.length > 2) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        const topWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([word, count]) => `${word} (${count})`)
            .join(', ');
        
        // Text complexity
        let complexity = 'Simple';
        if (averageWordsPerSentence > 20 || averageCharsPerWord > 6) {
            complexity = 'Complex';
        } else if (averageWordsPerSentence > 15 || averageCharsPerWord > 5) {
            complexity = 'Moderate';
        }
        
        await sock.sendMessage(from, {
            text: `📊 **Text Analysis Results** 📊\n\n📝 **Basic Statistics:**\n• **Characters:** ${characters.toLocaleString()}\n• **Characters (no spaces):** ${charactersNoSpaces.toLocaleString()}\n• **Words:** ${words.toLocaleString()}\n• **Sentences:** ${sentences.toLocaleString()}\n• **Paragraphs:** ${paragraphs.toLocaleString()}\n\n🧮 **Advanced Analysis:**\n• **Avg. words per sentence:** ${averageWordsPerSentence}\n• **Avg. characters per word:** ${averageCharsPerWord}\n• **Reading time:** ~${readingTimeMinutes} min\n• **Text complexity:** ${complexity}\n\n🔤 **Most frequent words:**\n${topWords || 'None found'}\n\n📖 **Text Preview:**\n"${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`,
            contextInfo: {
                externalAdReply: {
                    title: 'Text Analysis Complete',
                    body: `${words} words • ${characters} characters`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=530',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
