import path from 'path'
import { recursiveMerge } from '@tarojs/helper'

import StyleTransform, { getWrapedCSS } from '../dist/transforms'

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

async function run (src, config = {}, filename = './__tests__/styles/a.css', options, debug = false) {
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
    const css = await run(`
    .test {
      color: $base-color;
      height: 10px;
    }
  `, {
      sass: {
        resource: [
          '__tests__/styles/variable.scss',
          '__tests__/styles/b.css'
        ],
        projectDirectory: path.resolve(__dirname, '..'),
        data: '.data { width: 200px }'
      }
    }, './__tests__/styles/a.scss')
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
    const css = await run(`
    .test {
      color: $base-color;
      height: 10px;
    }
  `, {
      sass: {
        resource: [
          path.resolve(__dirname, 'styles/variable.scss'),
          path.resolve(__dirname, 'styles/b.css')
        ],
        projectDirectory: path.resolve(__dirname, '..'),
        data: '.data { width: 200px }'
      }
    }, './__tests__/styles/a.scss')
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
    const css = await run(`
    .test {
      height: 10px;
    }
  `, config)
    expect(css).toEqual(getWrapedCSS(`{
  "test": {
    "height": 5
  }
}`))
  })
  it('config.alias in css', async () => {
    const css = await run(`
    @import '@/b.css';
  `)
    expect(css).toEqual(getWrapedCSS(`{
  "brn": {
    "color": "red"
  }
}`))
  })

  it('config.alias in sass', async () => {
    const css = await run(`
    @import '@/b.scss';
  `, {}, './__tests__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  }
}`))
  })

  it('config.alias in less', async () => {
    const css = await run(`
    @import '@/b.less';
  `, {}, './__tests__/styles/a.less')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
    "color": "red"
  }
}`))
  })
})
