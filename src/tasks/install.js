import { localExecSync } from './config-util'
import { getRequires } from './config-util'

export default function install( config ) {

  let requires = getRequires({ config })

  if ( ! requires.length ) return

  let command = 'npm install --save-dev '+requires.join(' ')

  console.log(command)

  localExecSync({ config, command })
}
