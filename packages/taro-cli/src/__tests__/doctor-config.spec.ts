import * as helper from '@tarojs/helper'

import doctor from '../doctor'

const validator = doctor.validators[1]
const baseConfig = {
  projectName: 'test',
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react'
}

function getConfig (config) {
  return {
    projectConfig: {
      ...baseConfig,
      ...config
    },
    helper,
    configPath: ''
  }
}

describe('config validator of doctor', () => {
  it('should config include\'s all the required values', async () => {
    let { messages } = await validator({
      projectConfig: {},
      helper,
      configPath: ''
    })
    expect(messages.length).toEqual(6)
    let msgs = messages.map(line => line.content)
    expect(msgs.includes('缺少 "projectName" 配置项')).toBeTruthy()
    expect(msgs.includes('缺少 "sourceRoot" 配置项')).toBeTruthy()
    expect(msgs.includes('缺少 "outputRoot" 配置项')).toBeTruthy()
    expect(msgs.includes('缺少 "framework" 配置项')).toBeTruthy()

    const res = await validator({
      projectConfig: {
        projectName: '',
        sourceRoot: '',
        outputRoot: '',
        framework: ''
      },
      helper,
      configPath: ''
    })
    messages = res.messages

    expect(messages.length).toEqual(3)
    msgs = messages.map(line => line.content)
    expect(msgs.includes('framework 的值 "" 与任何指定选项 ["nerv","react","preact","solid","vue","vue3"] 都不匹配')).toBeTruthy()
  })

  it('date', async () => {
    let { messages } = await validator(getConfig({
      date: '2020-5-26'
    }))

    expect(messages.length).toEqual(3)

    const res = await validator(getConfig({
      date: 'abc'
    }))
    messages = res.messages

    expect(messages.length).toEqual(3)
    expect(messages[2].content).toEqual('date 的值 "abc" 与 "\\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])" 不匹配')
  })

  it('framework', async () => {
    let res = await validator(getConfig({
      framework: 'react'
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      framework: 'vue'
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      framework: 'nerv'
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      framework: 'vue3'
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      framework: 'other'
    }))
    expect(res.messages.length).toEqual(3)
    expect(res.messages[2].content).toEqual('framework 的值 "other" 与任何指定选项 ["nerv","react","preact","solid","vue","vue3"] 都不匹配')
  })

  it('designWidth', async () => {
    let res = await validator(getConfig({
      designWidth: '750'
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      designWidth: 'a'
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      designWidth: 700.5
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      designWidth: -640
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('deviceRatio', async () => {
    let res = await validator(getConfig({
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      deviceRatio: {
        640: 2.34 / 2,
        750: 'a',
        828: 1.81 / 2
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('plugins', async () => {
    let res = await validator(getConfig({
      plugins: [
        '@tarojs/plugin-mock',
        ['@tarojs/plugin-mock', {
          mocks: {
            '/api/user/1': {
              name: 'judy',
              desc: 'Mental guy'
            }
          }
        }],
        ['@tarojs/plugin-mock'],
        '/absulute/path/plugin/filename'
      ]
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      plugins: [
        1,
        {},
        ['x', 1],
        [{}, 'x'],
        ['x', {}, 1],
        ['']
      ]
    }))
    expect(res.messages.length).toEqual(6)
  })

  it('presets', async () => {
    let res = await validator(getConfig({
      presets: [
        '@tarojs/plugin-mock',
        ['@tarojs/plugin-mock', {
          mocks: {
            '/api/user/1': {
              name: 'judy',
              desc: 'Mental guy'
            }
          }
        }],
        ['@tarojs/plugin-mock'],
        '/absulute/path/plugin/filename'
      ]
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      presets: [
        1,
        {},
        ['x', 1],
        [{}, 'x'],
        ['x', {}, 1],
        ['']
      ]
    }))
    expect(res.messages.length).toEqual(6)
  })

  it('terser', async () => {
    let res = await validator(getConfig({
      terser: {
        enable: true,
        config: {
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      terser: {
        enables: true,
        enable: 1,
        config: []
      }
    }))
    expect(res.messages.length).toEqual(5)
  })

  it('csso', async () => {
    let res = await validator(getConfig({
      csso: {
        enable: true,
        config: {
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      csso: {
        enables: true,
        enable: 1,
        config: []
      }
    }))
    expect(res.messages.length).toEqual(5)
  })

  it('uglify', async () => {
    let res = await validator(getConfig({
      uglify: {
        enable: true,
        config: {
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      uglify: {
        enables: true,
        enable: 1,
        config: []
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('sass', async () => {
    let res = await validator(getConfig({
      sass: {
        resource: '/src/styles/variable.scss'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      sass: {
        resource: [
          './src/styles/variable.scss',
          './src/styles/mixins.scss'
        ],
        projectDirectory: '/root',
        data: '$nav-height: 48px;'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      sass: {
        resource: {},
        projectDirectory: 1,
        data: 1
      }
    }))
    expect(res.messages.length).toEqual(5)
  })

  it('env', async () => {
    const res = await validator(getConfig({
      env: {
        NODE_ENV: '"development"'
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('defineConstants', async () => {
    const res = await validator(getConfig({
      defineConstants: {
        A: '"a"'
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('alias', async () => {
    let res = await validator(getConfig({
      alias: {
        '@/components': 'src/components'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      alias: {
        '@/components': ['src/components'],
        '@/utils': 1,
        '@/project': {}
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('copy', async () => {
    let res = await validator(getConfig({
      copy: {
        patterns: [
          { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: ['*.js'] },
          { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' }
        ]
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      copy: {
        options: {
          ignore: ['*.js', '*.css']
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      copy: {
        patterns: [
          { ignore: ['*.js'] },
          { from: 'src/asset/tt/sd.jpg' },
          { to: 'dist/asset/tt/sd.jpg' }
        ],
        options: {
          ignore: [1, true, {}]
        }
      }
    }))
    expect(res.messages.length).toEqual(9)
  })

  it('mini.compile', async () => {
    let res = await validator(getConfig({
      mini: {
        compile: {
          exclude: [
            'src/pages/index/vod-wx-sdk-v2.js',
            modulePath => modulePath.indexOf('vod-wx-sdk-v2') >= 0
          ],
          include: [
            'src/pages/index/vod-wx-sdk-v2.js',
            modulePath => modulePath.indexOf('vod-wx-sdk-v2') >= 0
          ]
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        compile: {
          exclude: [null, []],
          include: [1, {}]
        }
      }
    }))
    expect(res.messages.length).toEqual(6)
  })

  it('mini.webpackChain', async () => {
    let res = await validator(getConfig({
      mini: {
        webpackChain (chain, webpack) {
          console.log(chain, webpack)
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        webpackChain: 'some'
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('mini.commonChunks', async () => {
    let res = await validator(getConfig({
      mini: {
        commonChunks: ['runtime', 'vendors', 'taro', 'common']
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        commonChunks (commonChunks) {
          commonChunks.push('yourCustomCommonChunkName')
          return commonChunks
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        commonChunks: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('mini.addChunkPages', async () => {
    let res = await validator(getConfig({
      mini: {
        addChunkPages (pages, pagesNames) {
          console.log(pages, pagesNames)
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        addChunkPages: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('mini.postcss', async () => {
    let res = await validator(getConfig({
      mini: {
        postcss: {
          autoprefixer: {
            enable: true,
            config: {}
          }
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        postcss: {
          autoprefixer: {
            enable: 1,
            config: 'a'
          },
          pxtransform: true
        }
      }
    }))
    expect(res.messages.length).toEqual(5)
  })

  it('mini.output', async () => {
    let res = await validator(getConfig({
      mini: {
        output: {}
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      mini: {
        output: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('mini\'s third party options', async () => {
    const res = await validator(getConfig({
      mini: {
        cssLoaderOption: {},
        styleLoaderOption: {},
        sassLoaderOption: {},
        lessLoaderOption: {},
        stylusLoaderOption: {},
        mediaUrlLoaderOption: {},
        fontUrlLoaderOption: {},
        imageUrlLoaderOption: {},
        miniCssExtractPluginOption: {}
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.devServer', async () => {
    let res = await validator(getConfig({
      h5: {
        devServer: {
          port: 10086
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        devServer: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.output', async () => {
    let res = await validator(getConfig({
      h5: {
        output: {
          filename: 'js/[name].[hash:8].js',
          chunkFilename: 'js/[name].[chunkhash:8].js'
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        output: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.publicPath', async () => {
    let res = await validator(getConfig({
      h5: {
        publicPath: '/'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        publicPath: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.staticDirectory', async () => {
    let res = await validator(getConfig({
      h5: {
        staticDirectory: '/'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        staticDirectory: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.chunkDirectory', async () => {
    let res = await validator(getConfig({
      h5: {
        chunkDirectory: '/'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        chunkDirectory: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.webpackChain', async () => {
    let res = await validator(getConfig({
      h5: {
        webpackChain (chain, webpack) {
          console.log(chain, webpack)
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        webpackChain: 'some'
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  // it('h5.webpack[DEPRECATED]', async () => {
  //   const res = await validator(getConfig({
  //     h5: {
  //       webpack: 1
  //     }
  //   }))
  //   expect(res.messages.length).toEqual(3)
  //   expect(res.messages[0].content).toEqual('h5.webpack "h5.webpack" is not allowed')
  // })

  it('h5.router', async () => {
    let res = await validator(getConfig({
      h5: {
        router: {
          mode: 'hash'
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        router: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.entry', async () => {
    let res = await validator(getConfig({
      h5: {
        entry: './path/to/my/entry/file.js'
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        entry: ['./path/to/my/entry/file.js', './path/other/file.js']
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        entry: {
          main: './path/to/my/entry/file.js'
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        entry: {
          main: ['./path/to/my/entry/file.js', './path/other/file.js']
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        entry: () => './demo'
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.enableSourceMap', async () => {
    let res = await validator(getConfig({
      h5: {
        enableSourceMap: true
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        enableSourceMap: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.enableExtract', async () => {
    let res = await validator(getConfig({
      h5: {
        enableExtract: true
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        enableExtract: 1
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.esnextModules', async () => {
    let res = await validator(getConfig({
      h5: {
        esnextModules: ['taro-ui']
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        esnextModules: [1, true, {}]
      }
    }))
    expect(res.messages.length).toEqual(4)

    res = await validator(getConfig({ h5: 1 }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.postcss', async () => {
    let res = await validator(getConfig({
      h5: {
        postcss: {
          autoprefixer: {
            enable: true,
            config: {}
          }
        }
      }
    }))
    expect(res.messages.length).toEqual(3)

    res = await validator(getConfig({
      h5: {
        postcss: {
          autoprefixer: {
            enable: 1,
            config: 'a'
          },
          pxtransform: true
        }
      }
    }))
    expect(res.messages.length).toEqual(5)
  })

  it('h5\'s third party options', async () => {
    const res = await validator(getConfig({
      h5: {
        cssLoaderOption: {},
        styleLoaderOption: {},
        sassLoaderOption: {},
        lessLoaderOption: {},
        stylusLoaderOption: {},
        mediaUrlLoaderOption: {},
        fontUrlLoaderOption: {},
        imageUrlLoaderOption: {},
        miniCssExtractPluginOption: {}
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('unknow', async () => {
    const res = await validator(getConfig({
      unknow: {}
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('mini.unknow', async () => {
    const res = await validator(getConfig({
      mini: {
        unknow: {}
      }
    }))
    expect(res.messages.length).toEqual(3)
  })

  it('h5.unknow', async () => {
    const res = await validator(getConfig({
      h5: {
        unknow: {}
      }
    }))
    expect(res.messages.length).toEqual(3)
  })
})
