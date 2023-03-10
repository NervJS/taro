/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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
 *  SOFTWARE.
 */

const json = JSON

export const clone = (obj) => json.parse(stringify(obj))

const isArray = Array.isArray || function (x) {
  return {}.toString.call(x) === '[object Array]'
}

const objectKeys = Object.keys || function (obj) {
  const has = Object.prototype.hasOwnProperty || function () { return true }
  const keys = []
  for (const key in obj) {
    if (has.call(obj, key)) keys.push(key)
  }
  return keys
}

function stringify (obj, opts) {
  if (!opts) opts = {}
  if (typeof opts === 'function') opts = { cmp: opts }
  let space = opts.space || ''
  if (typeof space === 'number') space = Array(space + 1).join(' ')
  const cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false
  const replacer = opts.replacer || function (key, value) { return value }

  const cmp = opts.cmp && (function (f) {
    return function (node) {
      return function (a, b) {
        const aobj = { key: a, value: node[a] }
        const bobj = { key: b, value: node[b] }
        return f(aobj, bobj)
      }
    }
  })(opts.cmp)

  const seen = []
  return (function stringify (parent, key, node, level) {
    const indent = space ? ('\n' + new Array(level + 1).join(space)) : ''
    const colonSeparator = space ? ': ' : ':'

    if (node && node.toJSON && typeof node.toJSON === 'function') {
      node = node.toJSON()
    }

    node = replacer.call(parent, key, node)

    if (node === undefined) {
      return
    }
    if (typeof node !== 'object' || node === null) {
      return json.stringify(node)
    }
    if (isArray(node)) {
      const out = []
      for (let i = 0; i < node.length; i++) {
        const item = stringify(node, i, node[i], level + 1) || json.stringify(null)
        out.push(indent + space + item)
      }
      return '[' + out.join(',') + indent + ']'
    } else {
      if (seen.indexOf(node) !== -1) {
        if (cycles) return json.stringify('__cycle__')
        throw new TypeError('Converting circular structure to JSON')
      } else seen.push(node)

      const keys = objectKeys(node).sort(cmp && cmp(node))
      const out = []
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = stringify(node, key, node[key], level + 1)

        if (!value) continue

        const keyValue = json.stringify(key) +
                  colonSeparator +
                  value

        out.push(indent + space + keyValue)
      }
      seen.splice(seen.indexOf(node), 1)
      return '{' + out.join(',') + indent + '}'
    }
  })({ '': obj }, '', obj, 0)
}
