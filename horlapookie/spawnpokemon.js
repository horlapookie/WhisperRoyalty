import { settings } from '../settings.js';

// Extract real phone number from JID (handles both user and participant JIDs)
function extractPhoneNumber(jid) {
    if (!jid) return null;

    // Handle LID format (participant JIDs): extract number after colon
    if (jid.includes('@lid')) {
        const match = jid.match(/:(\d+)@/);
        return match ? match[1] : null;
    } 
    // Handle standard WhatsApp format
    else if (jid.includes('@s.whatsapp.net')) {
        const match = jid.match(/^(\d+)@/);
        return match ? match[1] : null;
    } 
    // Generic @ format
    else if (jid.includes('@')) {
        const match = jid.match(/(\d+)@/);
        return match ? match[1] : null;
    }

    return jid;
}

// Comprehensive Pokemon database with all generations
const pokemonDatabase = {
    // Generation 1 (Kanto)
    bulbasaur: { name: 'Bulbasaur', type: 'Grass/Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    ivysaur: { name: 'Ivysaur', type: 'Grass/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
    venusaur: { name: 'Venusaur', type: 'Grass/Poison', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' },
    charmander: { name: 'Charmander', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    charmeleon: { name: 'Charmeleon', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
    charizard: { name: 'Charizard', type: 'Fire/Flying', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
    squirtle: { name: 'Squirtle', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
    wartortle: { name: 'Wartortle', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png' },
    blastoise: { name: 'Blastoise', type: 'Water', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
    caterpie: { name: 'Caterpie', type: 'Bug', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png' },
    metapod: { name: 'Metapod', type: 'Bug', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png' },
    butterfree: { name: 'Butterfree', type: 'Bug/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png' },
    weedle: { name: 'Weedle', type: 'Bug/Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png' },
    kakuna: { name: 'Kakuna', type: 'Bug/Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png' },
    beedrill: { name: 'Beedrill', type: 'Bug/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png' },
    pidgey: { name: 'Pidgey', type: 'Normal/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
    pidgeotto: { name: 'Pidgeotto', type: 'Normal/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png' },
    pidgeot: { name: 'Pidgeot', type: 'Normal/Flying', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png' },
    rattata: { name: 'Rattata', type: 'Normal', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png' },
    raticate: { name: 'Raticate', type: 'Normal', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png' },
    spearow: { name: 'Spearow', type: 'Normal/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/21.png' },
    fearow: { name: 'Fearow', type: 'Normal/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/22.png' },
    ekans: { name: 'Ekans', type: 'Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png' },
    arbok: { name: 'Arbok', type: 'Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png' },
    pikachu: { name: 'Pikachu', type: 'Electric', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    raichu: { name: 'Raichu', type: 'Electric', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
    sandshrew: { name: 'Sandshrew', type: 'Ground', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
    sandslash: { name: 'Sandslash', type: 'Ground', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/28.png' },
    nidoran: { name: 'Nidoran♀', type: 'Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/29.png' },
    nidorina: { name: 'Nidorina', type: 'Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/30.png' },
    nidoqueen: { name: 'Nidoqueen', type: 'Poison/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png' },
    nidoranm: { name: 'Nidoran♂', type: 'Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/32.png' },
    nidorino: { name: 'Nidorino', type: 'Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/33.png' },
    nidoking: { name: 'Nidoking', type: 'Poison/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png' },
    clefairy: { name: 'Clefairy', type: 'Fairy', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png' },
    clefable: { name: 'Clefable', type: 'Fairy', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png' },
    vulpix: { name: 'Vulpix', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png' },
    ninetales: { name: 'Ninetales', type: 'Fire', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png' },
    jigglypuff: { name: 'Jigglypuff', type: 'Normal/Fairy', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
    wigglytuff: { name: 'Wigglytuff', type: 'Normal/Fairy', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png' },
    eevee: { name: 'Eevee', type: 'Normal', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png' },
    vaporeon: { name: 'Vaporeon', type: 'Water', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png' },
    jolteon: { name: 'Jolteon', type: 'Electric', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png' },
    flareon: { name: 'Flareon', type: 'Fire', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png' },
    porygon: { name: 'Porygon', type: 'Normal', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png' },
    snorlax: { name: 'Snorlax', type: 'Normal', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
    articuno: { name: 'Articuno', type: 'Ice/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png' },
    zapdos: { name: 'Zapdos', type: 'Electric/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png' },
    moltres: { name: 'Moltres', type: 'Fire/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png' },
    dratini: { name: 'Dratini', type: 'Dragon', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
    dragonair: { name: 'Dragonair', type: 'Dragon', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png' },
    dragonite: { name: 'Dragonite', type: 'Dragon/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
    mewtwo: { name: 'Mewtwo', type: 'Psychic', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
    mew: { name: 'Mew', type: 'Psychic', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },

    // Generation 2 (Johto) - Selected
    chikorita: { name: 'Chikorita', type: 'Grass', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png' },
    bayleef: { name: 'Bayleef', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/153.png' },
    meganium: { name: 'Meganium', type: 'Grass', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png' },
    cyndaquil: { name: 'Cyndaquil', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png' },
    quilava: { name: 'Quilava', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/156.png' },
    typhlosion: { name: 'Typhlosion', type: 'Fire', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png' },
    totodile: { name: 'Totodile', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png' },
    croconaw: { name: 'Croconaw', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/159.png' },
    feraligatr: { name: 'Feraligatr', type: 'Water', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png' },
    espeon: { name: 'Espeon', type: 'Psychic', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png' },
    umbreon: { name: 'Umbreon', type: 'Dark', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png' },
    lugia: { name: 'Lugia', type: 'Psychic/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png' },
    hooh: { name: 'Ho-Oh', type: 'Fire/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png' },
    celebi: { name: 'Celebi', type: 'Psychic/Grass', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png' },

    // Generation 3 (Hoenn) - Selected
    treecko: { name: 'Treecko', type: 'Grass', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png' },
    grovyle: { name: 'Grovyle', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/253.png' },
    sceptile: { name: 'Sceptile', type: 'Grass', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/254.png' },
    torchic: { name: 'Torchic', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png' },
    combusken: { name: 'Combusken', type: 'Fire/Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/256.png' },
    blaziken: { name: 'Blaziken', type: 'Fire/Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png' },
    mudkip: { name: 'Mudkip', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png' },
    marshtomp: { name: 'Marshtomp', type: 'Water/Ground', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/259.png' },
    swampert: { name: 'Swampert', type: 'Water/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/260.png' },
    ralts: { name: 'Ralts', type: 'Psychic/Fairy', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/280.png' },
    kirlia: { name: 'Kirlia', type: 'Psychic/Fairy', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/281.png' },
    gardevoir: { name: 'Gardevoir', type: 'Psychic/Fairy', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png' },
    beldum: { name: 'Beldum', type: 'Steel/Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/374.png' },
    metang: { name: 'Metang', type: 'Steel/Psychic', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/375.png' },
    metagross: { name: 'Metagross', type: 'Steel/Psychic', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png' },
    kyogre: { name: 'Kyogre', type: 'Water', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png' },
    groudon: { name: 'Groudon', type: 'Ground', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png' },
    rayquaza: { name: 'Rayquaza', type: 'Dragon/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png' },
    jirachi: { name: 'Jirachi', type: 'Steel/Psychic', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/385.png' },
    deoxys: { name: 'Deoxys', type: 'Psychic', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/386.png' },

    // Generation 4 (Sinnoh) - Selected
    turtwig: { name: 'Turtwig', type: 'Grass', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png' },
    grotle: { name: 'Grotle', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/388.png' },
    torterra: { name: 'Torterra', type: 'Grass/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/389.png' },
    chimchar: { name: 'Chimchar', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/390.png' },
    monferno: { name: 'Monferno', type: 'Fire/Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/391.png' },
    infernape: { name: 'Infernape', type: 'Fire/Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png' },
    piplup: { name: 'Piplup', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png' },
    prinplup: { name: 'Prinplup', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/394.png' },
    empoleon: { name: 'Empoleon', type: 'Water/Steel', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png' },
    riolu: { name: 'Riolu', type: 'Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/447.png' },
    lucario: { name: 'Lucario', type: 'Fighting/Steel', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png' },
    gible: { name: 'Gible', type: 'Dragon/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/443.png' },
    gabite: { name: 'Gabite', type: 'Dragon/Ground', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/444.png' },
    garchomp: { name: 'Garchomp', type: 'Dragon/Ground', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png' },
    leafeon: { name: 'Leafeon', type: 'Grass', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png' },
    glaceon: { name: 'Glaceon', type: 'Ice', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png' },
    dialga: { name: 'Dialga', type: 'Steel/Dragon', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png' },
    palkia: { name: 'Palkia', type: 'Water/Dragon', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/484.png' },
    giratina: { name: 'Giratina', type: 'Ghost/Dragon', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/487.png' },
    darkrai: { name: 'Darkrai', type: 'Dark', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/491.png' },
    arceus: { name: 'Arceus', type: 'Normal', rarity: 'Mythical', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png' },

    // Generation 5 (Unova) - Selected
    snivy: { name: 'Snivy', type: 'Grass', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png' },
    servine: { name: 'Servine', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/496.png' },
    serperior: { name: 'Serperior', type: 'Grass', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/497.png' },
    tepig: { name: 'Tepig', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/498.png' },
    pignite: { name: 'Pignite', type: 'Fire/Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/499.png' },
    emboar: { name: 'Emboar', type: 'Fire/Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png' },
    oshawott: { name: 'Oshawott', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/501.png' },
    dewott: { name: 'Dewott', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/502.png' },
    samurott: { name: 'Samurott', type: 'Water', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/503.png' },
    zorua: { name: 'Zorua', type: 'Dark', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/570.png' },
    zoroark: { name: 'Zoroark', type: 'Dark', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png' },
    reshiram: { name: 'Reshiram', type: 'Dragon/Fire', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/643.png' },
    zekrom: { name: 'Zekrom', type: 'Dragon/Electric', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/644.png' },
    kyurem: { name: 'Kyurem', type: 'Dragon/Ice', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/646.png' },

    // Generation 6 (Kalos) - Selected
    chespin: { name: 'Chespin', type: 'Grass', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png' },
    quilladin: { name: 'Quilladin', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/651.png' },
    chesnaught: { name: 'Chesnaught', type: 'Grass/Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/652.png' },
    fennekin: { name: 'Fennekin', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/653.png' },
    braixen: { name: 'Braixen', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/654.png' },
    delphox: { name: 'Delphox', type: 'Fire/Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/655.png' },
    froakie: { name: 'Froakie', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png' },
    frogadier: { name: 'Frogadier', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/657.png' },
    greninja: { name: 'Greninja', type: 'Water/Dark', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png' },
    sylveon: { name: 'Sylveon', type: 'Fairy', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png' },
    xerneas: { name: 'Xerneas', type: 'Fairy', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png' },
    yveltal: { name: 'Yveltal', type: 'Dark/Flying', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png' },

    // Generation 7 (Alola) - Selected
    rowlet: { name: 'Rowlet', type: 'Grass/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png' },
    dartrix: { name: 'Dartrix', type: 'Grass/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/723.png' },
    decidueye: { name: 'Decidueye', type: 'Grass/Ghost', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/724.png' },
    litten: { name: 'Litten', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/725.png' },
    torracat: { name: 'Torracat', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/726.png' },
    incineroar: { name: 'Incineroar', type: 'Fire/Dark', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/727.png' },
    popplio: { name: 'Popplio', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/728.png' },
    brionne: { name: 'Brionne', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/729.png' },
    primarina: { name: 'Primarina', type: 'Water/Fairy', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png' },
    rockruff: { name: 'Rockruff', type: 'Rock', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/744.png' },
    lycanroc: { name: 'Lycanroc', type: 'Rock', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/745.png' },
    kartana: { name: 'Kartana', type: 'Grass/Steel', rarity: 'Ultra Beast', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/798.png' },
    necrozma: { name: 'Necrozma', type: 'Psychic', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/800.png' },

    // Generation 8 (Galar) - Selected
    grookey: { name: 'Grookey', type: 'Grass', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png' },
    thwackey: { name: 'Thwackey', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/811.png' },
    rillaboom: { name: 'Rillaboom', type: 'Grass', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/812.png' },
    scorbunny: { name: 'Scorbunny', type: 'Fire', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/813.png' },
    raboot: { name: 'Raboot', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/814.png' },
    cinderace: { name: 'Cinderace', type: 'Fire', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png' },
    sobble: { name: 'Sobble', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/816.png' },
    drizzile: { name: 'Drizzile', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/817.png' },
    inteleon: { name: 'Inteleon', type: 'Water', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/818.png' },
    corviknight: { name: 'Corviknight', type: 'Flying/Steel', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/823.png' },
    dragapult: { name: 'Dragapult', type: 'Dragon/Ghost', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/887.png' },
    zacian: { name: 'Zacian', type: 'Fairy', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/888.png' },
    zamazenta: { name: 'Zamazenta', type: 'Fighting', rarity: 'Legendary', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/889.png' },

    // Additional Gen 1 Pokemon
    psyduck: { name: 'Psyduck', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
    golduck: { name: 'Golduck', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png' },
    mankey: { name: 'Mankey', type: 'Fighting', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png' },
    primeape: { name: 'Primeape', type: 'Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/57.png' },
    growlithe: { name: 'Growlithe', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png' },
    arcanine: { name: 'Arcanine', type: 'Fire', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png' },
    poliwag: { name: 'Poliwag', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png' },
    poliwhirl: { name: 'Poliwhirl', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/61.png' },
    poliwrath: { name: 'Poliwrath', type: 'Water/Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png' },
    abra: { name: 'Abra', type: 'Psychic', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png' },
    kadabra: { name: 'Kadabra', type: 'Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png' },
    alakazam: { name: 'Alakazam', type: 'Psychic', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png' },
    machop: { name: 'Machop', type: 'Fighting', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png' },
    machoke: { name: 'Machoke', type: 'Fighting', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png' },
    machamp: { name: 'Machamp', type: 'Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png' },
    bellsprout: { name: 'Bellsprout', type: 'Grass/Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/69.png' },
    weepinbell: { name: 'Weepinbell', type: 'Grass/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png' },
    victreebel: { name: 'Victreebel', type: 'Grass/Poison', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png' },
    tentacool: { name: 'Tentacool', type: 'Water/Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/72.png' },
    tentacruel: { name: 'Tentacruel', type: 'Water/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/73.png' },
    geodude: { name: 'Geodude', type: 'Rock/Ground', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
    graveler: { name: 'Graveler', type: 'Rock/Ground', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png' },
    golem: { name: 'Golem', type: 'Rock/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png' },
    ponyta: { name: 'Ponyta', type: 'Fire', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/77.png' },
    rapidash: { name: 'Rapidash', type: 'Fire', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png' },
    slowpoke: { name: 'Slowpoke', type: 'Water/Psychic', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png' },
    slowbro: { name: 'Slowbro', type: 'Water/Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png' },
    magnemite: { name: 'Magnemite', type: 'Electric/Steel', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png' },
    magneton: { name: 'Magneton', type: 'Electric/Steel', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png' },
    farfetchd: { name: "Farfetch'd", type: 'Normal/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png' },
    doduo: { name: 'Doduo', type: 'Normal/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/84.png' },
    dodrio: { name: 'Dodrio', type: 'Normal/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/85.png' },
    seel: { name: 'Seel', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/86.png' },
    dewgong: { name: 'Dewgong', type: 'Water/Ice', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/87.png' },
    grimer: { name: 'Grimer', type: 'Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png' },
    muk: { name: 'Muk', type: 'Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png' },
    shellder: { name: 'Shellder', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/90.png' },
    cloyster: { name: 'Cloyster', type: 'Water/Ice', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png' },
    gastly: { name: 'Gastly', type: 'Ghost/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
    haunter: { name: 'Haunter', type: 'Ghost/Poison', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png' },
    gengar: { name: 'Gengar', type: 'Ghost/Poison', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
    onix: { name: 'Onix', type: 'Rock/Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png' },
    drowzee: { name: 'Drowzee', type: 'Psychic', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/96.png' },
    hypno: { name: 'Hypno', type: 'Psychic', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png' },
    krabby: { name: 'Krabby', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/98.png' },
    kingler: { name: 'Kingler', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png' },
    voltorb: { name: 'Voltorb', type: 'Electric', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png' },
    electrode: { name: 'Electrode', type: 'Electric', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png' },
    exeggcute: { name: 'Exeggcute', type: 'Grass/Psychic', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/102.png' },
    exeggutor: { name: 'Exeggutor', type: 'Grass/Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png' },
    cubone: { name: 'Cubone', type: 'Ground', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png' },
    marowak: { name: 'Marowak', type: 'Ground', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/105.png' },
    hitmonlee: { name: 'Hitmonlee', type: 'Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png' },
    hitmonchan: { name: 'Hitmonchan', type: 'Fighting', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png' },
    lickitung: { name: 'Lickitung', type: 'Normal', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/108.png' },
    koffing: { name: 'Koffing', type: 'Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png' },
    weezing: { name: 'Weezing', type: 'Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png' },
    rhyhorn: { name: 'Rhyhorn', type: 'Ground/Rock', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/111.png' },
    rhydon: { name: 'Rhydon', type: 'Ground/Rock', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png' },
    chansey: { name: 'Chansey', type: 'Normal', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png' },
    tangela: { name: 'Tangela', type: 'Grass', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/114.png' },
    kangaskhan: { name: 'Kangaskhan', type: 'Normal', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png' },
    horsea: { name: 'Horsea', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/116.png' },
    seadra: { name: 'Seadra', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/117.png' },
    goldeen: { name: 'Goldeen', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/118.png' },
    seaking: { name: 'Seaking', type: 'Water', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/119.png' },
    staryu: { name: 'Staryu', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png' },
    starmie: { name: 'Starmie', type: 'Water/Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png' },
    mrmime: { name: 'Mr. Mime', type: 'Psychic/Fairy', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png' },
    scyther: { name: 'Scyther', type: 'Bug/Flying', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png' },
    jynx: { name: 'Jynx', type: 'Ice/Psychic', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png' },
    electabuzz: { name: 'Electabuzz', type: 'Electric', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png' },
    magmar: { name: 'Magmar', type: 'Fire', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png' },
    pinsir: { name: 'Pinsir', type: 'Bug', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png' },
    tauros: { name: 'Tauros', type: 'Normal', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png' },
    magikarp: { name: 'Magikarp', type: 'Water', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png' },
    gyarados: { name: 'Gyarados', type: 'Water/Flying', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png' },
    lapras: { name: 'Lapras', type: 'Water/Ice', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png' },
    ditto: { name: 'Ditto', type: 'Normal', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png' },

    // More Gen 2 Pokemon
    sentret: { name: 'Sentret', type: 'Normal', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/161.png' },
    furret: { name: 'Furret', type: 'Normal', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/162.png' },
    hoothoot: { name: 'Hoothoot', type: 'Normal/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/163.png' },
    noctowl: { name: 'Noctowl', type: 'Normal/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/164.png' },
    ledyba: { name: 'Ledyba', type: 'Bug/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/165.png' },
    ledian: { name: 'Ledian', type: 'Bug/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/166.png' },
    spinarak: { name: 'Spinarak', type: 'Bug/Poison', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/167.png' },
    ariados: { name: 'Ariados', type: 'Bug/Poison', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/168.png' },
    crobat: { name: 'Crobat', type: 'Poison/Flying', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/169.png' },
    chinchou: { name: 'Chinchou', type: 'Water/Electric', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/170.png' },
    lanturn: { name: 'Lanturn', type: 'Water/Electric', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/171.png' },
    pichu: { name: 'Pichu', type: 'Electric', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png' },
    cleffa: { name: 'Cleffa', type: 'Fairy', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/173.png' },
    igglybuff: { name: 'Igglybuff', type: 'Normal/Fairy', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/174.png' },
    togepi: { name: 'Togepi', type: 'Fairy', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png' },
    togetic: { name: 'Togetic', type: 'Fairy/Flying', rarity: 'Epic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/176.png' },
    natu: { name: 'Natu', type: 'Psychic/Flying', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/177.png' },
    xatu: { name: 'Xatu', type: 'Psychic/Flying', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/178.png' },
    mareep: { name: 'Mareep', type: 'Electric', rarity: 'Common', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/179.png' },
    flaaffy: { name: 'Flaaffy', type: 'Electric', rarity: 'Uncommon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png' },
    ampharos: { name: 'Ampharos', type: 'Electric', rarity: 'Rare', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png' },
};

// Rarity weights for random spawning
const rarityWeights = {
    'Common': 50,
    'Uncommon': 25,
    'Rare': 15,
    'Epic': 6,
    'Legendary': 3,
    'Mythical': 0.8,
    'Ultra Beast': 0.2
};

function getRandomPokemon() {
    const pokemonList = Object.keys(pokemonDatabase);
    const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [rarity, weight] of Object.entries(rarityWeights)) {
        random -= weight;
        if (random <= 0) {
            const pokemonOfRarity = pokemonList.filter(name => pokemonDatabase[name].rarity === rarity);
            if (pokemonOfRarity.length > 0) {
                const randomIndex = Math.floor(Math.random() * pokemonOfRarity.length);
                return pokemonOfRarity[randomIndex];
            }
        }
    }

    // Fallback
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    return pokemonList[randomIndex];
}

export const command = {
    name: 'spawnpokemon',
    aliases: ['spawn', 'pokemon'],
    description: 'Spawn a random Pokemon or specific Pokemon (owner only)',
    usage: 'spawnpokemon [pokemon_name]',
    category: 'pokemon',
    cooldown: 30,

    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Check if user is owner
        const senderPhoneNumber = extractPhoneNumber(sender);
        const ownerNumbers = settings.ownerNumbers || [settings.ownerNumber];
        const isOwner = ownerNumbers.some(num => {
            const ownerPhone = extractPhoneNumber(num);
            return senderPhoneNumber === ownerPhone || sender === num;
        });

        // Allow owner to use in DMs, but restrict others to groups only
        if (!isGroup && !isOwner) {
            await sock.sendMessage(from, {
                text: '❌ This command only works in groups!'
            });
            return;
        }

        // Initialize global storage
        if (!global.wildPokemon) global.wildPokemon = new Map();

        // Check if Pokemon is already spawned in this group
        const existingSpawn = Array.from(global.wildPokemon.entries())
            .find(([key, pokemon]) => pokemon.groupId === from);

        if (existingSpawn) {
            global.wildPokemon.delete(existingSpawn[0]);
        }

        let targetPokemon = args.trim().toLowerCase();
        let isOwnerSpawn = false;

        // Check if owner wants to spawn specific Pokemon

        if (targetPokemon && isOwner && !isGroup) {
            // Owner can spawn specific Pokemon, but only in private DM
            isOwnerSpawn = true;
            if (!pokemonDatabase[targetPokemon]) {
                await sock.sendMessage(from, {
                    text: `❌ Pokemon "${targetPokemon}" not found!\n\n💡 Use .pokemonlist to see available Pokemon.`
                });
                return;
            }
        } else if (targetPokemon && isOwner && isGroup) {
            // Owner tried to spawn specific Pokemon in group
            await sock.sendMessage(from, {
                text: '❌ Specific Pokemon spawning only works in private DM!\n\n💬 Message me privately to spawn specific Pokemon.\n🎲 Using random spawn for group...'
            });
            // Fall back to random spawn in group
            targetPokemon = getRandomPokemon();
        } else if (targetPokemon && !isOwner) {
            await sock.sendMessage(from, {
                text: '❌ Only the bot owner can spawn specific Pokemon!\n\nUse .spawnpokemon without arguments to spawn random Pokemon.'
            });
            return;
        } else {
            // Random spawn for all users (groups) or when no specific Pokemon requested
            targetPokemon = getRandomPokemon();
        }

        const pokemonData = pokemonDatabase[targetPokemon];
        const spawnId = `${from}_${Date.now()}`;

        // Generate Pokemon stats
        const level = Math.floor(Math.random() * 12) + 19; // Level 19-30
        const baseHp = 100 + (level * 2);
        const hp = Math.floor(baseHp + (Math.random() * 50));

        const wildPokemon = {
            id: spawnId,
            name: pokemonData.name,
            type: pokemonData.type,
            rarity: pokemonData.rarity,
            level: level,
            hp: hp,
            maxHp: hp,
            image: pokemonData.image,
            groupId: from,
            spawnTime: Date.now(),
            spawner: isOwnerSpawn ? sender : 'wild'
        };

        // Store the spawned Pokemon
        global.wildPokemon.set(spawnId, wildPokemon);

        // Auto-remove after 5 minutes
        setTimeout(() => {
            if (global.wildPokemon.has(spawnId)) {
                global.wildPokemon.delete(spawnId);
                sock.sendMessage(from, {
                    text: `🌪️ The wild ${pokemonData.name} escaped into the wilderness!`
                });
            }
        }, 300000); // 5 minutes

        // Send spawn message with image
        const spawnMessage = isOwnerSpawn 
            ? `🎯 **OWNER SPAWN!**\n\n🎮 A wild **${pokemonData.name}** appeared!\n\n📊 **Details:**\n• **Type:** ${pokemonData.type}\n• **Rarity:** ${pokemonData.rarity}\n• **Level:** ${level}\n• **HP:** ${hp}\n\n⚡ **Quick! Use .catch ${pokemonData.name.toLowerCase()} to catch it!**\n\n⏰ **Disappears in 5 minutes!**`
            : `🌟 **WILD POKEMON APPEARED!**\n\n🎮 A wild **${pokemonData.name}** appeared!\n\n📊 **Details:**\n• **Type:** ${pokemonData.type}\n• **Rarity:** ${pokemonData.rarity}\n• **Level:** ${level}\n• **HP:** ${hp}\n\n⚡ **Use .catch ${pokemonData.name.toLowerCase()} to catch it!**\n\n⏰ **Disappears in 5 minutes!**`;

        await sock.sendMessage(from, {
            image: { url: pokemonData.image },
            caption: spawnMessage,
            contextInfo: {
                externalAdReply: {
                    title: `Wild ${pokemonData.name} - ${pokemonData.rarity}`,
                    body: `Level ${level} • ${pokemonData.type}`,
                    thumbnailUrl: pokemonData.image,
                    sourceUrl: 'https://github.com/horlapookie/WhisperRoyalty',
                    mediaType: 1
                }
            }
        });
    }
};