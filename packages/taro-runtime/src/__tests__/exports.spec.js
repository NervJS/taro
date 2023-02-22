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

describe('style', () => {
  const runtime = require('../../dist/runtime.esm')

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('bom', () => {
    const window = runtime.window
    expect(window).not.toBeUndefined()
    expect(window.navigator).not.toBeUndefined()
    expect(window.document).not.toBeUndefined()
    expect(runtime.document).toBe(window.document)
    expect(runtime.navigator).toBe(window.navigator)
  })

  it('dom', () => {
    expect(runtime.TaroElement).not.toBeUndefined()
    expect(runtime.TaroNode).not.toBeUndefined()
    expect(runtime.TaroText).not.toBeUndefined()
  })

  it('event', () => {
    expect(runtime.createEvent).not.toBeUndefined()
    expect(runtime.TaroEvent).not.toBeUndefined()
  })

  it('dsl', () => {
    expect(runtime.createComponentConfig).not.toBeUndefined()
    expect(runtime.createPageConfig).not.toBeUndefined()
  })
})
