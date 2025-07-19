import { settings } from '../settings.js';

const command = {
    name: 'help',
    aliases: ['h', 'menu', 'commands'],
    description: 'Display help information and command list',
    usage: 'help [category]',
    category: 'info',
    cooldown: 3,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        const prefix = settings.prefix || '.'; // Use prefix from settings or default to '.'

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
┃ ◉ ${prefix}public - Set bot to public mode
┃ ◉ ${prefix}private - Set bot to private mode
┃ ◉ ${prefix}on - Turn bot on
┃ ◉ ${prefix}off - Turn bot off
┃ ◉ ${prefix}autoview on/off - Toggle status auto-viewing
┃ ◉ ${prefix}autoreact on/off - Toggle auto-reactions
┃ ◉ ${prefix}chatbot on/off/girl/lady/boy/man - Toggle DM AI responses with personality
┃ ◉ ${prefix}autoread on/off - Toggle auto read messages
┃ ◉ ${prefix}autodel on/off - Toggle deleted message alerts (DM only)
┃ ◉ ${prefix}autotyping on/off - Toggle auto typing indicator
┃ ◉ ${prefix}autorecording on/off - Toggle auto recording indicator
┃ ◉ ${prefix}autoreadmessage on/off - Toggle auto read messages
┃ ◉ ${prefix}autoreactstatus on/off - Toggle auto status reactions
┃ ◉ ${prefix}autostatusemoji <emoji> - Set status reaction emoji
┃ ◉ ${prefix}ban - Ban user from bot (Owner)
┃ ◉ ${prefix}unban - Unban user from bot (Owner)
┃ ◉ ${prefix}block <number> - Block WhatsApp contact (Owner)
┃ ◉ ${prefix}unblock <number> - Unblock WhatsApp contact (Owner)
┃ ◉ ${prefix}chatmemory - Manage AI memory (clear/stats) (Owner)
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'general':
                    commandList = `
╭━━━━《 *𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}ping - Check bot response time
┃ ◉ ${prefix}menu - Show all commands
┃ ◉ ${prefix}repo - View repository info
┃ ◉ ${prefix}weather <city> - Weather forecast
┃ ◉ ${prefix}time <timezone> - World clock
┃ ◉ ${prefix}fact - Random facts
┃ ◉ ${prefix}quote - Inspirational quotes
┃ ◉ ${prefix}news <topic> - Latest news
┃ ◉ ${prefix}horoscope <sign> - Daily horoscope
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'group':
                    commandList = `
╭━━━━《 *𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}tagall <message> - Tag all members
┃ ◉ ${prefix}hidetag <message> - Hidden tag announcement
┃ ◉ ${prefix}group-admin add @user - Add member
┃ ◉ ${prefix}group-admin kick @user - Remove member
┃ ◉ ${prefix}group info - Group information
┃ ◉ ${prefix}group stats - Pokemon statistics
┃ ◉ ${prefix}group members - List members
┃ ◉ ${prefix}group admins - Show admins
┃ ◉ ${prefix}group settings - View settings
┃ ◉ ${prefix}setgroupicon - Set group picture (reply to image)
┃ ◉ ${prefix}setgroupdesc <text> - Set group description
┃ ◉ ${prefix}poll <question> - Create polls
┃ ◉ ${prefix}del - Delete messages
┃ ◉ ${prefix}team - Create teams
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'fun':
                    commandList = `
╭━━━━《 *𝗙𝗨𝗡 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}8ball <question> - Magic 8-ball
┃ ◉ ${prefix}dice <sides> - Roll dice
┃ ◉ ${prefix}joke - Random jokes
┃ ◉ ${prefix}meme <template> - Generate memes
┃ ◉ ${prefix}textmeme <top> | <bottom> - Text meme generator
┃ ◉ ${prefix}cat - Cute cat pictures
┃ ◉ ${prefix}dog - Adorable dog photos
┃ ◉ ${prefix}compliment - Get compliments
┃ ◉ ${prefix}chess - Play chess
┃ ◉ ${prefix}hangman - Word guessing game
┃ ◉ ${prefix}trivia - Knowledge trivia
┃ ◉ ${prefix}rps - Rock paper scissors
┃ ◉ ${prefix}riddle - Brain teasers
┃ ◉ ${prefix}gamble - Gamble your money
┃ ◉ ${prefix}rob - Rob a user
┃ ◉ ${prefix}reactions - Show all 50+ GIF reactions
┃ ◉ ${prefix}slap @user - Slap someone with GIF
┃ ◉ ${prefix}hug @user - Hug someone with GIF
┃ ◉ ${prefix}kiss @user - Kiss someone with GIF
┃ ◉ ${prefix}punch @user - Punch someone with GIF
┃ ◉ ${prefix}dance @user - Dance with someone
┃ ◉ ${prefix}smile @user - Smile at someone
┃ ◉ ${prefix}highfive @user - High five someone
┃ ◉ ${prefix}clap @user - Clap for someone
┃ ◉ ${prefix}excited @user - Be excited about someone
┃ ◉ *+ 40 more reaction commands!*
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'ai':
                    commandList = `
