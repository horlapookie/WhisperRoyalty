import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
    const commandsDir = path.join(__dirname, '../horlapookie');
    const commands = [];

    try {
        const files = await fs.readdir(commandsDir);
        const jsFiles = files.filter(file => file.endsWith('.js') && !file.includes('template'));

        for (const file of jsFiles) {
            try {
                const filePath = path.join(commandsDir, file);

                // Check if file exists and is readable
                const stats = await fs.stat(filePath);
                if (!stats.isFile()) {
                    console.warn(`⚠️ Skipping ${file}: Not a regular file`);
                    continue;
                }

                // Clear module cache to ensure fresh load
                const moduleUrl = `file://${filePath}?t=${Date.now()}`;
                const module = await import(moduleUrl);

                // Validate command structure
                if (!module.command) {
                    console.warn(`⚠️ Skipping ${file}: No command export found`);
                    continue;
                }

                if (typeof module.command !== 'object') {
                    console.warn(`⚠️ Skipping ${file}: Command export is not an object`);
                    continue;
                }

                if (!module.command.name || typeof module.command.name !== 'string') {
                    console.warn(`⚠️ Skipping ${file}: Command has no valid name`);
                    continue;
                }

                if (!module.command.execute || typeof module.command.execute !== 'function') {
                    console.warn(`⚠️ Skipping ${file}: Command has no execute function`);
                    continue;
                }

                // Check for duplicate command names
                const existingCommand = commands.find(cmd => cmd.name === module.command.name);
                if (existingCommand) {
                    console.warn(`⚠️ Duplicate command name "${module.command.name}" in ${file}, skipping`);
                    continue;
                }

                commands.push(module.command);
                console.log(`✅ Loaded command: ${module.command.name}`);

            } catch (error) {
                console.error(`❌ Error loading command ${file}:`, error.message);

                // Try to provide more specific error information
                if (error.code === 'MODULE_NOT_FOUND') {
                    console.error(`   Missing dependency in ${file}`);
                } else if (error instanceof SyntaxError) {
                    console.error(`   Syntax error in ${file}:`, error.message);
                } else {
                    console.error(`   Runtime error in ${file}:`, error.message);
                }
            }
        }

        console.log(`📋 Successfully loaded ${commands.length} out of ${jsFiles.length} command files`);
        return commands;

    } catch (error) {
        console.error('❌ Error accessing commands directory:', error);
        return [];
    }
}