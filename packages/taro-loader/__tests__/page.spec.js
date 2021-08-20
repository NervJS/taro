/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
