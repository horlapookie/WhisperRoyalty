# 🤖 WhisperRoyalty - Next-Gen WhatsApp Bot v1.0

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/horlapookie/WhisperRoyalty?style=for-the-badge&logo=github&color=gold)](https://github.com/horlapookie/WhisperRoyalty/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/horlapookie/WhisperRoyalty?style=for-the-badge&logo=github&color=blue)](https://github.com/horlapookie/WhisperRoyalty/network)
[![License](https://img.shields.io/github/license/horlapookie/WhisperRoyalty?style=for-the-badge&color=green)](https://github.com/horlapookie/WhisperRoyalty/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**⚡ Advanced Multi-Purpose WhatsApp Bot with AI Integration**

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🎮 Features](#-features) • [💡 Support](#-support)

</div>

---

## 🌟 **What Makes WhisperRoyalty Special?**

WhisperRoyalty isn't just another WhatsApp bot - it's a **complete digital assistant ecosystem** packed with cutting-edge features:

- 🧠 **AI-Powered Intelligence** - Gemini AI integration for smart conversations
- ⚔️ **Epic Pokemon Universe** - Complete battle system with 4v4 strategic gameplay
- 🛡️ **Ethical Hacking Toolkit** - Educational cybersecurity tools
- 🎵 **Media Powerhouse** - Download music, videos, and social content
- 🎮 **Interactive Gaming** - Chess, trivia, hangman, and more
- 📊 **Utility Arsenal** - 135+ commands for productivity
- 👥 **Advanced Group Management** - Comprehensive moderation tools

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js v18+ installed
- WhatsApp account
- Gemini API key (free from Google AI Studio)

### **Installation**

1. **Clone & Setup**
   ```bash
   git clone https://github.com/horlapookie/WhisperRoyalty.git
   cd WhisperRoyalty
   npm install
   ```

2. **Configure Settings**
   ```javascript
   // Edit settings.js
   export const settings = {
       ownerNumber: "YOUR_NUMBER@s.whatsapp.net", // Format: 2347049044897@s.whatsapp.net
       geminiApiKey: "YOUR_GEMINI_API_KEY",
       sessionBase64: "YOUR_SESSION_DATA", // Get from wa.me/2349122222622
       prefix: ".",
       botName: "yourhïghness"
   };
   ```

3. **Get Session Data**
   - Message: wa.me/2349122222622?text=session+loading+link+for+your+bot
   - Scan QR code with your WhatsApp
   - Copy the session data to `settings.js`

4. **Launch Bot**
   ```bash
   npm start
   ```

5. **Success!** 🎉
   ```
   ✅ Bot connected successfully!
   📨 Connection notification sent to owner
   🤖 Bot is now running...
   ```

---

## 🎮 **Core Features**

### 🧠 **AI & Machine Learning**
| Command | Description | Example |
|---------|-------------|---------|
| `.ai <question>` | Chat with Gemini AI | `.ai What is quantum computing?` |
| `.translate <text> \| <lang>` | Multi-language translation | `.translate Hello \| Spanish` |
| `.img <prompt>` | AI image generation | `.img sunset over mountains` |

### ⚔️ **Pokemon Battle System**
| Command | Description | Usage |
|---------|-------------|-------|
| `.spawnpokemon` | Spawn wild Pokemon | Auto-spawning system |
| `.catch` | Catch spawned Pokemon | Quick-time catching |
| `.pvp challenge @user` | Challenge to 4v4 battle | Strategic team battles |
| `.pvp party` | Manage battle team | View active Pokemon |
| `.pokedex` | View collection | Complete Pokemon stats |

### 🎵 **Media & Entertainment**
| Feature | Commands | Capabilities |
|---------|----------|--------------|
| **Music** | `.music <song>`, `.lyrics <song>` | MP3 download, lyrics search |
| **Video** | `.yt <url>`, `.tiktok <url>` | YouTube/TikTok download |
| **Social** | `.instagram <url>`, `.twitter <url>` | Social media content |

### 🛡️ **Ethical Hacking (Educational)**
| Tool | Command | Purpose |
|------|---------|---------|
| **Network** | `.nmap <target>` | Port scanning info |
| **DNS** | `.dns <domain>` | Domain analysis |
| **Security** | `.whois <domain>` | Registration details |
| **Analysis** | `.headers <url>` | HTTP security headers |

### 🎮 **Interactive Games**
- ♟️ **Chess** - Full board game with notation
- 🎯 **Trivia** - Multi-category questions
- 🎪 **Hangman** - Word guessing with hints
- 🎲 **Dice Games** - Custom dice rolling
- 🃏 **8Ball** - Magic 8-ball predictions

---

## 👑 **Owner Commands**

Exclusive controls for bot administrators:

```bash
.on/.off          # Bot power control
.public/.private   # Access mode switching
.autoview on/off   # Status auto-viewing
.autoreact on/off  # Auto-emoji reactions
.chatbot on/off    # DM AI responses
```

---

## 📊 **Advanced Features**

### 🛡️ **Security & Protection**
- ⚡ **Anti-Spam System** - Rate limiting & cooldowns
- 🔒 **Owner-Only Commands** - Secure admin controls
- 🛡️ **Error Handling** - Graceful failure recovery
- 📝 **Audit Logging** - Complete activity tracking

### 🤖 **AI Integration**
- 💬 **Smart DM Chatbot** - Context-aware responses
- 🌐 **Multi-Language Support** - 100+ languages
- 🎨 **Image Generation** - AI-powered artwork
- 📊 **Data Analysis** - Intelligent insights

### 👥 **Group Management**
- 🏷️ **Smart Tagging** - Mention all members with proper @ formatting
- 📊 **Polls & Surveys** - Interactive group decisions
- 🗑️ **Message Management** - Selective deletion
- ⚖️ **Team Formation** - Automatic group splitting

---

## 🎯 **Usage Examples**

### **Pokemon Battles**
```bash
# Start your Pokemon journey
.spawnpokemon              # Wild Pokemon appears
.catch                     # Catch the Pokemon
.pvp transfer2party 1      # Add to battle team
.pvp challenge @friend     # Challenge someone
.pvp accept               # Accept challenge
.pvp move1                # Use first move
```

### **AI Conversations**
```bash
# Smart AI interactions
.ai How do I code in Python?
.ai Write a poem about cats
.translate Bonjour | English
.img anime girl with sword
```

### **Media Downloads**
```bash
# Get your favorite content
.music Imagine Dragons Believer
.yt https://youtube.com/watch?v=...
.lyrics Shape of You
.tiktok https://tiktok.com/@user/video/...
```

### **Group Fun**
```bash
# Interactive group activities
.tagall Time for game night! 🎮    # Tags all members with @
.poll Should we order pizza? Yes|No
.trivia                            # Start quiz game
.chess                            # Begin chess match
```

---

## 📱 **Platform Compatibility**

| Platform | Status | Notes |
|----------|--------|-------|
| 🤖 **Android** | ✅ Full Support | Recommended |
| 🍎 **iOS** | ✅ Full Support | All features work |
| 💻 **Desktop** | ✅ WhatsApp Web | Complete functionality |
| 🌐 **Multi-Device** | ✅ Synced | Cross-platform sync |

---

## 🔧 **Configuration Guide**

### **Environment Setup**
```javascript
// settings.js configuration
export const settings = {
    // Bot Identity
    botName: "yourhïghness",
    version: "v1.0",
    prefix: ".",

    // Owner Settings
    ownerNumber: "2347049044897@s.whatsapp.net",

    // API Keys
    geminiApiKey: "your-gemini-api-key",

    // Session Management
    sessionBase64: "your-whatsapp-session-data",

    // Features
    antiSpam: true,
    autoReconnect: true,
    commandCooldown: 3000,

    // Appearance
    profilePics: [
        "https://picsum.photos/300/300?random=1",
        "https://picsum.photos/300/300?random=2"
    ]
};
```

### **Session Management**
To switch WhatsApp accounts:
1. Get new session from wa.me/2349122222622
2. Replace `sessionBase64` in settings.js
3. Restart bot - automatic session loading

---

## 📈 **Performance Stats**

```
🚀 Command Count: 135+ active commands
⚡ Response Time: <500ms average
🔄 Uptime: 99.9% reliability
📊 Multi-language: 100+ languages supported
🛡️ Security: Advanced anti-spam protection
🤖 AI Integration: Gemini-powered responses
```

---

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

1. **⭐ Star this repository** (Required for access)
2. **👤 Follow @horlapookie** on GitHub
3. **🍴 Fork** the repository
4. **🔧 Create** your feature branch
5. **📝 Commit** your changes
6. **📤 Push** to the branch
7. **🔄 Open** a Pull Request

### **Development Guidelines**
- Follow existing code patterns
- Add proper documentation
- Test all new features
- Update README if needed

---

## 📞 **Support & Community**

<div align="center">

### **🆘 Need Help?**

| Support Type | Link | Description |
|--------------|------|-------------|
| 🐛 **Bug Reports** | [GitHub Issues](https://github.com/horlapookie/WhisperRoyalty/issues) | Report bugs & issues |
| 💡 **Feature Requests** | [GitHub Discussions](https://github.com/horlapookie/WhisperRoyalty/discussions) | Suggest new features |
| 📞 **Direct Support** | [WhatsApp](https://wa.me/2349122222622) | Direct developer contact |
| 📚 **Documentation** | [Wiki](https://github.com/horlapookie/WhisperRoyalty/wiki) | Detailed guides |

### **🌟 Show Your Support**

If WhisperRoyalty has helped you, consider:
- ⭐ **Starring** the repository
- 🔄 **Sharing** with friends
- 💰 **Sponsoring** development
- 🤝 **Contributing** code

</div>

---

## 📄 **License & Legal**

```
MIT License - Free for personal and commercial use
Copyright (c) 2024 horlapookie

Educational Tools Notice:
All ethical hacking tools are for educational purposes only.
Users are responsible for compliance with local laws.