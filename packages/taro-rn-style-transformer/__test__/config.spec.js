import path from 'path'
import { recursiveMerge } from '@tarojs/helper'

import StyleTransform from '../dist/transforms'

function getWrapedCSS (css) {
  return `
import { StyleSheet, Dimensions } from 'react-native'

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width
const uiWidthPx = 375

function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

export default StyleSheet.create(${css})
`
}

const defaultConfig = {
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sass: {
    resource: [
      'styles/variable.scss',
      'styles/b.css'
    ],
    projectDirectory: path.resolve(__dirname),
    data: '.data { width: 200px }'
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

async function run (src, config = {}, filename = './__test__/styles/a.css', options, debug = false) {
  // const css = await styleTransform.transform2rn(src, filename, options)
  const mergeConfig = recursiveMerge({}, defaultConfig, config)
  // console.log('mergeConfig', JSON.stringify(mergeConfig, null, '  '))
  const styleTransform = new StyleTransform(mergeConfig)
  const css = await styleTransform.transform(src, filename, options)
  if (debug) {
    console.log(filename + ' source: ', src)
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
  `, {}, './__test__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
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
        ]
      }
    }, './__test__/styles/a.scss')
    expect(css).toEqual(getWrapedCSS(`{
  "b": {
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
})
