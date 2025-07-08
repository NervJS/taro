import Convertor from '../src'
import { clearMockFiles, normalizePath, resFileMap, setMockFiles, updateMockFiles } from './__mocks__/fs-extra'
import { DEMO_JS_FILE_INFO, DEMO_PLUGIN_COMPLETE_DIRECTORY, root } from './data/fileData'
import { changeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(changeBackslashesSerializer)

const pathSystem = require('path')

jest.mock('path')

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs')
  return {
    ...originalModule,
    promises: {
      ...originalModule.promises,
      writeFile: jest.fn((path, data) => {
        let resPath = ''
        if (pathSystem.isAbsolute(path)) {
          const resArr = normalizePath(path).split(root)
          if (resArr.length === 0) {
            resPath = normalizePath(path).split(root)[0]
          } else {
            resPath = normalizePath(path).split(root)[1]
          }
        }
        if (Buffer.isBuffer(data)) {
          data = Buffer.from(data).toString('utf8')
        }
        resFileMap.set(root + resPath, data)
      }),
      stat: jest.fn(() => {
        return {
          isDirectory: () => true,
        }
      }),
    },
  }
})

describe('日志', () => {
  beforeAll(() => {
    // mock 报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('生成日志', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    const convertor = new Convertor(root, false)
    convertor.run()
    expect(resFileMap.get('/wxProject/taroConvert/.convert/convert.log')).toMatchSnapshot()
  })
})

