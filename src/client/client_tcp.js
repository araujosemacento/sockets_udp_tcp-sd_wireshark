/**
 * @file client_tcp.js
 * @description CLI pro envio de mensagens via TCP.
 * 
 * Uso:
 *   node src/client/client_tcp.js <VALOR> <MOEDA>
 *   (ex: node src/client/client_tcp.js 100 USD)
 */

const net = require('net');

// Argumentos passados via terminal (padrão: 10 USD)
const [,, valor = '10', moeda = 'USD'] = process.argv;

console.log(`[TCP] Converte R$ ${valor} pra ${moeda}`);

/**
 * Conecta ao servidor TCP na porta 3030 e envia a requisição formatada.
 */
const client = net.connect(3030, '127.0.0.1', () => {
    client.write(`${valor} ${moeda}`);
});

/**
 * Recebe a resposta do servidor e fecha a conexão.
 */
client.on('data', (data) => {
    console.log(`Resposta: ${data.toString()}`);
    client.end();
});

/**
 * Encerra o cliente em caso de erro.
 */
client.on('error', (err) => {
    console.error(`Erro conectando ao servidor TCP: ${err.message}`);
    process.exit(1);
});
