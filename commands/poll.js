
export const command = {
    name: 'poll',
    aliases: ['vote'],
    description: 'Create a simple poll',
    usage: 'poll <question>',
    category: 'misc',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a question for the poll!\n\nExample: .poll Should we order pizza?'
            });
            return;
        }
        
        const question = args.trim();
        
        await sock.sendMessage(from, {
            text: `📊 **Poll Created**\n\n**Question:** ${question}\n\n**Options:**\n👍 Yes\n👎 No\n🤷 Maybe\n\nReact to this message to vote!`,
            contextInfo: {
                externalAdReply: {
                    title: 'Poll Creator',
                    body: 'Interactive voting',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=9',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
    }
};
