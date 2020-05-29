import { document } from '@tarojs/runtime'
import { Sizzle } from '../../src/jquery/sizzle'

describe('selector', () => {
  /**
   * The render DOM
   * @type {HTMLElement}
   */
  const dom = document.createElement('div')
  dom.setAttribute('id', 'test')
  dom.setAttribute('class', 'test')
  document.body.appendChild(dom)

  afterEach(() => {
    dom.textContent = ''
  })

  it('should work with ID', () => {
    const $dom = Sizzle('#test')
    expect($dom[0]).toBe(dom)
  })

  it('should work with tagName', () => {
    const $dom = Sizzle('div')
    expect($dom[0]).toBe(dom)
  })

  it('should work with className', () => {
    const $dom = Sizzle('.test')
    expect($dom[0]).toBe(dom)
  })
})
