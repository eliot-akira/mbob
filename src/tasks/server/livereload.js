import path from 'path'
import fs from 'fs'
import parseUrl from 'parseurl'
import { inherits } from 'util'
import { Server as WS  } from 'ws'
import { EventEmitter } from 'events'

const prefix = '/__lightserver__',
      clientJsPath = prefix + '/reload-client.js',
      triggerPath = prefix + '/trigger',
      triggerCSSPath = prefix + '/triggercss',
      loadClientJsPath = path.resolve(__dirname, 'reload-client.js')

let clientJsContent = fs.readFileSync(loadClientJsPath, 'utf8')
let emitter = new EventEmitter
let wss, wsArray = []

class LiveReload {

  constructor(options) {
    this.options = options
  }

  log(logLine) {
    this.options.verbose && console.log(logLine)
  }

  middleFunc(req, res, next) {

    let pathname = parseUrl(req).pathname

    if (pathname.indexOf(prefix) == -1) {
      next()
      return
    }

    if (req.method == 'GET' && pathname == clientJsPath) {
      res.writeHead(200)
      res.end(clientJsContent)
      return
    }

    if (pathname == triggerPath) {
      res.writeHead(200)
      res.end('ok')
      emitter.emit('reload')
      return
    }

    if (pathname == triggerCSSPath) {
      res.writeHead(200)
      res.end('ok')
      emitter.emit('reloadcss')
    }

    next()
  }

  startWS(server) {

    wss = new WS({ server })

    wss.on('connection', (ws) => {
      wsArray.push(ws)
      ws.on('close', function () {
        var index = wsArray.indexOf(ws)
        if (index > -1) {
          wsArray.splice(index, 1);
        }
      })
    })

    emitter.on('reload', () => {

      this.log('## send reload event via websocket to browser')

      for (let w of wsArray) {
        w.send(JSON.stringify({ r: Date.now().toString() }), (e) => {
          if (e) { console.log('websocket send error: ' + e) }
        })
      }
    })

    emitter.on('reloadcss', () => {

      this.log('## send reloadcss event via websocket to browser')

      for (let w of wsArray) {
        w.send(JSON.stringify({ rcss: Date.now().toString() }), (e) => {
          if (e) { console.log('websocket send error: ' + e) }
        })
      }
    })
  }

  triggerReload(delay) {
    if (delay) {
      this.log('delay reload for ' + delay + ' ms')
    }

    setTimeout(function () {
      emitter.emit('reload')
    }, delay)
  }

  triggerCSSReload(delay) {
    if (delay) {
      this.log('delay reloadcss for ' + delay + ' ms')
    }

    setTimeout(function () {
      emitter.emit('reloadcss')
    }, delay)
  }

  trigger(action, delay) {
    if (action === 'reloadcss') {
      this.triggerCSSReload(delay)
    } else {
      this.triggerReload(delay)
    }
  }
}

export default LiveReload
