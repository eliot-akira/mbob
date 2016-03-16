import { localExecSync } from './config-util'

export default function test( config ) {

  // TODO: Support multiple entries

  let command

  if ( config.test ) command = config.test.run
  else if ( config.build.test ) command = config.build.test.build

  if ( ! command  ) return

  console.log(command)

  localExecSync({ config, command, options: { silent: true } })
}
