import { settings } from '../settings.js';

export const command = {
    name: 'allhelp',
    aliases: ['allcommands', 'commandlist', 'fullhelp'],
    description: 'Display all commands from A to Z',
    usage: 'allhelp',
    category: 'info',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;

        const allCommands = `
╭━━━━《 *𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 (𝗔-𝗭)* 》━━┈⊷
┃❍╭──────────────
┃❍┃•  *ᴛᴏᴛᴀʟ* : 155+ Commands
┃❍┃•  *ᴘʀᴇғɪx* : [${settings.prefix}]
┃❍┃•  *ᴠᴇʀꜱɪᴏɴ* : 1.0.7
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

   *A - B Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .8ball - Magic 8-ball predictions
┃ ◉ .advice - Daily life advice
┃ ◉ .afk - Set away from keyboard
┃ ◉ .ai - Chat with AI assistant
┃ ◉ .aicontext - Context-aware AI chat
┃ ◉ .anime - Anime image search
┃ ◉ .ascii - Convert text to ASCII art
┃ ◉ .astronomy - Space facts & info
┃ ◉ .autogroup - Dynamic group creation
┃ ◉ .autoreadmessage - Toggle auto read messages (Owner)
┃ ◉ .autorecording - Toggle auto recording indicator (Owner)
┃ ◉ .autoreact - Toggle auto reactions (Owner)
┃ ◉ .autoreactstatus - Toggle auto status reactions (Owner)
┃ ◉ .autostatusemoji - Set status reaction emoji (Owner)
┃ ◉ .autotyping - Toggle auto typing indicator (Owner)
┃ ◉ .autoview - Toggle status viewing (Owner)
┃ ◉ .avatar - Avatar bending game
┃ ◉ .ban - Ban user from bot (Owner)
┃ ◉ .barcode - Generate barcodes
┃ ◉ .base64 - Base64 encode/decode
┃ ◉ .battery - Device battery info
┃ ◉ .bible - Bible verse search
┃ ◉ .binary - Binary encode/decode
┃ ◉ .birthday - Birthday reminders
┃ ◉ .book - Book recommendations
┗━━━━━━━━━━━━━━

   *C - D Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .calc - Calculator tool
┃ ◉ .calendar - Calendar view
┃ ◉ .cancel-evolution - Cancel Pokemon evolution
┃ ◉ .cat - Random cat images
┃ ◉ .chatmemory - Manage AI memory (clear/stats) (Owner)
┃ ◉ .catch - Catch Pokemon
┃ ◉ .imgd - Image downloader/search
┗━━━━━━━━━━━━━━

   *D - F Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .darkjoke - Dark humor jokes
┃ ◉ .definition - Word definitions
┃ ◉ .del - Delete messages
┃ ◉ .dice - Roll dice games
┃ ◉ .dns - DNS lookup tools
┃ ◉ .dog - Adorable dog photos
┃ ◉ .dream - Dream interpretation
┃ ◉ .evolve - Evolve Pokemon (level 50+)
┗━━━━━━━━━━━━━━

   *E - H Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .emoji - Text to emoji converter
┃ ◉ .energy - Energy tips & facts
┃ ◉ .evolve - Evolve Pokemon (level 50+)
┃ ◉ .excuse - Random excuses
┃ ◉ .fact - Random interesting facts
┃ ◉ .fitness - Fitness tips & workouts
┃ ◉ .flashcard - Study flashcards
┃ ◉ .github - GitHub user stats
┃ ◉ .givepoke @user <number> - Give Pokemon (reply/mention/number)
┃ ◉ .gradient - Color gradients
┃ ◉ .group - Group management
┃ ◉ .groupanalytics - Group statistics
┃ ◉ .groupconfig - Group configuration
┃ ◉ .habit - Habit tracking
┃ ◉ .hangman - Word guessing game
┃ ◉ .hash - Hash generator
┃ ◉ .headers - HTTP headers check
┃ ◉ .help - Command help system
┃ ◉ .hidetag - Hidden tag announcements
┃ ◉ .horoscope - Daily horoscope
┗━━━━━━━━━━━━━━

   *I - M Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .img - AI image generation
┃ ◉ .inspire - Inspirational quotes
┃ ◉ .instagram - Instagram downloader
┃ ◉ .ip - IP address information
┃ ◉ .joke - Random jokes & humor
┃ ◉ .journal - Personal journaling
┃ ◉ .learn - Teach Pokemon new moves
┃ ◉ .love - Love compatibility
┃ ◉ .luckynumber - Lucky numbers
┃ ◉ .lyrics - Song lyrics search
┃ ◉ .mart - Visit Pokemon Mart (items & Level 100 Pokemon)
┃ ◉ .mart-buy - Buy items by number
┃ ◉ .meditation - Meditation guides
┃ ◉ .meme - Meme generator
┃ ◉ .metasploit - Security tools
┃ ◉ .mp3 - Convert video to MP3
┃ ◉ .mgames - Multimedia games
┃ ◉ .morse - Morse code converter
┃ ◉ .movie - Movie information
┃ ◉ .music - Music downloader
┗━━━━━━━━━━━━━━

   *N - P Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .nameday - Name day calendar
┃ ◉ .news - Latest news updates
┃ ◉ .nmap - Network port scanning
┃ ◉ .number - Number facts & info
┃ ◉ .ocr - Extract text from images
┃ ◉ .off - Turn bot offline
┃ ◉ .on - Turn bot online
┃ ◉ .password - Generate passwords
┃ ◉ .pc - Pokemon storage PC
┃ ◉ .personality - Personality test
┃ ◉ .ping - Bot response time
┃ ◉ .pokedex - Pokemon information
┃ ◉ .pokemon - Spawn Pokemon
┃ ◉ .poll - Create group polls
┃ ◉ .port - Port checker tool
┃ ◉ .private - Set bot to private
┃ ◉ .public - Set bot to public
┃ ◉ .pvp - Pokemon battles
┗━━━━━━━━━━━━━━

   *Q - S Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .qr - QR code generator
┃ ◉ .qrread - QR code reader
┃ ◉ .quote - Inspirational quotes
┃ ◉ .quran - Quran verse search
┃ ◉ .recipe - Recipe finder
┃ ◉ .reactions - Show all 50+ available GIF reactions
┃ ◉ .reddit - Reddit content
┃ ◉ .reminder - Set reminders
┃ ◉ .repo - Repository information
┃ ◉ .restart - Restart the bot (Owner only)
┃ ◉ .reverse - Reverse text
┃ ◉ .riddle - Brain teasers
┃ ◉ .rps - Rock paper scissors
┃ ◉ .s2img/.sticker2image - Convert sticker to image
┃ ◉ .s2vid/.sticker2video - Convert animated sticker to video
┃ ◉ .save - Save status/media to DM (Owner only)
┃ ◉ .screenshot - Website screenshots
┃ ◉ .selfcare - Self-care tips
┃ ◉ .shazam - Identify songs (reply to audio/video)
┃ ◉ .shorten - URL shortener
┃ ◉ .slots - Slot machine game
┃ ◉ .spotify - Spotify downloader
┃ ◉ .statusupdate - Set WhatsApp status
┃ ◉ .steam - Steam game info
┃ ◉ .sticker - Convert image/video to sticker
┃ ◉ .study - Study techniques
┗━━━━━━━━━━━━━━

   *T - Z Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .tagall - Tag all members
┃ ◉ .team - Create teams
┃ ◉ .temp - Temperature converter
┃ ◉ .tiktok - TikTok downloader
┃ ◉ .time - World time zones
┃ ◉ .trace - Network traceroute
┃ ◉ .trade @user <your#> <their#> - Trade Pokemon (reply/mention/number)
┃ ◉ .trade-confirm - Accept Pokemon trades
┃ ◉ .trade-delete - Decline Pokemon trades
┃ ◉ .train - Train Pokemon
┃ ◉ .translate - Language translator
┃ ◉ .trivia - Knowledge trivia
┃ ◉ .truth - Truth or dare
┃ ◉ .twitter - Twitter downloader
┃ ◉ .swap - Swap Pokemon positions in party
┃ ◉ .unban - Unban user from bot (Owner)
┃ ◉ .uptime - Bot uptime stats
┃ ◉ .url - URL analyzer
┃ ◉ .uuid - UUID generator
┃ ◉ .vision - Image analysis
┃ ◉ .vv - Voice note converter
┃ ◉ .vv2 - Bypass view once messages (Owner only)
┃ ◉ .wallpaper - HD wallpapers
┃ ◉ .weather - Weather forecast
┃ ◉ .whois - Domain information
┃ ◉ .wikipedia - Wikipedia search
┃ ◉ .withdraw - Withdraw gold from bank
┃ ◉ .workout - Workout routines
┃ ◉ .yt - YouTube downloader
┃ ◉ .zen - Mindfulness tips
┃ ◉ .zodiac - Zodiac signs
┃ ◉ .rob - Attempt to rob other users
┃ ◉ .pokemongift @user <number> - Gift Pokemon (reply/mention/number)
┃ ◉ .pokeballs - Check numbered pokeball inventory
┃ ◉ .use pokeball <number> - Use specific pokeball
┃ ◉ .gamble - Gamble gold with dice
┃ ◉ .givepoke @user <number> - Give Pokemon (reply/mention/number)
┃ ◉ .slap - Slap reaction GIFs
┃ ◉ .hug - Hug reaction GIFs  
┃ ◉ .kiss - Kiss reaction GIFs
┃ ◉ .punch - Punch reaction GIFs
┃ ◉ .pat - Pat reaction GIFs
┃ ◉ .wave - Wave reaction GIFs
┃ ◉ .dance - Dance reaction GIFs
┃ ◉ .cry - Cry reaction GIFs
┃ ◉ .bite - Bite reaction GIFs
┃ ◉ .poke - Poke reaction GIFs
┃ ◉ .wink - Wink reaction GIFs
┃ ◉ .smile - Smile reaction GIFs
┃ ◉ .clap - Clap reaction GIFs
┃ ◉ .laugh - Laugh reaction GIFs
┃ ◉ .thumbsup - Thumbs up reaction GIFs
┃ ◉ .angry - Angry reaction GIFs
┃ ◉ .love - Love reaction GIFs
┗━━━━━━━━━━━━━━

   *Special Prefixes (Owner Only)*
┏━━━━━━━━━━━━━━
┃ ◉ => - GitHub repository updates
┃   Examples: => pull, => update, => sync
┃ ◉ $ - Terminal/Bash commands  
┃   Examples: $ ls -la, $ pwd, $ node --version
┗━━━━━━━━━━━━━━

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

        await sock.sendMessage(from, {
            text: allCommands,
            contextInfo: {
                externalAdReply: {
                    title: 'Complete Command List A-Z',
                    body: 'Join our channel for updates',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=999',
                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }
};