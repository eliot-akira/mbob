import path from 'path'
import { execSync } from 'child_process'
import { getBuildCommands, getServeCommand, replaceVars } from './config-util'
import runParallel from '../util/runParallel'
import build from './build'

export default function dev( config ) {

  var commands = getBuildCommands({ config, key: 'dev' })

  var serveCommand = getServeCommand( config )

  commands.push( serveCommand )

  if ( config.before ) execSync( replaceVars(config.before, config.vars) )

  build(config, () => runParallel( commands ))
}