╭━━━━《 *𝗔𝗜 & 𝗥𝗘𝗦𝗘𝗔𝗥𝗖𝗛* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}ai <question> - Chat with AI
┃ ◉ ${prefix}translate <text> - Auto-translate
┃ ◉ ${prefix}translate-lang <lang> <text> - Specific translation
┃ ◉ ${prefix}img <prompt> - AI image generation
┃ ◉ ${prefix}img-g <prompt> - OpenAI DALL-E image generation
┃ ◉ ${prefix}lyrics <song> - Get song lyrics
┃ ◉ ${prefix}lyricssearch <song> - Get song lyrics
┃ ◉ ${prefix}wikipedia <query> - Wikipedia search
┃ ◉ ${prefix}definition <word> - Word definitions
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'tools':
                    commandList = `
╭━━━━《 *𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}calc <expression> - Calculator
┃ ◉ ${prefix}qr <text> - Generate QR codes
┃ ◉ ${prefix}qrread - Read QR codes
┃ ◉ ${prefix}base64 encode/decode <text> - Base64 ops
┃ ◉ ${prefix}binary encode/decode <text> - Binary convert
┃ ◉ ${prefix}morse encode/decode <text> - Morse code
┃ ◉ ${prefix}hash <type> <text> - Hash generator
┃ ◉ ${prefix}password <length> - Secure passwords
┃ ◉ ${prefix}ascii <text> - ASCII art
┃ ◉ ${prefix}color <hex> - Color information
┃ ◉ ${prefix}currency <amount> <from> <to> - Currency
┃ ◉ ${prefix}sticker - Convert image/video to sticker
┃ ◉ ${prefix}s2img - Convert sticker to image
┃ ◉ ${prefix}s2vid - Convert animated sticker to video
┃ ◉ ${prefix}tts <text> - Text to speech
┃ ◉ ${prefix}truecaller <number> - Number lookup
┃ ◉ ${prefix}mp3 - Convert video to MP3
┃ ◉ ${prefix}textmeme - Create text memes
┃ ◉ ${prefix}allhelp - Show all commands A-Z
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'download':
                    commandList = `
