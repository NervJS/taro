/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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

    return hashFunc.update(content).digest('hex')
  } catch (e) {
    return null
  }
}

function hash (content, options) {
  options = options || defaultHashOptions

  let hash = getHash(content, options)

  if (hash == null) {
    // bad hash method fallback to defaults
    // TODO: warning/error reporting?
    hash = getHash(content, defaultHashOptions)
  }

  return options.shrink ? hash.substr(0, options.shrink) : hash
}

export default (file, options?: any) => {
  const content = fs.readFileSync(file)
  const ext = path.extname(file)
  return hash(content, options) + ext
}
