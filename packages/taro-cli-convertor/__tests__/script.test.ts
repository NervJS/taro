import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'
import { copyFileToTaro, getMatchUnconvertDir, transRelToAbsPath } from '../src/util'

const fs = require('fs')
const path = require('path')

describe('语法转换', () => {
  test('使用新建的setData替换组件中this.data.xx，实现this.data.xx的转换', () => {
    const entryJSON = { 'pages': ['pages/index/index'] }
    // json：index.json的内容  path：index的根目录（文件路径）  rootPath：小程序的根目录（文件路径）   
    // script：index.js的内容   scriptPath：index.js的绝对路径  wxml：index.html的内容
    const param = {
      json:'{}',
      path:'',
      rootPath:'',
      script:'this.data.intData = 1024',
      scriptPath:'',
      wxml:''
    }
    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    const convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })
    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast:taroizeResult.ast,
      sourceFilePath:'',
      outputFilePath:'',
      importStylePath:'',
      depComponents: new Set(),
      imports:[]
    })
    expect(ast).toMatchSnapshot()
  })

  test('组件的动态名称转换', () => {
    const entryJSON = { 'pages': ['pages/index/index'] }
    // json：index.json的内容  path：index的根目录（文件路径）  rootPath：小程序的根目录（文件路径）   
    // script：index.js的内容   scriptPath：index.js的绝对路径  wxml：index.html的内容
    const param = {
      json:'{}',
      path:'',
      rootPath:'',
      script:'',
      scriptPath:'',
      wxml:`<view wx:for="{{infoList}}" wx:key="infoId">
              <template is="info-{{item.tempName}}" data="{{item}}"></template>
            </view>`
    }
    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    const convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })
    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast:taroizeResult.ast,
      sourceFilePath:'',
      outputFilePath:'',
      importStylePath:'',
      depComponents: new Set(),
      imports:[]
    })
    expect(ast).toMatchSnapshot()
  })

  test('css中字母+数字+pX会转换成px', async () => {
    const convert = new Convertor('', false)
    const { css } = await convert.styleUnitTransform('', 'background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
    expect(css).toBe('background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
  })
})

describe('文件转换', () => {
  test('拷贝tsconfig.json文件到转换后的工程', () => {
    const convert = new Convertor('', false)
    const selfDefinedConfig: any = []
    // 目前只有tsconfig.json，还有的话继续加到array里
    selfDefinedConfig[0] = `tsconfig${convert.fileTypes.CONFIG}`
    for (const tempConfig of selfDefinedConfig) {
      const tempConfigPath = path.join(convert.root, tempConfig)
      if (fs.existsSync(tempConfig)) {
        const outputFilePath = path.join(convert.convertRoot, tempConfig)
        copyFileToTaro(tempConfigPath, outputFilePath)
        expect(fs.existsSync(outputFilePath)).toBe(true)
      }
    }
  })

  test('适配convert.config.json，对符合json内路径的文件，在其被导入时不做转换', () => {
    const convert = new Convertor('', false)
    const root = transRelToAbsPath('', ['./taro-cli-convertor'])[0].replace(/\\/g, '/')
    // 处理convert.config.json，并存储到convertConfig中
    const convertJsonPath: string = path.join(root, `convert.config${convert.fileTypes.CONFIG}`)
    const convertJson = { 'external': ['./taroConvert/'] }
    const convertConfig = { ...convertJson }
    convertConfig.external = transRelToAbsPath(convertJsonPath, convertConfig.external)
    // 处理不转换的目录，可在convert.config.json中external字段配置
    const filePath = transRelToAbsPath(convertJsonPath, ['./taroConvert/tsconfig.json'])
    const matchUnconvertDir: string | null = getMatchUnconvertDir(filePath[0], convertConfig?.external)
    if (matchUnconvertDir !== null) {
      // 支持用户在convert.config.json中配置不转换的目录
      const outputFilePath = 'src/taroConvert'
      if (!fs.existsSync(outputFilePath)) {
        copyFileToTaro(matchUnconvertDir, outputFilePath)
      }
      expect(fs.existsSync(outputFilePath)).toBe(true)
    }
  })
})