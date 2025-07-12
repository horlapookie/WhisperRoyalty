const command = {
    name: 'help',
    aliases: ['h', 'menu', 'commands'],
    description: 'Display help information and command list',
    usage: 'help [category]',
    category: 'info',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        // Parse arguments properly
        const argsArray = args.trim().split(' ').filter(arg => arg.length > 0);

        if (argsArray.length > 0) {
            const category = argsArray[0].toLowerCase();
            let commandList = '';

            switch (category) {
                case 'owner':
                    commandList = `
╭━━━━《 *𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .public - Set bot to public mode
┃ ◉ .private - Set bot to private mode
┃ ◉ .on - Turn bot on
┃ ◉ .off - Turn bot off
┃ ◉ .autoview - Toggle status auto-viewing
┃ ◉ .autoreact - Toggle auto-reactions
┃ ◉ .chatbot - Toggle DM AI responses
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'general':
                    commandList = `
╭━━━━《 *𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .ping - Check bot response time
┃ ◉ .menu - Show all commands
┃ ◉ .repo - View repository info
┃ ◉ .weather <city> - Weather forecast
┃ ◉ .time <timezone> - World clock
┃ ◉ .fact - Random facts
┃ ◉ .quote - Inspirational quotes
┃ ◉ .news <topic> - Latest news
┃ ◉ .horoscope <sign> - Daily horoscope
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'group':
                    commandList = `
╭━━━━《 *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .tagall <message> - Tag all members
┃ ◉ .hidetag <message> - Hidden tag announcement
┃ ◉ .group-admin add @user - Add member
┃ ◉ .group-admin kick @user - Remove member
┃ ◉ .group info - Group information
┃ ◉ .group stats - Pokemon statistics
┃ ◉ .group members - List members
┃ ◉ .group admins - Show admins
┃ ◉ .group settings - View settings
┃ ◉ .poll <question> - Create polls
┃ ◉ .del - Delete messages
┃ ◉ .team - Create teams
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'fun':
                    commandList = `
╭━━━━《 *𝗙𝗨𝗡 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .8ball <question> - Magic 8-ball
┃ ◉ .dice <sides> - Roll dice
┃ ◉ .joke - Random jokes
┃ ◉ .meme <template> - Generate memes
┃ ◉ .cat - Cute cat pictures
┃ ◉ .dog - Adorable dog photos
┃ ◉ .compliment - Get compliments
┃ ◉ .chess - Play chess
┃ ◉ .hangman - Word guessing game
┃ ◉ .trivia - Knowledge trivia
┃ ◉ .rps - Rock paper scissors
┃ ◉ .riddle - Brain teasers
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'ai':
                    commandList = `
╭━━━━《 *𝗔𝗜 & 𝗥𝗘𝗦𝗘𝗔𝗥𝗖𝗛* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .ai <question> - Chat with AI
┃ ◉ .translate <text> - Auto-translate
┃ ◉ .translate-lang <lang> <text> - Specific translation
┃ ◉ .img <prompt> - AI image generation
┃ ◉ .lyrics <song> - Get song lyrics
┃ ◉ .wikipedia <query> - Wikipedia search
┃ ◉ .definition <word> - Word definitions
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'tools':
                    commandList = `
╭━━━━《 *𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .calc <expression> - Calculator
┃ ◉ .qr <text> - Generate QR codes
┃ ◉ .qrread - Read QR codes
┃ ◉ .base64 encode/decode <text> - Base64 ops
┃ ◉ .binary encode/decode <text> - Binary convert
┃ ◉ .morse encode/decode <text> - Morse code
┃ ◉ .hash <type> <text> - Hash generator
┃ ◉ .password <length> - Secure passwords
┃ ◉ .ascii <text> - ASCII art
┃ ◉ .color <hex> - Color information
┃ ◉ .currency <amount> <from> <to> - Currency
┃ ◉ .sticker - Convert image/video to sticker
┃ ◉ .s2img - Convert sticker to image
┃ ◉ .s2vid - Convert animated sticker to video
┃ ◉ .allhelp - Show all commands A-Z
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'download':
                    commandList = `
╭━━━━《 *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .yt video <url/query> - YouTube video downloader
┃ ◉ .yt audio <url/query> - YouTube audio downloader
┃ ◉ .music <song name> - Music downloader
┃ ◉ .spotify <track url> - Spotify downloader
┃ ◉ .instagram <post url> - Instagram downloader
┃ ◉ .tiktok <video url> - TikTok downloader
┃ ◉ .twitter <tweet url> - Twitter media
┃ ◉ .lyrics <artist - song> - Real song lyrics
┃ ◉ .img <query> - Image search
┃ ◉ .wallpaper <query> - HD wallpapers
┃ ◉ .imgd <search> - Image downloader/search
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'pokemon':
                    commandList = `
╭━━━━《 *𝗣𝗢𝗞𝗘𝗠𝗢𝗡 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .spawnpokemon - Spawn wild Pokemon
┃ ◉ .catch - Catch spawned Pokemon
┃ ◉ .pokedex <pokemon> - Pokemon info
┃ ◉ .pc - View Pokemon storage
┃ ◉ .train <number> - Train Pokemon
┃ ◉ .pvp challenge @user - Battle trainers
┃ ◉ .pvp accept/decline - Handle challenges
┃ ◉ .pvp move1-4 - Use battle moves
┃ ◉ .pvp switch <1-4> - Switch Pokemon
┃ ◉ .pvp forfeit - Surrender battle
┃ ◉ .transfer2party <number> - Add to party
┃ ◉ .transfer2pc <number> - Store in PC
┃ ◉ .pvpheal - Heal party Pokemon
┃ ◉ .pokemongift @user <number> - Gift Pokemon
┃ ◉ .pvpstats - Battle statistics
┃ ◉ .pvpleaderboard - Top trainers
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'avatar':
                    commandList = `
╭━━━━《 *𝗔𝗩𝗔𝗧𝗔𝗥 𝗚𝗔𝗠𝗘* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .avatar start <element> - Begin journey
┃ ◉ .avatar profile - View character stats
┃ ◉ .avatar train - Gain experience
┃ ◉ .avatar skills - View abilities
┃ ◉ .avatar challenge @user - Duel benders
┃ ◉ .avatar accept - Accept challenge
┃ ◉ .avatar decline - Decline challenge
┃ ◉ .avatar attack <skill> - Use skill
┃ ◉ .avatar leaderboard - Top masters
┗━━━━━━━━━━━━━━
*Elements:* 💨 Air | 🌊 Water | 🗿 Earth | 🔥 Fire
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'dev':
                    commandList = `
╭━━━━《 *𝗗𝗘𝗩 𝗧𝗢𝗢𝗟𝗦* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ .github <username> - GitHub stats
┃ ◉ .nmap <host> - Network scanning
┃ ◉ .dns <domain> - DNS lookup
┃ ◉ .whois <domain> - Domain info
┃ ◉ .port <host> <port> - Port checker
┃ ◉ .headers <url> - HTTP headers
┃ ◉ .ip <domain> - IP information
┃ ◉ .trace <host> - Traceroute
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                default:
                    commandList = `
╭━━━━《 *𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ❌ Invalid category: ${category}
┃ 
┃ Valid categories:
┃ • owner, general, group, fun
┃ • ai, tools, download, pokemon
┃ • avatar, dev
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
            }

            await sock.sendMessage(from, { 
                text: commandList,
                contextInfo: {
                    externalAdReply: {
                        title: `${category.toUpperCase()} Commands`,
                        body: 'yourhïghness Bot v1.0.7',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=534',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        } else {
            // Get system info
            const totalCommands = 140; // You can make this dynamic if needed
            const ramUsage = process.memoryUsage();
            const ramUsed = (ramUsage.heapUsed / 1024 / 1024 / 1024).toFixed(2);
            const ramTotal = (ramUsage.heapTotal / 1024 / 1024 / 1024 * 2.5).toFixed(2); // Approximate
            const startTime = Date.now();
            const ping = Date.now() - startTime;

            const mainMenu = `
╭━━━━《 *𝗬𝗢𝗨𝗥𝗛𝗜̈𝗚𝗛𝗡𝗘𝗦𝗦-𝗕𝗢𝗧* 》━━┈⊷
┃❍╭──────────────
┃❍┃•  *ᴜꜱᴇʀ* : @${sender.split('@')[0]}
┃❍┃•  *ᴍᴏᴅᴇ* : Public
┃❍┃•  *ᴘʀᴇғɪx* : [.]
┃❍┃•  *ᴄᴏᴍᴍᴀɴᴅꜱ* : ${totalCommands}
┃❍┃•  *ᴠᴇʀꜱɪᴏɴ:* 1.0.7
┃❍┃•  *ʀᴀᴍ* : ${ramUsed} GB/${ramTotal} GB
┃❍┃•  *sᴘᴇᴇᴅ* : ${ping}MS
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

   *OWNER MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help owner
┗━━━━━━━━━━━━━━

   *GENERAL MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help general
┗━━━━━━━━━━━━━━

   *GROUP MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help group
┗━━━━━━━━━━━━━━

   *FUN MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help fun
┗━━━━━━━━━━━━━━

   *AI & RESEARCH MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help ai
┗━━━━━━━━━━━━━━

   *TOOLS MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help tools
┗━━━━━━━━━━━━━━

   *DOWNLOAD MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help download
┗━━━━━━━━━━━━━━

   *POKEMON MENU*
┏━━━━━━━━━━━━━━
┃ ◉ .help pokemon
┗━━━━━━━━━━━━━━

   *AVATAR GAME*
┏━━━━━━━━━━━━━━
┃ ◉ .help avatar
┗━━━━━━━━━━━━━━

   *DEV TOOLS*
┏━━━━━━━━━━━━━━
┃ ◉ .help dev
┗━━━━━━━━━━━━━━

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

            await sock.sendMessage(from, {
                text: mainMenu,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: 'yourhïghness Bot v1.0.7',
                        body: 'Next-Generation WhatsApp Bot - 140+ Commands',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=534',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        }
    }
};

export { command };