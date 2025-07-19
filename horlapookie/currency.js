import axios from 'axios';

export const command = {
    name: 'currency',
    aliases: ['convert'],
    description: 'Convert currency amount',
    usage: 'currency <amount> <from> <to>',
    category: 'utility',
    cooldown: 2,

    async execute(sock, msg, args, context) {
        const { from } = context;

        if (args.length < 3) {
            await sock.sendMessage(from, {
                text: '💸 Usage: .currency <amount> <from> <to>\nExample: `.currency 100 USD NGN`',
                quoted: msg
            });
            return;
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();

        if (isNaN(amount)) {
            await sock.sendMessage(from, {
                text: '❌ Please provide a valid numeric amount.',
                quoted: msg
            });
            return;
        }

        try {
            const res = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`);
            const rates = res.data[fromCurrency.toLowerCase()];
            const rate = rates[toCurrency.toLowerCase()];

            if (!rate) {
                await sock.sendMessage(from, {
                    text: `❌ Currency "${toCurrency}" not found!`,
                    quoted: msg
                });
                return;
            }

            const result = (amount * rate).toFixed(2);

            await sock.sendMessage(from, {
                text: `💱 *Currency Conversion*\n\n${amount} ${fromCurrency} = ${result} ${toCurrency}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Currency Converter',
                        body: 'Powered by YourHighness Bot 👑',
                        thumbnailUrl: 'https://picsum.photos/300?random=8',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            }, { quoted: msg });

        } catch (error) {
            await sock.sendMessage(from, {
                text: '❌ Failed to fetch conversion rate. Try again later.',
                quoted: msg
            });
        }
    }
};
