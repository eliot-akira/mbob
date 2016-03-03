export default function extend(destination, ...sources) {

  destination = destination || {}

  for (let source of sources) {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        destination[key] = source[key]
      }
    }
  }

  return destination
}
