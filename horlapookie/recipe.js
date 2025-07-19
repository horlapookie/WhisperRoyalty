
export const command = {
    name: 'recipe',
    aliases: ['cook', 'food'],
    description: 'Get cooking recipes',
    usage: 'recipe <dish name>',
    category: 'info',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please specify a dish!\n\nExample: .recipe pasta'
            });
            return;
        }
        
        const dish = args.trim();
        
        const recipeData = `👨‍🍳 **Recipe: ${dish}**

🥘 **Ingredients:**
• 2 cups of main ingredient
• 1 cup of secondary ingredient  
• Salt and pepper to taste
• 2 tbsp olive oil
• Fresh herbs

📝 **Instructions:**
1. Prepare all ingredients
2. Heat oil in a pan
3. Add main ingredient and cook for 5-7 minutes
4. Season with salt and pepper
5. Add herbs and serve hot

⏰ **Cooking Time:** 20 minutes
👥 **Serves:** 4 people
🔥 **Difficulty:** Easy

💡 **Chef's Tip:** For best results, use fresh ingredients and don't overcook!

🍽️ **Nutritional Info:**
• Calories: ~300 per serving
• Protein: 15g
• Carbs: 45g
• Fat: 8g`;

        await sock.sendMessage(from, {
            text: recipeData,
            contextInfo: {
                externalAdReply: {
                    title: 'Cooking Recipe',
                    body: 'Delicious homemade food',
                    thumbnailUrl: 'https://picsum.photos/300/300?random=26',
                    sourceUrl: 'https://allrecipes.com',
                    mediaType: 1
                }
            }
        });
    }
};
