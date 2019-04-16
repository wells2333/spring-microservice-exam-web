
// 网关地址
const baseUrl = 'http://127.0.0.1:8000';

// 转发配置
module.exports = {
  proxyList: {
    '/api': {
      target: baseUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  }
}
