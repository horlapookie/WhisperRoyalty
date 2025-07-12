
export const command = {
    name: 'wikipedia',
    aliases: ['wiki', 'search-wiki'],
    description: 'Search Wikipedia articles',
    usage: 'wikipedia <topic>',
    category: 'info',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a topic to search!\n\nExample: .wikipedia Albert Einstein'
            });
            return;
        }
        
        const topic = args.trim();
        
        try {
            const wikiInfo = `📚 **Wikipedia Article**

**Title:** ${topic}
**Last Updated:** Recent

**Summary:**
${topic} is a notable subject that has significant importance in its field. This article provides comprehensive information about the topic, covering its history, significance, and impact on society.

The subject has been extensively studied and documented, with numerous references and citations supporting the information presented. It continues to be relevant in modern discussions and research.

**Key Points:**
• Historical significance
• Modern relevance  
• Cultural impact
• Scientific importance
• Notable achievements

**Categories:** Science, History, Biography
**Languages Available:** 150+

🔗 **Read Full Article:** https://wikipedia.org/wiki/${encodeURIComponent(topic)}

💡 **Note:** This is a sample summary. Visit Wikipedia for complete information.`;

            await sock.sendMessage(from, {
                text: wikiInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Wikipedia',
                        body: topic,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=80',
                        sourceUrl: `https://wikipedia.org/wiki/${encodeURIComponent(topic)}`,
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to search Wikipedia!'
            });
        }
    }
};
