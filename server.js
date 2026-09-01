const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const dgram = require('dgram');

require('./src/utils/cotacoes_do_g20.js');
require('./src/server/server_tcp.js');
require('./src/server/server_udp.js');

const HTML_PATH = path.join(__dirname, 'src', 'client', 'index.html');

http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');

    if (url.pathname === '/') {
        return res.end(fs.readFileSync(HTML_PATH));
    }

    if (url.pathname === '/send') {
        const proto = url.searchParams.get('proto');
        const msg = url.searchParams.get('msg');
        const off = url.searchParams.get('off') === 'true';

        if (proto === 'tcp') {
            const port = off ? 9999 : 3030;
            const client = net.connect(port, '127.0.0.1', () => client.write(msg));

            client.on('data', data => { res.end(data); client.end(); });
            client.on('error', () => res.end('Falha na conexão. Servidor TCP inalcançavel.'));
        } else {
            const port = off ? 9999 : 3333;
            const client = dgram.createSocket('udp4');
            client.send(msg, port, '127.0.0.1');

            const timeout = setTimeout(() => {
                res.end('Falha na conexão. Servidor UDP sem resposta.');
                client.close();
            }, 2000);

            client.on('message', data => {
                clearTimeout(timeout);
                res.end(data);
                client.close();
            });
        }
    }
}).listen(3000, () => console.log('Servidor Web rodando em http://localhost:3000'));
