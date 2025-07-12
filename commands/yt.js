import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';

const tmpDir = join(process.cwd(), 'tmp');

export const command = {
  name: 'yt',
  aliases: ['youtube', 'ytdl'],
  description: 'Download YouTube audio or video',
  usage: 'yt <audio|video> <query or link>',
  category: 'media',
  cooldown: 3,

  async execute(sock, msg, args, context) {
    const { from, settings } = context;

    const getThumb = () =>
      settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)];

    const sendError = async (text) => {
      await sock.sendMessage(from, {
        text,
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title: 'YouTube Downloader',
            body: 'Audio/Video Tool',
            thumbnailUrl: getThumb(),
            sourceUrl: 'https://github.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      });
    };

    if (!args.trim()) {
      return sendError('❌ Please provide what to search!\n\nExample:\n`yt audio never give up`');
    }

    const parts = args.trim().split(' ');
    const type = parts.shift().toLowerCase();
    const query = parts.join(' ');

    if (!['audio', 'video'].includes(type) || !query) {
      return sendError('❌ Invalid format.\n\nUsage:\n`yt <audio|video> <query or link>`');
    }

    try {
      let videoUrl = '';

      if (ytdl.validateURL(query)) {
        videoUrl = query;
      } else {
        const result = await yts(query);
        const first = result?.videos?.[0];
        if (!first) {
          return sendError('❌ No video results found for your search.');
        }
        videoUrl = first.url;
      }

      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title;
      const thumbnail = info.videoDetails.thumbnails.pop().url;
      const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 60);
      const fileExt = type === 'video' ? 'mp4' : 'mp3';
      const filePath = join(tmpDir, `${safeTitle}.${fileExt}`);

      await fsPromises.mkdir(tmpDir, { recursive: true });

      const stream = ytdl(videoUrl, {
        filter: type === 'video' ? 'audioandvideo' : 'audioonly',
        quality: type === 'video' ? 'highestvideo' : 'highestaudio',
      });

      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        stream.on('error', reject);
        writeStream.on('error', reject);
      });

      // Preview message like .ping
      await sock.sendMessage(from, {
        text: `🎬 *${title}*\n\n📥 Type: ${type.toUpperCase()}\n🔗 Source: ${videoUrl}`,
        quoted: msg,
        contextInfo: {
          externalAdReply: {
            title,
            body: type === 'video' ? 'YouTube Video Downloader' : 'YouTube Audio Downloader',
            thumbnailUrl: thumbnail || getThumb(),
            sourceUrl: videoUrl,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      });

      // Send actual media file
      const fileBuffer = await fsPromises.readFile(filePath);
      const payload =
        type === 'video'
          ? {
              video: fileBuffer,
              caption: title,
              mimetype: 'video/mp4',
            }
          : {
              audio: fileBuffer,
              mimetype: 'audio/mpeg',
              ptt: false,
            };

      await sock.sendMessage(from, payload, { quoted: msg });
      await fsPromises.unlink(filePath);
    } catch (err) {
      return sendError(`❌ Failed: ${err.message}`);
    }
  },
};
