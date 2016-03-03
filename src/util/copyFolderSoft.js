import fs from 'fs'
import path from 'path'

// Copy folder soft: cp -rn source/** target

export default function copyFolderSoft( source, target ) {

  if ( ! fs.lstatSync( source ).isDirectory() ) return

  let files = fs.readdirSync( source )

  for (let file of files) {

    let checkTarget = path.join( target, file )

    if ( fs.existsSync( checkTarget ) ) {
     // Don't overwrite
     continue
    }

    let curSource = path.join( source, file )

    if ( fs.lstatSync( curSource ).isDirectory() ) {
      copyFolderRecursiveSync( curSource, target )
    } else {
      copyFileSync( curSource, target )
    }
  }
}


function copyFileSync( source, target ) {

  let targetFile = target

  //if target is a directory a new file with the same name will be created
  if ( fs.existsSync( target ) && fs.lstatSync( target ).isDirectory() ) {
    targetFile = path.join( target, path.basename( source ) )
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}


function copyFolderRecursiveSync( source, target ) {

  //check if folder needs to be created or integrated
  let targetFolder = path.join( target, path.basename( source ) )

  if ( !fs.existsSync( targetFolder ) ) {
    fs.mkdirSync( targetFolder )
  }

  if ( ! fs.lstatSync( source ).isDirectory() ) return

  let files = fs.readdirSync( source )

  for (let file of files) {

    let curSource = path.join( source, file )

    if ( fs.lstatSync( curSource ).isDirectory() ) {
      copyFolderRecursiveSync( curSource, targetFolder )
    } else {
      copyFileSync( curSource, targetFolder )
    }
  }
}
