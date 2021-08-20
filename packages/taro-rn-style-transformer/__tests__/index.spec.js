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

// 初始化
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

describe('style transform', () => {
  it('.css transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
        height: 10px;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red",
    "height": scalePx2dp(5)
  }
}`))
  })

  it('.css transform @import', async () => {
    const css = await run(`
      @import './b.css';
      .test {
        color: red;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.css import source omit extension', async () => {
    const css = await run(`
      @import './b';
    `, './__tests__/styles/a.css')
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  }
}`))
  })

  it('.sass transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
      }
    `, './__tests__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red"
  }
}`))
  })
  //
  it('.sass transform @import', async () => {
    const css = await run(`
      @import './b.scss';
      .test {
        color: red;
      }
    `, './__tests__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })
  it('.sass transform @import css file', async () => {
    const css = await run(`
      @import './c.css';
      .test {
        color: red;
      }
    `, './__tests__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "c": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.sass transform @import with mixins', async () => {
    const css = await run(`
      @import './mixins.scss';
      .test {
        color: red;
        @include hairline(width);
      }
    `, './__tests__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red",
    "width": scalePx2dp(0.5)
  }
}`))
  })

  it('.sass import source omit extension', async () => {
    const css = await run(`
      @import './b';
    `, './__tests__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  }
}`))
  })

  it('.less transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
      }
    `, './__tests__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "red"
  }
}`))
  })

  it('.less transform @import', async () => {
    const css = await run(`
      @import './b.less';
      .test {
        color: red;
      }
    `, './__tests__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.less tranform nest import', async () => {
    const css = await run(`
      @import './c.less';
      .test {
        color: red;
      }
    `, './__tests__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "nest": {
    "color": "red"
  },
  "c": {
    "color": "red"
  },
  "test": {
    "color": "red"
  }
}`))
  })

  it('.less import source omit extension', async () => {
    const css = await run(`
      @import './b';
    `, './__tests__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  }
}`))
  })

  it('.styl transform basic', async () => {
    const css = await run(`
      .test {
        color: red;
      }
    `, './__tests__/styles/a.styl')
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "color": "#f00"
  }
}`))
  })

  it('.styl transform @import', async () => {
    const css = await run(`
      @import './b.styl';
      .test {
        color: red;
      }
    `, './__tests__/styles/a.styl')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "#f00"
  },
  "test": {
    "color": "#f00"
  }
}`))
  })
})
