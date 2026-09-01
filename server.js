const http = require('http');
const fs = require('fs');
const net = require('net');
const dgram = require('dgram');

require('./server_tcp.js');
require('./server_udp.js');

http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');

    if (url.pathname === '/') {
        return res.end(fs.readFileSync('index.html'));
    }

    if (url.pathname === '/send') {
        const proto = url.searchParams.get('proto');
        const msg = url.searchParams.get('msg');

        switch (proto) {
            case 'tcp': {
                const client = net.connect(3030, '127.0.0.1', () => client.write(msg));
                client.on('data', data => { res.end(data); client.end(); });
                break;
            }
            case 'udp': {
                const client = dgram.createSocket('udp4');
                client.send(msg, 3333, '127.0.0.1');
                client.on('message', data => { res.end(data); client.close(); });
                break;
            }
            case 'tcp-null': {
                const client = net.connect(9999, '127.0.0.1', () => client.write(msg));
                client.on('data', data => { res.end(data); client.end(); });
                client.on('error', () => { res.end('Falha na conexão. Servidor TCP inalcançavel.'); });
                break;
            }
            case 'udp-null': {
                const client = dgram.createSocket('udp4');
                client.send(msg, 9999, '127.0.0.1');
                const timeout = setTimeout(() => { res.end('Falha na conexão. Servidor UDP sem resposta.'); client.close(); }, 2000);
                client.on('message', data => { clearTimeout(timeout); res.end(data); client.close(); });
                break;
            }
        }
    }
}).listen(3000, () => console.log('Servidor Web rodando em http://localhost:3000'));
