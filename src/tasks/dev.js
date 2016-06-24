import path from 'path'
import { localExecSync } from './config-util'
import { getBuildCommands, getServeCommand, replaceVars } from './config-util'
import runParallel from '../util/runParallel'
import build from './build'

export default function dev( config ) {

  let commands = getBuildCommands({ config, key: 'dev' })

  let serveCommand = getServeCommand( config )

  if (serveCommand) commands.push( serveCommand )

  if ( config.before ) {
    localExecSync({ config, command: config.before })
  }

  build(config, () => runParallel( commands ))
}
