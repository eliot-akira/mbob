// Unused in favor of adding local bin path to $PATH in process context

// Prepend local bin path to command, if found in package.json

export default function prependLocalBinPath({ config, command }) {
  return command

  let { getProjectPath, package: pack } = config,
      parts = command.split(' '),
      first = parts.shift(),
      packageName = first,
      localBinPath = getProjectPath('node_modules/.bin', first)

  // TODO: Should check in the `bin` field of module's package.json

  if (first === 'babel-node') packageName = 'babel-cli'

  if ( pack.dependencies && pack.dependencies[ packageName ] ||
    pack.devDependencies && pack.devDependencies[ packageName ] ) {

    command = localBinPath + ' ' + ( parts.join(' ') )
  }

  return command
}
