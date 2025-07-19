
export const command = {
    name: 'repo',
    aliases: ['repository', 'github', 'source'],
    description: 'Shows the bot\'s GitHub repository information',
    usage: 'repo',
    category: 'info',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from } = context;

        await sock.sendMessage(from, {
            text: `🔗 **WhisperRoyalty Bot Repository**\n\n**📋 Repository Info:**\n• **Name:** WhisperRoyalty\n• **Creator:** horlapookie\n• **Language:** JavaScript (Node.js)\n• **Features:** Advanced WhatsApp Bot with AI, Games & Tools\n\n**🌟 Key Features:**\n• 🤖 AI Chat with Gemini\n• 🎮 130+ Commands\n• ⚡ Pokemon Battle System\n• 🛠️ Utility Tools\n• 🎵 Media & Entertainment\n• 💻 Developer Tools\n\n**🔗 Links:**\n• **Repository:** https://github.com/horlapookie/WhisperRoyalty\n• **Issues:** Report bugs and suggestions\n• **Contributions:** Fork and contribute!\n\n**⭐ Show Support:**\nStar the repository if you find it useful!\n\n**📝 License:** Open Source\n**📊 Version:** v0.0.1`,
            contextInfo: {
                externalAdReply: {
                    title: 'WhisperRoyalty Bot',
                    body: 'Advanced WhatsApp Bot Repository',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=600',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
    }
};
