const net = require('net');
const converter = require('../utils/conversor.js');

const server = net.createServer((socket) => {
    socket.on('data', (msg) => {
        const res = `TCP: ${converter(msg)}`;
        console.log(res);
        socket.write(res);
    });
});

server.listen(3030, '127.0.0.1', () => {
    console.log('Servidor TCP rodando na porta 3030');
});
