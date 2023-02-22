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
 *  SOFTWARE.
 */

export default class MockStorage {
  constructor (cache = {}) {
    this.storageCache = cache
  }

  setItem = jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      return (typeof key !== 'string' || typeof value !== 'string')
        ? reject(new Error('key and value must be string'))
        : resolve(this.storageCache[key] = value)
    })
  });

  getItem = jest.fn((key) => {
    return new Promise((resolve) => {
      // eslint-disable-next-line
      return this.storageCache.hasOwnProperty(key)
        ? resolve(this.storageCache[key])
        : resolve(null)
    })
  })

  removeItem = jest.fn((key) => {
    return new Promise((resolve, reject) => {
      return this.storageCache.hasOwnProperty(key)
        ? resolve(delete this.storageCache[key])
        : reject(new Error('No such key!'))
    })
  })

  clear = jest.fn(() => {
    return new Promise((resolve) => resolve(this.storageCache = {}))
  })

  getAllKeys = jest.fn(() => {
    return new Promise((resolve) => resolve(Object.keys(this.storageCache)))
  })

  multiRemove = jest.fn((keys) => {
    return new Promise((resolve) => {
      keys.forEach(key => {
        this.removeItem(key)
      })
      resolve()
    })
  })
}
