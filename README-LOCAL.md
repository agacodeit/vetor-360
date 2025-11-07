# Como rodar a aplicação com API Local

## Pré-requisitos
- Certifique-se de que sua API local está rodando em `http://localhost:8090`

## Como usar

### 1. Iniciar a aplicação com API local

Execute o seguinte comando:

```bash
npm run start:local
```

### 2. O que acontece

- A aplicação Angular será iniciada normalmente (geralmente em `http://localhost:4200`)
- Todas as requisições para `/api/v1/*` serão redirecionadas para `http://localhost:8090/acessebankapi/api/v1/*`
- O proxy está configurado no arquivo `proxy.conf.local.js`

### 3. Scripts disponíveis

- `npm run start` - Inicia com API de desenvolvimento (homologação)
- `npm run start:local` - Inicia com API local (localhost:8090)
- `npm run start:no-proxy` - Inicia sem proxy

### 4. Verificar logs

No console, você verá logs do proxy indicando:
- Requisições interceptadas
- URLs de redirecionamento
- Respostas recebidas
- Erros (se houver)

### 5. Troubleshooting

Se você encontrar erros de conexão:

1. Verifique se a API está rodando: `http://localhost:8090/acessebankapi/api/v1`
2. Verifique se a porta 8090 não está sendo usada por outro processo
3. Verifique os logs do console para ver as requisições sendo feitas

