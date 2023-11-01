import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'
import { copyFileToTaro, getMatchUnconvertDir, transRelToAbsPath } from '../src/util'
import { generateMinimalEscapeCode } from './util'

const fs = require('fs')
const path = require('path')

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

describe('语法转换', () => {
  let convert
  let param: ITaroizeOptions
  beforeAll(() => {
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
    convert = new Convertor('', false)
  })

  test('使用新建的setData替换组件中this.data.xx，实现this.data.xx的转换', () => {
    param.script = 'this.data.intData = 1024'
    const taroizeResult = taroize({
      ...param,
      framework: 'react'
    })

    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: []
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('组件的动态名称转换', () => {
    param.wxml = `<view wx:for="{{infoList}}" wx:key="infoId">
              <template is="info-{{item.tempName}}" data="{{item}}"></template>
            </view>`
    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })

    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: []
    })
    
    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('css中字母+数字+pX会转换成px', async () => {
    const { css } = await convert.styleUnitTransform('', 'background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
    expect(css).toBe('background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
  })
})

describe('文件转换', () => {
  let convert
  beforeAll(() => {
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
    convert = new Convertor('', false)
  })

  test('拷贝tsconfig.json文件到转换后的工程', () => {
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
    const root = transRelToAbsPath('', ['./taro-cli-convertor'])[0].replace(/\\/g, '/')
    
    // 处理convert.config.json，并存储到convertConfig中
    const convertJsonPath: string = path.join(root, `convert.config${convert.fileTypes.CONFIG}`)
    const convertJson = { 'external': ['./taroConvert/'] }
    const convertConfig = { ...convertJson }
    convertConfig.external = transRelToAbsPath(convertJsonPath, convertConfig.external)
    
    // 处理不转换的目录，可在convert.config.json中external字段配置
    const filePath = transRelToAbsPath(convertJsonPath, [`./taroConvert/tsconfig${convert.fileTypes.CONFIG}`])
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

  test('project.config.json中添加配置miniprogramRoot后能够读取app.json进行convert', () => {
    // rootPath：小程序的根目录（文件路径）
    const rootPath = 'D:\\WeChatProjects'
    
    // new Convertor后先直接执行 init()里面的initConvert()和getConvertConfig()
    jest.spyOn(Convertor.prototype, 'initConvert').mockImplementation(() => {
      Convertor.prototype.convertRoot = rootPath
    })
    const convertJsonPath = { 'convertJsonPath': ['aaa'] }
    jest.spyOn(Convertor.prototype, 'getConvertConfig').mockImplementation(() => {
      Convertor.prototype.pages = new Set(convertJsonPath.convertJsonPath)
    })
    const convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
    
    // 模拟配置miniprogramRoot字段中的projectConfig值
    const readFromFile = './miniprogram'
    const mockFileData  = `
      "miniprogramRoot": "miniprogram/",
    `
    
    // 将 getApp() 中的 fs.readFileSync 返回值模拟为常量 mockFileData
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockFileData)
    const paresResult = new Convertor(mockFileData, readFromFile)
    expect(paresResult).toMatchSnapshot()
  })
})