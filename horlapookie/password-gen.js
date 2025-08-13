
export const command = {
    name: 'genpass',
    aliases: ['password-gen', 'passgen'],
    description: 'Generate secure passwords',
    usage: 'genpass <length> [options: numbers, symbols, uppercase]',
    category: 'security',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const parts = args.trim().split(' ');
        const length = parseInt(parts[0]) || 12;
        const options = parts.slice(1).join(' ').toLowerCase();
        
        if (length < 6 || length > 50) {
            await sock.sendMessage(from, {
                text: '❌ Password length must be between 6 and 50 characters!\n\nExample: .genpass 16 symbols numbers'
            });
            return;
        }
        
        try {
            let charset = 'abcdefghijklmnopqrstuvwxyz';
            
            if (options.includes('uppercase') || !options) {
                charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            }
            
            if (options.includes('numbers') || !options) {
                charset += '0123456789';
            }
            
            if (options.includes('symbols') || !options) {
                charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            }
            
            let password = '';
            for (let i = 0; i < length; i++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            
            // Calculate strength
            let strength = 'Weak';
            if (length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                strength = 'Very Strong';
            } else if (length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
                strength = 'Strong';
            } else if (length >= 8) {
                strength = 'Medium';
            }
            
            const passwordInfo = `🔐 **Generated Password**

**Password:** \`${password}\`

**Details:**
• Length: ${length} characters
• Strength: ${strength}
• Character Types: ${charset.length} possible characters

**Security Tips:**
✅ Don't reuse this password
✅ Store in a password manager
✅ Enable 2FA when possible
✅ Change passwords regularly

**Estimated Crack Time:**
• Brute Force: ${length >= 12 ? 'Centuries' : length >= 8 ? 'Years' : 'Months'}

⚠️ **Important:** Save this password securely before closing this message!`;

            await sock.sendMessage(from, {
                text: passwordInfo
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to generate password!'
            });
        }
    }
};
