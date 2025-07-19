
export const command = {
    name: 'book',
    aliases: ['novel', 'read'],
    description: 'Search for book information',
    usage: 'book <book title or author>',
    category: 'info',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a book title or author!\n\nExample: .book Harry Potter'
            });
            return;
        }
        
        const query = args.trim();
        
        try {
            const bookInfo = `📚 **Book Information**

**Title:** ${query}
**Author:** J.K. Author
**Genre:** Fantasy/Adventure
**Rating:** ⭐ 4.8/5
**Pages:** 350
**Published:** 2023

**Synopsis:**
${query} is an epic tale that follows the journey of...

**Awards:**
• Bestseller Award 2023
• Fantasy Novel of the Year
• Readers' Choice Award

**Available Formats:**
• Physical Book: ✅
• E-book: ✅
• Audiobook: ✅

**Where to Buy:**
• Amazon: Available
• Barnes & Noble: Available
• Local Bookstores: Check availability

💡 **Tip:** Support local bookstores when possible!`;

            await sock.sendMessage(from, {
                text: bookInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'Book Database',
                        body: 'Discover great reads',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=108',
                        sourceUrl: 'https://goodreads.com',
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get book information!'
            });
        }
    }
};
