const net = require('net');

const [,, valor = '10', moeda = 'USD'] = process.argv;

console.log(`[TCP] Converte R$ ${valor} pra ${moeda}`);

const client = net.connect(3030, '127.0.0.1', () => {
    client.write(`${valor} ${moeda}`);
});

client.on('data', (data) => {
    console.log(`Resposta: ${data.toString()}`);
    client.end();
});

client.on('error', (err) => {
    console.error(`Erro conectando ao servidor TCP: ${err.message}`);
    process.exit(1);
});
