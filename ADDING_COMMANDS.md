# Adding New Commands to yourhïghness Bot

## Quick Start

1. **Create a new command file** in the `commands/` folder
2. **Follow the command structure** (see template below)
3. **Restart the bot** to load the new command

## Command Structure

Every command file must export a `command` object with the following structure:

```javascript
export const command = {
    name: 'mycommand',              // Command name (required)
    description: 'What it does',    // Brief description (required)
    category: 'misc',               // Category for help menu (required)
    usage: '.mycommand [args]',     // Usage example (required)
    
    // Optional properties
    cooldown: 5,                    // Cooldown in seconds (default: 3)
    ownerOnly: false,               // Only bot owner can use
    adminOnly: false,               // Only group admins can use
    aliases: ['cmd', 'command'],    // Alternative names
    
    // Main function (required)
    async execute(sock, msg, args, context) {
        // Your command logic here
    }
};
```

## Available Categories

- `ai` - AI-related commands
- `games` - Games and entertainment
- `hack` - Ethical hacking tools
- `owner` - Owner-only commands
- `misc` - Miscellaneous commands

## Context Object

The `context` parameter provides useful information:

```javascript
const {
    from,        // Chat/group ID
    sender,      // Sender's number
    isOwner,     // Is sender the bot owner?
    isAdmin,     // Is sender a group admin?
    settings,    // Bot settings
    botState,    // Bot state data
    spamControl  // Spam control instance
} = context;
```

## Example Commands

### 1. Simple Text Command

```javascript
export const command = {
    name: 'hello',
    description: 'Say hello to the user',
    category: 'misc',
    usage: '.hello [name]',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const name = args || 'friend';
        
        await sock.sendMessage(from, {
            text: `Hello, ${name}! 👋`,
            quoted: msg
        });
    }
};
```

### 2. API-based Command

```javascript
export const command = {
    name: 'joke',
    description: 'Get a random joke',
    category: 'misc',
    usage: '.joke',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const response = await fetch('https://api.chucknorris.io/jokes/random');
            const data = await response.json();
            
            await sock.sendMessage(from, {
                text: `😄 **Random Joke**\n\n${data.value}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch joke. Try again later.',
                quoted: msg
            });
        }
    }
};
```

### 3. Owner-only Command

```javascript
export const command = {
    name: 'restart',
    description: 'Restart the bot',
    category: 'owner',
    usage: '.restart',
    ownerOnly: true,
    
    async execute(sock, msg, args, context) {
        const { from, isOwner } = context;
        
        if (!isOwner) {
            await sock.sendMessage(from, {
                text: '❌ Only the bot owner can use this command.',
                quoted: msg
            });
            return;
        }
        
        await sock.sendMessage(from, {
            text: '🔄 Restarting bot...',
            quoted: msg
        });
        
        process.exit(0);
    }
};
```

### 4. Command with Arguments

```javascript
export const command = {
    name: 'weather',
    description: 'Get weather information',
    category: 'misc',
    usage: '.weather <city>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🌤️ Please provide a city name!\n\nExample: .weather London',
                quoted: msg
            });
            return;
        }
        
        try {
            // Replace with actual weather API
            const city = args.trim();
            await sock.sendMessage(from, {
                text: `🌤️ Weather in ${city}:\n\nTemp: 25°C\nCondition: Sunny\nHumidity: 60%`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Could not get weather data.',
                quoted: msg
            });
        }
    }
};
```

## Message Types

### Send Image
```javascript
await sock.sendMessage(from, {
    image: { url: 'https://example.com/image.jpg' },
    caption: 'Image caption'
});
```

### Send Document
```javascript
await sock.sendMessage(from, {
    document: { url: 'https://example.com/file.pdf' },
    fileName: 'document.pdf',
    mimetype: 'application/pdf'
});
```

### Send Audio
```javascript
await sock.sendMessage(from, {
    audio: { url: 'https://example.com/audio.mp3' },
    mimetype: 'audio/mpeg'
});
```

### Reply to Message
```javascript
await sock.sendMessage(from, {
    text: 'Reply text'
}, { quoted: msg });
```

## Using AI (Gemini)

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export const command = {
    name: 'ask',
    description: 'Ask AI a question',
    category: 'ai',
    usage: '.ask <question>',
    
    async execute(sock, msg, args, context) {
        const { from, settings } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '🤔 Please ask a question!',
                quoted: msg
            });
            return;
        }
        
        try {
            const ai = new GoogleGenerativeAI(settings.geminiApiKey);
            const genModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
            const response = await genModel.generateContent(args);
            
            const reply = response.response?.text() || "I couldn't process that.";
            
            await sock.sendMessage(from, {
                text: `🤖 **AI Response**\n\n${reply}`,
                quoted: msg
            });
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ AI service error. Try again later.',
                quoted: msg
            });
        }
    }
};
```

## Error Handling

Always wrap your command logic in try-catch blocks:

```javascript
async execute(sock, msg, args, context) {
    try {
        // Your command logic here
    } catch (error) {
        console.error('Command error:', error);
        await sock.sendMessage(context.from, {
            text: '❌ An error occurred while executing the command.',
            quoted: msg
        });
    }
}
```

## Testing Your Command

1. **Save your command file** in the `commands/` folder
2. **Restart the bot** with `npm start`
3. **Check the console** for loading errors
4. **Test the command** in WhatsApp
5. **Use `.help`** to see if it appears in the help menu

## Tips

- **Keep commands simple** and focused on one task
- **Use descriptive names** that are easy to remember
- **Add appropriate cooldowns** to prevent spam
- **Always validate user input** before processing
- **Provide helpful error messages** when things go wrong
- **Use the template.js** file as a starting point

## File Naming

- Use **lowercase** filenames
- Use **hyphens** for multi-word commands (e.g., `weather-forecast.js`)
- **Match the filename** to the command name when possible

## Need Help?

- Look at existing commands in the `commands/` folder for examples
- Check the `template.js` file for a complete template
- Test your commands thoroughly before deploying