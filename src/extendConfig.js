import path from 'path'
import getJSONFile from './util/getJSONFile'
import extend from './util/extend'

const projectPath = process.cwd(),
      localPath = path.resolve(__dirname, '..'), // root path of this module
      getProjectPath = ( ...paths ) => path.resolve(projectPath, ...paths),
      getLocalPath = ( ...paths ) => path.resolve(localPath, ...paths),
      getProjectBinPath = ( ...paths ) => getProjectPath('node_modules/.bin', ...paths)

let pack = getJSONFile( getProjectPath('package.json') )

export default function extendConfig( config ) {

  let vars = config.vars || {}
  let reserved = ['before', 'build', 'serve', 'test']

  for (let key in config) {
    if ( ! config.hasOwnProperty(key) || reserved.indexOf(key) >= 0 ) continue
    vars[key] = config[key]
  }

  if ( ! vars.bin ) vars.bin = getProjectBinPath()

  process.env.PATH += ':'+vars.bin

  extend(config, {
    vars,
    projectPath,
    localPath,
    getProjectPath,
    getLocalPath,
    getProjectBinPath,
    package: pack
  })

  //console.log(config)
}
