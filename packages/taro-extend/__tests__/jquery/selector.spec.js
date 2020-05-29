import { document } from '@tarojs/runtime'
import { Sizzle } from '../../src/jquery/sizzle'

describe('selector', () => {
  /**
   * The render DOM
   * @type {HTMLElement}
   */
  const dom = document.createElement('main')
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
    const $dom = Sizzle('main')
    expect($dom[0]).toBe(dom)
  })

  it('should work with className', () => {
    const $dom = Sizzle('.test')
    expect($dom[0]).toBe(dom)
  })

  it('should work with >', () => {
    // console.log(dom)
    dom.innerHTML = '<view class="t1 fuck" id="t1"></view>'
    // console.log(dom.childNodes)
    const $dom = Sizzle('main > .t1')
    expect($dom[0]).toBe(dom.firstChild)
  })
})
