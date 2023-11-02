import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'
import { generateMinimalEscapeCode } from './util'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

interface ITaroizeOptions {
  json?: string
  script?: string
  wxml?: string
  path?: string
  rootPath?: string
  scriptPath?: string
  logFilePath?: string
}

describe('parseAst', () => {
  let convert
  let param: ITaroizeOptions
  beforeAll(() => {
    const entryJSON = { pages: ['pages/index/index'] }
    /**
     * json：index.json的内容
     * path：index的根目录（文件路径)
     * rootPath：小程序的根目录（文件路径）
     * script：index.js的内容
     * scriptPath：index.js的绝对路径
     * wxml：index.html的内容
     * logFilePath：convert.log的文件路径
     */
    param = {
      json: '{}',
      path: '',
      rootPath: '',
      script: '',
      scriptPath: '',
      wxml: '',
      logFilePath: ''
    }

    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
    
    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
  })

  test('当使用e.target.dataset时引入工具函数 getTarget', () => {
    param.script = `
      app.createPage({
        data:{
          tagInfo:{
            id:123456,
            data:'茅台',
          },
          msg:'',
          tagName:{}  
        },
        getMsg(e){
          const detail = e.currentTarget
          //变量赋值
          const tagName_ = e.currentTarget.dataset.tagName
          const tagData_ = e.currentTarget.dataset.tagData
          //结构赋值
          const { tagName } = e?.target?.dataset
          const { tagData } = e?.target?.dataset
        },
        getMsg02(e){
          const detail = e.currentTarget
          const tagname_ = e.currentTarget.dataset.tagname
          const tagdata_ = e.currentTarget.dataset.tagdata
          const { tagname } = detail?.dataset
          const { tagdata } = detail?.dataset
        },
      })
    `

    param.wxml = `
      <view>测试data-xxx-xxx写法</view>
      <button data-tag-name="WX1314" data-tag-data="{{ tagInfo }}" bindtap="getMsg">获取</button>
      <view>测试data-xxxXxxx 驼峰写法</view>
      <button data-tagName="WX1314" data-tagData="{{ tagInfo }}" bindtap="getMsg02">获取</button>
      `

    // 解析wxml的时候有缓存，需保证test的path唯一
    param.path = 'e_target_dataset'
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })
    
    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  // 测试require
  // 场景1：require引用为空
  test('require引用为空', () => {
    param.script = `const aa = require()`
    param.wxml = ''

    // 解析wxml的时候有缓存，需保证test的path唯一
    param.path = 'require'

    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: [],
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  // 场景1：require引用包含变量
  test('require引用包含变量', () => {
    param.script = `const aa = require('aa' + aa)`
    param.wxml = ''

    // 转换页面js脚本
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    expect(() =>
      convert.parseAst({
        ast: taroizeResult.ast,
        sourceFilePath: '',
        outputFilePath: '',
        importStylePath: '',
        depComponents: new Set(),
        imports: [],
      })
    ).toThrow()
  })
})
