import Server from './index'
import program from 'commander'

export default function cli( argv = process.argv ) {

  function collect(val, memo) {
    memo.push(val)
    return memo
  }

  program //.version(require('../../package').version)
    .option('-s, --serve <directory>', 'serve the directory as static http')
    .option('-p, --port <port>', 'http server port, default 3000', parseInt)
    .option('-b, --bind <bind>', 'bind to a specific host, default 127.0.0.1')
    .option('-w, --watchexp <watch expression>', 'watch expression, repeatable', collect, [])
    .option('-i, --interval <watch inteval>', 'interval in ms of watching, default 500', parseInt)
    .option('-d, --delay <livereolad delay>', 'delay in ms before triggering live reload, default 0', parseInt)
    .option('-x, --proxy <upstreamurl>', 'when file not found, proxy the request to another server')
    .option('-v, --verbose', 'verbose mode with log messages')
    .on('--help', function () {
       console.log('  Examples:')
       console.log('')
       console.log('    -s . -p 7000')
       console.log('    -s . -w "*.js, src/** # npm run build && echo wow!"')
       console.log('    -s . -x http://localhost:8000')
       console.log('    -s . -b 10.0.0.1')
       console.log('    -x http://localhost:9999 -w "public/**"')
       console.log('    -s static -w "**/*.css # # reloadcss"')
       console.log('')
       console.log('  Watch expression syntax: "files[,files] # [command to run] # [reload action]"')
       console.log('    3 parts delimited by #')
       console.log('    1st part: files to watch, support glob format, delimited by ","')
       console.log('    2nd part: (optional) command to run, before reload')
       console.log('    3rd part: (optional) reload action, default is "reload", also support "reloadcss"')
       console.log('    Examples: ')
       console.log('      "**/*.js, index.html # npm run build # reload"')
       console.log('      "*.css # # reloadcss"')
       console.log('      "** # make"')
       console.log('')
     })

  if ( ! argv.length ) {
    process.argv.push('--help')
  }

  program.parse(argv)

  let options = {
    port: 3000,
    interval: 500,
    delay: 0,
    host: 'localhost',
    watchexps: [],
  }
/*
  if (program.config) {
    Object.assign(options, rc(program.config))
  }
*/

  // cli can override config file
  let cliOptions = {
    port: program.port,
    interval: program.interval,
    delay: program.delay,
    host: program.bind,
    serveDir: program.serve,
    watchexps: program.watchexp.length ? program.watchexp : undefined,
    proxy: program.proxy,
    verbose: program.verbose,
  }

  cliOptions = JSON.parse(JSON.stringify(cliOptions)) // remove undefined properties
  Object.assign(options, cliOptions)

  if (!options.serveDir && !options.watchexps.length && !options.proxy) {
    console.log('Please use http-server and/or watch and/or proxy, but not nothing.')
    process.exit(1)
  }

  new Server(options)
}
