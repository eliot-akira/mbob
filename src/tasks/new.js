import path from 'path'
import copyFolderSoft from '../util/copyFolderSoft'
import fileExists from '../util/fileExists'
import mkdirSync from '../util/mkdirSync'
import getArgs from '../util/getArgs'

export default function newProject( config ) {

  let { getLocalPath, getProjectPath } = config

  let cwd = getProjectPath()

  let newDir = getArgs().argv[1]

  if ( newDir ) {
    mkdirSync( newDir )
    process.chdir( newDir )
    cwd = process.cwd()
  }

  // TODO: option to specify starter folder

  copyFolderSoft( getLocalPath('starter'), cwd )

  console.log('New project created')

  if ( ! fileExists( path.resolve( cwd, 'node_modules' ) )) {
    console.log('Make sure to run: npm install')
  }
}
