/**
 * @file server_tcp.js
 * @description Servidor Socket TCP (orientado à conexão) ouvindo na porta 3030.
 * Recebe o payload com o valor em BRL e moeda, processa a conversão e responde via stream TCP.
 */

const net = require('net');
const converter = require('../utils/conversor.js');

/**
 * Instância do servidor TCP.
 */
const server = net.createServer((socket) => {
    // Quando chega uma mensagem
    socket.on('data', (msg) => {
        // Formata e envia a resposta pro remetente
        const res = `TCP: ${converter(msg)}`;
        console.log(res);
        socket.write(res);
    });
});

// Inicia o servidor na porta 3030
server.listen(3030, '127.0.0.1', () => {
    console.log('Servidor TCP rodando na porta 3030');
});
