
var path = require('path')
var fs = require('fs')

var parseUrl = require('parseurl')
var inherits = require('util').inherits
var WS = require('ws').Server
var EventEmitter = require('events').EventEmitter
var prefix = '/__lightserver__'
var clientJsPath = prefix + '/reload-client.js'
var triggerPath = prefix + '/trigger'
var triggerCSSPath = prefix + '/triggercss'

var loadClientJsPath = path.resolve(__dirname, 'reload-client.js')
var clientJsContent = fs.readFileSync(loadClientJsPath, 'utf8')

var emitter = new EventEmitter
var wss
var wsArray = []

function Livereload(options) {
  if (!(this instanceof Livereload)) return new Livereload(options)
  this.options = options
}

Livereload.prototype.writeLog = function (logLine) {
  this.options.verbose && console.log(logLine)
}

Livereload.prototype.middleFunc = function livereload(req, res, next) {
  var pathname = parseUrl(req).pathname
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

Livereload.prototype.startWS = function (server) {
  var _this = this
  wss = new WS({ server: server })

  wss.on('connection', function (ws) {
    wsArray.push(ws)
    ws.on('close', function () {
      var index = wsArray.indexOf(ws)
      if (index > -1) {
        wsArray.splice(index, 1);
      }
    })
  })

  emitter.on('reload', function () {
    _this.writeLog('## send reload event via websocket to browser')
    wsArray.forEach(function (w) {
      w.send(JSON.stringify({ r: Date.now().toString() }), function (e) {
        if (e) { console.log('websocket send error: ' + e) }
      })
    })
  })

  emitter.on('reloadcss', function () {
    _this.writeLog('## send reloadcss event via websocket to browser')
    wsArray.forEach(function (w) {
      w.send(JSON.stringify({ rcss: Date.now().toString() }), function (e) {
        if (e) { console.log('websocket send error: ' + e) }
      })
    })
  })
}

Livereload.prototype.triggerReload = function (delay) {
  if (delay) {
    this.writeLog('delay reload for ' + delay + ' ms')
  }

  setTimeout(function () {
    emitter.emit('reload')
  }, delay)
}

Livereload.prototype.triggerCSSReload = function (delay) {
  if (delay) {
    this.writeLog('delay reloadcss for ' + delay + ' ms')
  }

  setTimeout(function () {
    emitter.emit('reloadcss')
  }, delay)
}

Livereload.prototype.trigger = function (action, delay) {
  if (action === 'reloadcss') {
    this.triggerCSSReload(delay)
  } else {
    this.triggerReload(delay)
  }
}

module.exports = Livereload
