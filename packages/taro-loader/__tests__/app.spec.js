import app from '../src/app'

describe('app-loader', () => {
  it('nerv', () => {
    const request = '!request'
    const result = app.call({ query: { framework: 'nerv' }, request })
    const method = 'createReactApp'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${request.slice(1)}'
var inst = App(${method}(component))
`)
  })

  it('react', () => {
    const request = '!request'
    const result = app.call({ query: { framework: 'react' }, request })
    const method = 'createReactApp'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${request.slice(1)}'
var inst = App(${method}(component))
`)
  })

  it('vue', () => {
    const request = '!request'
    const result = app.call({ query: { framework: 'vue' }, request })
    const method = 'createVueApp'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${request.slice(1)}'
var inst = App(${method}(component))
`)
  })

  it('prerender', () => {
    const request = '!request'
    const result = app.call({ query: { framework: 'vue', prerender: true }, request })
    const method = 'createVueApp'
    expect(result).toMatch(`import { ${method} } from '@tarojs/runtime'
import component from '${request.slice(1)}'
var inst = App(${method}(component))

if (typeof PRERENDER !== 'undefined') {
  global._prerender = inst
}
`)
  })
})
