import fs from 'fs'
import Hjson from 'hjson'

export default function getConfig( file ) {

  let text

  try {
    text = fs.readFileSync(file, 'utf8')
  } catch (e) {
    return false
  }

  return Hjson.parse( text )
}
