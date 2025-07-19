
export const command = {
    name: 'movie',
    aliases: ['film', 'cinema'],
    description: 'Search for movie information',
    usage: 'movie <movie name>',
    category: 'info',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a movie name!\n\nExample: .movie Avengers'
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            const movieInfo = `🎬 **Movie Information**

**Title:** ${query}
**Year:** 2023
**Genre:** Action/Adventure
**Rating:** ⭐ 8.5/10
**Duration:** 2h 30m

**Plot:** ${query} is an epic adventure that follows...

**Cast:**
• Director: John Doe
• Lead Actor: Jane Smith
• Supporting: Mike Johnson

**Where to Watch:**
• Netflix: Available ✅
• Amazon Prime: Available ✅
• Disney+: Available ✅
• HBO Max: Available ✅

**Box Office:** $500M worldwide

💡 **Note:** This is sample movie data for demonstration.`;

            await sock.sendMessage(from, {
                text: movieInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Movie Database',
                        body: 'Discover movies and shows',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=21',
                        sourceUrl: 'https://imdb.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get movie information!'
            });
        }
    }
};
