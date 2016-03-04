import getArgs from './util/getArgs'

export default function getAction() {

  let args = getArgs()
  let action = args.argv[0] || 'dev'

  const translate = {
    'b': 'build',
    'd': 'dev',
    'i': 'init'
  }

  if (translate[action]) action = translate[action]

  if (args.args.serve || args.args.s) action = 'serve'

  return action
}
