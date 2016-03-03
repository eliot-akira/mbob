import path from 'path'
import { spawn } from 'child_process'

let sh, shFlag,
    verbose = false,
    wait,
    children = [],
    done

let log = ( ...args ) => verbose && console.log(...args)

if (process.platform === 'win32') {
  sh = 'cmd'
  shFlag = '/c'
} else {
  sh = 'sh'
  shFlag = '-c'
}

export default function runParallel( commands, callback ) {

  if ( ! Array.isArray( commands ) ) commands = [commands]

  if ( callback ) done = callback
  else done = ( code ) => process.exit(code)

//console.log('runParallel', commands)

  for (let command of commands) {

    if (process.platform != 'win32') command = 'exec '+command

    let child = spawn(sh, [ shFlag, command ], {
      cwd: process.cwd,
      env: process.env,
      stdio: callback ? [] : ['pipe', process.stdout, process.stderr]
    })
    .on('close', childClose)

    child.command = command
    children.push(child)
  }

  // close all children on ctrl+c
  process.on('SIGINT', close)

  return
}


// called on close of a child process
function childClose (code) {

  code = code ? (code.code || code) : code

  if (verbose) {
    if (code > 0) {
      console.error('`' + this.cmd + '` failed with exit code ' + code)
    } else {
      log('`' + this.cmd + '` ended successfully')
    }
  }

  if (code > 0 && !wait) close(code)
  status()
}


function status() {

  let len = children.length,
      completed = 0

  log('\n### Status ###')

  for (let child of children) {

    if (child.exitCode === null) {
        log('`' + child.command + '` is still running')
    } else if (child.exitCode > 0) {
      completed++
      log('`' + child.command + '` errored')
    } else {
      completed++
      log('`' + child.command + '` finished')
    }
  }

  verbose && console.log('\n')

  if ( completed === len ) done()
}


// close all children and the process
function close (code) {

  var i, len, closed = 0, opened = 0

  for (let child of children) {

    if ( child.exitCode ) continue

    opened++

    child.removeAllListeners('close')
    child.kill("SIGINT")

    log('`' + child.command + '` will now be closed')

    child.on('close', () => {
      closed++
      if (opened === closed) done( code )
    })
  }

  if (opened === closed) done(code)
//console.log('CLOSE')
}
