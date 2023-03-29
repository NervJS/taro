import validator from '../doctor/configValidator'

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
    configPath: ''
  }
}

describe('config validator of doctor', () => {
  it('should config include\'s all the required values', async () => {
    let { lines } = await validator({
      projectConfig: {},
      configPath: ''
    })

    expect(lines.length).toEqual(4)
    let msgs = lines.map(line => line.desc)
    expect(msgs.includes('projectName 必须填写')).toBeTruthy()
    expect(msgs.includes('sourceRoot 必须填写')).toBeTruthy()
    expect(msgs.includes('outputRoot 必须填写')).toBeTruthy()
    expect(msgs.includes('framework 必须填写')).toBeTruthy()

    const res = await validator({
      projectConfig: {
        projectName: '',
        sourceRoot: '',
        outputRoot: '',
        framework: ''
      },
      configPath: ''
    })
    lines = res.lines

    expect(lines.length).toEqual(4)
    msgs = lines.map(line => line.desc)
    expect(msgs.includes('projectName "projectName" is not allowed to be empty')).toBeTruthy()
    expect(msgs.includes('sourceRoot "sourceRoot" is not allowed to be empty')).toBeTruthy()
    expect(msgs.includes('outputRoot "outputRoot" is not allowed to be empty')).toBeTruthy()
    expect(msgs.includes('framework "framework" must be one of [nerv, react, preact, vue, vue3, solid]')).toBeTruthy()
  })

  it('date', async () => {
    let { lines } = await validator(getConfig({
      date: '2020-5-26'
    }))

    expect(lines.length).toEqual(0)

    const res = await validator(getConfig({
      date: 'abc'
    }))
    lines = res.lines

    expect(lines.length).toEqual(1)
    expect(lines[0].desc).toEqual('date 应该为一个日期')
  })

  it('framework', async () => {
    let res = await validator(getConfig({
      framework: 'react'
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      framework: 'vue'
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      framework: 'nerv'
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      framework: 'vue3'
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      framework: 'solid'
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      framework: 'other'
    }))
    expect(res.lines.length).toEqual(1)
    expect(res.lines[0].desc).toEqual('framework "framework" must be one of [nerv, react, preact, vue, vue3, solid]')
  })

  it('designWidth', async () => {
    let res = await validator(getConfig({
      designWidth: '750'
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      designWidth: 'a'
    }))
    expect(res.lines.length).toEqual(1)

    res = await validator(getConfig({
      designWidth: 700.5
    }))
    expect(res.lines.length).toEqual(1)

    res = await validator(getConfig({
      designWidth: -640
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('deviceRatio', async () => {
    let res = await validator(getConfig({
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      deviceRatio: {
        640: 2.34 / 2,
        750: 'a',
        828: 1.81 / 2
      }
    }))
    expect(res.lines.length).toEqual(1)
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
    expect(res.lines.length).toEqual(0)

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
    expect(res.lines.length).toEqual(6)
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
    expect(res.lines.length).toEqual(0)

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
    expect(res.lines.length).toEqual(6)
  })

  it('terser', async () => {
    let res = await validator(getConfig({
      terser: {
        enable: true,
        config: {
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      terser: {
        enables: true,
        enable: 1,
        config: []
      }
    }))
    expect(res.lines.length).toEqual(3)
  })

  it('csso', async () => {
    let res = await validator(getConfig({
      csso: {
        enable: true,
        config: {
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      csso: {
        enables: true,
        enable: 1,
        config: []
      }
    }))
    expect(res.lines.length).toEqual(3)
  })

  it('uglify', async () => {
    let res = await validator(getConfig({
      uglify: {
        enable: true,
        config: {
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      uglify: {
        enables: true,
        enable: 1,
        config: []
      }
    }))
    expect(res.lines.length).toEqual(3)
  })

  it('sass', async () => {
    let res = await validator(getConfig({
      sass: {
        resource: '/src/styles/variable.scss'
      }
    }))
    expect(res.lines.length).toEqual(0)

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
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      sass: {
        resource: {},
        projectDirectory: 1,
        data: 1
      }
    }))
    expect(res.lines.length).toEqual(3)
  })

  it('env', async () => {
    const res = await validator(getConfig({
      env: {
        NODE_ENV: '"development"'
      }
    }))
    expect(res.lines.length).toEqual(0)
  })

  it('defineConstants', async () => {
    const res = await validator(getConfig({
      defineConstants: {
        A: '"a"'
      }
    }))
    expect(res.lines.length).toEqual(0)
  })

  it('alias', async () => {
    let res = await validator(getConfig({
      alias: {
        '@/components': 'src/components'
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      alias: {
        '@/components': ['src/components'],
        '@/utils': 1,
        '@/project': {}
      }
    }))
    expect(res.lines.length).toEqual(3)
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
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      copy: {
        options: {
          ignore: ['*.js', '*.css']
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

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
    expect(res.lines.length).toEqual(7)
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
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      mini: {
        compile: {
          exclude: [null, []],
          include: [1, {}]
        }
      }
    }))
    expect(res.lines.length).toEqual(4)
  })

  it('mini.webpackChain', async () => {
    let res = await validator(getConfig({
      mini: {
        webpackChain (chain, webpack) {
          console.log(chain, webpack)
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      mini: {
        webpackChain: 'some'
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('mini.commonChunks', async () => {
    let res = await validator(getConfig({
      mini: {
        commonChunks: ['runtime', 'vendors', 'taro', 'common']
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      mini: {
        commonChunks (commonChunks) {
          commonChunks.push('yourCustomCommonChunkName')
          return commonChunks
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      mini: {
        commonChunks: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('mini.addChunkPages', async () => {
    let res = await validator(getConfig({
      mini: {
        addChunkPages (pages, pagesNames) {
          console.log(pages, pagesNames)
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      mini: {
        addChunkPages: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
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
    expect(res.lines.length).toEqual(0)

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
    expect(res.lines.length).toEqual(3)
  })

  it('mini.output', async () => {
    let res = await validator(getConfig({
      mini: {
        output: {}
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      mini: {
        output: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
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
    expect(res.lines.length).toEqual(0)
  })

  it('h5.devServer', async () => {
    let res = await validator(getConfig({
      h5: {
        devServer: {
          port: 10086
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        devServer: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
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
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        output: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.publicPath', async () => {
    let res = await validator(getConfig({
      h5: {
        publicPath: '/'
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        publicPath: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.staticDirectory', async () => {
    let res = await validator(getConfig({
      h5: {
        staticDirectory: '/'
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        staticDirectory: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.chunkDirectory', async () => {
    let res = await validator(getConfig({
      h5: {
        chunkDirectory: '/'
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        chunkDirectory: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.webpackChain', async () => {
    let res = await validator(getConfig({
      h5: {
        webpackChain (chain, webpack) {
          console.log(chain, webpack)
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        webpackChain: 'some'
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.webpack[DEPRECATED]', async () => {
    const res = await validator(getConfig({
      h5: {
        webpack: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
    expect(res.lines[0].desc).toEqual('h5.webpack "h5.webpack" is not allowed')
  })

  it('h5.router', async () => {
    let res = await validator(getConfig({
      h5: {
        router: {
          mode: 'hash'
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        router: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.entry', async () => {
    let res = await validator(getConfig({
      h5: {
        entry: './path/to/my/entry/file.js'
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        entry: ['./path/to/my/entry/file.js', './path/other/file.js']
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        entry: {
          main: './path/to/my/entry/file.js'
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        entry: {
          main: ['./path/to/my/entry/file.js', './path/other/file.js']
        }
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        entry: () => './demo'
      }
    }))
    expect(res.lines.length).toEqual(0)
  })

  it('h5.enableSourceMap', async () => {
    let res = await validator(getConfig({
      h5: {
        enableSourceMap: true
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        enableSourceMap: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.enableExtract', async () => {
    let res = await validator(getConfig({
      h5: {
        enableExtract: true
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        enableExtract: 1
      }
    }))
    expect(res.lines.length).toEqual(1)
  })

  it('h5.esnextModules', async () => {
    let res = await validator(getConfig({
      h5: {
        esnextModules: ['taro-ui']
      }
    }))
    expect(res.lines.length).toEqual(0)

    res = await validator(getConfig({
      h5: {
        esnextModules: [1, true, {}]
      }
    }))
    expect(res.lines.length).toEqual(3)

    res = await validator(getConfig({ h5: 1 }))
    expect(res.lines.length).toEqual(1)
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
    expect(res.lines.length).toEqual(0)

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
    expect(res.lines.length).toEqual(3)
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
    expect(res.lines.length).toEqual(0)
  })

  it('unknow', async () => {
    const res = await validator(getConfig({
      unknow: {}
    }))
    expect(res.lines.length).toEqual(0)
  })

  it('mini.unknow', async () => {
    const res = await validator(getConfig({
      mini: {
        unknow: {}
      }
    }))
    expect(res.lines.length).toEqual(0)
  })

  it('h5.unknow', async () => {
    const res = await validator(getConfig({
      h5: {
        unknow: {}
      }
    }))
    expect(res.lines.length).toEqual(0)
  })
})