╭━━━━《 *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}yt video <url/query> - YouTube video downloader
┃ ◉ ${prefix}yt audio <url/query> - YouTube audio downloader
┃ ◉ ${prefix}linkdl <url> - Universal social media downloader
┃ ◉ ${prefix}spotify <track url> - Spotify downloader
┃ ◉ ${prefix}instagram <post url> - Instagram downloader
┃ ◉ ${prefix}tiktok <video url> - TikTok downloader
┃ ◉ ${prefix}twitter <tweet url> - Twitter media
┃ ◉ ${prefix}lyrics <artist - song> - Real song lyrics
┃ ◉ ${prefix}img <query> - Image search
┃ ◉ ${prefix}wallpaper <query> - HD wallpapers
┃ ◉ ${prefix}imgd <search> - Image downloader/search
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'pokemon':
                    commandList = `
╭━━━━《 *𝗣𝗢𝗞𝗘𝗠𝗢𝗡 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}spawnpokemon - Spawn random wild Pokemon
┃ ◉ ${prefix}spawnpokemon <name> - Spawn specific Pokemon (Owner only)
┃ ◉ ${prefix}catch [pokemon_name] - Catch spawned Pokemon
┃ ◉ ${prefix}pokemonlist - Show all available Pokemon
┃ ◉ ${prefix}pokemonlist <rarity> - Filter by rarity
┃ ◉ ${prefix}pokedex <pokemon> - Pokemon info
┃ ◉ ${prefix}pc - View Pokemon storage
┃ ◉ ${prefix}train <number> - Train Pokemon
┃ ◉ ${prefix}learn <number> - Teach new moves
┃ ◉ ${prefix}evolve <number> - Evolve Pokemon (level 50+)
┃ ◉ ${prefix}cancel-evolution <number> - Cancel evolution
┃ ◉ ${prefix}pvp challenge @user - Battle trainers
┃ ◉ ${prefix}pvp accept/decline - Handle challenges
┃ ◉ ${prefix}pvp move1-4 - Use battle moves
┃ ◉ ${prefix}pvp switch <1-4> - Switch Pokemon
┃ ◉ ${prefix}pvp forfeit - Surrender battle
┃ ◉ ${prefix}transfer2party <number> - Add to party
┃ ◉ ${prefix}transfer2pc <number> - Store in PC
┃ ◉ ${prefix}swap <pos1> <pos2> - Reorder party Pokemon
┃ ◉ ${prefix}pvpheal - Heal party Pokemon
┃ ◉ ${prefix}pokemongift @user <number> - Gift Pokemon
┃ ◉ ${prefix}givepoke @user <number> - Give Pokemon (reply/mention/number)
┃ ◉ ${prefix}trade @user <your#> <their#> - Trade Pokemon (reply/mention/number)
┃ ◉ ${prefix}trade-confirm - Accept trade
┃ ◉ ${prefix}trade-delete - Decline trade
┃ ◉ ${prefix}pvpstats - Battle statistics
┃ ◉ ${prefix}pvpleaderboard - Top trainers
┃ ◉ ${prefix}use pokeballs <number> - Use specific Pokeball
┃ ◉ ${prefix}pcatch - Use pokeball during battle
┗━━━━━━━━━━━━━━
*Total Pokemon:* 120+ from all generations!
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'avatar':
                    commandList = `
╭━━━━《 *𝗔𝗩𝗔𝗧𝗔𝗥 𝗚𝗔𝗠𝗘* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}avatar start <element> - Begin journey
┃ ◉ ${prefix}avatar profile - View character stats
┃ ◉ ${prefix}avatar train - Gain experience
┃ ◉ ${prefix}avatar skills - View abilities
┃ ◉ ${prefix}avatar challenge @user - Duel benders
┃ ◉ ${prefix}avatar accept - Accept challenge
┃ ◉ ${prefix}avatar decline - Decline challenge
┃ ◉ ${prefix}avatar attack <skill> - Use skill
┃ ◉ ${prefix}avatar leaderboard - Top masters
┗━━━━━━━━━━━━━━
*Elements:* 💨 Air | 🌊 Water | 🗿 Earth | 🔥 Fire
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'dev':
                    commandList = `
╭━━━━《 *𝗗𝗘𝗩 𝗧𝗢𝗢𝗟𝗦* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}github <username> - GitHub stats
┃ ◉ ${prefix}nmap <host> - Network scanning
┃ ◉ ${prefix}dns <domain> - DNS lookup
┃ ◉ ${prefix}whois <domain> - Domain info
┃ ◉ ${prefix}port <host> <port> - Port checker
┃ ◉ ${prefix}headers <url> - HTTP headers
┃ ◉ ${prefix}ip <domain> - IP information
┃ ◉ ${prefix}trace <host> - Traceroute
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'economy':
                    commandList = `
