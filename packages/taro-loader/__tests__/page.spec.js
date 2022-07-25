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
