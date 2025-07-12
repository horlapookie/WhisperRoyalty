#!/usr/bin/env node

/**
 * Quick Bot Runner - Start the WhatsApp bot
 */

import('./index.js').then(() => {
    console.log('Bot started successfully!');
}).catch(error => {
    console.error('Failed to start bot:', error);
    process.exit(1);
});