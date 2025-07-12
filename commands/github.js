
export const command = {
    name: 'github',
    aliases: ['git', 'gh'],
    description: 'Search GitHub users and repositories',
    usage: 'github <username>',
    category: 'dev',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a GitHub username!\n\nExample: .github torvalds'
            });
            return;
        }
        
        const username = args.trim();
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (!response.ok) {
                await sock.sendMessage(from, {
                    text: '❌ GitHub user not found!'
                });
                return;
            }
            
            const userData = await response.json();
            
            const githubInfo = `👨‍💻 **GitHub Profile**

**Username:** ${userData.login}
**Name:** ${userData.name || 'Not provided'}
**Bio:** ${userData.bio || 'No bio available'}

**Stats:**
• Public Repos: ${userData.public_repos}
• Followers: ${userData.followers}
• Following: ${userData.following}
• Gists: ${userData.public_gists}

**Location:** ${userData.location || 'Not specified'}
**Company:** ${userData.company || 'Not specified'}
**Blog:** ${userData.blog || 'None'}

**Member Since:** ${new Date(userData.created_at).toLocaleDateString()}
**Profile:** ${userData.html_url}`;

            await sock.sendMessage(from, {
                text: githubInfo,
                contextInfo: {
                    externalAdReply: {
                        title: 'GitHub Profile',
                        body: userData.login,
                        thumbnailUrl: userData.avatar_url,
                        sourceUrl: userData.html_url,
                        mediaType: 1
                    }
                }
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch GitHub profile!'
            });
        }
    }
};
