import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const command = {
  name: 'metasploit',
  aliases: ['msf'],
  description: 'Run metasploit command (smb_version, ftp_version)',
  usage: 'metasploit <module> <host>',
  category: 'tool',
  cooldown: 5,

  async execute(sock, msg, args, context) {
    const { from } = context;

    if (args.trim().split(' ').length < 2) {
      await sock.sendMessage(from, {
        text: '❗ Usage: .metasploit <smb_version|ftp_version> <host>',
        quoted: msg,
      });
      return;
    }

    const [module, host] = args.trim().split(' ');

    if (!['smb_version', 'ftp_version'].includes(module)) {
      await sock.sendMessage(from, {
        text: '❌ Supported modules: smb_version, ftp_version',
        quoted: msg,
      });
      return;
    }

    try {
      const cmd = `msfconsole -q -x "use auxiliary/scanner/${module.replace('_', '/')}; set RHOSTS ${host}; run; exit"`;
      const { stdout } = await execAsync(cmd);

      const result = stdout.length > 1500 ? stdout.slice(0, 1500) + '...' : stdout;

      await sock.sendMessage(from, {
        text: `📡 *Metasploit Scan Result*\n\n${result}`,
        contextInfo: {
          externalAdReply: {
            title: 'Metasploit Scan',
            body: `Module: ${module} on ${host}`,
            thumbnailUrl: 'https://picsum.photos/300/300?random=21',
            sourceUrl: 'https://github.com',
            mediaType: 1,
          },
        },
        quoted: msg,
      });
    } catch (err) {
      await sock.sendMessage(from, {
        text: `❌ Metasploit failed: ${err.message}`,
        quoted: msg,
      });
    }
  },
};
