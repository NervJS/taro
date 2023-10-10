import * as t from '@babel/types'

import { parseScript } from '../src/script'
import { parseWXML , WXS } from '../src/wxml'


interface Option {
  script: string
  scriptPath:string
  wxml: object
  wxses: WXS[]
  refIds: Set<string> 
  isApp: boolean
}

const option:Option = {
  script: '',
  scriptPath: '',
  wxml: {},
  wxses: [],
  refIds: new Set<string>(),
  isApp: false
}
describe('parseScript', () => {

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
    expect(ast).toBeTruthy()
    expect(ast).toMatchSnapshot()
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
    expect(ast).toMatchSnapshot()
  })

  // 当wxml是纯文本
  test('wxml jsxText', () => {
    option.script = `App({})`
    const wxmlStr = `123`
    // 调用 parseWXML 会首先获取缓存，所以第一个参数建议保持唯一。以下用例同理
    const { wxml } = parseWXML('wxml_jsxText', wxmlStr)
    const ast = parseScript(option.script, option.scriptPath, wxml as t.Expression, option.wxses, option.refIds, true)
    expect(ast).toMatchSnapshot()
  })

  // 当wxml存在变量
  test('wxml expression', () => {
    option.script = `
      App({
        data:{
            srt:'Hello Word!',
        }
      })
    `
    const wxmlStr = `<view>{{str}}</view>`
    const { wxml } = parseWXML('wxml_expression', wxmlStr)
    const ast = parseScript(option.script, option.scriptPath, wxml as t.Expression, option.wxses, option.refIds, true)
    expect(ast).toMatchSnapshot()
  })
})