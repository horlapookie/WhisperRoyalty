
const bibleData = {
    // Genesis
    'genesis 1:1': { text: "In the beginning God created the heavens and the earth.", ref: "Genesis 1:1" },
    'genesis 1:27': { text: "So God created mankind in his own image, in the image of God he created them; male and female he created them.", ref: "Genesis 1:27" },
    'genesis 9:13': { text: "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.", ref: "Genesis 9:13" },
    
    // Psalms
    'psalm 23:1': { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
    'psalm 23:4': { text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.", ref: "Psalm 23:4" },
    'psalm 46:1': { text: "God is our refuge and strength, an ever-present help in trouble.", ref: "Psalm 46:1" },
    'psalm 91:11': { text: "For he will command his angels concerning you to guard you in all your ways.", ref: "Psalm 91:11" },
    'psalm 119:105': { text: "Your word is a lamp for my feet, a light on my path.", ref: "Psalm 119:105" },
    
    // Proverbs
    'proverbs 3:5': { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    'proverbs 3:6': { text: "In all your ways submit to him, and he will make your paths straight.", ref: "Proverbs 3:6" },
    'proverbs 31:25': { text: "She is clothed with strength and dignity; she can laugh at the days to come.", ref: "Proverbs 31:25" },
    
    // Matthew
    'matthew 5:16': { text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", ref: "Matthew 5:16" },
    'matthew 6:26': { text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?", ref: "Matthew 6:26" },
    'matthew 28:19': { text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.", ref: "Matthew 28:19" },
    
    // John
    'john 3:16': { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
    'john 14:6': { text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'", ref: "John 14:6" },
    'john 8:32': { text: "Then you will know the truth, and the truth will set you free.", ref: "John 8:32" },
    
    // Romans
    'romans 8:28': { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", ref: "Romans 8:28" },
    'romans 12:2': { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2" },
    
    // 1 Corinthians
    'corinthians 13:4': { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", ref: "1 Corinthians 13:4" },
    'corinthians 13:13': { text: "And now these three remain: faith, hope and love. But the greatest of these is love.", ref: "1 Corinthians 13:13" },
    
    // Philippians
    'philippians 4:13': { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    'philippians 4:19': { text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", ref: "Philippians 4:19" },
    
    // Ephesians
    'ephesians 2:8': { text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", ref: "Ephesians 2:8" },
    'ephesians 6:11': { text: "Put on the full armor of God, so that you can take your stand against the devil's schemes.", ref: "Ephesians 6:11" },
    
    // Isaiah
    'isaiah 41:10': { text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.", ref: "Isaiah 41:10" },
    'isaiah 40:31': { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", ref: "Isaiah 40:31" },
    
    // Jeremiah
    'jeremiah 29:11': { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.", ref: "Jeremiah 29:11" },
    
    // Joshua
    'joshua 1:9': { text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
    
    // Revelation
    'revelation 21:4': { text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.", ref: "Revelation 21:4" }
};

export const command = {
    name: 'bible',
    description: 'Search for specific bible verses or get random verse',
    category: 'info',
    usage: '.bible [book chapter:verse] or .bible random',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const randomVerses = Object.values(bibleData);
            
            if (!args || args.trim().toLowerCase() === 'random') {
                const randomVerse = randomVerses[Math.floor(Math.random() * randomVerses.length)];
                
                await sock.sendMessage(from, {
                    text: `📖 *Daily Bible Verse*\n\n"${randomVerse.text}"\n\n📍 ${randomVerse.ref}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Daily Bible Verse',
                            body: 'Scripture reading',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=105',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                const searchTerm = args.trim().toLowerCase();
                const verse = bibleData[searchTerm];
                
                if (verse) {
                    await sock.sendMessage(from, {
                        text: `📖 *Bible Verse*\n\n"${verse.text}"\n\n📍 ${verse.ref}`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Bible Verse',
                                body: verse.ref,
                                thumbnailUrl: 'https://picsum.photos/300/300?random=105',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                } else {
                    // Show available books and sample verses
                    const books = [...new Set(Object.keys(bibleData).map(key => key.split(' ')[0]))];
                    await sock.sendMessage(from, {
                        text: `❌ Verse not found!\n\n📚 *Available books:*\n${books.join(', ')}\n\n📝 *Example searches:*\n• john 3:16\n• psalm 23:1\n• proverbs 3:5\n• genesis 1:1\n\n💡 *Usage:* .bible john 3:16 or .bible random\n\n🔍 Try searching with: book chapter:verse`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Bible Search',
                                body: 'Verse not found - see examples',
                                thumbnailUrl: 'https://picsum.photos/300/300?random=105',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                }
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get bible verse!'
            });
        }
    }
};
