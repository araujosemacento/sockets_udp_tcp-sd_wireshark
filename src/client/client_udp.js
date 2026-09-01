const dgram = require('dgram');

const [,, valor = '10', moeda = 'USD'] = process.argv;

console.log(`[UDP] Solicitando conversão de R$ ${valor} para ${moeda}...`);

const client = dgram.createSocket('udp4');

client.send(`${valor} ${moeda}`, 3333, '127.0.0.1', (err) => {
    if (err) {
        console.error(`Erro enviando datagrama UDP: ${err.message}`);
        client.close();
    }
});

client.on('message', (msg) => {
    console.log(`Resposta: ${msg.toString()}`);
    client.close();
});

setTimeout(() => {
    console.log('Sem resposta do servidor.');
    client.close();
}, 1000);