import { fs } from '@tarojs/helper'
import * as taroize from '@tarojs/taroize'
import wxTransformer from '@tarojs/transformer-wx'

import Convertor from '../src/index'
import { copyFileToTaro } from '../src/util'
import { clearMockFiles, getResMapFile, updateMockFiles } from './__mocks__/fs-extra.js'
import { root } from './data/fileData'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

const path = require('path')

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
      logFilePath: '',
    }

    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
    convert = new Convertor('', false)
  })

  // 还原模拟函数
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('使用新建的setData替换组件中this.data.xx，实现this.data.xx的转换', () => {
    param.script = 'this.data.intData = 1024'
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
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

  test('模版的动态名称转换', () => {
    param.wxml = `<view wx:for="{{infoList}}" wx:key="infoId">
              <template is="info-{{item.tempName}}" data="{{item}}"></template>
            </view>`
    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
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

  // 示例：转换前： 转换后：
  test('css中字母+数字+pX转换成px', async () => {
    const { css } = await convert.styleUnitTransform(
      '',
      'background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");'
    )
    expect(css).toBe('background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
  })

  test('支持export from语法，情况一：部分导入', () => {
    const wxScriptFile = {
      'tools1.js': `
        {
          export const var1 = 'Hello';
          export function func1() {
            return 'This is function 1';
          }
        }`,
      'tools2.js': `
        {
          export { var1, func1 } from './tools1'
        }`,
    }
    updateMockFiles(root, wxScriptFile)

    const code = `
      export { var1, func1 } from './tools1'
    `
    const file = path.join(root, 'tools2.js')
    const outputFilePath = ''

    const transformResult = wxTransformer({
      code,
      sourcePath: file,
      isNormal: true,
      isTyped: true,
      logFilePath: '',
    })

    const { ast, scriptFiles } = convert.parseAst({
      ast: transformResult.ast,
      outputFilePath,
      sourceFilePath: file,
    })

    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
    expect(scriptFiles.size).toBe(1)
  })

  test('支持export from语法，情况二：全部导入', () => {
    const wxScriptFile = {
      'tools1.js': `
        {
          export const var1 = 'Hello';
          export function func1() {
            return 'This is function 1';
          }
        }`,
      'tools2.js': `
        {
          export * from './tools1'
        }`,
    }
    updateMockFiles(root, wxScriptFile)

    const code = `
      export * from './tools1'
    `
    const file = path.join(root, 'tools2.js')
    const outputFilePath = ''

    const transformResult = wxTransformer({
      code,
      sourcePath: file,
      isNormal: true,
      isTyped: true,
      logFilePath: '',
    })

    const { ast, scriptFiles } = convert.parseAst({
      ast: transformResult.ast,
      outputFilePath,
      sourceFilePath: file,
    })

    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
    expect(scriptFiles.size).toBe(1)
  })
})

describe('文件转换', () => {
  let convert
  beforeAll(() => {
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
    convert = new Convertor('', false)
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  // 还原模拟函数
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('拷贝tsconfig.json文件到转换后的工程', () => {
    const tsConfigFile = {
      'tsconfig.json': `
        {
          "compilerOptions": {
            "baseUrl": "."
          }
        }`,
    }
    updateMockFiles(root, tsConfigFile)

    // 目前只有tsconfig.json，还有的话继续加到array里
    const selfDefinedConfig: any = []
    selfDefinedConfig[0] = `tsconfig${convert.fileTypes.CONFIG}`
    for (const tempConfig of selfDefinedConfig) {
      const tempConfigPath = path.join(convert.root, tempConfig)
      if (fs.existsSync(tempConfig)) {
        const outputFilePath = path.join(convert.convertRoot, tempConfig)
        copyFileToTaro(tempConfigPath, outputFilePath)

        // 获取转换后的结果
        const resFileMap = getResMapFile()
        expect(resFileMap.get(outputFilePath)).toBeTruthy()
        expect(resFileMap.get(outputFilePath)).toEqual(tsConfigFile['tsconfig.json'])
      }
    }
  })

})

describe('page页面转换', () => {
  let convert
  let param: ITaroizeOptions
  const entryJSON = { pages: ['pages/index/index'] }
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
      logFilePath: '',
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

  // 还原模拟函数
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('template组件名转换', () => {
    param.wxml = `
      <!-- template的name值为全小写 -->
      <template name="ash"></template>
      <template is="ash"/>
      <!-- template的name值为首字母大写且单个单词 -->
      <template name="Aol"></template>
      <template is="Aol"/>
      <!-- template的name值为首字母大写且多个单词 -->
      <template name="AshMer"></template>
      <template is="AshMer"/>
      <!-- template的name值为单字母 -->
      <template name="a"></template>
      <template is="a"/>
      <!-- template的name值为小驼峰 -->
      <template name="anFish"></template>
      <template is="anFish"/>
      `
    param.path = 'import_template'

    // 模拟writeFileToTaro文件写入方法，避免imports文件夹写入到taro工程
    jest.spyOn(Convertor.prototype, 'writeFileToTaro').mockImplementation(() => {})

    const taroizeResult = taroize({
      ...param,
      framework: 'react',
    })

    /**
     * sourceFilePath：需要转换的文件路径
     * outputFilePath：转换输出路径
     * importStylePath：style的文件路径
     */
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: taroizeResult.imports,
    })

    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })
})