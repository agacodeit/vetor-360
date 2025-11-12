const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  '/api': {
    target: 'https://homolog.vetorsolucoesfinanceiras.com.br/acessebankapi',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
      console.log('[PROXY] Requisição interceptada:', req.method, req.url);
    }
  }
};