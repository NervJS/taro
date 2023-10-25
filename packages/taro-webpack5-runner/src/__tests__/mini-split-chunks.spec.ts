import * as fs from 'fs-extra'
import * as path from 'path'

let compile
let readDir

describe('mini-split-chunks', () => {
  beforeAll(() => {
    jest.unmock('webpack')
  })

  beforeEach(() => {
    jest.resetModules()
    const compiler = require('./utils/compiler')
    compile = compiler.compile
    readDir = compiler.readDir
  })

  test('should process mini-split-chunks', async () => {
    const appName = 'mini-split-chunks'
    const { stats, config } = await compile(appName, {
      platformType: 'mini',
      webpackChain (chain) {
        chain.merge({
          externals: [
            'lodash'
          ]
        })
      },
      optimizeMainPackage: {
        enable: true,
        exclude: [
          path.resolve(__dirname, './fixtures/mini-split-chunks/src/utils/testExcludeString.js'),
          (module) => module.resource?.indexOf('testExcludeFunction') >= 0
        ]
      },
      postcss: {
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    })

    const assets = stats.toJson().assets || []
    expect(assets.length).toMatchSnapshot()

    const files = readDir(fs, config.outputRoot)

    /**
     * 因为该plugin输出的文件名跟用户路径有关，snapshot输出的文件内容不稳定，这里改用判断输出文件是否存在来测试
     */
    files.forEach(file => {
      const fileContent = fs.readFileSync(file).toString()
      const jsExt = '.js'
      const wxssExt = '.wxss'
      const needTestPages = [
        'packageA/detail/index',
        'packageA/my/index',
        'packageB/list/index'
      ]
      const checkChunksExist = ({ ext, regexp }) => {
        const isNeedTestFile = needTestPages.find(needTestPage => new RegExp(`${needTestPage}${ext}$`).test(file))

        if (!isNeedTestFile) return

        const chunkPaths: string[] = []
        const matchChunks = (fileContent || '').match(new RegExp(regexp, 'g'))
        ;(matchChunks || []).forEach(chunkPath => {
          const regex =new RegExp(regexp, 'g')
          const matches = [...chunkPath.matchAll(regex)]
          const paths: string[] = matches.map(match => {
            // @ts-ignore
            return match[0].match(/"([^"]+)"/)[1] || match[0].match(/'([^']+)'/)[1]
          })
          chunkPaths.push(...paths)
        })

        chunkPaths.forEach(chunkPath => {
          const chunkAbsolutePath = path.resolve(file, '..', chunkPath)
          const isExists = fs.pathExistsSync(chunkAbsolutePath)

          // 根据match到的module path查看输出的chunk是否存在
          expect(isExists).toBe(true)
        })
      }

      // js
      if (path.extname(file) === jsExt) {
        checkChunksExist({
          ext: jsExt,
          regexp: 'require\\([\'"]\\.\\.\\/.*?[\'"]\\)'
        })
      }

      // wxss
      if (path.extname(file) === wxssExt) {
        checkChunksExist({
          ext: wxssExt,
          regexp: new RegExp('@import "(.*)";')
        })
      }
    })
  })
})
