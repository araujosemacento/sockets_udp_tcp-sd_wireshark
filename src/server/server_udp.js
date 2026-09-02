/**
 * @file server_udp.js
 * @description Servidor Socket UDP ouvindo na porta 3333.
 * Recebe datagramas com o valor em BRL e moeda, processa a conversão e responde ao endereço e porta do remetente.
 */

const dgram = require('dgram');
const converter = require('../utils/conversor.js');

/**
 * Socket UDP (datagrama IPv4).
 */
const server = dgram.createSocket('udp4');

// Quando chega uma mensagem
server.on('message', (msg, rinfo) => {
    // Formata e envia a resposta pro remetente
    const res = `UDP: ${converter(msg)}`;
    console.log(res);
    server.send(res, rinfo.port, rinfo.address);
});

// Inicia o servidor na porta 3333
server.bind(3333, '127.0.0.1', () => {
    console.log('Servidor UDP rodando na porta 3333');
});
