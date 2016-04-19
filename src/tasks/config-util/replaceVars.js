function replaceVarsInString( str, vars ) {

  let newStr = str

  for (let key in vars) {
    newStr = newStr.split( '$'+key ).join( vars[key] )
  }

  return newStr
}

export default function replaceVars( str, vars ) {

  if (typeof str === 'string') return replaceVarsInString( str, vars )

  // Assume array
  return str.map((s) => replaceVarsInString( s, vars ))
}
