import * as t from '@babel/types'

import { parseScript } from '../src/script'
import { parseWXML } from '../src/wxml'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

interface Option {
  script: string
  scriptPath: string
  wxml: object
  wxses: []
  refIds: Set<string>
  isApp: boolean
}

const option: Option = {
  script: '',
  scriptPath: '',
  wxml: {},
  wxses: [],
  refIds: new Set<string>(),
  isApp: false
}

describe('parseScript', () => {
  // 调用 parseWXML 需要用到的参数，因parseWXML会先获取缓存，所有每个用例的path需要保持其唯一性
  let path = ''
  // 解析app.js
  test('app.js', () => {
    option.script = `
      App({
          onLaunch(){
              console.log('onLaunch');
          }
      })
    `
    option.wxml = { type: 'NullLiteral' }
    const ast = parseScript(option.script, option.scriptPath, option.wxml as t.Expression, option.wxses, option.refIds, true)
    const code = generateMinimalEscapeCode(ast)
    expect(ast).toBeTruthy()
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
    option.wxml = { type: 'NullLiteral' }
    const ast = parseScript(option.script, option.scriptPath, option.wxml as t.Expression, option.wxses, option.refIds, true)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  // 当wxml是纯文本 parseWXML的返回值 { wxml } 影响js转换
  test('wxml jsxText', () => {
    option.script = `App({})`
    const wxmlStr = `123`
    // 调用 parseWXML 会首先获取缓存，所以第一个参数path建议保持唯一
    path = 'wxml_jsxText'
    const { wxml } = parseWXML(path, wxmlStr)
    const ast = parseScript(option.script, option.scriptPath, wxml as t.Expression, option.wxses, option.refIds, true)
    const code = generateMinimalEscapeCode(ast)
    expect(code).toMatchSnapshot()
  })

  // 当wxml存在变量 parseWXML的返回值 { wxml } 影响js转换
  test('wxml expression', () => {
    option.script = `
      App({
        data:{
            srt:'Hello Word!',
        }
      })
    `
    const wxmlStr = `<view>{{str}}</view>`
    // 调用 parseWXML 会首先获取缓存，所以第一个参数path建议保持唯一
    path = 'wxml_expression'
    const { wxml } = parseWXML(path, wxmlStr)
    const ast = parseScript(option.script, option.scriptPath, wxml as t.Expression, option.wxses, option.refIds, true)
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
    const wxmlStr = `
      <wxs src="../../utils/req.wxs" module="wxs_date"/>
      <view>{{wxs_date.date}}</view>
    `
    path = 'CommonJS_module_exports'
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
    const { wxml, wxses }:any = parseWXML(path,wxmlStr)
    option.wxml = wxml
    option.wxses = wxses
    const ast = parseScript(option.script, option.scriptPath, option.wxml as t.Expression, option.wxses, option.refIds, true)
    const code = generateMinimalEscapeCode(ast)
    expect(ast).toBeTruthy()
    expect(code).toMatchSnapshot()
  })
})
