import { parse } from '../src'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('parseScript', () => {
  let option: any

  beforeAll(() => {
    option = {
      script: '',
      scriptPath: '',
      wxml: '',
      path: '',
      rootPath: '',
      framework: 'react',
      isApp: false,
      logFilePath: '',
      pluginInfo: {}
    }
  })

  // 解析app.js
  test('app.js', () => {
    option.script = `
      App({
          onLaunch(){
              console.log('onLaunch');
          }
      })
    `
    // app.js 没有对应的wxml文件
    option.wxml = undefined
    option.path = 'app_js'
    option.isApp = true
    const { ast } = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  // 当存在 getAPP 或 getCurrentPages 方法
  test('getAPP || getCurrentPages', () => {
    option.script = `
      App({
          onLaunch(){
              const appInstance = getApp();
              console.log('页面栈信息：', getCurrentPages());
          }
      })
    `
    // app.js 没有对应的wxml文件
    option.wxml = undefined
    option.path = 'getApp_or_getCurrentPages'
    option.isApp = true
    const { ast } = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  // 当wxml是纯文本
  test('wxml jsxText', () => {
    option.script = `Page({})`
    option.wxml = `123`
    option.path = 'wxml_jsxText'
    option.isApp = false
    const { ast } = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  // 当wxml存在变量
  test('wxml expression', () => {
    option.script = `
      Page({
        data:{
            srt:'Hello Word!',
        }
      })
    `
    option.wxml = '<view>{{str}}</view>'
    option.path = 'wxml_expression'
    option.isApp = false
    const { ast } = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  test('CommonJS 导出页面', () => {
    /**
     *  wxs内容
     * module.exports = {
          date:'2023-11-11'
        }
     */
    option.wxml = `
      <wxs src="../../utils/req.wxs" module="wxs_date"/>
      <view>{{wxs_date.date}}</view>
    `
    option.path = 'CommonJS_module_exports'
    option.script = `
      module.exports = {
        data: {
          message: 'Hello, Mini Program!'
        },
        onLoad() {
          console.log('Page loaded.');
        },
      }
    `
    option.isApp = false
    const { ast } = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(ast).toBeTruthy()
    expect(code).toMatchSnapshot()
  })

  test('page页面通过插件url跳转到插件页面', () => {
    /**
     * plugin的目录结构以及内容
     *  /plugin/plugin.json:"{
                                "pages": {
                                  "hello-page": "pages/hello-page"
                                },
                                "main": "index.js"
                              }",
        /plugin/pages/hello-page.wxml:"<text>This is a plugin page!</text>",
        /plugin/pages/hello-page.js:"Page({})",
     */
    // 插件的解析在 taro-cli-convertor 中进行
    option.pluginInfo = {
      pluginRoot: '/wxProject/plugin',
      pluginName: 'hello-plugin',
      pages: new Set(['pages/hello-page']),
      pagesMap: new Map([['hello-page', 'pages/hello-page']]),
      publicComponents: {},
      entryFilePath: '/wxProject/plugin/index.js',
    }
    option.path = '/wxProject/miniprogram/pages/index'
    option.rootPath = '/wxProject/miniprogram'
    option.script = `
      Page({
        pluginUrl() {
          wx.navigateTo({
            url: 'plugin://hello-plugin/hello-page',
          })
        }
      })`
    option.scriptPath = '/wxProject/miniprogram/pages/index/index.js'
    option.wxml = `<button bindtap="pluginUrl">跳转到plugin</button>`
    option.isApp = false
    const { ast } = parse(option)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })
})
