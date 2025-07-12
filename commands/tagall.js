import chalk from 'chalk';

export const command = {
  name: 'tagall',
  aliases: ['mentionall', 'tag'],
  description: 'Tags all group members',
  usage: 'tagall [owner|admins|members|hidden] <message>',
  category: 'group',
  cooldown: 5,

  async execute(sock, msg, args, context) {
    const { from, sender, senderJid, isGroup } = context;

    if (!isGroup) {
      return await sock.sendMessage(from, {
        text: '❌ This command only works in groups.',
        quoted: msg
      });
    }

    try {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata?.participants || [];

      const ownerJid = metadata.owner || participants.find(p => p.admin === 'superadmin')?.id || '';
      const admins = participants.filter(p => p.admin).map(p => p.id);
      const members = participants
        .filter(p => p.id !== ownerJid && !admins.includes(p.id))
        .map(p => p.id);

      const role = args.trim().split(' ')[0]?.toLowerCase();
      const messageText = args.trim().split(' ').slice(1).join(' ') || 'Hello everyone!';
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      const announcement = messageText || quotedMsg?.conversation || 'Hello group!';

      // Helper to get real number and format for WhatsApp
      const formatNumber = (jid) => {
        if (!jid || typeof jid !== 'string') return jid;
        const match = jid.match(/^(\d+)@/);
        return match ? match[1] : jid.replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@lid', '');
      };

      // Helper to get clean phone number for display with proper formatting
      const getPhoneNumber = (jid) => {
        if (!jid || typeof jid !== 'string') return 'Unknown';
        if (jid.includes('@g.us')) return jid; // Group JID
        
        // Extract the number from various JID formats
        let number = '';
        if (jid.includes('@s.whatsapp.net')) {
          number = jid.replace('@s.whatsapp.net', '');
        } else if (jid.includes('@lid')) {
          number = jid.replace('@lid', '');
        } else {
          const match = jid.match(/^(\d+)@/);
          number = match ? match[1] : jid;
        }
        
        // Clean any non-numeric characters and format with +
        number = number.replace(/[^0-9]/g, '');
        return number ? `+${number}` : jid;
      };

      // Handle hidden tag
      if (role === 'hidden') {
        const mentionAll = participants.map(p => p.id);
        return await sock.sendMessage(from, {
          text: `📢 *${announcement}*\n\n_Tagged by: +${formatNumber(senderJid || sender)}_`,
          mentions: mentionAll,
          quoted: msg,
        });
      }

      const sections = [];
      const mentions = [];

      if (!role || role === 'owner') {
        if (ownerJid) {
          mentions.push(ownerJid);
          sections.push(`👑 *Owner:*\n@${formatNumber(ownerJid)}`);
        }
      }

      if (!role || role === 'admins') {
        if (admins.length > 0) {
          admins.forEach(id => mentions.push(id));
          const adminList = admins.map(id => `@${formatNumber(id)}`).join('\n');
          sections.push(`🛡️ *Admins:*\n${adminList}`);
        }
      }

      if (!role || role === 'members') {
        if (members.length > 0) {
          members.forEach(id => mentions.push(id));
          const memberList = members.map(id => `@${formatNumber(id)}`).join('\n');
          sections.push(`👥 *Members:*\n${memberList}`);
        }
      }

      if (sections.length === 0) {
        return await sock.sendMessage(from, {
          text: '❌ No members found for this role!',
          quoted: msg,
        });
      }

      const finalText = `*👥 Group Tag (${role || 'all'})*\n\n${sections.join('\n\n')}`;

      await sock.sendMessage(from, {
        text: finalText,
        mentions,
        contextInfo: {
          externalAdReply: {
            title: 'Tag All Group Members',
            body: 'YourHighness Bot 👑',
            thumbnailUrl: 'https://picsum.photos/300/300?random=7',
            sourceUrl: 'https://github.com',
            mediaType: 1
          }
        },
        quoted: msg
      });

      console.log(chalk.green(`[YourHighness] Tagall success by +${formatNumber(sender)}`));
    } catch (err) {
      console.error(chalk.red('[YourHighness] Tagall Error:'), err.message);
      await sock.sendMessage(from, {
        text: '❌ Failed to tag members due to error.',
        quoted: msg,
      });
    }
  }
};