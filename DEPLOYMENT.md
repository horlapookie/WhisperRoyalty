
# 🚀 Deployment Guide - yourhïghness WhatsApp Bot

This bot can be deployed on multiple platforms. Choose the one that suits your needs:

## 🔴 Replit (Recommended - Always Free)
1. Fork this repository on Replit
2. Update `settings.js` with your configuration
3. Click the Run button
4. ✅ Done! Your bot is live 24/7

## 🟢 Render (Free Tier Available)
1. Connect your GitHub repository
2. Use `render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy automatically

## 🔵 Railway (Free $5 Credits)
1. Import from GitHub
2. `railway.json` will be auto-detected
3. Configure environment variables
4. Deploy with one click

## ⚫ Vercel (Serverless)
1. Import project from GitHub
2. `vercel.json` handles configuration
3. Set environment variables
4. Deploy automatically

## 🟠 Heroku (Limited Free)
1. Create new Heroku app
2. Connect GitHub repository
3. `heroku.yml` and `app.json` auto-configure
4. Set config vars and deploy

## 🟡 Fly.io (Free Allowance)
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly launch` (uses `fly.toml`)
3. Deploy: `fly deploy`

## 🟣 Netlify (Functions)
1. Connect GitHub repository
2. `netlify.toml` auto-configures
3. Set environment variables
4. Deploy via Git push

## 🐳 Docker Deployment
```bash
# Build and run locally
docker build -t whatsapp-bot .
docker run -p 3000:3000 whatsapp-bot

# Or use Docker Compose
docker-compose up -d
```

## 📋 Required Environment Variables
- `GEMINI_API_KEY`: Your Gemini AI API key
- `NODE_ENV`: Set to "production"
- `PORT`: Platform will auto-assign (usually 3000, 8080, or 10000)

## 🔧 Platform-Specific Notes

### Render
- Uses `render.yaml` for configuration
- Free tier available with 750 hours/month
- Auto-sleeps after 15 minutes of inactivity

### Railway  
- Uses `railway.json` for configuration
- $5 free credits per month
- Excellent for Node.js applications

### Vercel
- Serverless deployment using `vercel.json`
- Great for lightweight bots
- May need optimization for long-running processes

### Heroku
- Uses `Procfile`, `heroku.yml`, and `app.json`
- Limited free dynos
- Good for testing and small scale

## 💡 Performance Tips
1. Use lightweight session storage
2. Implement proper error handling
3. Add health check endpoints
4. Monitor memory usage
5. Use environment variables for secrets

## 🆘 Troubleshooting
- Check logs for connection issues
- Verify environment variables are set
- Ensure session data is properly configured
- Monitor memory and CPU usage

Choose your preferred platform and deploy your bot in minutes! 🎉
