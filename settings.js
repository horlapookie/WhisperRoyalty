export const settings = {
    // Bot Configuration
    botName: 'queen',
    version: '1.0',
    prefix: '!',

    // Owner Configuration
    ownerNumber: '919356055210', // Replace with actual owner number
    ownerNumbers: ['919356055210@s.whatsapp.net'], // Multiple owner numbers for recognition

    // Session Configuration (Manual Session)
    // To change session: Replace the base64 string below with your new session data
    sessionBase64: "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUJYdXFiTzZ4ZWwvQ2g2bzA4L2YrUkoxekJLTndXTlV2ZldSbUNHeG9sMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidnZGcXR6T3Rua0U2NlNaRmoxbGE2dGcrWmZBc2pDamxZNllCVTJRR0RVYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFSFVjcEZHV1VyRzBiM1BvL1hCYUlDNTBMNnMzMEVzSGlqbFNHOGtoZUhzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtVk5xU2N3U2hoaFgxa3JTRVBwUi9ZUk5yNkhqNlBGR3hoOTlsQ2tFN2drPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1LS1FpM1ZWSWhOMWNUQVcxTHdaQ1V6MHZHZ2tLbDNTcm1Zbngxeno1RXM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImR6MW5mZjk2VFBsOWZWU0tESVJQNk84MHlqbVYzVlpLT0FTR0ZkeDh6ejQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0pZU2taQzlQRlR1b3h2cStEZ2FNbVM2cndTcFR1R1I5WTBscmREMUZYaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVTI5empKdWNkL3k1OU1mUEZQbU1heUFmcTM3clNVdWwybURWeWZUTUdVST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9pUGVMbDZBT2pDR09hM3kyM1Y3OEZLUWE1bXcyWVZ5U0w1S0VpeVY1aDhCdXNWYXVPWStkTXZQNG5DN2tUeS9RbTh4Rlk2UUw0SVBmU0QwQ0dVcmlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjIwLCJhZHZTZWNyZXRLZXkiOiJJTDlkVUZiaVNkTjliUkNZNXpxKzBEeElyNm5ld25pZFhXN2RYM3A1Mm5jPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkxOTM1NjA1NTIxMEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJEODJGMUEzMUJCNThGRjQ4Nzc3RDEzQTZFNjJDMDk1RCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUyNTAyMjE3fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJZTU0zOUJERiIsIm1lIjp7ImlkIjoiOTE5MzU2MDU1MjEwOjQ0QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMjA0NDQzODAxMjAyNTo0NEBsaWQiLCJuYW1lIjoiRElFIEZPUiBNRSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT3Z5cVBFSEVKR2YxTU1HR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMDVEcHc4U1ZLR2hNWGxBS1BXQ2ZnRXpld3NtcnlqOW4vdCtodW5xU1dqWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiZW5JaFlwQ3ErbEhOMU1wdlhveHpvSkwza0hsZEEvRFI3SWs5VkZDOGhlOExvamwxQWFwM2dwWW90OXFwNGp6WCtmaVRDdnRvdUVsZXVrRFJmZGZyQ1E9PSIsImRldmljZVNpZ25hdHVyZSI6IlhhZVdwYkVJWTlQYnNuWUFIVXI2eFdlZDcwVmtqZ0tSTThVd1JoQWxZVTZhNytmT2NLVWxTVVN5S3BMUThFMVVHQ1ZzZDIxcWRSR3k1QmlVaXN4YWd3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTE5MzU2MDU1MjEwOjQ0QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmRPUTZjUEVsU2hvVEY1UUNqMWduNEJNM3NMSnE4by9aLzdmb2JwNmtsbzIifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBSUlFZz09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MjUwMjE3NCwibGFzdFByb3BIYXNoIjoiMk1GS1BRIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFQY3IifQ==",  //get from the link in the README.md

    // API Keys
    geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyArdMt3se0P2U5PCWjprpBZlzGZ2bHJklg',
    youtubeApiKey: process.env.YOUTUBE_API_KEY || 'AIzaSyBvVo--Jslb084-F8ATSWgsgqOl2JVh660',
    geniusApiKey: "NrGLCWeRCNlny8qtUzXhxalvAwWWjcjWdwyCe3aUrXJZLlzs3lwSd5ddu_Iy3q5O", // Get from https://genius.com/api-clients
    openaiApiKey: "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", // Get from https://platform.openai.com/account/api-keys
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
