/**
 * Command Template
 * Copy this file and rename it to create new commands
 * 
 * Example: copy template.js to weather.js to create a weather command
 */

export const command = {
    name: 'template',
    description: 'Template command for creating new commands',
    category: 'misc',
    usage: '.template [argument]',
    cooldown: 5, // seconds
    ownerOnly: false,
    adminOnly: false,
    
    async execute(sock, msg, args, context) {
        const { from, sender, isOwner, isAdmin } = context;
        
        try {
            // Your command logic here
            
            // Example: Simple text response
            const responseText = `Hello! This is a template command.
            
Arguments received: ${args.join(', ')}
Sender: ${sender}
Is Owner: ${isOwner}
Is Admin: ${isAdmin}`;
            
            await sock.sendMessage(from, {
                text: responseText,
                quoted: msg
            });
            
        } catch (error) {
            console.error('Template command error:', error);
            await sock.sendMessage(from, {
                text: '❌ An error occurred while executing the template command.',
                quoted: msg
            });
        }
    }
};

/**
 * Command Structure Guide:
 * 
 * Required Properties:
 * - name: Command name (should match filename)
 * - description: Brief description of what the command does
 * - category: Category for help menu (ai, games, hack, owner, misc)
 * - usage: How to use the command
 * - execute: Main function that runs when command is called
 * 
 * Optional Properties:
 * - cooldown: Cooldown in seconds (default: 3)
 * - ownerOnly: Only bot owner can use (default: false)
 * - adminOnly: Only group admins can use (default: false)
 * - aliases: Array of alternative names for the command
 * 
 * Execute Function Parameters:
 * - sock: WhatsApp socket connection
 * - msg: Original message object
 * - args: Array of command arguments
 * - context: Object with useful info (from, sender, isOwner, etc.)
 * 
 * Examples of sending different message types:
 * 
 * 1. Text message:
 *    await sock.sendMessage(from, { text: 'Hello!' });
 * 
 * 2. Image with caption:
 *    await sock.sendMessage(from, { 
 *        image: { url: 'https://example.com/image.jpg' },
 *        caption: 'Image caption'
 *    });
 * 
 * 3. Reply to message:
 *    await sock.sendMessage(from, { text: 'Reply text' }, { quoted: msg });
 * 
 * 4. Send file:
 *    await sock.sendMessage(from, { 
 *        document: { url: 'https://example.com/file.pdf' },
 *        fileName: 'document.pdf',
 *        mimetype: 'application/pdf'
 *    });
 */