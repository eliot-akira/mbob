export default function replaceVars( str, vars ) {

  let newStr = str

  for (let key in vars) {
    newStr = newStr.split( '$'+key ).join( vars[key] )
  }

  return newStr
}
