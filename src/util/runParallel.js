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

  for (let command of commands) {

    let origCommand = command

    if (process.platform != 'win32') command = 'exec '+command

    let child = spawn(sh, [ shFlag, command ], {
      cwd: process.cwd,
      env: process.env,
      //stdio: ['pipe', process.stdout]
      //stdio: ['pipe', 'pipe', 'pipe']
      stdio: 'inherit'
    })
    .on('close', childClose)

    //child.stdout.on('data', (data) => process.stdout.write(data))
/*
    child.stderr.on('data', (data) => {
console.log('HERE')
      let message = data.toString()
      try {
        console.error( JSON.parse( message ).formatted )
      } catch(e) {
        console.error(message)
      }
    })*/

    child.command = origCommand
    children.push(child)
  }

  // close all children on ctrl+c
  process.on('SIGINT', close)

  return
}


// called on close of a child process
function childClose (code) {

  code = code ? (code.code || code) : code

  if (code > 0) {
    console.error('Fail: ' + this.command)
  } else {
    log('Success: ' + this.command)
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
        log('Still running: ' + child.command)
    } else if (child.exitCode > 0) {
      completed++
      log('Errored: ' + child.command)
    } else {
      completed++
      log('Finished: ' + child.command)
    }
  }

  log('\n')

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

    log('Will close: ' + child.command)

    child.on('close', () => {
      closed++
      if (opened === closed) done( code )
    })
  }

  if (opened === closed) done(code)
//console.log('CLOSE')
}
