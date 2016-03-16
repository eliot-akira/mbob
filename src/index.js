import fs from 'fs'
import getAction from './getAction'
import getConfig from './getConfig'
import extendConfig from './extendConfig'
import tasks from './tasks'

let action = getAction()
let config = getConfig('.mbob')

if ( ! config ) {
  if ( action !== 'newProject' ) {
    console.error( 'No .mbob found. Run: mbob new' )
    process.exit(1)
  }
  config = {}
}

extendConfig( config )

if (tasks[action]) tasks[action]( config )
else console.error('Unknown action', action)
