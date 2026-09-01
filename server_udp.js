const dgram = require('dgram');
const converter = require('./conversor.js');

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    const res = `UDP: ${converter(msg)}`;
    console.log(res);
    server.send(res, rinfo.port, rinfo.address);
});

server.bind(3333, '127.0.0.1', () => {
    console.log('Servidor UDP rodando na porta 3333');
});
