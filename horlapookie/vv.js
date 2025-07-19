import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const command = {
  name: "vv",
  aliases: ["viewonce"],
  description: "Bypass and delete view-once image/video messages",
  usage: "vv (reply to view-once media)",
  category: "media",
  cooldown: 3,

  async execute(sock, msg, args, context) {
    const { from } = context;
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

      await sock.sendMessage(from, {
        [fileType]: buffer,
        caption: `🔓 View-once ${fileType} bypassed`,
        contextInfo: {
          externalAdReply: {
            title: "ViewOnce Bypassed",
            body: "Media unlocked",
            thumbnailUrl: "https://picsum.photos/300/300?random=5",
            sourceUrl: "https://github.com",
            mediaType: 1,
          },
        },
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
