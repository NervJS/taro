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

import { recursiveMerge } from '@tarojs/helper'
import * as path from 'path'

import StyleTransform, { getWrapedCSS } from '../src/transforms'

const defaultConfig = {
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  alias: {
    '@': path.resolve(__dirname, './styles')
  },
  rn: {
    postcss: {
      options: {
        plugins: []
      }
    },
    sass: {
      options: {},
      additionalData: ''
    },
    less: {
      options: {},
      additionalData: ''
    },
    stylus: {
      options: {},
      additionalData: ''
    }
  }
}

async function run (src, filename = './__tests__/styles/a.css', debug) {
  let options = { platform: 'android' }
  let config

  if (typeof src === 'object') {
    ({
      src,
      filename = './__tests__/styles/a.css',
      options = { platform: 'android' },
      debug,
      config
    } = src || {})
  }

  const mergeConfig = recursiveMerge({}, defaultConfig, config)
  // console.log('mergeConfig', JSON.stringify(mergeConfig, null, '  '))
  const styleTransform = new StyleTransform(mergeConfig)
  const css = await styleTransform.transform(src, filename, options)
  if (debug) {
    // eslint-disable-next-line
    console.log(filename + ' source: ', src)
    // eslint-disable-next-line
    console.log(filename + ' target: ', css)
  }
  return css
}

describe('style transform with config options', () => {
  it('config.sass option', async () => {
    const css = await run({
      src: `
        .test {
          color: $base-color;
          height: 10px;
        }
      `,
      config: {
        sass: {
          resource: [
            '__tests__/styles/variable.scss',
            '__tests__/styles/b.css'
          ],
          projectDirectory: path.resolve(__dirname, '..'),
          data: '.data { width: 200px }'
        }
      },
      filename: './__tests__/styles/a.scss'
    })
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  },
  "data": {
    "width": scalePx2dp(100)
  },
  "test": {
    "color": "#c6538c",
    "height": scalePx2dp(5)
  }
}`))
  })

  it('config.sass option without projectDirectory', async () => {
    const css = await run({
      src: `
        .test {
          color: $base-color;
          height: 10px;
        }
      `,
      filename: './__tests__/styles/a.scss',
      config: {
        sass: {
          resource: [
            path.resolve(__dirname, 'styles/variable.scss'),
            path.resolve(__dirname, 'styles/b.css')
          ],
          projectDirectory: path.resolve(__dirname, '..'),
          data: '.data { width: 200px }'
        }
      }
    })
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  },
  "data": {
    "width": scalePx2dp(100)
  },
  "test": {
    "color": "#c6538c",
    "height": scalePx2dp(5)
  }
}`))
  })

  it('config.postcss disable pxTransform', async () => {
    const css = await run(`
      .test {
        height: 10px;
      }
    `)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "height": scalePx2dp(5)
  }
}`))
  })

  it('config.postcss disable scalePx2dp', async () => {
    const config = {
      rn: {
        postcss: {
          options: {
            plugins: []
          },
          scalable: false
        }
      }
    }
    const css = await run({
      src: `
        .test {
          height: 10px;
        }
      `,
      config
    })
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "height": 5
  }
}`))
  })
  it('config.alias in css', async () => {
    const css = await run("@import '@/b.css';")
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  }
}`))
  })

  it('config.alias in sass', async () => {
    const css = await run({
      src: "@import '@/b.scss';",
      filename: './__tests__/styles/a.scss'
    })
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  }
}`))
  })

  it('config.alias in less', async () => {
    const css = await run({
      src: "@import '@/b.less';",
      filename: './__tests__/styles/a.less'
    })
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  }
}`))
  })
})
