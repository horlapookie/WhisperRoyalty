
import { settings } from '../settings.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export const command = {
    name: 'gitupdate',
    aliases: ['update', 'pull', 'sync'],
    description: 'Update bot from GitHub repository (Owner only)',
    usage: '=> pull\n=> update\n=> sync',
    category: 'owner',
    cooldown: 30,
    
    async execute(sock, msg, args, context) {
        const { from, sender, isOwner } = context;
        
        if (!isOwner) {
            await sock.sendMessage(from, {
                react: { text: '❌', key: msg.key }
            });
            return;
        }

        try {
            await sock.sendMessage(from, {
                text: '🔄 *GITHUB UPDATE INITIATED*\n\n⏳ Initializing git repository and pulling latest changes...',
                contextInfo: {
                    externalAdReply: {
                        title: '📦 GitHub Update',
                        body: 'Syncing with WhisperRoyalty repo',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

            // Backup current settings.js
            let settingsBackup = null;
            try {
                settingsBackup = fs.readFileSync('./settings.js', 'utf8');
                console.log('✅ Settings.js backed up');
            } catch (error) {
                console.log('⚠️ Could not backup settings.js:', error.message);
            }

            // Check if we're in a git repository, if not initialize it
            let isGitRepo = false;
            try {
                await execAsync('git rev-parse --git-dir');
                isGitRepo = true;
                console.log('✅ Git repository detected');
            } catch (error) {
                console.log('⚠️ Not a git repository, initializing...');
                
                // Initialize git repository
                await execAsync('git init');
                console.log('✅ Git repository initialized');
            }

            // Set remote URL to ensure we're pulling from the correct repository
            try {
                if (isGitRepo) {
                    await execAsync('git remote set-url origin https://github.com/horlapookie/WhisperRoyalty.git');
                } else {
                    await execAsync('git remote add origin https://github.com/horlapookie/WhisperRoyalty.git');
                }
                console.log('✅ Remote URL set to horlapookie/WhisperRoyalty');
            } catch (error) {
                console.log('⚠️ Could not set remote URL:', error.message);
            }

            // Configure git user if not set
            try {
                await execAsync('git config user.name "WhisperRoyalty Bot"');
                await execAsync('git config user.email "bot@whisperroyalty.com"');
                console.log('✅ Git user configured');
            } catch (error) {
                console.log('⚠️ Could not configure git user:', error.message);
            }

            // If it's a new repo, do initial pull
            if (!isGitRepo) {
                try {
                    await execAsync('git pull origin main');
                    console.log('✅ Initial pull completed');
                } catch (error) {
                    console.log('⚠️ Initial pull failed, trying fetch and reset...');
                    
                    // Try fetch and reset for new repo
                    await execAsync('git fetch origin main');
                    await execAsync('git reset --hard origin/main');
                    console.log('✅ Repository synchronized');
                }
            } else {
                // For existing repo, do normal update process
                
                // Check current branch and switch to main if needed
                try {
                    const { stdout: currentBranch } = await execAsync('git branch --show-current');
                    if (currentBranch.trim() !== 'main') {
                        await execAsync('git checkout main');
                        console.log('✅ Switched to main branch');
                    }
                } catch (error) {
                    console.log('⚠️ Branch check/switch warning:', error.message);
                    // Try to create and checkout main branch
                    try {
                        await execAsync('git checkout -b main');
                        console.log('✅ Created and switched to main branch');
                    } catch (createError) {
                        console.log('⚠️ Could not create main branch:', createError.message);
                    }
                }

                // Reset any local changes that might conflict
                try {
                    await execAsync('git reset --hard HEAD');
                    console.log('✅ Reset local changes');
                } catch (error) {
                    console.log('⚠️ Reset warning:', error.message);
                }

                // Fetch latest changes with force
                await execAsync('git fetch origin main --force');

                // Execute git pull with force
                await execAsync('git pull origin main --force');
            }

            // Restore settings.js if it was modified
            if (settingsBackup) {
                try {
                    const currentSettings = fs.readFileSync('./settings.js', 'utf8');
                    if (currentSettings !== settingsBackup) {
                        fs.writeFileSync('./settings.js', settingsBackup);
                        console.log('✅ Settings.js restored from backup');
                    }
                } catch (error) {
                    console.log('⚠️ Could not restore settings.js:', error.message);
                }
            }

            let responseText = '✅ *GITHUB UPDATE COMPLETED*\n\n';
            responseText += '📥 *Repository synchronized successfully!*\n\n';
            responseText += '🔒 *Settings.js preserved*\n';
            responseText += '🌐 *Repository: horlapookie/WhisperRoyalty*\n';
            responseText += '🔄 Run `.restart` to apply changes.\n\n';
            responseText += '💡 *Tip: Use `=>gitupdate` anytime to sync with latest updates!*';

            await sock.sendMessage(from, {
                text: responseText,
                contextInfo: {
                    externalAdReply: {
                        title: '✅ Update Complete',
                        body: 'WhisperRoyalty synchronized',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });

        } catch (error) {
            console.error('Git update error:', error);
            await sock.sendMessage(from, {
                text: `❌ *GITHUB UPDATE FAILED*\n\n\`\`\`\n${error.message}\`\`\`\n\n💡 The bot will automatically initialize git repository and sync with the remote.\n\n🔗 Repository: https://github.com/horlapookie/WhisperRoyalty`,
                contextInfo: {
                    externalAdReply: {
                        title: '❌ Update Failed',
                        body: 'Git operation failed',
                        thumbnailUrl: 'https://files.catbox.moe/mq8b1n.png',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            });
        }
    }
};
