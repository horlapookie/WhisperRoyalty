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
┃❍┃•  *ᴛᴏᴛᴀʟ* : 140+ Commands
┃❍┃•  *ᴘʀᴇғɪx* : [.]
┃❍┃•  *ᴠᴇʀꜱɪᴏɴ* : 1.0.7
┃❍╰──────────────
╰━━━━━━━━━━━━━━━━━━┈⊷

   *A - B Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .8ball - Magic 8-ball predictions
┃ ◉ .advice - Daily life advice
┃ ◉ .afk - Set away from keyboard
┃ ◉ .ai - Chat with AI assistant
┃ ◉ .anime - Anime image search
┃ ◉ .ascii - Convert text to ASCII art
┃ ◉ .astronomy - Space facts & info
┃ ◉ .autoview - Toggle status viewing
┃ ◉ .autoreact - Toggle auto reactions
┃ ◉ .avatar - Avatar bending game
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
┃ ◉ .cat - Random cat images
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
┗━━━━━━━━━━━━━━

   *E - H Commands*
┏━━━━━━━━━━━━━━
┃ ◉ .emoji - Text to emoji converter
┃ ◉ .energy - Energy tips & facts
┃ ◉ .excuse - Random excuses
┃ ◉ .fact - Random interesting facts
┃ ◉ .fitness - Fitness tips & workouts
┃ ◉ .flashcard - Study flashcards
┃ ◉ .github - GitHub user stats
┃ ◉ .gradient - Color gradients
┃ ◉ .group - Group management
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
┃ ◉ .love - Love compatibility
┃ ◉ .luckynumber - Lucky numbers
┃ ◉ .lyrics - Song lyrics search
┃ ◉ .meditation - Meditation guides
┃ ◉ .meme - Meme generator
┃ ◉ .metasploit - Security tools
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
┃ ◉ .reddit - Reddit content
┃ ◉ .reminder - Set reminders
┃ ◉ .repo - Repository information
┃ ◉ .reverse - Reverse text
┃ ◉ .riddle - Brain teasers
┃ ◉ .rps - Rock paper scissors
┃ ◉ .s2img/.sticker2image - Convert sticker to image
┃ ◉ .s2vid/.sticker2video - Convert animated sticker to video
┃ ◉ .screenshot - Website screenshots
┃ ◉ .selfcare - Self-care tips
┃ ◉ .shorten - URL shortener
┃ ◉ .slots - Slot machine game
┃ ◉ .spotify - Spotify downloader
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
┃ ◉ .train - Train Pokemon
┃ ◉ .translate - Language translator
┃ ◉ .trivia - Knowledge trivia
┃ ◉ .truth - Truth or dare
┃ ◉ .twitter - Twitter downloader
┃ ◉ .uptime - Bot uptime stats
┃ ◉ .url - URL analyzer
┃ ◉ .uuid - UUID generator
┃ ◉ .vision - Image analysis
┃ ◉ .vv - Voice note converter
┃ ◉ .wallpaper - HD wallpapers
┃ ◉ .weather - Weather forecast
┃ ◉ .whois - Domain information
┃ ◉ .wikipedia - Wikipedia search
┃ ◉ .workout - Workout routines
┃ ◉ .yt - YouTube downloader
┃ ◉ .zen - Mindfulness tips
┃ ◉ .zodiac - Zodiac signs
┗━━━━━━━━━━━━━━

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴏᴜʀʜɪ̈ɢʜɴᴇꜱꜱ-ʙᴏᴛ©*`;

        await sock.sendMessage(from, {
            text: allCommands,
            contextInfo: {
                externalAdReply: {
                    title: 'Complete Command List A-Z',
                    body: 'yourhïghness Bot v1.0.7 - All Commands',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=999',
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
    }
};