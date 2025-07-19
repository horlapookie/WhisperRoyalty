
export const command = {
    name: 'zen',
    aliases: ['wisdom', 'peace'],
    description: 'Get zen wisdom and peaceful quotes',
    category: 'fun',
    usage: '.zen',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const zenQuotes = [
                "The present moment is the only time over which we have dominion. - Thich Nhat Hanh",
                "Peace comes from within. Do not seek it without. - Buddha",
                "You are perfect as you are, and you could use a little improvement. - Suzuki Roshi",
                "The quieter you become, the more you are able to hear. - Rumi",
                "In the midst of winter, I found there was, within me, an invincible summer. - Albert Camus",
                "Let go of what has passed. Let go of what may come. Let go of what is happening now. Don't try to figure anything out. Don't try to make anything happen. Relax, right now, and rest. - Tilopa",
                "The way is not in the sky. The way is in the heart. - Buddha",
                "Smile, breathe, and go slowly. - Thich Nhat Hanh",
                "Wherever you are, be there totally. - Eckhart Tolle",
                "The mind is everything. What you think you become. - Buddha"
            ];
            
            const zenTips = [
                "Take three deep breaths",
                "Notice five things you can see around you",
                "Feel your feet on the ground",
                "Listen to the sounds around you without judgment",
                "Place your hand on your heart and feel it beating",
                "Smile gently, even if you don't feel like it",
                "Thank yourself for taking this moment",
                "Let your shoulders drop and relax"
            ];
            
            const randomQuote = zenQuotes[Math.floor(Math.random() * zenQuotes.length)];
            const randomTip = zenTips[Math.floor(Math.random() * zenTips.length)];
            
            await sock.sendMessage(from, {
                text: `🧘‍♀️ *Zen Moment*\n\n💫 "${randomQuote}"\n\n🌸 Mindfulness tip:\n${randomTip}\n\n🕯️ Take a moment to breathe and be present.`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get zen wisdom!'
            });
        }
    }
};
