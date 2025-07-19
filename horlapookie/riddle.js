
export const command = {
    name: 'riddle',
    description: 'Get brain teasing riddles',
    category: 'fun',
    usage: '.riddle [difficulty]',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const riddles = {
                easy: [
                    { q: "What has keys but no locks, space but no room, and you can enter but can't go inside?", a: "A keyboard" },
                    { q: "What gets wet while drying?", a: "A towel" },
                    { q: "What has hands but cannot clap?", a: "A clock" },
                    { q: "What can travel around the world while staying in a corner?", a: "A stamp" }
                ],
                medium: [
                    { q: "I have cities, but no houses dwell. I have mountains, but no trees as well. I have water, but no fish swim free. What am I?", a: "A map" },
                    { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps" },
                    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "The letter M" }
                ],
                hard: [
                    { q: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?", a: "An echo" },
                    { q: "You see a boat filled with people. It has not sunk, but when you look again you don't see a single person. Why?", a: "All the people were married" },
                    { q: "What breaks but never falls, and what falls but never breaks?", a: "Day breaks and night falls" }
                ]
            };
            
            const difficulty = args && riddles[args.toLowerCase()] ? args.toLowerCase() : 'easy';
            const riddleList = riddles[difficulty];
            const randomRiddle = riddleList[Math.floor(Math.random() * riddleList.length)];
            
            await sock.sendMessage(from, {
                text: `🧩 *Brain Teaser*\n\n🎯 Difficulty: ${difficulty}\n\n❓ Riddle:\n"${randomRiddle.q}"\n\n🤔 Think about it...\n\n💡 Reply with your answer, then scroll down for the solution!\n\n.\n.\n.\n.\n.\n\n✅ Answer: ${randomRiddle.a}\n\n🧠 Available difficulties: easy, medium, hard`
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get riddle!'
            });
        }
    }
};
