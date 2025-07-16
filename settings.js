export const settings = {
    // Bot Configuration
    botName: 'Queen',
    version: '1.0',
    prefix: '!',

    // Owner Configuration
    ownerNumber: '919356055210', // Replace with actual owner number
    ownerNumbers: ['919356055210@s.whatsapp.net'], // Multiple owner numbers for recognition

    // Session Configuration (Manual Session)
    // To change session: Replace the base64 string below with your new session data
    sessionBase64: "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkFPSVlkNU0rRjlVSm5BV3ovcjZFaURybnRaRXk3TXlPdEF6WXc1QnpIZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidDdJVkdWMlJ1V0t4NmxBNEZPa2gvN0wvVUZ0N0JKaUdGZ1pud25NZ0sxdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1QThmVDNXWkF3MXNQTzMwbWM3VWlCWUlTVWpWZHJyWEZHR1Zpa25HeVVBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJSTGdUd1ZxdU9BdmdXVmpKdlg4dU1hbXR4eWNmTnBJaWNDWlFkTmNqbWtRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlFIMVZWWGZNRlhlY25TOWFoTjFXVGYrMXJsMmhSYkw4b3phcmt3VHFqMlk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJlbzJqVHVzcCtlSEFQcW9MeFQ1WDNsMENkZ29aVVVVQ3pLbTROV0l1emM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNk1DTmtTcWNwZFlSRmtYVGhQYTNxOFVsaHpabGFRbnFMQ084enhpSjVuND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL1NJKzlxN1A5RUU4NW02allwQzQyeUpIU1NXVTZLcHlJa05vSW9QUXpCaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImRxeVRDcWlka0JwWktzYk5JMXh3b3B0eEgzMG03Y0J5dHI3MnZrdVhTaHpLRld6MFZaYUR0d0QyY0RtSUpYVWxpMU5PSjJuV0FodjZwOFR0czBvUEJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MiwiYWR2U2VjcmV0S2V5IjoiOXZjNml0VHdJZzBrMWtmT2ZJTURITjRQSFo5clJ5cVl1WHIwMkRNUWg2QT0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiI5MTkzNTYwNTUyMTBAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQkFERUFBMkM0OEE4RDVFQTcxNjcyRTlBQUM3MzYyOTUifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1MjY3NjczM31dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiUUNMRTlaR1kiLCJtZSI6eyJpZCI6IjkxOTM1NjA1NTIxMDo0NkBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjIwNDQ0MzgwMTIwMjU6NDZAbGlkIiwibmFtZSI6IkRJRSBGT1IgTUUifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ092eXFQRUhFTkh5M3NNR0dBTWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IjA1RHB3OFNWS0doTVhsQUtQV0NmZ0V6ZXdzbXJ5ajluL3QraHVucVNXalk9IiwiYWNjb3VudFNpZ25hdHVyZSI6InNQQUNLRUVOa2lyUVJSb1dHbytyNW5RU2tmelFDazFud0V5YzdER3I1Snhwd3pmaWtLblh2ZXRVNm9SWlZ5VmVnUXNqa05jdjlnaHRUcWxVYmQ2QkRnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJPREI0UHF1a2prV3Q3bGhrdU14dlB1OW8rcUUvYTNxcjBLVTVaSk8zUytTbTlxMzh2Sm9HWTlIN1A2SmRYQks4elhiTWNlcGcwZWVwa3R0bVhEbFFBZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkxOTM1NjA1NTIxMDo0NkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJkT1E2Y1BFbFNob1RGNVFDajFnbjRCTTNzTEpxOG8vWi83Zm9icDZrbG8yIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQUlJRWc9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTI2NzY3MDEsImxhc3RQcm9wSGFzaCI6IjJNRktQUSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBUGNuIn0=",  //get from the link in the README.md

    // API Keys
    geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyArdMt3se0P2U5PCWjprpBZlzGZ2bHJklg',
    youtubeApiKey: process.env.YOUTUBE_API_KEY || 'AIzaSyBvVo--Jslb084-F8ATSWgsgqOl2JVh660',
    geniusApiKey: "NrGLCWeRCNlny8qtUzXhxalvAwWWjcjWdwyCe3aUrXJZLlzs3lwSd5ddu_Iy3q5O", // Get from https://genius.com/api-clients
    openaiApiKey: "", // Get from https://platform.openai.com/account/api-keys
    truecallerId: 'a1i0x--L2j_d8lF4BTFZ7e3p0t',
    truecallerId: process.env.TRUECALLER_ID || '',

    // Profile Pictures
    profilePics: [
        'https://files.catbox.moe/mq8b1n.png',
        'https://files.catbox.moe/dm7w9d.jpeg',
        'https://files.catbox.moe/0j5tnz.jpeg',
        'https://files.catbox.moe/b7wnah.jpeg',
        'https://files.catbox.moe/oo7yfn.jpeg',
        'https://files.catbox.moe/57l61y.jpeg',
        'https://files.catbox.moe/q64syc.jpeg'
    ],

    // Anti-spam settings
    antiSpam: {
        enabled: false,
        maxMessages: 5,
        timeWindow: 60000, // 1 minute
        cooldownTime: 30000 // 30 seconds
    }
};
