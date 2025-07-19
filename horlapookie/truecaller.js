
import { settings } from '../settings.js';

import truecallerjs from "truecallerjs";

export const command = {
    name: 'truecaller',
    aliases: ['tc', 'numberinfo'],
    description: 'Get number information using Truecaller',
    usage: 'truecaller <number> or reply to a message',
    category: 'tools',
    cooldown: 10,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!settings.truecallerId) {
            return await sock.sendMessage(from, {
                text: "```Truecaller ID is Missing```"
            }, { quoted: msg });
        }
        
        let number;
        
        // Check if replying to a message with participant
        if (msg.message.extendedTextMessage?.contextInfo?.participant?.length > 0) {
            number = msg.message.extendedTextMessage.contextInfo.participant.split("@")[0];
        } 
        // Check for mentioned users
        else if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            number = msg.message.extendedTextMessage.contextInfo.mentionedJid[0].split("@")[0];
        } 
        // Use provided argument
        else {
            if (!args.trim()) {
                return await sock.sendMessage(from, {
                    text: `❎ Give number or tag/reply to a message`
                }, { quoted: msg });
            }
            number = args.replace(/\s*/g, "");
        }
        
        console.log('Searching number:', number);
        
        if (number.startsWith("+")) {
            number = number.split("+")[1];
        }
        
        if (!number.startsWith("91")) {
            return await sock.sendMessage(from, {
                text: `❎ Number must start with 91 (Indian numbers only)`
            }, { quoted: msg });
        }
        
        try {
            const searchData = {
                number: number,
                countryCode: "IN",
                installationId: settings.truecallerId,
            };
            
            const response = await truecallerjs.search(searchData);
            
            if (!response) {
                return await sock.sendMessage(from, {
                    text: `❎ Number not found`
                }, { quoted: msg });
            }
            
            const data = response.json().data[0];
            const name = response.getName();
            const { e164Format, numberType, countryCode, carrier } = data?.phones[0] || {};
            const { city } = response.getAddresses()[0] || {};
            const email = response.getEmailId();
            
            const message = `🔍 *Truecaller Info* 🔍\n\n` +
                `*Name:* ${name || 'Unknown'}\n` +
                `*Number:* ${e164Format || number}\n` +
                `*City:* ${city || 'Unknown'}\n` +
                `*Country Code:* ${countryCode || 'IN'}\n` +
                `*Carrier:* ${carrier || 'Unknown'}, ${numberType || 'Unknown'}\n` +
                `*Email:* ${email || 'Not available'}\n`;
            
            await sock.sendMessage(from, {
                text: message,
                contextInfo: {
                    externalAdReply: {
                        title: 'Truecaller Search',
                        body: 'Number information lookup',
                        thumbnailUrl: settings.profilePics[Math.floor(Math.random() * settings.profilePics.length)],
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Truecaller Error:', error);
            await sock.sendMessage(from, {
                text: `❎ Error searching number: ${error.message}`
            }, { quoted: msg });
        }
    }
};
