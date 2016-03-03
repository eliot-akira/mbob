import { execSync } from 'child_process'
import { getBuildCommands, replaceVars } from './config-util'
import runParallel from '../util/runParallel'

export default function build( config, callback ) {

  let commands = getBuildCommands({ config })

  if ( config.before ) execSync( replaceVars(config.before, config.vars) )

  runParallel( commands, callback )
}
