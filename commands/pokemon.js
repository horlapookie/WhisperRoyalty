
import axios from 'axios';

export const command = {
    name: 'pokemon',
    aliases: ['poke', 'pokemoninfo'],
    description: 'Get detailed Pokemon information with images and stats',
    usage: 'pokemon <pokemon_name>',
    category: 'games',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a Pokemon name!\n\nExample: .pokemon pikachu\n\n💡 You can also search by Pokemon ID number!'
            });
            return;
        }
        
        try {
            const pokemon = args.trim().toLowerCase();
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            const speciesResponse = await axios.get(response.data.species.url);
            const data = response.data;
            const speciesData = speciesResponse.data;
            
            // Get Pokemon details
            const types = data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(' / ');
            const abilities = data.abilities.map(a => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)).join(', ');
            const stats = data.stats.map(s => `${s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1)}: ${s.base_stat}`).join('\n• ');
            
            // Get description
            const description = speciesData.flavor_text_entries
                .find(entry => entry.language.name === 'en')?.flavor_text
                .replace(/\f/g, ' ') || 'No description available.';
            
            // Evolution chain info
            let evolutionInfo = '';
            if (speciesData.evolution_chain) {
                try {
                    const evolutionResponse = await axios.get(speciesData.evolution_chain.url);
                    const evolutionChain = getEvolutionChain(evolutionResponse.data.chain);
                    evolutionInfo = evolutionChain.length > 1 ? `\n\n🔄 **Evolution Chain:**\n${evolutionChain.join(' → ')}` : '';
                } catch (error) {
                    evolutionInfo = '';
                }
            }
            
            // Habitat and generation
            const habitat = speciesData.habitat ? speciesData.habitat.name.charAt(0).toUpperCase() + speciesData.habitat.name.slice(1) : 'Unknown';
            const generation = speciesData.generation.name.toUpperCase().replace('-', ' ');
            
            // Capture rate
            const captureRate = speciesData.capture_rate;
            const capturePercent = ((captureRate / 255) * 100).toFixed(1);
            
            await sock.sendMessage(from, {
                text: `🔥 **${data.name.charAt(0).toUpperCase() + data.name.slice(1)} Information**\n\n**Basic Info:**\n• **Pokedex ID:** #${data.id.toString().padStart(3, '0')}\n• **Height:** ${data.height/10}m\n• **Weight:** ${data.weight/10}kg\n• **Type:** ${types}\n• **Generation:** ${generation}\n• **Habitat:** ${habitat}\n\n**Description:**\n${description}\n\n**Abilities:**\n${abilities}\n\n**Base Stats:**\n• ${stats}\n• **Total:** ${data.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}\n\n**Game Info:**\n• **Base Experience:** ${data.base_experience}\n• **Capture Rate:** ${captureRate}/255 (${capturePercent}%)\n• **Base Happiness:** ${speciesData.base_happiness}${evolutionInfo}\n\n🎮 Use .spawnpokemon to find wild Pokemon!\n⚔️ Use .pvp challenge @user for battles!`,
                contextInfo: {
                    externalAdReply: {
                        title: `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} - Pokemon Info`,
                        body: `#${data.id} • ${types} • ${habitat} Pokemon`,
                        thumbnailUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                        sourceUrl: 'https://pokeapi.co',
                        mediaType: 1
                    }
                }
            });
            
            // Send additional images if available
            const images = [];
            if (data.sprites.other['official-artwork'].front_default) {
                images.push(data.sprites.other['official-artwork'].front_default);
            }
            if (data.sprites.other['home'].front_default) {
                images.push(data.sprites.other['home'].front_default);
            }
            
            if (images.length > 0) {
                for (const imageUrl of images.slice(0, 2)) {
                    try {
                        await sock.sendMessage(from, {
                            image: { url: imageUrl },
                            caption: `📸 ${data.name.charAt(0).toUpperCase() + data.name.slice(1)} - Official Artwork`
                        });
                    } catch (error) {
                        console.log('Failed to send image:', error);
                    }
                }
            }
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Pokemon not found! Please check the spelling or try a different name.\n\n💡 Examples: pikachu, charizard, mewtwo'
            });
        }
        
        function getEvolutionChain(chain) {
            const evolutionNames = [];
            let current = chain;
            
            while (current) {
                evolutionNames.push(current.species.name.charAt(0).toUpperCase() + current.species.name.slice(1));
                current = current.evolves_to[0];
            }
            
            return evolutionNames;
        }
    }
};
