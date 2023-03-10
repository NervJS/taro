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
 */

export const normalizePath = url => {
  let _isRelative
  let _leadingParents = ''
  let _parent, _pos

  // handle relative paths
  if (url.charAt(0) !== '/') {
    _isRelative = true
    url = '/' + url
  }

  // handle relative files (as opposed to directories)
  if (url.substring(-3) === '/..' || url.slice(-2) === '/.') {
    url += '/'
  }

  // resolve simples
  url = url.replace(/(\/(\.\/)+)|(\/\.$)/g, '/').replace(/\/{2,}/g, '/')

  // remember leading parents
  if (_isRelative) {
    _leadingParents = url.substring(1).match(/^(\.\.\/)+/) || ''
    if (_leadingParents) {
      _leadingParents = _leadingParents[0]
    }
  }

  // resolve parents
  while (true) {
    _parent = url.search(/\/\.\.(\/|$)/)
    if (_parent === -1) {
      // no more ../ to resolve
      break
    } else if (_parent === 0) {
      // top level cannot be relative, skip it
      url = url.substring(3)
      continue
    }

    _pos = url.substring(0, _parent).lastIndexOf('/')
    if (_pos === -1) {
      _pos = _parent
    }
    url = url.substring(0, _pos) + url.substring(_parent + 3)
  }

  // revert to relative
  if (_isRelative) {
    url = _leadingParents + url.substring(1)
  }

  return url
}

export const splitUrl = _url => {
  let url = _url || ''
  let pos
  const res = {
    path: null,
    query: null,
    fragment: null
  }

  pos = url.indexOf('#')
  if (pos > -1) {
    res.fragment = url.substring(pos + 1)
    url = url.substring(0, pos)
  }

  pos = url.indexOf('?')
  if (pos > -1) {
    res.query = url.substring(pos + 1)
    url = url.substring(0, pos)
  }

  res.path = url

  return res
}
