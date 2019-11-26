import crypto from 'crypto'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as xxh from 'xxhashjs'

const HEXBASE = 16

const defaultHashOptions = {
  method: 'xxhash32',
  shrink: 8,
  append: false
}

const getxxhash = (content, options) => {
  const hashFunc = options.method === 'xxhash32' ? xxh.h32 : xxh.h64
  const seed = 0

  return hashFunc(seed)
    .update(content)
    .digest()
    .toString(HEXBASE)
}

const getHash = (content, options) => {
  if (options.method && typeof options.method === 'function') {
    return options.method(content)
  }

  if (options.method && options.method.indexOf('xxhash') === 0) {
    return getxxhash(content, options)
  }

  try {
    const hashFunc = crypto.createHash(options.method)

    return hashFunc.update(content)
      .digest('hex')
  } catch (e) {
    return null
  }
}

function hash(content, options) {

  options = options || defaultHashOptions

  let hash = getHash(content, options)

  if (hash == null) {
    // bad hash method fallback to defaults
    // TODO: warning/error reporting?
    hash = getHash(content, defaultHashOptions)
  }

  return options.shrink ? hash.substr(0, options.shrink) : hash
}

export default (file, options? : any) => {
  const content = fs.readFileSync(file)
  const ext = path.extname(file)
  return hash(content, options) + ext
}
