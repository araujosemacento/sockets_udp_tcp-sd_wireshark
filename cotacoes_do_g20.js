const fs = require('fs');

const MOEDAS_G20 = [
    'ARS', 'AUD', 'BRL', 'CAD', 'CNY', 'EUR', 'GBP', 'IDR',
    'INR', 'JPY', 'KRW', 'MXN', 'RUB', 'SAR', 'TRY', 'ZAR'
];

async function atualizarCotacoes() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();

        const cotacoes = {};
        for (const code of MOEDAS_G20) {
            if (data.rates[code]) cotacoes[code] = data.rates[code];
        }

        fs.writeFileSync('cotacoes.json', JSON.stringify({
            atualizadoEm: data.time_last_update_utc,
            base: 'USD',
            cotacoes
        }, null, 2));

        console.log('Cotações salvas em cotacoes.json');
    } catch (err) {
        console.error('Sem conexão.');
    }
}

atualizarCotacoes();
