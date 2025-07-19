
import { settings } from '../settings.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const command = {
    name: 'terminal',
    aliases: ['bash', 'cmd', 'shell', 'exec'],
    description: 'Execute terminal/bash commands (Owner only)',
    usage: '$ ls -la\n$ npm install\n$ node --version',
    category: 'owner',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from, sender, isOwner } = context;
        
        if (!isOwner) {
            await sock.sendMessage(from, {
                react: { text: '❌', key: msg.key }
            });
            return;
        }

        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❓ *TERMINAL USAGE*\n\n📝 Usage: `$ <command>`\n\n🔧 Examples:\n• `$ ls -la` - List files\n• `$ pwd` - Current directory\n• `$ node --version` - Check Node version\n• `$ npm list` - List packages\n• `$ ps aux` - List processes\n\n⚠️ *Warning: Be careful with destructive commands!*',
                contextInfo: {
                    externalAdReply: {
                        title: '💻 Terminal Help',
                        body: 'Bash command execution',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }

        const command = args.trim();
        
        // Basic security check for dangerous commands
        const dangerousCommands = [
            'rm -rf /', 'rm -rf *', 'format', 'del *', 'rmdir /s',
            'shutdown', 'reboot', 'init 0', 'halt', 'poweroff',
            'mkfs', 'fdisk', 'dd if=', ':(){ :|:& };:'
        ];
        
        const isDangerous = dangerousCommands.some(dangerous => 
            command.toLowerCase().includes(dangerous.toLowerCase())
        );

        if (isDangerous) {
            await sock.sendMessage(from, {
                text: '🚫 *DANGEROUS COMMAND BLOCKED*\n\n⚠️ This command has been blocked for security reasons.\n\n🛡️ Potentially destructive commands are not allowed.',
                contextInfo: {
                    externalAdReply: {
                        title: '🚫 Command Blocked',
                        body: 'Security protection active',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
            return;
        }

        try {
            await sock.sendMessage(from, {
                text: `💻 *EXECUTING COMMAND*\n\n\`\`\`bash\n$ ${command}\`\`\`\n\n⏳ Processing...`,
                contextInfo: {
                    externalAdReply: {
                        title: '💻 Terminal Execution',
                        body: 'Running bash command',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

            // Execute command with timeout
            const { stdout, stderr } = await execAsync(command, { 
                timeout: 30000, // 30 seconds timeout
                maxBuffer: 1024 * 1024 // 1MB buffer
            });
            
            let output = '';
            if (stdout) output += stdout;
            if (stderr) output += stderr;
            
            // Limit output length to prevent message overflow
            if (output.length > 3000) {
                output = output.substring(0, 3000) + '\n\n... (output truncated)';
            }
            
            if (!output.trim()) {
                output = '(No output)';
            }

            await sock.sendMessage(from, {
                text: `✅ *COMMAND COMPLETED*\n\n💻 Command: \`${command}\`\n\n📋 Output:\n\`\`\`\n${output}\`\`\``,
                contextInfo: {
                    externalAdReply: {
                        title: '✅ Command Success',
                        body: 'Execution completed',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

        } catch (error) {
            console.error('Terminal command error:', error);
            
            let errorMessage = error.message;
            if (error.killed) {
                errorMessage = 'Command timed out (30 seconds limit)';
            }
            
            await sock.sendMessage(from, {
                text: `❌ *COMMAND FAILED*\n\n💻 Command: \`${command}\`\n\n🚨 Error:\n\`\`\`\n${errorMessage}\`\`\``,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Command Failed',
                        body: 'Execution error',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        }
    }
};
