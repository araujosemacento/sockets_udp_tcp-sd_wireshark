/**
 * @file cotacoes_do_g20.js
 * @description Requisição à API pública ExchangeRate-API pra obter as taxas de câmbio atualizadas das moedas dos países do G20 e salvar em cotacoes.json
 */

const fs = require('fs');
const path = require('path');

/** Lista de códigos ISO das moedas dos países no G20 */
const MOEDAS_G20 = [
    'ARS', 'AUD', 'BRL', 'CAD', 'CNY', 'EUR', 'GBP', 'IDR',
    'INR', 'JPY', 'KRW', 'MXN', 'RUB', 'SAR', 'TRY', 'ZAR'
];

/**
 * Consulta a API de taxas de câmbio e atualiza o arquivo local cotacoes.json.
 * Caso haja falha de conexão, preserva o cache existente sem interromper a aplicação.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function atualizarCotacoes() {
    try {
        // Busca as taxas de câmbio do Dólar Americano
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();

        // Pega somente as moedas do G20
        const cotacoes = {};
        for (const code of MOEDAS_G20) {
            if (data.rates[code]) cotacoes[code] = data.rates[code];
        }

        // Salva as cotações em um arquivo json
        const jsonPath = path.join(__dirname, 'cotacoes.json');
        fs.writeFileSync(jsonPath, JSON.stringify({
            atualizadoEm: data.time_last_update_utc,
            base: 'USD',
            cotacoes
        }, null, 2));

        console.log('Cotações salvas em cotacoes.json');
    } catch (err) {
        // Se der erro, mostra uma mensagem mas continua a execução
        console.error('Sem conexão. Mantendo dados do cache local.');
    }
}

atualizarCotacoes();
