
export const command = {
    name: 'password',
    aliases: ['pass', 'generate'],
    description: 'Generate a secure password',
    usage: 'password [length]',
    category: 'misc',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const length = parseInt(args.trim()) || 12;
        
        if (length < 4 || length > 50) {
            await sock.sendMessage(from, {
                text: '🔐 Password length must be between 4 and 50 characters!\n\nExample: .password 16',
                quoted: msg
            });
            return;
        }
        
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        await sock.sendMessage(from, {
            text: `🔐 **Generated Password**\n\nLength: ${length} characters\nPassword: \`${password}\`\n\n⚠️ Make sure to save this securely!`,
            quoted: msg
        });
    }
};
