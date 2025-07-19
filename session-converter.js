#!/usr/bin/env node

/**
 * Session Converter Utility
 * Converts JSON session data to base64 format for easy configuration
 */

import fs from 'fs';
import readline from 'readline';

console.log('🔄 yourhïghness Session Converter');
console.log('==================================');
console.log('');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    try {
        console.log('This tool helps you convert WhatsApp session data to the format needed by the bot.');
        console.log('');
        
        const choice = await promptUser('Choose an option:\n1. Convert JSON session data to base64\n2. Convert base64 back to JSON (for viewing)\n\nEnter choice (1 or 2): ');
        
        if (choice === '1') {
            console.log('');
            console.log('Paste your JSON session data below (press Enter twice when done):');
            
            let jsonData = '';
            let emptyLineCount = 0;
            
            return new Promise((resolve) => {
                const dataCollector = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                
                dataCollector.on('line', (line) => {
                    if (line.trim() === '') {
                        emptyLineCount++;
                        if (emptyLineCount >= 2) {
                            dataCollector.close();
                            processJsonToBase64(jsonData);
                            resolve();
                        }
                    } else {
                        emptyLineCount = 0;
                        jsonData += line + '\n';
                    }
                });
            });
            
        } else if (choice === '2') {
            const base64Data = await promptUser('\nPaste your base64 session data: ');
            processBase64ToJson(base64Data);
        } else {
            console.log('Invalid choice. Please run the script again.');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        rl.close();
    }
}

function processJsonToBase64(jsonData) {
    try {
        // Try to parse the JSON
        const parsed = JSON.parse(jsonData);
        
        // Convert to base64
        const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
        
        console.log('\n✅ Conversion successful!');
        console.log('');
        console.log('📋 Base64 session data (copy this to settings.js):');
        console.log('==================================================');
        console.log(base64);
        console.log('==================================================');
        console.log('');
        console.log('📝 Instructions:');
        console.log('1. Copy the base64 string above');
        console.log('2. Open bot/settings.js');
        console.log('3. Replace the sessionBase64 value with your new data');
        console.log('4. Restart the bot');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error parsing JSON:', error.message);
        console.log('Please make sure you pasted valid JSON data.');
    }
}

function processBase64ToJson(base64Data) {
    try {
        // Decode base64
        const jsonString = Buffer.from(base64Data.trim(), 'base64').toString();
        
        // Parse and pretty print JSON
        const parsed = JSON.parse(jsonString);
        const prettyJson = JSON.stringify(parsed, null, 2);
        
        console.log('\n✅ Conversion successful!');
        console.log('');
        console.log('📋 JSON session data:');
        console.log('====================');
        console.log(prettyJson);
        console.log('====================');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error decoding base64:', error.message);
        console.log('Please make sure you pasted valid base64 data.');
    }
}

// Start the converter
main().catch(console.error);