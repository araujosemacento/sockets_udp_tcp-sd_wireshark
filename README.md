# sockets_udp_tcp-sd_wireshark

Conversor de moedas utilizando sockets TCP e UDP pra análise de rede com Wireshark.

---

## Arquitetura

```mermaid
flowchart TD
    subgraph Clientes
        CLI_TCP["client_tcp.js (CLI)"]
        CLI_UDP["client_udp.js (CLI)"]
        WEB["index.html (Navegador)"]
    end

    subgraph Entrada
        SERVER["server.js (Porta 3000)"]
    end

    subgraph Sockets
        TCP["server_tcp.js (Porta 3030)"]
        UDP["server_udp.js (Porta 3333)"]
    end

    subgraph Dados
        CONV["conversor.js"]
        JSON[("cotacoes.json")]
        API["cotacoes_do_g20.js"]
    end

    API -.->|"Atualiza"| JSON
    WEB -->|"HTTP GET /send"| SERVER
    SERVER -->|"TCP Socket"| TCP
    SERVER -->|"UDP Socket"| UDP

    CLI_TCP -->|"TCP Socket"| TCP
    CLI_UDP -->|"UDP Datagrama"| UDP

    TCP -->|"Calcula"| CONV
    UDP -->|"Calcula"| CONV
    CONV -->|"Lê taxas"| JSON
```

<span style="color:red">Esse diagram foi feito usando inteligência artificial.</span>

---

## Execução

### 1. Iniciar servidores (TCP, UDP e Web)
```bash
node run server.js
# ou: node start
```
- Interface Web: `http://localhost:3000`
- Servidor TCP: `127.0.0.1:3030`
- Servidor UDP: `127.0.0.1:3333`

### 2. Usar clientes CLI
Em outro terminal, com o servidor ativo:

```bash
bun run src/client/client_tcp.js 10 USD

bun run src/client/client_udp.js 50 EUR
```

---

## Filtros no Wireshark

- **TCP**: `tcp.port == 3030`
- **UDP**: `udp.port == 3333`
