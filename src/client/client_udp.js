/**
 * @file client_udp.js
 * @description CLI pro envio de mensagens via UDP.
 * 
 * Uso:
 *   node src/client/client_udp.js <VALOR> <MOEDA>
 *   (ex: node src/client/client_udp.js 50 EUR)
 */

const dgram = require('dgram');

// Argumentos passados via terminal (padrão: 10 USD)
const [,, valor = '10', moeda = 'USD'] = process.argv;

console.log(`Convertendo R$ ${valor} pra ${moeda}`);

const client = dgram.createSocket('udp4');

/**
 * Envia o datagrama com a mensagem pra porta 3333.
 */
client.send(`${valor} ${moeda}`, 3333, '127.0.0.1', (err) => {
    if (err) {
        // Exibe erro caso ocorra
        console.error(`Erro enviando datagrama UDP: ${err.message}`);
        client.close();
    }
});

/**
 * Recebe a resposta do servidor e encerra a conexão.
 */
client.on('message', (msg) => {
    console.log(`Resposta: ${msg.toString()}`);
    client.close();
});

// Timeout caso o servidor não responda dentro de 1 segundo
setTimeout(() => {
    console.log('Sem resposta do servidor.');
    client.close();
}, 1000);