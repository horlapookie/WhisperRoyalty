import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting yourhïghness WhatsApp Bot...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Node.js Version:', process.version);
console.log('💾 Memory Limit:', Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB');

// Platform-specific port configuration
function getPlatformPort() {
    // Detect platform and set appropriate port
    if (process.env.RENDER) return 10000; // Render
    if (process.env.RAILWAY_ENVIRONMENT) return 3000; // Railway
    if (process.env.VERCEL) return 3000; // Vercel
    if (process.env.HEROKU) return process.env.PORT || 5000; // Heroku
    if (process.env.FLY_APP_NAME) return 8080; // Fly.io
    if (process.env.NETLIFY) return 8888; // Netlify
    if (process.env.REPLIT_ENVIRONMENT) return 5000; // Replit
    return process.env.PORT || 5000; // Default
}

const PORT = getPlatformPort();
const HOST = process.env.HOST || '0.0.0.0';

// Create Express app for health checks and webhook
const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        platform: process.platform,
        port: PORT,
        host: HOST,
        environment: {
            render: !!process.env.RENDER,
            railway: !!process.env.RAILWAY_ENVIRONMENT,
            vercel: !!process.env.VERCEL,
            heroku: !!process.env.HEROKU,
            fly: !!process.env.FLY_APP_NAME,
            netlify: !!process.env.NETLIFY,
            replit: !!process.env.REPLIT_ENVIRONMENT
        }
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'yourhïghness WhatsApp Bot is running!',
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

// Webhook endpoint for some platforms
app.post('/webhook', (req, res) => {
    res.status(200).json({ received: true });
});

// Start HTTP server
const server = app.listen(PORT, HOST, () => {
    console.log(`🌐 Server running on http://${HOST}:${PORT}`);
    console.log(`🔍 Health check: http://${HOST}:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying alternative port...`);
        const altPort = PORT + Math.floor(Math.random() * 1000);
        server.listen(altPort, HOST);
    } else {
        console.error('Server error:', error);
    }
});

// Start the bot
require('./index.js');

// Enhanced error handling for production
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    console.log('🔄 Restarting bot in 5 seconds...');
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    if (!reason?.message?.includes('Connection Closed')) {
        console.log('🔄 Restarting bot in 5 seconds...');
        setTimeout(() => {
            process.exit(1);
        }, 5000);
    }
});

// Auto-restart functionality
function startBot() {
    const bot = spawn('node', ['index.js'], {
        stdio: 'inherit',
        cwd: __dirname,
        env: {
            ...process.env,
            NODE_ENV: 'production',
            TZ: 'UTC'
        }
    });

    bot.on('close', (code) => {
        console.log(`🔄 Bot process exited with code ${code}`);
        if (code !== 0) {
            console.log('🔄 Restarting bot in 3 seconds...');
            setTimeout(startBot, 3000);
        }
    });

    bot.on('error', (error) => {
        console.error('💥 Bot process error:', error);
        console.log('🔄 Restarting bot in 5 seconds...');
        setTimeout(startBot, 5000);
    });
}

// Start the bot
startBot();