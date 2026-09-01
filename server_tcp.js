const net = require('net');

const server = net.createServer((socket) => {
    socket.on('data', (echo) => socket.write(`TCP: ${echo}`));
});

server.listen(3030, '127.0.0.1', () => {
    console.log('Servidor TCP rodando na porta 3030');
});
