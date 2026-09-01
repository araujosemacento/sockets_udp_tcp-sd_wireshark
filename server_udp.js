const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (echo, rinfo) => {
    const res = `UDP: ${echo}`;
    console.log(res);
    server.send(res, rinfo.port, rinfo.address);
});

server.bind(3333, '127.0.0.1', () => {
    console.log('Servidor UDP rodando na porta 3333');
});