describe('转换报告', () => {
  beforeEach(() => {
    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
    jest.restoreAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('生成转换报告文件', () => {
    const REPORT_DEMO = {
      '/pages': {
        '/index': {
          '/index.js': `
            const app = getApp()
            Page({
              data: {
                motto: 'Hello World',
              },
              onLoad() {}
            })
          `,
          '/index.json': `
            {
              "usingComponents": {}
            }
          `,
          '/index.wxml': `
            <view>
              <text>{{motto}}</text>
            </view>
          `,
          '/index.wxss': '',
        },
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, REPORT_DEMO)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report/static/media/HarmonyOS_Sans_SC_Medium.ttf')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media/HarmonyOS_Sans_SC_Bold.ttf')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/favicon.ico')).toBeTruthy()
    resFileMap.delete('/wxProject/taroConvert/report/static/media/HarmonyOS_Sans_SC_Medium.ttf')
    resFileMap.delete('/wxProject/taroConvert/report/static/media/HarmonyOS_Sans_SC_Bold.ttf')
    resFileMap.delete('/wxProject/taroConvert/report/favicon.ico')

    expect(resFileMap).toMatchSnapshot()
    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })
})

describe('生成转换报告及日志', () => {
  beforeEach(() => {
    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
    jest.restoreAllMocks()
  })

  test('app.json 不存在', () => {
    const NO_APP_JSON = {
      '/pages': {
        '/index': {
          '/index.js': `Page({})`,
          '/index.json': `{}`,
          '/index.wxml': ``,
          '/index.wxss': '',
        },
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
    }
    setMockFiles(root, NO_APP_JSON)
    jest.spyOn(process, 'exit').mockImplementation()
    const spy = jest.spyOn(console, 'log')
    const convert = new Convertor(root, false)
    expect(spy).toHaveBeenCalledTimes(3)
    convert.generateReport()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('图片路径不存在', () => {
    const IMAGE_PATH_NO = {
      '/pages': {
        '/index': {
          '/index.js': `Page({})`,
          '/index.json': `{}`,
          '/index.wxml': `<image src="/images/tutu.jpg" mode=""/>`,
          '/index.wxss': '',
        },
      },
      '/images': {
        '/tu.jpg': '',
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, IMAGE_PATH_NO)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('没有注册插件', () => {
    const NO_REGISTERED_PLUGIN = {
      '/miniprogram': {
        '/app.json': `{
          "pages": [
            "pages/index/index"
          ],
          "plugins": {}
        }`,
        '/pages': {
          '/index': {
            '/index.js': `Page({})`,
            '/index.wxml': ``,
            '/index.json': `{}`,
            '/index.wxss': ``,
          }
        }
      },
    }
    setMockFiles(root, DEMO_PLUGIN_COMPLETE_DIRECTORY)
    updateMockFiles(root, NO_REGISTERED_PLUGIN)
    jest.spyOn(process, 'exit').mockImplementation()
    const convertor = new Convertor(root, false)
    convertor.generateReport()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('自定义组件没有 js 文件', () => {
    const COMPONENT_NO_JS = {
      '/pages': {
        '/index': {
          '/index.js': `Page({})`,
          '/index.json': `
            {
              "usingComponents": {
                "com":"/components/index/index"
              }
            }
          `,
          '/index.wxml': ``,
          '/index.wxss': '',
        },
      },
      '/components': {
        '/index': {
          '/index.wxml': ''
        }
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, COMPONENT_NO_JS)
    const convertor = new Convertor(root, false)
    convertor.run()
    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('引用插件路径格式异常', () => {
    const PLUGIN_PATH_ABNORMAL = {
      '/miniprogram': {
        '/app.json': `{
          "pages": [
            "pages/index/index"
          ],
          "plugins": {
            "hello-plugin": {
              "version": "dev",
              "provider": "wx4cdb21d9ed86dd14"
            }
          },
          "usingComponents": {
            "hello-list": "plugin://hello-component"
          }
        }`,
        '/pages': {
          '/index': {
            '/index.js': `Page({})`,
            '/index.wxml': ``,
            '/index.json': `{

            }`,
            '/index.wxss': ``,
          }
        }
      }
    }
    setMockFiles(root, DEMO_PLUGIN_COMPLETE_DIRECTORY)
    updateMockFiles(root, PLUGIN_PATH_ABNORMAL)
    const convertor = new Convertor(root, false)
    convertor.run()
    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('插件配置信息为空，解析 plugin.json 失败', () => {
    const PLUGIN_PATH_ABNORMAL = {
      '/plugin': {
        '/components': {
          '/hello-component.js': `Component({})`,
          '/hello-component.wxml': `<text>plugin/components/hello-component.wxml</text>`,
          '/hello-component.json': `{
            "component": true,
            "usingComponents": {}
            }`,
          '/hello-component.wxss': ``,
        },
        '/pages': {
          '/hello-page.js': `Page({})`,
          '/hello-page.wxml': '<text>This is a plugin page!</text>',
          '/hello-page.json': '{}',
          '/hello-page.wxss': '',
        },
        '/plugin.json': Buffer.alloc(0),
      },
    }
    setMockFiles(root, DEMO_PLUGIN_COMPLETE_DIRECTORY)
    updateMockFiles(root, PLUGIN_PATH_ABNORMAL)
    jest.spyOn(process, 'exit').mockImplementation()
    const convertor = new Convertor(root, false)
    convertor.generateReport()
    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('project.config.json 中 pluginRoot 为空或未配置', () => {
    const NO_PLUGINROOT = {
      '/project.config.json': `
        {
          "miniprogramRoot": "miniprogram/",
          "pluginRoot": "",
          "compileType": "plugin"
        }
      `
    }
    setMockFiles(root, DEMO_PLUGIN_COMPLETE_DIRECTORY)
    updateMockFiles(root, NO_PLUGINROOT)
    jest.spyOn(process, 'exit').mockImplementation()
    const convertor = new Convertor(root, false)
    convertor.generateReport()
    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('引用了未注册的插件组件', () => {
    const USE_NOT_REGISTERED_COMPONENT = {
      '/plugin': {
        '/components': {
          '/hello-component.js': `Component({})`,
          '/hello-component.wxml': `<text>plugin/components/hello-component.wxml</text>`,
          '/hello-component.json': `{
            "component": true,
            "usingComponents": {}
            }`,
          '/hello-component.wxss': ``,
        },
        '/pages': {
          '/hello-page.js': `Page({})`,
          '/hello-page.wxml': '<text>This is a plugin page!</text>',
          '/hello-page.json': '{}',
          '/hello-page.wxss': '',
        },
        '/plugin.json': `
          {
            "pages": {
              "hello-page": "pages/hello-page"
            },
            "main": "index.js"
          }
        `,
      }
    }
    setMockFiles(root, DEMO_PLUGIN_COMPLETE_DIRECTORY)
    updateMockFiles(root, USE_NOT_REGISTERED_COMPONENT)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('三方依赖未安装', () => {
    const NODE_MODULES_NO_INSTALL = {
      '/pages': {
        '/index': {
          '/index.js': `
            import moment from 'moment'
            Page({
              data:{
                time:moment(new Date()).format('YYYY-MM-DD')
              }
            })
          `,
          '/index.json': `{}`,
          '/index.wxml': ``,
          '/index.wxss': '',
        },
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages": [
            "pages/index/index"
          ]
        }
      `,
      '/node_modules': {}
    }

    setMockFiles(root, NODE_MODULES_NO_INSTALL)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('js 文件中，引用不存在的文件（相对路径）', () => {
    const JS_IMPORT_NOT_EXIST_FILE = {
      '/pages': {
        '/index': {
          '/index.js': `
            import './add'
            Page({})
          `,
          '/index.json': `{}`,
          '/index.wxml': ``,
          '/index.wxss': '',
        }
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, JS_IMPORT_NOT_EXIST_FILE)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('js 文件中，引用不存在的文件（绝对路径）', () => {
    const JS_IMPORT_NOT_EXIST_FILE = {
      '/pages': {
        '/index': {
          '/index.js': `
            import '/add'
            Page({})
          `,
          '/index.json': `{}`,
          '/index.wxml': ``,
          '/index.wxss': '',
        }
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, JS_IMPORT_NOT_EXIST_FILE)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('utils 文件中不存在 index.js 文件', () => {
    const UTILS_NO_INDEXJS_FILE = {
      '/pages': {
        '/index': {
          '/index.js': `
            const utils = require("../../utils")
            Page ({
              onLoad: function() {
                utils.myFunction()
              }
            })
          `,
          '/index.json': `
            {
              "usingComponents": {
                "utils": "/utils/utils"
              }
            }
          `,
          '/index.wxml': ``,
          '/index.wxss': '',
        }
      },
      '/utils': {
        '/utils': {
          '/utils.js': `
            const myUtil = {
              myFunction: function() {
              }
            }
            module.exports = myUtil
          `,
          '/utils.json': `{}`,
          '/utils.wxml': ``,
          '/utils.wxss': '',
        }
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }

    setMockFiles(root, UTILS_NO_INDEXJS_FILE)
    const convertor = new Convertor(root, false)
    convertor.run()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })
})
