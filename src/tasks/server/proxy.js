import httpProxy from 'http-proxy'

class Proxy {

  constructor() {
    this.proxyUrl = url
    this.proxy = httpProxy.createProxyServer({ changeOrigin: true })
  }

  middleFunc(req, res, next) {
    this.proxy.web(req, res, { target: this.proxyUrl })
  }
}

export default Proxy
