let requires = []

export default function getRequires({ config }) {

  if (config.build) {
    for (let task in config.build) {
      maybeAddRequire( config.build[task].require )
    }
  }
  if (config.test && config.test.require)
    maybeAddRequire( config.test.require )

  return requires
}

function maybeAddRequire( req ) {

  if ( ! req ) return

  if (typeof req === 'string')
    req = [req]

  // Avoid duplicates
  for (let r of req) {
    if ( requires.indexOf(r) >= 0 ) continue
    requires.push(r)
  }
}
