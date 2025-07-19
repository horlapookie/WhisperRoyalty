export const settings = {
    // Bot Configuration
    botName: 'yourhïghness',
    version: '1.0',
    prefix: '?',

    // Owner Configuration
    ownerNumber: '919356055210@s.whatsapp.net', // Replace with actual owner number
    ownerNumbers: ['919356055210', '919356055210@s.whatsapp.net'], // Multiple owner formats for recognition

    // Session Configuration (Manual Session)
    // To change session: Replace the base64 string below with your new session data
    sessionBase64: "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0pIWkNvcVNaWFZXNTdCMm8zZXBDa0Vra1hXNzF6bVI3YlJlTVhkK2NuND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTE45Qnc2UW9DcFBpb2xKQ1pQRnpWWUVGZHMzU3FaWmEvb0lvNXhYYUFScz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhS0xMR2dkUVBWbW1xOXdaMmxTSjhsWnQrTzFNYUdzam0wd0kxY1p5VWtzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHQThaUzlTZjVOV3RjNXhHcEFkeTZrazl5V3MrejBWVXYzNTlJTmZodEFZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNPYy9xNU41VC9MNjl3azVwTVAzT1IzL2NidFhDaGsxMDMrVWJhQUxoMkU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImRCdzZXVTN4ZVJPVHB3Wmd2UnZDYnNManh0Vlg5WjBuTVQzakpsay85Q009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY000VkMxRTlHdlJYSFV0cDBKeEhCaVhrSHJ6dytJS2k3UUk1Q1VjN2Eycz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibnEyU3R3NGJZRzR0emltSGZacExJZjkrc1JyaTk1Nk5WVGFodGVING53bz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InJ3TWhlVXZiL0xRUEQ3cEpacStrSzNCT2wwdi85SWtuR05uTG12N1IycUNjK2EwSmMxYlYxU09XM3JMK0p3b1NJU2R2aExpMUFnY2o1b3B2eG9WQkFnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MSwiYWR2U2VjcmV0S2V5IjoiczZjMGlScjh0NGg3THh3akh4TXUxMXhaYjdzelZKRXFBL2E5OHloQmlFZz0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiI5MTkzNTYwNTUyMTBAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQzRBMDY5MkI1RTBFOERCRkZBMERFOTA5Qzk3NDZDOTMifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1MjkxMDg2N31dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiMjlNNUFIM1EiLCJtZSI6eyJpZCI6IjkxOTM1NjA1NTIxMDo1OEBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjIwNDQ0MzgwMTIwMjU6NThAbGlkIiwibmFtZSI6IkRJRSBGT1IgTUUifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ096eXFQRUhFT2FYN2NNR0dBZ2dBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IjA1RHB3OFNWS0doTVhsQUtQV0NmZ0V6ZXdzbXJ5ajluL3QraHVucVNXalk9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImlPYmtXdFdWZ0Q3NVBJdHFJWE1Yc0FrTmhDeEY4QlIyRkthRi9icy9QcnpXUDNhd1Qxd1BueEpTYmtUNFFIYVM4bXlCRTVFNmtnd0VxR3FFYlR3V0RRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJCVy85MWtGbWdCakQzRkZyOEp5VU9ydDRVS1BrT1FKWnN3K2dJU2kwQTN5RHp0TldjRlAxWWQvVmsyZTR1My9CTFJnQjNEU01vZ2VuQTVZem90OVZCUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkxOTM1NjA1NTIxMDo1OEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJkT1E2Y1BFbFNob1RGNVFDajFnbjRCTTNzTEpxOG8vWi83Zm9icDZrbG8yIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQUlJRWc9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTI5MTA4MzQsImxhc3RQcm9wSGFzaCI6IjJNRktQUSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBUGN2In0=",  //get from the link in the README.md

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
