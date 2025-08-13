
export const command = {
    name: 'truth',
    aliases: ['truthordare', 'dare'],
    description: 'Play truth or dare game',
    category: 'games',
    usage: '.truth [truth/dare]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const truths = [
                "What's the most embarrassing thing that's ever happened to you?",
                "What's your biggest fear?",
                "Who was your first crush?",
                "What's the weirdest thing you've eaten?",
                "What's your most embarrassing childhood memory?",
                "What's a secret you've never told anyone?",
                "What's the worst lie you've ever told?",
                "Who do you have a crush on right now?",
                "What's your biggest regret?",
                "What's the most trouble you've ever been in?"
            ];
            
            const dares = [
                "Do your best impression of a celebrity",
                "Sing your favorite song out loud",
                "Do 10 push-ups",
                "Tell a joke (it has to be funny!)",
                "Do a silly dance for 30 seconds",
                "Say the alphabet backwards",
                "Call a friend and tell them a funny story",
                "Do your best animal impression",
                "Take a selfie making a funny face",
                "Speak in an accent for the next 3 messages"
            ];
            
            const type = args && args.toLowerCase();
            
            if (type === 'truth') {
                const randomTruth = truths[Math.floor(Math.random() * truths.length)];
                await sock.sendMessage(from, {
                    text: `🤔 *Truth Question*\n\n❓ ${randomTruth}\n\n💭 Be honest! That's the whole point! 😊`
                });
            } else if (type === 'dare') {
                const randomDare = dares[Math.floor(Math.random() * dares.length)];
                await sock.sendMessage(from, {
                    text: `😈 *Dare Challenge*\n\n🎯 ${randomDare}\n\n💪 You've got this! Show us what you've got! 🔥`
                });
            } else {
                // Random choice
                const isTruth = Math.random() < 0.5;
                if (isTruth) {
                    const randomTruth = truths[Math.floor(Math.random() * truths.length)];
                    await sock.sendMessage(from, {
                        text: `🎲 *Random: Truth*\n\n❓ ${randomTruth}\n\n💭 Time to be honest! 😊`
                    });
                } else {
                    const randomDare = dares[Math.floor(Math.random() * dares.length)];
                    await sock.sendMessage(from, {
                        text: `🎲 *Random: Dare*\n\n🎯 ${randomDare}\n\n💪 Challenge accepted? 🔥`
                    });
                }
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get truth or dare!'
            });
        }
    }
};
