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

import StyleTransform, { getWrapedCSS } from '../src/transforms'

// 初始化config
const styleTransform = new StyleTransform({})

async function run (src, filename = './__tests__/styles/a.css', options = { platform: 'android' }, debug) {
  if (typeof src === 'object') {
    ({
      src,
      filename = './__tests__/styles/a.css',
      options = { platform: 'android' },
      debug
    } = src || {})
  }

  const css = await styleTransform.transform(src, filename, options)
  if (debug) {
    // eslint-disable-next-line
    console.log(filename + ' source: ', src)
    // eslint-disable-next-line
    console.log(filename + ' target: ', css)
  }
  return css
}

describe('style transform in cross platform', () => {
  it('postcss cross platform conditional compile', async () => {
    const css = await run(`
      .test {
        color: red;
      }
      /*  #ifdef  rn  */
      .rn { width: 100px }
      /*  #endif  */
      /*  #ifndef  rn  */
      .h5 { errSet: 100px }
      /*  #endif  */
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red"
  },
  "rn": {
    "width": scalePx2dp(50)
  }
}`))
  })

  it('not surport style', async () => {
    const css = await run(`
      .test {
        o: 0.5;
        background: red;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "o": 0.5,
    "backgroundColor": "red"
  }
}`))
  })

  it('nest sass import cross platform', async () => {
    const css = await run({
      filename: './__tests__/styles/a.scss',
      src: "@import './c.scss';"
    })
    expect(css).toEqual(getWrapedCSS(`{
  "drn": {
    "color": "red"
  },
  "crn": {
    "color": "red"
  }
}`))
  })
})
