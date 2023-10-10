import { parseContent,parseWXML } from '../src/wxml'

interface Option {
  path: string
  rootPath: string
  framework: 'react' | 'vue'
  json?: string
  script?: string
  scriptPath?: string
  wxml?: string
  isApp?: boolean
}

const option: Option = {
  framework: 'react',
  json: '{}',
  path: '',
  rootPath: '',
  script: '',
  scriptPath: '',
  wxml: ''
}

describe('wxml.ts测试', () => {
  
  test('当wxml 是 undefined', () => {
    option.wxml = undefined
    // 存在缓存  需改变path  以下涉及parseWXML测试用例的同理
    option.path = 'wxml_undefined'
    const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
    expect(wxml?.type).toBe('NullLiteral')
    expect(wxses).toEqual([])
    expect(imports).toEqual([])
    expect(Array.from(refIds)).toEqual(Array.from(new Set()))
  })

  test('wxml 简单应用', () => {
    option.wxml = `<view>Hello Word!</view>`
    option.path = 'wxml__'
    const { wxml } = parseWXML(option.path, option.wxml)
    // wxml转为ast
    expect(wxml).toBeTruthy()
    expect(wxml?.type).toBe('JSXElement')
  })

  test('wxml 中存在 wxs', () => {
    option.wxml = `<wxs module="wxs_demo">
                        module.exports = {
                            data: 'wxs demo'
                        }
                    </wxs>
                    <view>Hello Word!</view>
                    <view>{{wxs_demo.data}}</view>`
    option.path = 'wxml_wxs'
    const { wxses, imports } = parseWXML(option.path, option.wxml)
    expect(wxses).toMatchSnapshot()
    expect(imports).toMatchSnapshot()
  })
})

describe('parseContent', () => {
  test('节点key的值解析', () => {
    const contentInput = `{{list}}`
    const { type, content } = parseContent(contentInput)
    expect(type).toBe('expression')
    expect(content).toBe(`(list)`)
  })
})