╭━━━━《 *𝗘𝗖𝗢𝗡𝗢𝗠𝗬 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}bank - Check bank balance
┃ ◉ ${prefix}buy - Buy items from store
┃ ◉ ${prefix}daily - Claim daily rewards
┃ ◉ ${prefix}deposit - Deposit money to bank
┃ ◉ ${prefix}gamble - Gamble your money
┃ ◉ ${prefix}givegold - Give gold to user
┃ ◉ ${prefix}rob - Rob a user
┃ ◉ ${prefix}store - View the store
┃ ◉ ${prefix}slot - Play slot machine
┃ ◉ ${prefix}wallet - Check wallet balance
┃ ◉ ${prefix}withdraw - Withdraw money from bank
┃ ◉ ${prefix}mart <pokemon> <page> - Visit Pokemon Mart to buy all Level 100 Pokemon
┃ ◉ ${prefix}mart-buy <number> - Buy items from the mart using item number
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'save':
                    commandList = `
╭━━━━《 *𝗦𝗔𝗩𝗘 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}save <text> - Save the status
┗━━━━━━━━━━━━━━
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*
`;
                    break;
                case 'nsfw':
                    commandList = `
╭━━━━《 *𝗡𝗦𝗙𝗪 𝗠𝗘𝗡𝗨* 》━━┈⊷
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}hentai - Random hentai images
┃ ◉ ${prefix}xxx <query> - Search adult videos
┃ ◉ ${prefix}pornhub <query> - Search PornHub videos
┃ ◉ ${prefix}xnxx <query> - Search XNXX videos
┃ ◉ ${prefix}redtube <query> - Search RedTube videos
┗━━━━━━━━━━━━━━
⚠️ **Warning:** 18+ content only
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
┃ • avatar, dev, economy
┃ • save, nsfw
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
                        body: `Join our channel for updates`,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=534',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        } else {
            // Get system info
            const totalCommands = 155; // added reactions and nsfw commands
            const ramUsage = process.memoryUsage();
            const ramUsed = (ramUsage.heapUsed / 1024 / 1024 / 1024).toFixed(2);
            const ramTotal = (ramUsage.heapTotal / 1024 / 1024 / 1024 * 2.5).toFixed(2); // Approximate
            const startTime = Date.now();
            const ping = Date.now() - startTime;

            const mainMenu = `
╭━━━━《 *𝗬𝗢𝗨𝗥𝗛𝗜̈𝗚𝗛𝗡𝗘ꜱꜱ-𝗕𝗢𝗧* 》━━┈⊷
┃❍╭──────────────
┃❍┃•  *ᴜꜱᴇʀ* : @${sender.split('@')[0]}
┃❍┃•  *ᴍᴏᴅᴇ* : Public
┃❍┃•  *ᴘʀᴇғɪx* : [${prefix}]
┃❍┃•  *ᴄᴏᴍᴍᴀɴᴅꜱ* : ${totalCommands}
┃❍┃•  *ᴠᴇʀꜱɪᴏɴ:* 1.0.7
┃❍┃•  *ʀᴀᴍ* : ${ramUsed} GB/${ramTotal} GB
┃❍┃•  *sᴘᴇᴇᴅ* : ${ping}MS
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

   *OWNER MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help owner
┗━━━━━━━━━━━━━━

   *GENERAL MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help general
┗━━━━━━━━━━━━━━

   *GROUP MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help group
┗━━━━━━━━━━━━━━

   *FUN MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help fun
┗━━━━━━━━━━━━━━

   *AI & RESEARCH MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help ai
┗━━━━━━━━━━━━━━

   *TOOLS MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help tools
┗━━━━━━━━━━━━━━

   *DOWNLOAD MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help download
┗━━━━━━━━━━━━━━

   *POKEMON MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help pokemon
┗━━━━━━━━━━━━━━

   *AVATAR GAME*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help avatar
┗━━━━━━━━━━━━━━

   *DEV TOOLS*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help dev
┗━━━━━━━━━━━━━━

   *ECONOMY MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help economy
┗━━━━━━━━━━━━━━
   *SAVE MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help save
┗━━━━━━━━━━━━━━

   *NSFW MENU*
┏━━━━━━━━━━━━━━
┃ ◉ ${prefix}help nsfw
┗━━━━━━━━━━━━━━

   *Special Prefixes (Owner Only)*
┏━━━━━━━━━━━━━━
┃ ◉ => - GitHub repository updates
┃   Example: => pull, => update
┃ ◉ $ - Terminal/Bash commands
┃   Example: $ ls, $ node --version
┗━━━━━━━━━━━━━━

🔗 *View our channel for updates and news!*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

            await sock.sendMessage(from, {
                text: mainMenu,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: 'yourhïghness Bot v1.0.7',
                        body: 'Next-Generation WhatsApp Bot - 140+ Commands',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=534',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        }
    }
};

export { command };