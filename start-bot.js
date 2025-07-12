#!/usr/bin/env node

/**
 * yourhïghness WhatsApp Bot Starter
 * Version: 0.0.1
 * 
 * This script starts the WhatsApp bot independently
 * Run: node start-bot.js
 */

// Set process title for easy identification
process.title = 'yourhighness-whatsapp-bot';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.log('🔄 Restarting bot in 5 seconds...');
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.log('🔄 Restarting bot in 5 seconds...');
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    process.exit(0);
});

console.log('🚀 Starting yourhïghness WhatsApp Bot...');
console.log('📱 Version: 0.0.1');
console.log('🔧 Mode: Production');
console.log('⏰ Started at:', new Date().toLocaleString());

// Start the bot
import('./index.js').then(() => {
    console.log('✅ Bot initialization complete!');
    console.log('🤖 Bot is now running...');
    console.log('💡 Press Ctrl+C to stop the bot');
}).catch(error => {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
});