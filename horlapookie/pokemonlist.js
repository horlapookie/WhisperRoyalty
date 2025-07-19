
export const command = {
    name: 'pokemonlist',
    aliases: ['pokedex-list', 'allpokemon', 'pokelist'],
    description: 'Show all available Pokemon sorted by rarity',
    usage: 'pokemonlist [rarity]',
    category: 'pokemon',
    cooldown: 5,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const pokemonDatabase = {
            // Generation 1 (Kanto)
            bulbasaur: { name: 'Bulbasaur', type: 'Grass/Poison', rarity: 'Common' },
            ivysaur: { name: 'Ivysaur', type: 'Grass/Poison', rarity: 'Uncommon' },
            venusaur: { name: 'Venusaur', type: 'Grass/Poison', rarity: 'Rare' },
            charmander: { name: 'Charmander', type: 'Fire', rarity: 'Common' },
            charmeleon: { name: 'Charmeleon', type: 'Fire', rarity: 'Uncommon' },
            charizard: { name: 'Charizard', type: 'Fire/Flying', rarity: 'Epic' },
            squirtle: { name: 'Squirtle', type: 'Water', rarity: 'Common' },
            wartortle: { name: 'Wartortle', type: 'Water', rarity: 'Uncommon' },
            blastoise: { name: 'Blastoise', type: 'Water', rarity: 'Rare' },
            pikachu: { name: 'Pikachu', type: 'Electric', rarity: 'Rare' },
            raichu: { name: 'Raichu', type: 'Electric', rarity: 'Epic' },
            eevee: { name: 'Eevee', type: 'Normal', rarity: 'Rare' },
            vaporeon: { name: 'Vaporeon', type: 'Water', rarity: 'Epic' },
            jolteon: { name: 'Jolteon', type: 'Electric', rarity: 'Epic' },
            flareon: { name: 'Flareon', type: 'Fire', rarity: 'Epic' },
            espeon: { name: 'Espeon', type: 'Psychic', rarity: 'Epic' },
            umbreon: { name: 'Umbreon', type: 'Dark', rarity: 'Epic' },
            leafeon: { name: 'Leafeon', type: 'Grass', rarity: 'Epic' },
            glaceon: { name: 'Glaceon', type: 'Ice', rarity: 'Epic' },
            sylveon: { name: 'Sylveon', type: 'Fairy', rarity: 'Epic' },
            snorlax: { name: 'Snorlax', type: 'Normal', rarity: 'Epic' },
            gyarados: { name: 'Gyarados', type: 'Water/Flying', rarity: 'Epic' },
            alakazam: { name: 'Alakazam', type: 'Psychic', rarity: 'Rare' },
            machamp: { name: 'Machamp', type: 'Fighting', rarity: 'Rare' },
            gengar: { name: 'Gengar', type: 'Ghost/Poison', rarity: 'Epic' },
            lapras: { name: 'Lapras', type: 'Water/Ice', rarity: 'Rare' },
            dragonite: { name: 'Dragonite', type: 'Dragon/Flying', rarity: 'Legendary' },
            articuno: { name: 'Articuno', type: 'Ice/Flying', rarity: 'Legendary' },
            zapdos: { name: 'Zapdos', type: 'Electric/Flying', rarity: 'Legendary' },
            moltres: { name: 'Moltres', type: 'Fire/Flying', rarity: 'Legendary' },
            mewtwo: { name: 'Mewtwo', type: 'Psychic', rarity: 'Mythical' },
            mew: { name: 'Mew', type: 'Psychic', rarity: 'Mythical' },
            
            // Generation 2 starters and legends
            chikorita: { name: 'Chikorita', type: 'Grass', rarity: 'Common' },
            cyndaquil: { name: 'Cyndaquil', type: 'Fire', rarity: 'Common' },
            totodile: { name: 'Totodile', type: 'Water', rarity: 'Common' },
            lugia: { name: 'Lugia', type: 'Psychic/Flying', rarity: 'Legendary' },
            hooh: { name: 'Ho-Oh', type: 'Fire/Flying', rarity: 'Legendary' },
            celebi: { name: 'Celebi', type: 'Psychic/Grass', rarity: 'Mythical' },
            
            // Generation 3 highlights
            treecko: { name: 'Treecko', type: 'Grass', rarity: 'Common' },
            torchic: { name: 'Torchic', type: 'Fire', rarity: 'Common' },
            mudkip: { name: 'Mudkip', type: 'Water', rarity: 'Common' },
            gardevoir: { name: 'Gardevoir', type: 'Psychic/Fairy', rarity: 'Epic' },
            metagross: { name: 'Metagross', type: 'Steel/Psychic', rarity: 'Legendary' },
            rayquaza: { name: 'Rayquaza', type: 'Dragon/Flying', rarity: 'Legendary' },
            kyogre: { name: 'Kyogre', type: 'Water', rarity: 'Legendary' },
            groudon: { name: 'Groudon', type: 'Ground', rarity: 'Legendary' },
            jirachi: { name: 'Jirachi', type: 'Steel/Psychic', rarity: 'Mythical' },
            deoxys: { name: 'Deoxys', type: 'Psychic', rarity: 'Mythical' },
            
            // Generation 4 highlights
            turtwig: { name: 'Turtwig', type: 'Grass', rarity: 'Common' },
            chimchar: { name: 'Chimchar', type: 'Fire', rarity: 'Common' },
            piplup: { name: 'Piplup', type: 'Water', rarity: 'Common' },
            lucario: { name: 'Lucario', type: 'Fighting/Steel', rarity: 'Epic' },
            garchomp: { name: 'Garchomp', type: 'Dragon/Ground', rarity: 'Legendary' },
            dialga: { name: 'Dialga', type: 'Steel/Dragon', rarity: 'Legendary' },
            palkia: { name: 'Palkia', type: 'Water/Dragon', rarity: 'Legendary' },
            giratina: { name: 'Giratina', type: 'Ghost/Dragon', rarity: 'Legendary' },
            darkrai: { name: 'Darkrai', type: 'Dark', rarity: 'Mythical' },
            arceus: { name: 'Arceus', type: 'Normal', rarity: 'Mythical' },
            
            // Generation 5 highlights
            snivy: { name: 'Snivy', type: 'Grass', rarity: 'Common' },
            tepig: { name: 'Tepig', type: 'Fire', rarity: 'Common' },
            oshawott: { name: 'Oshawott', type: 'Water', rarity: 'Common' },
            zoroark: { name: 'Zoroark', type: 'Dark', rarity: 'Epic' },
            reshiram: { name: 'Reshiram', type: 'Dragon/Fire', rarity: 'Legendary' },
            zekrom: { name: 'Zekrom', type: 'Dragon/Electric', rarity: 'Legendary' },
            kyurem: { name: 'Kyurem', type: 'Dragon/Ice', rarity: 'Legendary' },
            
            // Generation 6 highlights
            chespin: { name: 'Chespin', type: 'Grass', rarity: 'Common' },
            fennekin: { name: 'Fennekin', type: 'Fire', rarity: 'Common' },
            froakie: { name: 'Froakie', type: 'Water', rarity: 'Common' },
            greninja: { name: 'Greninja', type: 'Water/Dark', rarity: 'Epic' },
            xerneas: { name: 'Xerneas', type: 'Fairy', rarity: 'Legendary' },
            yveltal: { name: 'Yveltal', type: 'Dark/Flying', rarity: 'Legendary' },
            
            // Generation 7 highlights
            rowlet: { name: 'Rowlet', type: 'Grass/Flying', rarity: 'Common' },
            litten: { name: 'Litten', type: 'Fire', rarity: 'Common' },
            popplio: { name: 'Popplio', type: 'Water', rarity: 'Common' },
            lycanroc: { name: 'Lycanroc', type: 'Rock', rarity: 'Rare' },
            kartana: { name: 'Kartana', type: 'Grass/Steel', rarity: 'Ultra Beast' },
            necrozma: { name: 'Necrozma', type: 'Psychic', rarity: 'Legendary' },
            
            // Generation 8 highlights
            grookey: { name: 'Grookey', type: 'Grass', rarity: 'Common' },
            scorbunny: { name: 'Scorbunny', type: 'Fire', rarity: 'Common' },
            sobble: { name: 'Sobble', type: 'Water', rarity: 'Common' },
            corviknight: { name: 'Corviknight', type: 'Flying/Steel', rarity: 'Epic' },
            dragapult: { name: 'Dragapult', type: 'Dragon/Ghost', rarity: 'Epic' },
            zacian: { name: 'Zacian', type: 'Fairy', rarity: 'Legendary' },
            zamazenta: { name: 'Zamazenta', type: 'Fighting', rarity: 'Legendary' },
            
            // Additional Gen 1 Pokemon
            psyduck: { name: 'Psyduck', type: 'Water', rarity: 'Common' },
            golduck: { name: 'Golduck', type: 'Water', rarity: 'Uncommon' },
            growlithe: { name: 'Growlithe', type: 'Fire', rarity: 'Uncommon' },
            arcanine: { name: 'Arcanine', type: 'Fire', rarity: 'Rare' },
            abra: { name: 'Abra', type: 'Psychic', rarity: 'Uncommon' },
            kadabra: { name: 'Kadabra', type: 'Psychic', rarity: 'Rare' },
            machop: { name: 'Machop', type: 'Fighting', rarity: 'Common' },
            machoke: { name: 'Machoke', type: 'Fighting', rarity: 'Uncommon' },
            geodude: { name: 'Geodude', type: 'Rock/Ground', rarity: 'Common' },
            graveler: { name: 'Graveler', type: 'Rock/Ground', rarity: 'Uncommon' },
            golem: { name: 'Golem', type: 'Rock/Ground', rarity: 'Rare' },
            ponyta: { name: 'Ponyta', type: 'Fire', rarity: 'Uncommon' },
            rapidash: { name: 'Rapidash', type: 'Fire', rarity: 'Rare' },
            slowpoke: { name: 'Slowpoke', type: 'Water/Psychic', rarity: 'Common' },
            slowbro: { name: 'Slowbro', type: 'Water/Psychic', rarity: 'Rare' },
            magnemite: { name: 'Magnemite', type: 'Electric/Steel', rarity: 'Common' },
            magneton: { name: 'Magneton', type: 'Electric/Steel', rarity: 'Uncommon' },
            gastly: { name: 'Gastly', type: 'Ghost/Poison', rarity: 'Uncommon' },
            haunter: { name: 'Haunter', type: 'Ghost/Poison', rarity: 'Rare' },
            onix: { name: 'Onix', type: 'Rock/Ground', rarity: 'Rare' },
            drowzee: { name: 'Drowzee', type: 'Psychic', rarity: 'Common' },
            hypno: { name: 'Hypno', type: 'Psychic', rarity: 'Uncommon' },
            cubone: { name: 'Cubone', type: 'Ground', rarity: 'Uncommon' },
            marowak: { name: 'Marowak', type: 'Ground', rarity: 'Rare' },
            hitmonlee: { name: 'Hitmonlee', type: 'Fighting', rarity: 'Rare' },
            hitmonchan: { name: 'Hitmonchan', type: 'Fighting', rarity: 'Rare' },
            chansey: { name: 'Chansey', type: 'Normal', rarity: 'Rare' },
            kangaskhan: { name: 'Kangaskhan', type: 'Normal', rarity: 'Rare' },
            scyther: { name: 'Scyther', type: 'Bug/Flying', rarity: 'Rare' },
            electabuzz: { name: 'Electabuzz', type: 'Electric', rarity: 'Rare' },
            magmar: { name: 'Magmar', type: 'Fire', rarity: 'Rare' },
            pinsir: { name: 'Pinsir', type: 'Bug', rarity: 'Rare' },
            tauros: { name: 'Tauros', type: 'Normal', rarity: 'Rare' },
            magikarp: { name: 'Magikarp', type: 'Water', rarity: 'Common' },
            ditto: { name: 'Ditto', type: 'Normal', rarity: 'Epic' },
            
            // More Gen 2
            sentret: { name: 'Sentret', type: 'Normal', rarity: 'Common' },
            furret: { name: 'Furret', type: 'Normal', rarity: 'Uncommon' },
            hoothoot: { name: 'Hoothoot', type: 'Normal/Flying', rarity: 'Common' },
            noctowl: { name: 'Noctowl', type: 'Normal/Flying', rarity: 'Uncommon' },
            crobat: { name: 'Crobat', type: 'Poison/Flying', rarity: 'Rare' },
            pichu: { name: 'Pichu', type: 'Electric', rarity: 'Uncommon' },
            togepi: { name: 'Togepi', type: 'Fairy', rarity: 'Rare' },
            togetic: { name: 'Togetic', type: 'Fairy/Flying', rarity: 'Epic' },
            mareep: { name: 'Mareep', type: 'Electric', rarity: 'Common' },
            flaaffy: { name: 'Flaaffy', type: 'Electric', rarity: 'Uncommon' },
            ampharos: { name: 'Ampharos', type: 'Electric', rarity: 'Rare' },
            
            // Additional Gen 1-2 Pokemon
            caterpie: { name: 'Caterpie', type: 'Bug', rarity: 'Common' },
            metapod: { name: 'Metapod', type: 'Bug', rarity: 'Common' },
            butterfree: { name: 'Butterfree', type: 'Bug/Flying', rarity: 'Uncommon' },
            weedle: { name: 'Weedle', type: 'Bug/Poison', rarity: 'Common' },
            kakuna: { name: 'Kakuna', type: 'Bug/Poison', rarity: 'Common' },
            beedrill: { name: 'Beedrill', type: 'Bug/Poison', rarity: 'Uncommon' },
            pidgey: { name: 'Pidgey', type: 'Normal/Flying', rarity: 'Common' },
            pidgeotto: { name: 'Pidgeotto', type: 'Normal/Flying', rarity: 'Uncommon' },
            pidgeot: { name: 'Pidgeot', type: 'Normal/Flying', rarity: 'Rare' },
            rattata: { name: 'Rattata', type: 'Normal', rarity: 'Common' },
            raticate: { name: 'Raticate', type: 'Normal', rarity: 'Uncommon' },
            spearow: { name: 'Spearow', type: 'Normal/Flying', rarity: 'Common' },
            fearow: { name: 'Fearow', type: 'Normal/Flying', rarity: 'Uncommon' },
            ekans: { name: 'Ekans', type: 'Poison', rarity: 'Common' },
            arbok: { name: 'Arbok', type: 'Poison', rarity: 'Uncommon' },
            sandshrew: { name: 'Sandshrew', type: 'Ground', rarity: 'Common' },
            sandslash: { name: 'Sandslash', type: 'Ground', rarity: 'Uncommon' },
            nidoranf: { name: 'Nidoran♀', type: 'Poison', rarity: 'Common' },
            nidorina: { name: 'Nidorina', type: 'Poison', rarity: 'Uncommon' },
            nidoqueen: { name: 'Nidoqueen', type: 'Poison/Ground', rarity: 'Rare' },
            nidoranm: { name: 'Nidoran♂', type: 'Poison', rarity: 'Common' },
            nidorino: { name: 'Nidorino', type: 'Poison', rarity: 'Uncommon' },
            nidoking: { name: 'Nidoking', type: 'Poison/Ground', rarity: 'Rare' },
            clefairy: { name: 'Clefairy', type: 'Fairy', rarity: 'Uncommon' },
            clefable: { name: 'Clefable', type: 'Fairy', rarity: 'Rare' },
            vulpix: { name: 'Vulpix', type: 'Fire', rarity: 'Uncommon' },
            ninetales: { name: 'Ninetales', type: 'Fire', rarity: 'Rare' },
            jigglypuff: { name: 'Jigglypuff', type: 'Normal/Fairy', rarity: 'Uncommon' },
            wigglytuff: { name: 'Wigglytuff', type: 'Normal/Fairy', rarity: 'Rare' },
            zubat: { name: 'Zubat', type: 'Poison/Flying', rarity: 'Common' },
            golbat: { name: 'Golbat', type: 'Poison/Flying', rarity: 'Uncommon' },
            oddish: { name: 'Oddish', type: 'Grass/Poison', rarity: 'Common' },
            gloom: { name: 'Gloom', type: 'Grass/Poison', rarity: 'Uncommon' },
            vileplume: { name: 'Vileplume', type: 'Grass/Poison', rarity: 'Rare' },
            paras: { name: 'Paras', type: 'Bug/Grass', rarity: 'Common' },
            parasect: { name: 'Parasect', type: 'Bug/Grass', rarity: 'Uncommon' },
            venonat: { name: 'Venonat', type: 'Bug/Poison', rarity: 'Common' },
            venomoth: { name: 'Venomoth', type: 'Bug/Poison', rarity: 'Uncommon' },
            diglett: { name: 'Diglett', type: 'Ground', rarity: 'Common' },
            dugtrio: { name: 'Dugtrio', type: 'Ground', rarity: 'Uncommon' },
            meowth: { name: 'Meowth', type: 'Normal', rarity: 'Common' },
            persian: { name: 'Persian', type: 'Normal', rarity: 'Uncommon' },
            mankey: { name: 'Mankey', type: 'Fighting', rarity: 'Common' },
            primeape: { name: 'Primeape', type: 'Fighting', rarity: 'Uncommon' },
            bellsprout: { name: 'Bellsprout', type: 'Grass/Poison', rarity: 'Common' },
            weepinbell: { name: 'Weepinbell', type: 'Grass/Poison', rarity: 'Uncommon' },
            victreebel: { name: 'Victreebel', type: 'Grass/Poison', rarity: 'Rare' },
            tentacool: { name: 'Tentacool', type: 'Water/Poison', rarity: 'Common' },
            tentacruel: { name: 'Tentacruel', type: 'Water/Poison', rarity: 'Uncommon' },
            seel: { name: 'Seel', type: 'Water', rarity: 'Common' },
            dewgong: { name: 'Dewgong', type: 'Water/Ice', rarity: 'Uncommon' },
            grimer: { name: 'Grimer', type: 'Poison', rarity: 'Common' },
            muk: { name: 'Muk', type: 'Poison', rarity: 'Uncommon' },
            shellder: { name: 'Shellder', type: 'Water', rarity: 'Common' },
            cloyster: { name: 'Cloyster', type: 'Water/Ice', rarity: 'Uncommon' },
            krabby: { name: 'Krabby', type: 'Water', rarity: 'Common' },
            kingler: { name: 'Kingler', type: 'Water', rarity: 'Uncommon' },
            voltorb: { name: 'Voltorb', type: 'Electric', rarity: 'Common' },
            electrode: { name: 'Electrode', type: 'Electric', rarity: 'Uncommon' },
            exeggcute: { name: 'Exeggcute', type: 'Grass/Psychic', rarity: 'Common' },
            exeggutor: { name: 'Exeggutor', type: 'Grass/Psychic', rarity: 'Uncommon' },
            lickitung: { name: 'Lickitung', type: 'Normal', rarity: 'Uncommon' },
            koffing: { name: 'Koffing', type: 'Poison', rarity: 'Common' },
            weezing: { name: 'Weezing', type: 'Poison', rarity: 'Uncommon' },
            rhyhorn: { name: 'Rhyhorn', type: 'Ground/Rock', rarity: 'Common' },
            rhydon: { name: 'Rhydon', type: 'Ground/Rock', rarity: 'Uncommon' },
            tangela: { name: 'Tangela', type: 'Grass', rarity: 'Uncommon' },
            horsea: { name: 'Horsea', type: 'Water', rarity: 'Common' },
            seadra: { name: 'Seadra', type: 'Water', rarity: 'Uncommon' },
            goldeen: { name: 'Goldeen', type: 'Water', rarity: 'Common' },
            seaking: { name: 'Seaking', type: 'Water', rarity: 'Uncommon' },
            staryu: { name: 'Staryu', type: 'Water', rarity: 'Common' },
            starmie: { name: 'Starmie', type: 'Water/Psychic', rarity: 'Uncommon' },
            mrMime: { name: 'Mr. Mime', type: 'Psychic/Fairy', rarity: 'Rare' },
            jynx: { name: 'Jynx', type: 'Ice/Psychic', rarity: 'Rare' },
            
            // More Gen 3 Pokemon
            swellow: { name: 'Swellow', type: 'Normal/Flying', rarity: 'Uncommon' },
            taillow: { name: 'Taillow', type: 'Normal/Flying', rarity: 'Common' },
            wingull: { name: 'Wingull', type: 'Water/Flying', rarity: 'Common' },
            pelipper: { name: 'Pelipper', type: 'Water/Flying', rarity: 'Uncommon' },
            ralts: { name: 'Ralts', type: 'Psychic/Fairy', rarity: 'Rare' },
            kirlia: { name: 'Kirlia', type: 'Psychic/Fairy', rarity: 'Rare' },
            slakoth: { name: 'Slakoth', type: 'Normal', rarity: 'Common' },
            vigoroth: { name: 'Vigoroth', type: 'Normal', rarity: 'Uncommon' },
            slaking: { name: 'Slaking', type: 'Normal', rarity: 'Epic' },
            nincada: { name: 'Nincada', type: 'Bug/Ground', rarity: 'Common' },
            ninjask: { name: 'Ninjask', type: 'Bug/Flying', rarity: 'Rare' },
            shedinja: { name: 'Shedinja', type: 'Bug/Ghost', rarity: 'Epic' },
            whismur: { name: 'Whismur', type: 'Normal', rarity: 'Common' },
            loudred: { name: 'Loudred', type: 'Normal', rarity: 'Uncommon' },
            exploud: { name: 'Exploud', type: 'Normal', rarity: 'Rare' },
            makuhita: { name: 'Makuhita', type: 'Fighting', rarity: 'Common' },
            hariyama: { name: 'Hariyama', type: 'Fighting', rarity: 'Uncommon' },
            azurill: { name: 'Azurill', type: 'Normal/Fairy', rarity: 'Common' },
            nosepass: { name: 'Nosepass', type: 'Rock', rarity: 'Uncommon' },
            skitty: { name: 'Skitty', type: 'Normal', rarity: 'Common' },
            delcatty: { name: 'Delcatty', type: 'Normal', rarity: 'Uncommon' },
            sableye: { name: 'Sableye', type: 'Dark/Ghost', rarity: 'Rare' },
            mawile: { name: 'Mawile', type: 'Steel/Fairy', rarity: 'Rare' },
            aron: { name: 'Aron', type: 'Steel/Rock', rarity: 'Common' },
            lairon: { name: 'Lairon', type: 'Steel/Rock', rarity: 'Uncommon' },
            aggron: { name: 'Aggron', type: 'Steel/Rock', rarity: 'Rare' },
            meditite: { name: 'Meditite', type: 'Fighting/Psychic', rarity: 'Common' },
            medicham: { name: 'Medicham', type: 'Fighting/Psychic', rarity: 'Uncommon' },
            electrike: { name: 'Electrike', type: 'Electric', rarity: 'Common' },
            manectric: { name: 'Manectric', type: 'Electric', rarity: 'Uncommon' },
            plusle: { name: 'Plusle', type: 'Electric', rarity: 'Uncommon' },
            minun: { name: 'Minun', type: 'Electric', rarity: 'Uncommon' },
            volbeat: { name: 'Volbeat', type: 'Bug', rarity: 'Uncommon' },
            illumise: { name: 'Illumise', type: 'Bug', rarity: 'Uncommon' },
            roselia: { name: 'Roselia', type: 'Grass/Poison', rarity: 'Uncommon' },
            gulpin: { name: 'Gulpin', type: 'Poison', rarity: 'Common' },
            swalot: { name: 'Swalot', type: 'Poison', rarity: 'Uncommon' },
            carvanha: { name: 'Carvanha', type: 'Water/Dark', rarity: 'Common' },
            sharpedo: { name: 'Sharpedo', type: 'Water/Dark', rarity: 'Uncommon' },
            wailmer: { name: 'Wailmer', type: 'Water', rarity: 'Common' },
            wailord: { name: 'Wailord', type: 'Water', rarity: 'Rare' }
        };
        
        const filterRarity = args.trim().toLowerCase();
        const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical', 'ultra beast'];
        
        if (filterRarity && !validRarities.includes(filterRarity)) {
            await sock.sendMessage(from, {
                text: `❌ Invalid rarity! Valid options: ${validRarities.join(', ')}`
            });
            return;
        }
        
        // Organize Pokemon by rarity
        const pokemonByRarity = {
            'Common': [],
            'Uncommon': [],
            'Rare': [],
            'Epic': [],
            'Legendary': [],
            'Mythical': [],
            'Ultra Beast': []
        };
        
        Object.entries(pokemonDatabase).forEach(([key, pokemon]) => {
            pokemonByRarity[pokemon.rarity].push(pokemon);
        });
        
        if (filterRarity) {
            const targetRarity = filterRarity.charAt(0).toUpperCase() + filterRarity.slice(1);
            if (targetRarity === 'Ultra beast') targetRarity = 'Ultra Beast';
            
            const filteredPokemon = pokemonByRarity[targetRarity] || [];
            if (filteredPokemon.length === 0) {
                await sock.sendMessage(from, {
                    text: `❌ No Pokemon found for rarity: ${targetRarity}`
                });
                return;
            }
            
            let list = `🎯 **${targetRarity.toUpperCase()} POKEMON** (${filteredPokemon.length})\n\n`;
            filteredPokemon.forEach((pokemon, index) => {
                list += `${index + 1}. **${pokemon.name}** - ${pokemon.type}\n`;
            });
            
            await sock.sendMessage(from, {
                text: list,
                contextInfo: {
                    externalAdReply: {
                        title: `${targetRarity} Pokemon List`,
                        body: `${filteredPokemon.length} Pokemon available`,
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        } else {
            // Show summary of all rarities
            let summary = `📋 **COMPLETE POKEMON DATABASE**\n\n`;
            
            Object.entries(pokemonByRarity).forEach(([rarity, pokemon]) => {
                if (pokemon.length > 0) {
                    const rarityEmoji = {
                        'Common': '⚪',
                        'Uncommon': '🟢',
                        'Rare': '🔵',
                        'Epic': '🟣',
                        'Legendary': '🟡',
                        'Mythical': '🔴',
                        'Ultra Beast': '⭐'
                    };
                    
                    summary += `${rarityEmoji[rarity]} **${rarity}:** ${pokemon.length} Pokemon\n`;
                }
            });
            
            summary += `\n**📊 Total Pokemon:** ${Object.keys(pokemonDatabase).length}\n\n`;
            summary += `**🔍 Usage:**\n`;
            summary += `• .pokemonlist common - Show common Pokemon\n`;
            summary += `• .pokemonlist legendary - Show legendary Pokemon\n`;
            summary += `• .pokemonlist mythical - Show mythical Pokemon\n\n`;
            summary += `**⚡ Spawn Commands:**\n`;
            summary += `• .spawnpokemon - Random spawn\n`;
            summary += `• .spawnpokemon pikachu - Owner only\n`;
            summary += `• .catch <name> - Catch spawned Pokemon`;
            
            await sock.sendMessage(from, {
                text: summary,
                contextInfo: {
                    externalAdReply: {
                        title: 'Complete Pokemon Database',
                        body: `${Object.keys(pokemonDatabase).length} Pokemon available`,
                        thumbnailUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
                        sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                        mediaType: 1
                    }
                }
            });
        }
    }
};
