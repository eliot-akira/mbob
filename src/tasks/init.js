import path from 'path'
import copyFolderSoft from '../util/copyFolderSoft'
import fileExists from '../util/fileExists'
import mkdirSync from '../util/mkdirSync'
import getArgs from '../util/getArgs'

export default function init( config ) {

  let { getLocalPath, getProjectPath } = config

  let cwd = getProjectPath()

  let newDir = getArgs().argv[1]

  if ( newDir ) {
    mkdirSync( newDir )
    process.chdir( newDir )
    cwd = process.cwd()
  }

  copyFolderSoft( getLocalPath('starter'), cwd )

  console.log('Init done')

  if ( ! fileExists( path.resolve( cwd, 'node_modules' ) )) {
    console.log('Make sure to run: npm install')
  }
}
