const fs = require('fs');
const path = require('path');

/**
 * Converte um valor em Reais (BRL) pra uma moeda de destino com base no cache de cotações.
 * 
 * @param {string|Buffer} msg - Mensagem com o valor e a moeda (ex: "10 USD" ou "50 EUR").
 * @returns {string} Resultado formatado da conversão (ou mensagem de erro).
 */
function converter(msg) {
    // Lê o arquivo JSON com as cotações e grava o valor a ser convertido
    const jsonPath = path.join(__dirname, 'cotacoes.json');
    const { cotacoes } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const [valorStr, moeda] = msg.toString().trim().split(' ');
    const valor = parseFloat(valorStr);

    // Calcula a cotação pra moeda-alvo usando regra de três
    const taxaBRL = cotacoes['BRL'];
    const taxaDestino = moeda === 'USD' ? 1 : cotacoes[moeda];

    // Verifica se o valor é válido e se a moeda existe
    if (isNaN(valor) || !taxaDestino || !taxaBRL) return 'Valor ou moeda inválida';

    // Formata o resultado pra mostrar o valor convertido
    const convertido = ((valor / taxaBRL) * taxaDestino).toFixed(2);
    return `R$ ${valor.toFixed(2)} = ${convertido} ${moeda}`;
}

module.exports = converter;
