# Use official Node.js 20 image as base
FROM node:20

# Install GraphicsMagick system package
RUN apt-get update && apt-get install -y graphicsmagick && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your bot source code
COPY . .

# Start the bot
CMD ["node", "start-bot.js"]
