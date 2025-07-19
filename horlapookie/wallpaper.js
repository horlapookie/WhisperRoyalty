import axios from 'axios';
import { load } from 'cheerio';

export const command = {
  name: 'wallpaper',
  aliases: ['wp', 'walls'],
  description: 'Search wallpapers from besthdwallpaper.com',
  usage: 'wallpaper <query> [page]',
  category: 'media',
  cooldown: 3,

  async execute(sock, msg, args, context) {
    const { from } = context;
    if (!args.trim()) {
      await sock.sendMessage(from, {
        text: '❌ Please provide a wallpaper topic\n\nExample: .wallpaper nature 2',
        quoted: msg,
      });
      return;
    }

    let input = args.trim().split(' ');
    let page = '1';
    if (!isNaN(input[input.length - 1])) page = input.pop();
    const query = input.join(' ');

    try {
      const url = `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${encodeURIComponent(query)}`;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      const $ = load(res.data);
      const images = [];

      $('img').each((_, el) => {
        const title = $(el).attr('alt')?.trim() || 'Wallpaper';
        let img = $(el).attr('src') || '';
        if (img && !img.startsWith('http')) {
          img = `https://www.besthdwallpaper.com${img}`;
        }
        if (img) images.push({ title, img });
      });

      if (!images.length) {
        await sock.sendMessage(from, {
          text: `😢 No wallpapers found for "${query}" on page ${page}`,
          quoted: msg,
        });
        return;
      }

      const picked = images.slice(0, 5); // Send first 5

      for (let wall of picked) {
        await sock.sendMessage(from, {
          image: { url: wall.img },
          caption: `🖼️ ${wall.title}\n\nSearch: ${query} (Page ${page})`,
          contextInfo: {
            externalAdReply: {
              title: wall.title,
              body: 'Search Wallpapers - YourHighness Bot 👑',
              thumbnailUrl: 'https://picsum.photos/300/300?random=15',
              sourceUrl: 'https://www.besthdwallpaper.com/',
              mediaType: 1,
            },
          },
          quoted: msg,
        });
      }
    } catch (err) {
      await sock.sendMessage(from, {
        text: `❌ Failed to fetch wallpapers: ${err.message}`,
        quoted: msg,
      });
    }
  },
};
