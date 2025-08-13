
#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkCommands() {
    const commandsDir = path.join(__dirname, 'commands');
    const problematicCommands = [];
    
    try {
        const files = await fs.readdir(commandsDir);
        const jsFiles = files.filter(file => file.endsWith('.js') && !file.includes('template'));
        
        console.log('🔍 Checking command files...\n');
        
        for (const file of jsFiles) {
            try {
                const filePath = path.join(commandsDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                // Check for basic structure
                if (!content.includes('export const command')) {
                    problematicCommands.push({
                        file,
                        issue: 'Missing "export const command"'
                    });
                    continue;
                }
                
                // Try to import and validate
                const module = await import(`file://${filePath}?t=${Date.now()}`);
                
                if (!module.command) {
                    problematicCommands.push({
                        file,
                        issue: 'No command export found'
                    });
                    continue;
                }
                
                if (!module.command.name) {
                    problematicCommands.push({
                        file,
                        issue: 'Command has no name'
                    });
                    continue;
                }
                
                if (!module.command.execute || typeof module.command.execute !== 'function') {
                    problematicCommands.push({
                        file,
                        issue: 'Command has no execute function'
                    });
                    continue;
                }
                
                console.log(`✅ ${file} - ${module.command.name}`);
                
            } catch (error) {
                problematicCommands.push({
                    file,
                    issue: error.message
                });
            }
        }
        
        if (problematicCommands.length > 0) {
            console.log('\n❌ Problematic commands:');
            problematicCommands.forEach(cmd => {
                console.log(`   ${cmd.file}: ${cmd.issue}`);
            });
        } else {
            console.log('\n✅ All commands are valid!');
        }
        
    } catch (error) {
        console.error('Error checking commands:', error);
    }
}

checkCommands();
