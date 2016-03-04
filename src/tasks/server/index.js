import connect from 'connect'
import serveStatic from 'serve-static'
import http from 'http'
import injector from 'connect-injector'
import { spawn } from 'child_process'
import os from 'os'

import Proxy from './proxy'
import Watcher from './watcher'
import LiveReload from './livereload'

class Server {

  constructor( options ) {

    this.options = options

    if (os.type() === 'Windows_NT') {
      this.shell = 'cmd'
      this.firstParam = '/c'
    } else {
      this.shell = 'bash'
      this.firstParam = '-c'
    }

    this.start()
  }

  log(logLine) {
    this.options.verbose && console.log(logLine)
  }

  start() {

    if (!this.options.serveDir && !this.options.proxyUrl) {
      this.watch()
      return
    }

    let app = connect()

    this.livereload = new LiveReload({
      verbose: this.options.verbose,
    })

    app.use(this.livereload.middleFunc)

    app.use(injector(
      (req, res) => {
        return res.getHeader('content-type') && res.getHeader('content-type').indexOf('text/html') !== -1
      },
      (data, req, res, callback) => {
        callback(null, data.toString().replace('</body>', '<script src="/__lightserver__/reload-client.js"></script></body>'))
      })
    )

    if (this.options.serveDir) {
      app.use(serveStatic(this.options.serveDir))
    }

    if (this.options.proxyUrl) {
      let p = new Proxy(this.options.proxyUrl)
      app.use(p.middleFunc)
    }

    let server = http.createServer(app)

    server.listen(this.options.port, this.options.host, () => {

      console.log('Listening at http://'  + this.options.host + ':' + this.options.port)

      if (this.options.serveDir) {
        this.log('  serving static dir: ' + this.options.serveDir)
      }

      if (this.options.proxyUrl) {
        this.log('  when static file not found, proxy to ' + this.options.proxyUrl)
      }

      this.log('')
      this.livereload.startWS(server) // websocket shares same port with http
      this.watch()

    }).on('error', (err) => {

      if (err.errno === 'EADDRINUSE') {
        console.log('## ERROR: port ' + this.options.port + ' is already in use')
        process.exit(2)
      } else {
        console.log(err)
      }
    })
  }

  watch() {

    for (let we of this.options.watchexps) {

      let tokens = we.trim().split(/\s*#\s*/)
      let filesToWatch = tokens[0].trim().split(/\s*,\s*/)
      let commandToRun = tokens[1]
      let reloadOption = tokens[2]

      if (reloadOption !== 'reloadcss') {
        reloadOption = 'reload' // default value
      }

      this.processWatchExp(filesToWatch, commandToRun, reloadOption)
    }
  }

  processWatchExp(filesToWatch, commandToRun, reloadOption) {

    let watcher = new Watcher(filesToWatch, this.options.interval)

    watcher.on('change', (f) => {

      if (watcher.executing) return

      watcher.executing = true

      this.log('* file: ' + f + ' changed')

      if (!commandToRun) {

        if (this.livereload) {
          this.livereload.trigger(reloadOption, this.options.delay)
        }

        watcher.executing = false
        return
      }

      this.log('## executing command: ' + commandToRun)

      let start = new Date().getTime()
      let p = spawn(this.shell, [this.firstParam, commandToRun], { stdio: 'inherit' })

      p.on('close', (code) => {
        if (code !== 0) {
          console.log('## ERROR: command ' + commandToRun + ' exited with code ' + code)
        } else {
          this.log('## command succeeded in ' + (new Date().getTime() - start) + 'ms')
          if (this.livereload) {
            this.livereload.trigger(reloadOption, this.options.delay)
          }
        }

        watcher.executing = false
      })
    })

    if (filesToWatch.length) {
      this.log('light-server is watching these files: ' + filesToWatch.join(', '))
      this.log('  when file changes,')
      if (commandToRun) {
        this.log('  this command will be executed:      ' + commandToRun)
      }

      this.log('  this event will be sent to browser: ' + reloadOption + '\n')
    }
  }
}

export default Server
