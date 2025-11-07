const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  '/api': {
    target: 'http://localhost:8090',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '/acessebankapi/api' // Reescreve /api para /acessebankapi/api
    },
    onProxyReq: (proxyReq, req, res) => {
      const targetUrl = `http://localhost:8090/acessebankapi${req.url}`;
      console.log('[PROXY LOCAL] Requisição interceptada:', req.method, req.url);
      console.log('[PROXY LOCAL] Redirecionando para:', targetUrl);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('[PROXY LOCAL] Resposta recebida:', proxyRes.statusCode, req.url);
    },
    onError: (err, req, res) => {
      console.error('[PROXY LOCAL] Erro no proxy:', err.message);
      console.error('[PROXY LOCAL] Verifique se a API está rodando em http://localhost:8090');
    }
  }
};

