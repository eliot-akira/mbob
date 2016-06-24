import getBuildCommands from './getBuildCommands'
import replaceVars from './replaceVars'

export default function getServeCommand( config ) {

  let { serve, vars } = config

  if (!serve) return

  let { reload, reloadCSS, port } = serve

  let serveCommand = config.getLocalPath( 'bin/mbob' )

  serveCommand +=
      ' -s ' + (serve.from ? replaceVars( serve.from, vars ) : '.')
      +' -p ' + ( port || '3000' )

  if (reload) {

    if (Array.isArray(reload)) reload = reload.join(',')

    serveCommand += ' -w "'+( replaceVars(reload, vars) )+'"'
  }

  if (reloadCSS) {

    if (Array.isArray(reloadCSS)) reloadCSS = reloadCSS.join(',')

    serveCommand += ' -w "'+( replaceVars(reloadCSS, vars) )+' # # reloadcss"'
  }


  let watches = getBuildCommands({ config, key: 'watch' })

  for (var taskName in watches) {

    for (let w of watches[ taskName ]) {

      if ( Array.isArray(w.watch) ) w.watch = w.watch.join(', ')
      if ( Array.isArray(w.run) ) w.run = w.run.join(' && ')

      serveCommand += ' -w "' + w.watch + ' # ' + w.run
        + ( taskName === 'css' ? ' # reloadcss' : '')
        + '"'
    }
  }

  return serveCommand
}
