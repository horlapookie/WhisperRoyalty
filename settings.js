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
    sessionBase64: "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUszRlNWOGI1RktpdkJRUjZNakZTSFoxMWVsWXNwamZ0Z2JZRXhqZTcyOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiKzJOM0ZNVFdpSFlHTlFJSXh4aHVQMk12MVJmNXoxRXJkVmVxMWVraWRuVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHQmxaTDl0UTVyRHFDYS9neDFkTDQwdWRCb1JkMVd6by84MUtwOGp3U2tVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJYRHY0WGdBdUJ3a1FwTG15cStkWFpYeW9IVWZ0SnltbU1oWjh3TDFFcURvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklDazZMUHFScUJEQUhtYnovSVJuS0Z4YjdyQXZXdFNrRWNRNFZZaFl4Rnc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVnTGo5cFptelBRRFpIZlcvYVRaaHVZOElSWmpWcjF6YVZFeG1kaThJM1U9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidURGSEp5cXZPa0gwOWhRVFptQUdRS1l0ejFiTmx3Tjl4NlM2K3JyWTMwND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieCtPa3MydktuU3lxanFENzdoZEdCdmJXUFEzMHBuV1lGaTJDZCs5SU1rOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjgzMnR0blI4cVF0dEhRcmhEeEtlbSt5M004MHpBVm1vUU1WZDVLZU9aT3NCN3FxSXZZQ1FkblJ4NHB5KzRSUFhjQ3MzVzdWc2c1eDZhZnJ2QmQzeWd3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTI5LCJhZHZTZWNyZXRLZXkiOiJLMUpiWFJwSVB2SCtSNzZMMHJncEN2enY5OWNqbUNLN0p4eERJT21hKzc4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzNDkxMjIyMjYyMkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIzRURCNDZCQzgzRTZGQzE5MUI5QkVlNERGQjMzNTMwIn0sIm1lc3NhZ2V0aW1lc3RhbXAiOjE3NTI5MzQ2MTl9LHsia2V5Ijp7InJlbW90ZUppZCI6IjIzNDkxMjIyMjYyMkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJEQjEzNUU5MEY3QTlCRUFCRDE4RTEzQjQzRTJDNDdFNSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUyOTM0NjI4fV0sIm5leHRQcmVLZXlJZCI6MzMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMywiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJMTlA4TjVGVyIsIm1lIjp7ImlkIjoiMjM0OTEyMjIyMjYyMjo1MEBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE4MjcyNTQ3NDU1Mzk4Njo1MEBsaWQiLCJuYW1lIjoi8J+nrFvigKBdaMO4cmzDoOKYheKCscO4w7hrw6/Dq1vigKBd8J+nrCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUFRUdk04R0VNZlI3c01HR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiSFp2dVY2ZndzRFNVV2tMcmhRdCtGS1lNL2ZyeTAwZ216SExEeUlvVnBpUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTlFDZEMwYkdjNEhGaGtrd2R1bWV6WlNmUEt3WDVsZjhldE1HRzNCdktNd3U1ejBVY21pT2wxWHJyME8rQVlwS1J1QTZBSlo4ZGk5SWpRRnpWbW5iQ2c9PSIsImRldmljZVNpZ25hdHVyZSI6IjhCUmY5VkZWYWludjBDRzJCOHhJR0wwQU1KQVJHMnYzN2Q2VU9WcVl6UmhvU0ZUb0UrVEpZdGpTZmxKa1p3WHJpUXNHOXlqc1FuS2FyTUNrM1kwdWlBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0OTEyMjIyMjYyMjo1MEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJSMmI3bGVuOExBMGxGcEM2NFVMZmhTbURQMzY4dE5JSnN4eXc4aUtGYVlrIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQUlJQ0E9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTI5MzQ2MTIsImxhc3RQcm9wSGFzaCI6Im5tM0JiIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFLOUsifQ==", // Fresh session data

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