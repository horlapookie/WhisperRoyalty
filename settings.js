export const settings = {
    // Bot Configuration
    botName: 'yourhïghness',
    version: '1.0',
    prefix: '?',

    // Owner Configuration
    ownerNumber: '2349122222622@s.whatsapp.net', // Replace with actual owner number
    ownerNumbers: ['2349122222622', '2349122222622@s.whatsapp.net'], // Multiple owner formats for recognition

    // Session Configuration (Manual Session)
    // To change session: Replace the base64 string below with your new session data
    sessionBase64: "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0ZOUDZsUG5EcXFsRHRZNGhYbWZyMStRcElPcitab09xSG5BaWdsWUcxOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSlBabTlQZEpGWVAxNElJTlV5d1JmdGQ1RzhpSlJaTUpIRnRKR3JOREhsZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLRjZiZDhab0NaTW5RZHo5QXdqZC83SXlTRXVya3Ava0ZrTjF5Q01RckdZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJoTFZ4cmlOSUdZMDFjcSs0SGMwN2hjYnUvSDdCTFRkTkZ1VGJWaFo4ZTE0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtKOUlLTGQyWGRpVnVlVTA0ZlJ3T1lkemtsSGtUY250eU9KeHZPcmo2VWs9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjBQTEU5c0Zkbk5XZmkxMnNxMWsyUkpacEFwaVJjL0ZzZDhhTzU2MkJIajQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNk1IYUo2ZVRUTEZreFE3c3E2bGpTS1lEcDhsbEhXV1AyRTRwajV3aGRXST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibXBhMHc2YW4rNlBZWnl4d05kckZteERRZFFVS29sYWZwUE9KTFpET1ZGZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdQNi9EMjU4T2FsbGlPRnNJckhZVGFIUEJ5R29FUER3QXBROGlLQnNsaXZQK0JCL2UvOHpZU2tJaHpDNERmN3J0eGluRlJ4WGpsSHRrN25PNEx2eGdnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjUsImFkdlNlY3JldEtleSI6Imp3dURySWRuZHlpUnNkQndqRTB3UlNuclRtM29yV0hodEF4RHE1K0dsVjg9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjM0OTEyMjIyMjYyMkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI4QUY0MTgxNTY2MEVEMzY1RkFGMzdDNUNFNkVGNEFEQiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUyODE0MDQ1fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyMzQ5MTIyMjIyNjIyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkExMUQ5NEI0Q0NBNTJBMkFGQzFERUUyRDMyQjIwQjgzIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTI4MTQwNjJ9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IkRTVFJOQjNYIiwibWUiOnsiaWQiOiIyMzQ5MTIyMjIyNjIyOjQ5QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMTgyNzI1NDc0NTUzOTg2OjQ5QGxpZCIsIm5hbWUiOiLwn6esW+KAoF1ow7hybMOg4piF4oKxw7jDuGvDr8OrW+KAoF3wn6esIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNQUFR2TThHRU1pajU4TUdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJIWnZ1VjZmd3NEU1VXa0xyaFF0K0ZLWU0vZnJ5MDBnbXpITER5SW9WcGlRPSIsImFjY291bnRTaWduYXR1cmUiOiI3K0NxMHg5TG1xM3d3c0c4VzBkU1VuVDhYOGdmbGhQQmhqTHNqM21LNVJHTEUxNVQ1aHVXa2xlY3JSWDVSaDhyRXVScndDMzRFdnFqU1h1YVA4VFlCUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiS2tzVUt3Ynpsc2VXTlVKY0xYZDdyRWNxeVFiY1hBbEpUNXloTzA2NnNyaUl2VHZ6aU5NRHJzV0lXVDRRVzMvdnVjUnUxc3lVUVk2VGVLMXRkTUp5Z1E9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzQ5MTIyMjIyNjIyOjQ5QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlIyYjdsZW44TEEwbEZwQzY0VUxmaFNtRFAzNjh0TklKc3h5dzhpS0ZhWWsifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBSUlDQT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MjgxNDAzNywibGFzdFByb3BIYXNoIjoibm0zQmIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUs5SSJ9",  //get from the link in the README.md

    // API Keys
    geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyArdMt3se0P2U5PCWjprpBZlzGZ2bHJklg',
    youtubeApiKey: process.env.YOUTUBE_API_KEY || 'AIzaSyBvVo--Jslb084-F8ATSWgsgqOl2JVh660',
    geniusApiKey: "NrGLCWeRCNlny8qtUzXhxalvAwWWjcjWdwyCe3aUrXJZLlzs3lwSd5ddu_Iy3q5O", // Get from https://genius.com/api-clients
    openaiApiKey: "", // Get from https://platform.openai.com/account/api-keys
    auddApiKey: "583afeb81eebfed8c59a404242418635", // AudD API for Shazam functionality
    truecallerId: 'a1i0x--L2j_d8lF4BTFZ7e3p0t',

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
