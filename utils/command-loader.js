import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
    const commandsDir = path.join(__dirname, '../commands');
    const commands = [];
    
    try {
        const files = await fs.readdir(commandsDir);
        const jsFiles = files.filter(file => file.endsWith('.js') && !file.includes('template'));
        
        for (const file of jsFiles) {
            try {
                const filePath = path.join(commandsDir, file);
                const module = await import(`file://${filePath}?t=${Date.now()}`);
                
                if (module.command && typeof module.command === 'object') {
                    commands.push(module.command);
                    console.log(`✅ Loaded command: ${module.command.name}`);
                } else {
                    console.warn(`⚠️ Invalid command structure in ${file}`);
                }
            } catch (error) {
                console.error(`❌ Error loading command ${file}:`, error);
            }
        }
        
        console.log(`📋 Loaded ${commands.length} commands total`);
        return commands;
    } catch (error) {
        console.error('Error loading commands directory:', error);
        return [];
    }
}
