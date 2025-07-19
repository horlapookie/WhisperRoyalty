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

      // Helper to get real WhatsApp number from participant JID - using the attached bot approach
      const extractRealNumber = (participantJid) => {
        if (!participantJid || typeof participantJid !== 'string') return participantJid;

        // Use the same approach as the attached bot: split on '@' and take first part
        const baseNumber = participantJid.split('@')[0];
        
        // For LID format: extract the number before the colon (the real phone number)
        if (baseNumber.includes(':')) {
          const parts = baseNumber.split(':');
          return parts[0]; // The real phone number is before the colon
        }

        // For standard format, return as is
        return baseNumber;
      };

      // Helper to format number for display with proper WhatsApp number
      const formatForDisplay = (participantJid) => {
        const realNumber = extractRealNumber(participantJid);
        // Only return valid phone numbers
        return realNumber && /^\d{10,15}$/.test(realNumber) ? realNumber : participantJid;
      };

      // Collect participants to mention based on role
      let participantsToMention = [];

      // Handle all participants for hidden tag
      if (role === 'hidden') {
        participantsToMention = participants.map(p => p.id);
      } else {
        // Add owner if role matches
        if (!role || role === 'owner') {
          if (ownerJid) {
            participantsToMention.push(ownerJid);
          }
        }

        // Add admins if role matches
        if (!role || role === 'admins') {
          participantsToMention.push(...admins);
        }

        // Add members if role matches
        if (!role || role === 'members') {
          participantsToMention.push(...members);
        }
      }

      if (participantsToMention.length === 0) {
        return await sock.sendMessage(from, {
          text: '❌ No members found for this role!',
          quoted: msg,
        });
      }

      // Create the announcement text with mentions
      const announcementText = `📢 *Group Announcement*\n\n${announcement}\n\n👤 *Announced by:* @${formatForDisplay(senderJid || sender)}`;

      // Send hidetag message to group
      await sock.sendMessage(from, {
        text: announcementText,
        mentions: participantsToMention,
        contextInfo: {
          externalAdReply: {
            title: 'Group Tag Announcement',
            body: `${metadata.subject} • ${participantsToMention.length} members tagged`,
            thumbnailUrl: 'https://picsum.photos/300/300?random=7',
            sourceUrl: 'https://github.com',
            mediaType: 1
          }
        },
        quoted: msg
      });

      console.log(chalk.green(`[YourHighness] Tagall success by +${formatForDisplay(senderJid)}`));
    } catch (err) {
      console.error(chalk.red('[YourHighness] Tagall Error:'), err.message);
      await sock.sendMessage(from, {
        text: '❌ Failed to tag members due to error.',
        quoted: msg,
      });
    }
  }
};