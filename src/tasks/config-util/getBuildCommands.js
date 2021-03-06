import path from 'path'
import replaceVars from './replaceVars'
import prependLocalBinPath from './prependLocalBinPath'

export default function getBuildCommands({ key = 'build', config }) {

  let { build, vars } = config

  let pack = config.package,
      commands = [],
      watches = {}

  let watch = key === 'watch'

  for (let taskName in build) {

    let task = build[ taskName ]

    let entries = [{}]

    if ( task.entry ) {
      if ( ! Array.isArray(task.entry) ) task.entry = [task.entry]
      entries = task.entry
    }

    if ( task.watch && entries.length ) entries[0].watch = task.watch


    let command

    if ( watch ) {
      command = task.dev || task.build
    } else {
      command = task[ key ]
    }

    if ( ! command ) continue

    //command = prependLocalBinPath({ config, command })

    for (let entry of entries) {

      let entryCommand = command

      // Replace vars in entry prop values, then in build/dev command

      for (let k in entry) {

        // Entry key's value can have $var, such as - in: $src/*
        entry[k] = replaceVars(entry[k], config.vars)

        // Replace entry variable: in, out
        entryCommand = replaceVars(entryCommand, { [k]: entry[k] })

        // Replace root variables: name, src, dest
        entryCommand = replaceVars(entryCommand, config.vars)
      }

      commands.push( entryCommand )


      if ( ! watch || ! entry.watch ) continue

      // Files to watch for this entry

      if ( ! watches[ taskName ] ) watches[ taskName ] = []

      watches[ taskName ].push({
        watch: entry.watch,
        run: entryCommand
      })
    }
  }

  if ( watch ) return watches
  else return commands
}
