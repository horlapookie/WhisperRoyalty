import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { settings } from "../settings.js";

export const command = {
  name: "vv2",
  description: "Bypass view-once and send media to the bot owner's private chat",
  usage: "vv2 (reply to view-once media)",
  category: "media",
  cooldown: 3,

  async execute(sock, msg, args, context) {
    const { from } = context;
    const owner = settings.ownerNumber;
    const quoted = msg.message?.extendedTextMessage?.contextInfo;

    if (!quoted?.quotedMessage) {
      return await sock.sendMessage(from, {
        text: "❌ Please reply to a view-once image or video.",
        quoted: msg,
      });
    }

    const quotedMsg = {
      key: {
        remoteJid: from,
        id: quoted.stanzaId,
        fromMe: false,
        participant: quoted.participant,
      },
      message:
        quoted.quotedMessage?.viewOnceMessage?.message ||
        quoted.quotedMessage?.viewOnceMessageV2?.message ||
        quoted.quotedMessage?.viewOnceMessageV2Extension?.message ||
        quoted.quotedMessage,
    };

    const mediaType = Object.keys(quotedMsg.message || {}).find((k) =>
      ["imageMessage", "videoMessage"].includes(k)
    );

    if (!mediaType) {
      return await sock.sendMessage(from, {
        text: "❌ Only view-once image/video is supported.",
        quoted: msg,
      });
    }

    try {
      const buffer = await downloadMediaMessage(quotedMsg, "buffer", {}, { logger: console });
      const mediaData = quotedMsg.message[mediaType];
      const fileType = mediaType.replace("Message", "");

      await sock.sendMessage(owner, {
        [fileType]: buffer,
        caption: `🔓 View-once ${fileType} forwarded from ${from.replace("@s.whatsapp.net", "")}`,
        contextInfo: {
          externalAdReply: {
            title: "Private ViewOnce Forward",
            body: "Sent to owner",
            thumbnailUrl: "https://picsum.photos/300/300?random=6",
            sourceUrl: "https://github.com",
            mediaType: 1,
          },
        },
      });

      await sock.sendMessage(from, {
        text: "✅ View-once media bypassed and sent to owner's DM.",
        quoted: msg,
      });

      await sock.sendMessage(from, { delete: quotedMsg.key });
    } catch (e) {
      await sock.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        quoted: msg,
      });
    }
  },
};
