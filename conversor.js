const fs = require('fs');

function converter(msg) {
    const { cotacoes } = JSON.parse(fs.readFileSync('cotacoes.json', 'utf8'));
    const [valorStr, moeda] = msg.toString().trim().split(' ');
    const valor = parseFloat(valorStr);

    const taxaBRL = cotacoes['BRL'];
    const taxaDestino = moeda === 'USD' ? 1 : cotacoes[moeda];

    if (isNaN(valor) || !taxaDestino || !taxaBRL) return 'Valor ou moeda inválida';

    const convertido = ((valor / taxaBRL) * taxaDestino).toFixed(2);
    return `R$ ${valor.toFixed(2)} = ${convertido} ${moeda}`;
}

module.exports = converter;
