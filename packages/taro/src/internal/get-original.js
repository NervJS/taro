import { ENV_TYPE, getEnv } from '../env'

function isObject (arg) {
  return arg === Object(arg) && typeof arg !== 'function'
}

let env = null

export function getOriginal (item) {
  if (env === null) {
    env = getEnv()
  }
  if (isObject(item)) {
    return item[env === ENV_TYPE.SWAN ? 'privateOriginal' : '$original'] || item
  }
  return item
}
