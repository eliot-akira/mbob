import fs from 'fs'
import glob from 'glob'
import { inherits } from 'util'
import { EventEmitter } from 'events'

class Watcher extends EventEmitter {

  constructor(files, interval) {

    super()

    this.interval = interval

    for (let file of files) {
      this.watch(file)
    }
  }

  watch(file) {

    file = file.trim()

    if (~file.indexOf('*')) {

      glob(file, {
        ignore: [
          '.git',
          '**/node_modules',
          '**/node_modules/**',
          '**/_*',
          '**/_*/**'
        ]
      }, (err, files) => {
        for (let file of files) {
          this.watch(file)
        }
      })

    } else {
      fs.watchFile(file, { interval: this.interval }, (curr) => {
        if (curr.isFile()) {
          this.emit('change', file)
        }
      })
    }
  }
}

//inherits(Watcher, EventEmitter)

export default Watcher
