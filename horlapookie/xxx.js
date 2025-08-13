import fetch from 'node-fetch';
import { load } from 'cheerio';

export const command = {
  name: 'xvideos-search',
  aliases: ['xvsearch', 'xvideo', 'xxx'],
  description: 'Search for videos on Xvideos',
  usage: 'xvideos-search <query>',
  category: 'nsfw',
  cooldown: 3,

  async execute(sock, msg, args, context) {
    const { from, settings } = context;
    const query = args.trim();
    const thumb = settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)];

    if (!query) {
      await sock.sendMessage(from, {
        text: '❌ Invalid format. Use: .xvideos-search <query>',
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'Xvideos Search',
            body: 'NSFW Video Finder',
            thumbnailUrl: thumb,
            sourceUrl: 'https://xvideos.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      });
      return;
    }

    const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(searchUrl);
      const html = await res.text();
      const $ = load(html);
      const results = [];

      $('.thumb-block').slice(0, 10).each((i, el) => {
        const aTag = $(el).find('p > a');
        const href = aTag.attr('href')?.trim();
        const title = aTag.text().trim();
        const duration = $(el).find('.duration').text().trim();
        const thumb = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';

        if (!href || !title || !thumb) return;

        const fullUrl = `https://www.xvideos.com${href}`;
        const idMatch = href.match(/(?:video(\d+)|video\.([a-z0-9]+))\//i);
        const videoId = idMatch ? (idMatch[1] || idMatch[2]) : 'Unknown';

        results.push(
          `#${i + 1}\n🔖 *${title}*\n🆔 ID: ${videoId}\n🕒 Duration: ${duration}\n🔗 Link: ${fullUrl}`
        );
      });

      if (results.length === 0) {
        await sock.sendMessage(from, {
          text: '❌ No results found.',
          quoted: msg,
          contextInfo: {
            externalAdReply: {
              title: 'Xvideos Search',
              body: 'Nothing found',
              thumbnailUrl: thumb,
              sourceUrl: 'https://xvideos.com',
              mediaType: 1
            }
          }
        });
        return;
      }

      const finalText = `🔍 *Xvideos Search Results for:* "${query}"\n\n${results.join('\n\n')}`;

      await sock.sendMessage(from, {
        text: finalText,
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'Xvideos Search',
            body: 'Top 10 NSFW videos',
            thumbnailUrl: thumb,
            sourceUrl: 'https://xvideos.com',
            mediaType: 1
          }
        }
      });
    } catch (err) {
      await sock.sendMessage(from, {
        text: `❌ Failed to search: ${err.message}`,
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'Xvideos Search',
            body: 'Error occurred',
            thumbnailUrl: thumb,
            sourceUrl: 'https://xvideos.com',
            mediaType: 1
          }
        }
      });
    }
  }
};
