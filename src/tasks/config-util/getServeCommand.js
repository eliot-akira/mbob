import getBuildCommands from './getBuildCommands'
import replaceVars from './replaceVars'

export default function getServeCommand( config ) {

  let { serve, vars } = config

  let { reload, port } = serve

  let serveCommand = config.getLocalPath( 'bin/server' )
      + ' -s ' + (serve.from ? replaceVars( serve.from, vars ) : '.')
      +' -p ' + ( port || '3000' )

  if (reload) {

    if (Array.isArray(reload)) reload = reload.join(',')

    serveCommand += ' -w "'+( replaceVars(reload, vars) )+'"'
  }

  let watches = getBuildCommands({ config, key: 'watch' })

  for (var taskName in watches) {

    for (let w of watches[ taskName ]) {

      if ( Array.isArray(w.watch) ) w.watch = w.watch.join(' ')

      serveCommand += ' -w "' + w.watch + ' # ' + w.run
        + ( taskName === 'css' ? ' # reloadcss' : '')
        + '"'
    }
  }

  return serveCommand
}
