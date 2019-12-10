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

const fileHashNames = {}

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

export const hash = (content, options) => {
  options = options || defaultHashOptions

  let hash = getHash(content, options)

  if (hash == null) {
    // bad hash method fallback to defaults
    // TODO: warning/error reporting?
    hash = getHash(content, defaultHashOptions)
  }

  return options.shrink ? hash.substr(0, options.shrink) : hash
}

export const getHashName = (filePath: string, format: boolean | string = '[name].[hash].[ext]') => {
  if (!filePath) return ''
  if (typeof format !== 'string') {
    format = '[name].[hash].[ext]'
  }
  const key = `${filePath}-${format}`
  if (!fileHashNames[key]) {
    const code = hash(fs.readFileSync(filePath), defaultHashOptions)
    const ext = path.extname(filePath)
    const name = path.basename(filePath, ext)
    fileHashNames[key] = Object.entries({
      '\\[name\\]': name,
      '\\[hash\\]': code,
      '\\[ext\\]': ext.slice(1)
    }).reduce(
      (result, item) => result.replace(RegExp(item[0], 'g'), item[1]),
      format
    )
  }

  return fileHashNames[key] || path.basename(filePath)
}
