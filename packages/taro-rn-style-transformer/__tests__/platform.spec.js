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

import StyleTransform, { getWrapedCSS } from '../dist/transforms'

// 初始化config
const styleTransform = new StyleTransform()

async function run (src, filename = './__tests__/styles/a.css', options, debug) {
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
})
