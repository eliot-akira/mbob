const fs = require('fs')

export default function getJSONFile( file ) {

  let text

  try {

    text = fs.readFileSync(file, 'utf8')

  } catch (e) {

    return {}
  }

  return JSON.parse( text )
}
