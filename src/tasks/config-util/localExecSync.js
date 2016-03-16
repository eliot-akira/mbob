import { execSync } from 'child_process'
import replaceVars from './replaceVars'

export default function localExecSync({ config, command, options }) {

  command = replaceVars( command, config.vars )

//console.log(command)

  options = Object.assign({ stdio: 'inherit' }, options)

  if ( options.silent ) {
    try {
      execSync( command, options )
    } catch (e) {}
  } else execSync( command, options )
}
