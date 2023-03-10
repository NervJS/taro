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

import pageLoader from '../src/page'

const path = require('path')

describe('app-loader', () => {
  it('nerv', () => {
    const request = '!request'
    const name = '/page/test'
    const result = pageLoader.call({ query: { framework: 'nerv', name }, request })
    const method = 'createPageConfig'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${request.slice(1)}'
var inst = Page(${method}(component, '${name}'))
`)
  })

  it('react', () => {
    const request = '!request'
    const name = '/page/test'
    const result = pageLoader.call({ query: { framework: 'react', name }, request })
    const method = 'createPageConfig'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${request.slice(1)}'
var inst = Page(${method}(component, '${name}'))
`)
  })

  it('vue', () => {
    const request = '!request'
    const name = '/page/test'
    const resourcePath = 'resourcePath'
    const result = pageLoader.call({ query: { framework: 'vue', name }, request, resourcePath })
    const method = 'createPageConfig'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${path.resolve(__dirname, '..', 'src', 'raw.js')}!${resourcePath}'
var inst = Page(${method}(component, '${name}'))
`)
  })

  it('prerender', () => {
    const request = '!request'
    const name = '/page/test'
    const resourcePath = 'resourcePath'
    const result = pageLoader.call({ query: { framework: 'vue', name, prerender: true }, request, resourcePath })
    const method = 'createPageConfig'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${path.resolve(__dirname, '..', 'src', 'raw.js')}!${resourcePath}'
var inst = Page(${method}(component, '${name}'))

if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}
`)
  })
})
