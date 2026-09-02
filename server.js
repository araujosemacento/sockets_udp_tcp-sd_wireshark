/**
 * @file server.js
 * @description Ponto de entrada da aplicação. Inicializa os servidores TCP/UDP em background
 * e sobe um servidor Web HTTP (porta 3000) que serve a interface e atua como proxy pros sockets.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const dgram = require('dgram');

// Inicializa a atualização de cotações e os servidores TCP/UDP
require('./src/utils/cotacoes_do_g20.js');
require('./src/server/server_tcp.js');
require('./src/server/server_udp.js');

const HTML_PATH = path.join(__dirname, 'src', 'client', 'index.html');

/**
 * Servidor HTTP que atende a interface Web e encaminha mensagens para os sockets TCP/UDP.
 */
http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');

    // Rota da interface Web
    if (url.pathname === '/') {
        return res.end(fs.readFileSync(HTML_PATH));
    }

    // Rota de envio de mensagens para os sockets
    if (url.pathname === '/send') {
        const proto = url.searchParams.get('proto');
        const msg = url.searchParams.get('msg');
        const off = url.searchParams.get('off') === 'true';

        if (proto === 'tcp') {
            // Porta 9999 simula servidor inacessível para fins de teste no Wireshark
            const port = off ? 9999 : 3030;
            const client = net.connect(port, '127.0.0.1', () => client.write(msg));

            // Quando chega a resposta, envia de volta e encerra a conexão
            client.on('data', data => { res.end(data); client.end(); });
            // Se der erro, mostra uma mensagem e encerra a conexão
            client.on('error', () => res.end('Falha na conexão. Servidor TCP inalcançavel.'));
        } else {
            // Socket UDP
            const port = off ? 9999 : 3333;
            const client = dgram.createSocket('udp4');
            client.send(msg, port, '127.0.0.1');

            // Define um timeout de 1 segundo para esperar a resposta
            const timeout = setTimeout(() => {
                res.end('Falha na conexão. Servidor UDP sem resposta.');
                client.close();
            }, 1000);

            // Quando chega a resposta
            client.on('message', data => {
                // Limpa o timeout
                clearTimeout(timeout);
                // Envia a resposta
                res.end(data);
                // Fecha a conexão
                client.close();
            });
        }
    }
}).listen(3000, () => console.log('Servidor Web rodando em http://localhost:3000'));
