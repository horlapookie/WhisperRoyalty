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
        const prefix = settings.prefix || '?';
        const botName = settings.botName || 'yourhïghness★alpha';
        const version = settings.version || '1.0';

        // Get system info
        const totalCommands = global.totalCommands || 185;
        const ramUsage = process.memoryUsage();
        const ramUsed = (ramUsage.heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = (ramUsage.heapTotal / 1024 / 1024).toFixed(2);
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true });
        const currentDate = new Date().toLocaleDateString('en-US');

        const allCommands = `
╔╭━━〔 *${botName.toUpperCase()}* 〕━━╮
│ ✦ *Mᴏᴅᴇ* : public
│ ✦ *Pʀᴇғɪx* : [ ${prefix} ]
│ ✦ *Usᴇʀ* : @${sender.split('@')[0]}
│ ✦ *Pʟᴜɢɪɴs* : ${totalCommands}
│ ✦ *Vᴇʀsɪᴏɴ* : ${version}
│ ✦ *Uᴘᴛɪᴍᴇ* : ${days}d ${hours}h ${minutes}m ${seconds}s
│ ✦ *Tɪᴍᴇ Nᴏᴡ* : ${currentTime}
│ ✦ *Dᴀᴛᴇ Tᴏᴅᴀʏ* : ${currentDate}
│ ✦ *Tɪᴍᴇ Zᴏɴᴇ* : Africa/Lagos
│ ✦ *Sᴇʀᴠᴇʀ Rᴀᴍ* : ${ramUsed} GB/${ramTotal} GB
╰─────────────────╯

╭━━━✦❮ *𝙰𝙸* ❯✦━⊷ 
┃✪  ai - Gemini AI chat
┃✪  gpt-4 - GPT-4 chat
┃✪  aicontext - Context-aware AI
┃✪  ai-image - DALL-E images
┃✪  img - AI image generation
┃✪  img-g - Advanced images
┃✪  vision - Image analysis
┃✪  translate - Auto-translate
┃✪  translate-lang - Specific translation
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* ❯✦━⊷ 
┃✪  yt - YouTube downloader
┃✪  tiktok - TikTok downloader
┃✪  instagram - Instagram downloader
┃✪  twitter - Twitter downloader
┃✪  spotify - Spotify downloader
┃✪  music - Music downloader
┃✪  mp3 - Convert to MP3
┃✪  linkdl - Universal downloader
┃✪  imgd - Image search
┃✪  wallpaper - HD wallpapers
┃✪  anime - Anime images
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝙵𝚄𝙽* ❯✦━⊷ 
┃✪  8ball - Magic 8-ball
┃✪  dice - Roll dice
┃✪  rps - Rock paper scissors
┃✪  hangman - Word guessing
┃✪  trivia - Knowledge quiz
┃✪  riddle - Brain teasers
┃✪  slots - Slot machine
┃✪  2048 - Number puzzle
┃✪  gamble - Gamble money
┃✪  rob - Rob other users
┃✪  joke - Random jokes
┃✪  meme - Generate memes
┃✪  darkjoke - Dark humor
┃✪  compliment - Get compliments
┃✪  cat - Cute cat pictures
┃✪  dog - Adorable dog photos
┃✪  fact - Random facts
┃✪  quote - Inspirational quotes
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝚂𝙴𝙰𝚁𝙲𝙷* ❯✦━⊷ 
┃✪  wikipedia - Wiki search
┃✪  weather - Weather forecast
┃✪  lyrics - Song lyrics
┃✪  news - Latest news
┃✪  horoscope - Daily horoscope
┃✪  definition - Word definitions
┃✪  time - World clock
┃✪  movie - Movie information
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝙶𝙴𝙽𝙴𝚁𝙰𝙻* ❯✦━⊷ 
┃✪  ping - Bot response time
┃✪  uptime - Bot uptime stats
┃✪  owner - Developer contact
┃✪  repo - Repository info
┃✪  session - Pairing link
┃✪  help - Command help system
┃✪  allhelp - Complete command list
┃✪  reactions - Show all GIF reactions
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝙾𝚆𝙽𝙴𝚁* ❯✦━⊷ 
┃✪  on - Activate bot
┃✪  off - Deactivate bot
┃✪  public - Set public mode
┃✪  private - Set private mode
┃✪  restart - Restart bot
┃✪  autoview - Status auto-viewing
┃✪  autoreact - Auto-reactions
┃✪  autotyping - Typing indicator
┃✪  autorecording - Recording indicator
┃✪  autoread - Auto read messages
┃✪  autoreactstatus - Status reactions
┃✪  autostatusemoji - Set reaction emoji
┃✪  autodel - Deleted message alerts
┃✪  chatbot - AI personality
┃✪  chatmemory - Memory management
┃✪  ban - Ban user
┃✪  unban - Unban user
┃✪  block - Block contact
┃✪  unblock - Unblock contact
┃✪  save - Save status/media (Owner only)
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝙶𝚁𝙾𝚄𝙿* ❯✦━⊷ 
┃✪  tagall - Tag all members
┃✪  hidetag - Hidden announcement
┃✪  poll - Create polls
┃✪  del - Delete messages
┃✪  setgroupicon - Set group picture
┃✪  setgroupdesc - Set group description
┃✪  group - Group management
┃✪  groupanalytics - Group statistics
┃✪  welcome - Welcome messages
┃✪  leave - Goodbye messages
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝚃𝙾𝙾𝙻𝚂* ❯✦━⊷ 
┃✪  calc - Calculator
┃✪  currency - Currency converter
┃✪  temp - Temperature converter
┃✪  qr - Generate QR codes
┃✪  qrread - Read QR codes
┃✪  base64 - Base64 encode/decode
┃✪  binary - Binary encode/decode
┃✪  morse - Morse code converter
┃✪  hash - Hash generator
┃✪  ascii - ASCII art
┃✪  sticker - Image to sticker
┃✪  sticker2image - Sticker to image
┃✪  sticker2video - Animated sticker to video
┃✪  password - Generate passwords
┃✪  uuid - Generate UUID
┃✪  shorten - URL shortener
┃✪  screenshot - Website screenshots
┃✪  ocr - Extract text from images
╰━━━━━━━━━━━━━━━━━⊷

╭━━━✦❮ *𝚁𝙴𝙰𝙲𝚃𝙸𝙾𝙽𝚂* ❯✦━⊷ 
┃✪  slap - Slap reaction GIFs
┃✪  hug - Hug reaction GIFs  
┃✪  kiss - Kiss reaction GIFs
┃✪  punch - Punch reaction GIFs
┃✪  pat - Pat reaction GIFs
┃✪  wave - Wave reaction GIFs
┃✪  dance - Dance reaction GIFs
┃✪  cry - Cry reaction GIFs
┃✪  bite - Bite reaction GIFs
┃✪  poke - Poke reaction GIFs
┃✪  wink - Wink reaction GIFs
┃✪  smile - Smile reaction GIFs
┃✪  clap - Clap reaction GIFs
┃✪  laugh - Laugh reaction GIFs
┃✪  thumbsup - Thumbs up reaction GIFs
┃✪  angry - Angry reaction GIFs
┃✪  love - Love reaction GIFs
╰━━━━━━━━━━━━━━━━━⊷

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
            mentions: [sender],
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420639943950@newsletter',
                    newsletterName: `${botName} Updates`,
                    serverMessageId: Math.floor(Math.random() * 1000000)
                },
                externalAdReply: {
                    title: 'Complete Command List A-Z',
                    body: 'Join our channel for updates',
                    thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6AZrY2f3EMgD8kRQ01',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    }
};