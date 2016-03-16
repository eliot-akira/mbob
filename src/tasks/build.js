import { getBuildCommands, localExecSync, replaceVars } from './config-util'
import runParallel from '../util/runParallel'

export default function build( config, callback ) {

  let commands = getBuildCommands({ config })

  if ( config.before ) {
    localExecSync({ config, command: config.before })
  }

  runParallel( commands, callback )
}
