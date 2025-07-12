
const quranData = {
    // Al-Fatiha (The Opening)
    'al-fatiha 1:1': { text: "In the name of Allah, the Most Gracious, the Most Merciful.", ref: "Al-Fatiha 1:1", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
    'al-fatiha 1:2': { text: "Praise be to Allah, the Lord of all the worlds.", ref: "Al-Fatiha 1:2", arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
    'al-fatiha 1:6': { text: "Guide us to the straight path.", ref: "Al-Fatiha 1:6", arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
    
    // Al-Baqarah (The Cow)
    'al-baqarah 2:255': { text: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.", ref: "Al-Baqarah 2:255", arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ" },
    'al-baqarah 2:286': { text: "Allah does not burden a soul beyond that it can bear.", ref: "Al-Baqarah 2:286", arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا" },
    
    // Al-Imran (The Family of Imran)
    'al-imran 3:185': { text: "Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection.", ref: "Al-Imran 3:185", arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ" },
    'al-imran 3:200': { text: "O you who believe! Persevere in patience and constancy; vie in such perseverance; strengthen each other; and fear Allah; that you may prosper.", ref: "Al-Imran 3:200", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ" },
    
    // An-Nisa (The Women)
    'an-nisa 4:1': { text: "O mankind, fear your Lord, who created you from one soul", ref: "An-Nisa 4:1", arabic: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِنْ نَفْسٍ وَاحِدَةٍ" },
    
    // Al-Anfal (The Spoils of War)
    'al-anfal 8:46': { text: "And obey Allah and His Messenger, and do not dispute and [thus] lose courage and [then] your strength would depart", ref: "Al-Anfal 8:46", arabic: "وَأَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ" },
    
    // At-Tawbah (The Repentance)
    'at-tawbah 9:40': { text: "If you do not aid the Prophet - Allah has already aided him", ref: "At-Tawbah 9:40", arabic: "إِلَّا تَنْصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ" },
    
    // Yunus (Jonah)
    'yunus 10:62': { text: "Unquestionably, [for] the allies of Allah there will be no fear concerning them, nor will they grieve", ref: "Yunus 10:62", arabic: "أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ" },
    
    // Ar-Rahman (The Beneficent)
    'ar-rahman 55:13': { text: "So which of the favors of your Lord would you deny?", ref: "Ar-Rahman 55:13", arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ" },
    
    // Al-Waqiah (The Inevitable)
    'al-waqiah 56:79': { text: "Which none touch but the purified.", ref: "Al-Waqiah 56:79", arabic: "لَا يَمَسُّهُ إِلَّا الْمُطَهَّرُونَ" },
    
    // Al-Mulk (The Sovereignty)
    'al-mulk 67:2': { text: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving", ref: "Al-Mulk 67:2", arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا" },
    
    // Al-Asr (The Declining Day)
    'al-asr 103:1': { text: "By time", ref: "Al-Asr 103:1", arabic: "وَالْعَصْرِ" },
    'al-asr 103:2': { text: "Indeed, mankind is in loss", ref: "Al-Asr 103:2", arabic: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ" },
    'al-asr 103:3': { text: "Except for those who believe and do righteous deeds and advise each other to truth and advise each other to patience.", ref: "Al-Asr 103:3", arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ" },
    
    // Al-Kauthar (The Abundance)
    'al-kauthar 108:1': { text: "Indeed, We have granted you abundance.", ref: "Al-Kauthar 108:1", arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ" },
    
    // Al-Kafirun (The Disbelievers)
    'al-kafirun 109:1': { text: "Say: O disbelievers", ref: "Al-Kafirun 109:1", arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ" },
    'al-kafirun 109:6': { text: "For you is your religion, and for me is my religion.", ref: "Al-Kafirun 109:6", arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ" },
    
    // An-Nasr (The Divine Support)
    'an-nasr 110:1': { text: "When the victory of Allah has come and the conquest", ref: "An-Nasr 110:1", arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ" },
    
    // Al-Masad (The Palm Fiber)
    'al-masad 111:1': { text: "May the hands of Abu Lahab be ruined, and ruined is he.", ref: "Al-Masad 111:1", arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ" },
    
    // Al-Ikhlas (The Sincerity)
    'al-ikhlas 112:1': { text: "Say: He is Allah, the One!", ref: "Al-Ikhlas 112:1", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ" },
    'al-ikhlas 112:2': { text: "Allah, the Eternal, Absolute", ref: "Al-Ikhlas 112:2", arabic: "اللَّهُ الصَّمَدُ" },
    
    // Al-Falaq (The Daybreak)
    'al-falaq 113:1': { text: "Say: I seek refuge with the Lord of the dawn", ref: "Al-Falaq 113:1", arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ" },
    
    // An-Nas (The Men)
    'an-nas 114:1': { text: "Say: I seek refuge with the Lord of mankind", ref: "An-Nas 114:1", arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ" }
};

export const command = {
    name: 'quran',
    aliases: ['quran-verse', 'surah'],
    description: 'Search for specific Quran verses or get random verse',
    category: 'info',
    usage: '.quran [surah:verse] or .quran random',
    cooldown: 5,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const randomVerses = Object.values(quranData);
            
            if (!args || args.trim().toLowerCase() === 'random') {
                const randomVerse = randomVerses[Math.floor(Math.random() * randomVerses.length)];
                
                await sock.sendMessage(from, {
                    text: `☪️ *Quran Verse*\n\n${randomVerse.arabic}\n\n"${randomVerse.text}"\n\n📍 ${randomVerse.ref}`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Quran Verse',
                            body: 'Holy Quran',
                            thumbnailUrl: 'https://picsum.photos/300/300?random=204',
                            sourceUrl: 'https://github.com',
                            mediaType: 1
                        }
                    }
                });
            } else {
                const searchTerm = args.trim().toLowerCase();
                const verse = quranData[searchTerm];
                
                if (verse) {
                    await sock.sendMessage(from, {
                        text: `☪️ *Quran Verse*\n\n${verse.arabic}\n\n"${verse.text}"\n\n📍 ${verse.ref}`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Quran Verse',
                                body: verse.ref,
                                thumbnailUrl: 'https://picsum.photos/300/300?random=204',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                } else {
                    // Show available surahs and sample verses
                    const surahs = [...new Set(Object.keys(quranData).map(key => key.split(' ')[0]))];
                    await sock.sendMessage(from, {
                        text: `❌ Verse not found!\n\n📚 *Available surahs:*\n${surahs.join(', ')}\n\n📝 *Example searches:*\n• al-fatiha 1:1\n• al-baqarah 2:255\n• al-ikhlas 112:1\n• al-asr 103:1\n\n💡 *Usage:* .quran al-fatiha 1:1 or .quran random\n\n🔍 Try searching with: surah verse:number`,
                        contextInfo: {
                            externalAdReply: {
                                title: 'Quran Search',
                                body: 'Verse not found - see examples',
                                thumbnailUrl: 'https://picsum.photos/300/300?random=204',
                                sourceUrl: 'https://github.com',
                                mediaType: 1
                            }
                        }
                    });
                }
            }
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to get Quran verse!'
            });
        }
    }
};
