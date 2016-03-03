import getArgs from './util/getArgs'

export default function getAction() {

  let action = getArgs().argv[0] || 'dev'

  const translate = {
    'b': 'build',
    'd': 'dev',
    'i': 'init'
  }

  if (translate[action]) action = translate[action]

  return action
}
