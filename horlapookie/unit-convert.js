
export const command = {
    name: 'convert',
    aliases: ['unit', 'converter'],
    description: 'Convert between different units',
    usage: 'convert <value> <from_unit> to <to_unit>',
    category: 'utility',
    cooldown: 3,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (!args.trim()) {
            await sock.sendMessage(from, {
                text: '❌ Please provide conversion details!\n\nExamples:\n.convert 100 celsius to fahrenheit\n.convert 5 feet to meters\n.convert 10 kg to pounds\n\nSupported: temperature, length, weight, volume'
            });
            return;
        }
        
        const input = args.trim().toLowerCase();
        const parts = input.split(' to ');
        
        if (parts.length !== 2) {
            await sock.sendMessage(from, {
                text: '❌ Please use format: value unit to unit'
            });
            return;
        }
        
        const fromParts = parts[0].trim().split(' ');
        const value = parseFloat(fromParts[0]);
        const fromUnit = fromParts.slice(1).join(' ');
        const toUnit = parts[1].trim();
        
        if (isNaN(value)) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a valid number!'
            });
            return;
        }
        
        try {
            // Sample conversions
            const conversions = {
                'celsius fahrenheit': (c) => (c * 9/5) + 32,
                'fahrenheit celsius': (f) => (f - 32) * 5/9,
                'feet meters': (ft) => ft * 0.3048,
                'meters feet': (m) => m * 3.28084,
                'kg pounds': (kg) => kg * 2.20462,
                'pounds kg': (lbs) => lbs * 0.453592,
                'inches cm': (inch) => inch * 2.54,
                'cm inches': (cm) => cm * 0.393701
            };
            
            const conversionKey = `${fromUnit} ${toUnit}`;
            const converter = conversions[conversionKey];
            
            if (!converter) {
                await sock.sendMessage(from, {
                    text: '❌ Conversion not supported! Available conversions:\n• Temperature: celsius ↔ fahrenheit\n• Length: feet ↔ meters, inches ↔ cm\n• Weight: kg ↔ pounds'
                });
                return;
            }
            
            const result = converter(value);
            
            const conversionResult = `🔄 **Unit Conversion**

**Original:** ${value} ${fromUnit}
**Converted:** ${result.toFixed(4)} ${toUnit}

**Conversion Factor:**
${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}

**Formula Used:** Standard conversion formula
**Precision:** 4 decimal places

💡 **Tip:** Use .convert help for more conversion options.`;

            await sock.sendMessage(from, {
                text: conversionResult
            });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to convert units!'
            });
        }
    }
};
