#!/usr/bin/env node

/**
 * yourhïghness WhatsApp Bot Test Runner
 * Quick test to verify bot functionality
 */

import { settings } from './settings.js';
import { loadCommands } from './utils/command-loader.js';
import { GeminiAI } from './utils/gemini.js';

async function testBot() {
    console.log('🤖 Testing yourhïghness WhatsApp Bot v0.0.1');
    console.log('============================================');
    console.log('');
    
    // Test 1: Settings
    console.log('📋 Testing Settings:');
    console.log(`   Bot Name: ${settings.botName}`);
    console.log(`   Version: ${settings.version}`);
    console.log(`   Owner: ${settings.ownerNumber}`);
    console.log(`   Prefix: ${settings.prefix}`);
    console.log(`   Has Session: ${settings.sessionBase64 ? 'Yes' : 'No'}`);
    console.log(`   Has Gemini Key: ${settings.geminiApiKey ? 'Yes' : 'No'}`);
    console.log('');
    
    // Test 2: Commands Loading
    console.log('📂 Testing Command Loading:');
    try {
        const commands = await loadCommands();
        console.log(`   Loaded ${commands.size} commands:`);
        for (const [name, command] of commands) {
            console.log(`   - ${name}: ${command.description}`);
        }
        console.log('');
    } catch (error) {
        console.error('   ❌ Error loading commands:', error.message);
    }
    
    // Test 3: Gemini AI
    console.log('🧠 Testing Gemini AI:');
    try {
        const ai = new GeminiAI(settings.geminiApiKey);
        const response = await ai.generateText('Say hello in a friendly way');
        console.log(`   Response: ${response.substring(0, 100)}...`);
        console.log('   ✅ Gemini AI working');
    } catch (error) {
        console.error('   ❌ Gemini AI error:', error.message);
    }
    console.log('');
    
    // Test 4: Session Data
    console.log('📱 Testing Session Data:');
    try {
        const sessionData = JSON.parse(Buffer.from(settings.sessionBase64, 'base64').toString());
        console.log(`   Account ID: ${sessionData.me?.id || 'Not found'}`);
        console.log(`   Account Name: ${sessionData.me?.name || 'Not found'}`);
        console.log(`   Registration ID: ${sessionData.registrationId || 'Not found'}`);
        console.log('   ✅ Session data valid');
    } catch (error) {
        console.error('   ❌ Session data error:', error.message);
    }
    console.log('');
    
    console.log('🎯 Test Complete!');
    console.log('');
    console.log('📝 To add new commands:');
    console.log('   1. Create a new .js file in the commands/ folder');
    console.log('   2. Follow the command structure (see existing commands)');
    console.log('   3. Restart the bot to load the new command');
    console.log('');
    console.log('🚀 To start the bot: npm start');
}

testBot().catch(console.error);