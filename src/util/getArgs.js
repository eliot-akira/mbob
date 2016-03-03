export default function getArgs() {

  let args={}, argv=[]

  for (let x of process.argv.slice(2)) {
    if (x[0]==='-') {
      let i = x.indexOf('=')
      args[ x.substr(1, i>0 ? i-1 : undefined) ] = i>0 ? x.substr(i+1) : true
    } else argv.push(x)
  }

  return { args,argv }
}
