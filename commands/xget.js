import { join } from 'path';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { tmpdir } from 'os';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

export const command = {
  name: 'xget',
  aliases: ['xvdownload', 'xvideo'],
  description: 'Download video from Xvideos link',
  usage: 'xget <link>',
  category: 'nsfw',
  cooldown: 3,

  async execute(sock, msg, args, context) {
    const { from, settings } = context;
    const link = args.trim();
    const thumb = settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)];

    if (!/^https:\/\/(www\.)?xvideos\.com\/video\.\w+/i.test(link)) {
      await sock.sendMessage(from, {
        text: '❌ Invalid format.\n\nUse: .xget <xvideos link>\nExample: .xget https://www.xvideos.com/video123456/title',
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'Xvideos Downloader',
            body: 'Provide a valid video link',
            thumbnailUrl: thumb,
            sourceUrl: 'https://xvideos.com',
            mediaType: 1
          }
        }
      });
      return;
    }

    try {
      await sock.sendMessage(from, {
        text: '⏳ Fetching video, please wait...',
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'Xvideos Downloader',
            body: 'Getting video source...',
            thumbnailUrl: thumb,
            sourceUrl: link,
            mediaType: 1
          }
        }
      });

      const res = await fetch(link);
      const html = await res.text();
      const $ = load(html);

      let videoUrl = $('video > source').attr('src') || $('#html5video_base source').attr('src');

      if (!videoUrl) {
        const scripts = $('script').toArray().map(el => $(el).html());
        for (const script of scripts) {
          const match = script?.match(/https?:\/\/[^"']+\.mp4/);
          if (match) {
            videoUrl = match[0];
            break;
          }
        }
      }

      if (!videoUrl) {
        await sock.sendMessage(from, {
          text: '❌ Failed to extract video URL. Try another link.',
          quoted: msg,
          contextInfo: {
            externalAdReply: {
              title: 'Xvideos Downloader',
              body: 'Video URL not found',
              thumbnailUrl: thumb,
              sourceUrl: link,
              mediaType: 1
            }
          }
        });
        return;
      }

      const title = $('h2.page-title').text().trim().replace(/[^\w\s]/gi, '') || 'xvideos_video';
      const filePath = join(tmpdir(), `${title}.mp4`);

      const vidRes = await fetch(videoUrl);
      if (!vidRes.ok) throw new Error('Download failed.');

      const fileStream = createWriteStream(filePath);
      await streamPipeline(vidRes.body, fileStream);

      await sock.sendMessage(from, {
        video: { url: filePath },
        mimetype: 'video/mp4',
        caption: `🎬 *${title}*\nFrom Xvideos`,
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: 'Video from Xvideos',
            thumbnailUrl: thumb,
            sourceUrl: link,
            mediaType: 1
          }
        }
      });
    } catch (err) {
      await sock.sendMessage(from, {
        text: `❌ Error: ${err.message}`,
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'Xvideos Downloader',
            body: 'Download failed',
            thumbnailUrl: thumb,
            sourceUrl: 'https://xvideos.com',
            mediaType: 1
          }
        }
      });
    }
  }
};
