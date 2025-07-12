import axios from 'axios';

export const command = {
  name: 'tt2',
  aliases: ['tiktok2', 'ttaudio', 'ttsearch'],
  description: 'Download TikTok video, audio, slideshow, or search TikTok content',
  usage: 'tt2 <url> | ttaudio <url> | ttsearch <keyword>',
  category: 'media',
  cooldown: 3,
  async execute(sock, msg, args, context) {
    const { from, commandName } = context;
    const input = args.trim(); // Changed from args.join(' ').trim()

    if (!input) {
      return await sock.sendMessage(from, {
        text: '❌ Usage:\n.tt2 <link> - download video or slideshow\n.ttaudio <link> - download audio only\n.ttsearch <keyword>',
        quoted: msg,
      });
    }

    if (['tt2', 'tiktok2'].includes(commandName)) {
      return await handleDownload(sock, msg, from, input);
    }
    if (commandName === 'ttaudio') {
      return await handleAudio(sock, msg, from, input);
    }
    if (commandName === 'ttsearch') {
      return await handleSearch(sock, msg, from, input);
    }
  },
};

async function handleDownload(sock, msg, from, link) {
  try {
    const res = await fetchTikTokData(link);
    const data = res?.data?.data;
    if (!data) throw new Error('No media found');

    const images = data.images || [];
    const video = data.play;
    const music = data.music;

    const mimeType = await getMime(video);
    if (mimeType?.startsWith('video/')) {
      return await sock.sendMessage(from, {
        video: { url: video },
        caption: `🎥 TikTok video downloaded!\n\nYourHighness Bot 👑`,
        contextInfo: {
          externalAdReply: {
            title: 'TikTok Video Downloader',
            body: 'Video saved by YourHighness Bot',
            thumbnailUrl: 'https://picsum.photos/300/300?random=6',
            sourceUrl: 'https://github.com',
            mediaType: 1,
          },
        },
        quoted: msg,
      });
    }

    if (images.length > 0) {
      await sock.sendMessage(from, {
        text: `📸 Sending ${images.length} slideshow images with background music...`,
        quoted: msg,
      });

      await sock.sendMessage(from, {
        audio: { url: music },
        mimetype: 'audio/mpeg',
        ptt: false,
      });

      for (let i = 0; i < images.length; i++) {
        await sock.sendMessage(from, {
          image: { url: images[i] },
          caption: `📸 Slide ${i + 1}`,
        }, { quoted: msg });
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  } catch (err) {
    await sock.sendMessage(from, {
      text: `❌ Error fetching media: ${err.message}`,
      quoted: msg,
    });
  }
}

async function handleAudio(sock, msg, from, link) {
  try {
    const res = await fetchTikTokData(link);
    const music = res?.data?.data?.music;
    if (!music) throw new Error('No audio found');

    await sock.sendMessage(from, {
      audio: { url: music },
      mimetype: 'audio/mpeg',
      ptt: false,
    }, { quoted: msg });

    await sock.sendMessage(from, {
      text: `🎧 TikTok audio downloaded successfully!\nYourHighness Bot 👑`,
      quoted: msg,
    });
  } catch (err) {
    await sock.sendMessage(from, {
      text: `❌ Failed to download audio: ${err.message}`,
      quoted: msg,
    });
  }
}

async function handleSearch(sock, msg, from, keyword) {
  try {
    const results = await fakeTikTokSearch(keyword);
    if (!results.length) throw new Error('No results');

    let listText = `🔍 TikTok Search Results for "${keyword}":\n\n`;
    results.forEach((vid, i) => {
      listText += `${i + 1}. ${vid.title}\n🔗 ${vid.url}\n\n`;
    });

    await sock.sendMessage(from, {
      text: listText.trim(),
      quoted: msg,
    });
  } catch (err) {
    await sock.sendMessage(from, {
      text: `❌ Error searching: ${err.message}`,
      quoted: msg,
    });
  }
}

// --- Helpers ---
async function getMime(url) {
  try {
    const res = await axios.head(url);
    return res.headers['content-type'];
  } catch {
    return null;
  }
}

async function fetchTikTokData(url) {
  return await axios.get(`https://aemt.me/download/tiktokdl2?url=${encodeURIComponent(url)}`);
}

// Simulated search — Replace with real one later
async function fakeTikTokSearch(keyword) {
  return [
    { title: `Funny Cat Dance (${keyword})`, url: 'https://www.tiktok.com/@cat/video/123' },
    { title: `How to cook Egusi - ${keyword}`, url: 'https://www.tiktok.com/@chef/video/456' },
    { title: `Love Wahala in Lagos`, url: 'https://www.tiktok.com/@lagosgirl/video/789' },
  ];
}
