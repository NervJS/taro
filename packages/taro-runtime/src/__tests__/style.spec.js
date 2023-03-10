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

let Style

describe('style', () => {
  const runtime = require('../../dist/runtime.esm')
  Style = runtime.Style
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('works', () => {
    const root = document.createElement('root')
    const style = new Style(root)
    style.color = 'red'
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.getPropertyValue('color')).toBe('red')
    style.fontSize = '16'
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.getPropertyValue('font-size')).toBe('16')
    style.removeProperty('font-size')
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.fontSize).toBe('')
    style.setProperty('font-weight', 'bold')
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.fontWeight).toBe('bold')
    expect(style.cssText).toBe('color: red; font-weight: bold;')
    style.cssText = ''
    expect(style.cssText).toBe('')
    expect(style._usedStyleProp.size).toBe(0)
    expect(style.color).toBe('')
    expect(style.fontWeight).toBe('')
    style.textAlign = 'center'
    expect(style.cssText).toBe('text-align: center;')
    style.cssText = 'color: red; font-weight: bold;'
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.fontWeight).toBe('bold')
    expect(style.color).toBe('red')
  })
})
