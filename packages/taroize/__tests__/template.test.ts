import { globals } from '../src/global'
import { parse } from '../src/index'
import { parseWXML } from '../src/wxml'
import { generateMinimalEscapeCode } from './util'

const fs = require('fs')
const path = require('path')

const option: any = {
  framework: 'react',
  json: '{}',
  logFilePath: '',
  path: '',
  rootPath: '',
  script: '',
  scriptPath: '',
  wxml: '',
  isApp: false,
}

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('template.ts', () => {
  describe('模板', () => {
    // 还原模拟函数
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('直接使用页面中的模板，转换后会创建模板文件', () => {
      option.wxml = `
        <template name="msgItem">
          <view>
            <text> {{index}}: {{msg}} </text>
            <text> Time: {{time}} </text>
          </view>
        </template>
        <template is="msgItem" data="{{...item}}"/>
      `
      option.script = `
        Page({
          data:{
            item: {
              index: 0,
              msg: 'this is a template',
              time: '2016-09-15'
            }
          },
        })
      `
      option.path = 'template'
      const { ast, imports }: any = parse(option)
      // 模板的引入需在 taro-cli-convertor 验证
      const code = generateMinimalEscapeCode(ast)
      const importsCode = generateMinimalEscapeCode(imports[0].ast)
      expect(code).toMatchSnapshot()
      expect(importsCode).toMatchSnapshot()
    })

    test('当template同时使用外部工具类和data传递数据', () => {
      const wxml = `
      <wxs src="../utils/myFunc.wxs" module="myFunc"/>
      <wxs src="../utils/timFunc.wxs" module="Tim"/>
      <wxs src="../utils/timFunc.wxs" module="utils"/>
      <template name="huangye">
        <text>{{ myFunc.getMsg }}</text>
        <view>{{ Tim.getMsg }}</view>
        <view>{{ '姓名：' + info.name + '年龄：' + info.age }}</view>
      </template>
      <template is="huangye" data="{{ info }}"/>
      `
      // 确定解析wxml文件的绝对路径
      const dirPath = '\\wechatTest\\template_test\\components\\LunaComponent\\ListHuangye'

      /**
       *  模拟全局对象下的文件路径
       */
      // 保存原始的属性描述符
      const originalDescriptor = Object.getOwnPropertyDescriptor(globals, 'rootPath')
      Object.defineProperty(globals, 'rootPath', {
        get: jest.fn().mockReturnValue('\\wechatTest\\template_test'),
      })

      const { imports } = parseWXML(dirPath, wxml)
      const importsCode = generateMinimalEscapeCode(imports[0].ast)
      expect(importsCode).toMatchSnapshot()

      // 恢复原始的属性描述符
      if (originalDescriptor) {
        Object.defineProperty(globals, 'rootPath', originalDescriptor)
      }
    })
  })

  describe('引入', () => {
    describe('import 正常情况', () => {
      // 还原模拟函数
      afterEach(() => {
        jest.restoreAllMocks()
      })

      test('import 引入template', () => {
        const wxmlStr = `
          <import src="../template/template"/>
          <view>
            <template is="template_demo"></template>
          </view>
        `
        const template = `
          <template name="template_demo">
            <view>模版DEMO</view>
          </template>
        `
        // 将 template.ts 中的 fs.readFileSync 返回值模拟为常量 template
        jest.spyOn(fs, 'readFileSync').mockReturnValue(template)
        const dirPath = 'import_normal'
        const { wxml, imports }: any = parseWXML(dirPath, wxmlStr)
        const wxmlCode = generateMinimalEscapeCode(wxml)
        const importsCode = generateMinimalEscapeCode(imports[0].ast)
        expect(wxmlCode).toBe(`<View><TemplateDemoTmpl></TemplateDemoTmpl></View>`)
        expect(importsCode).toMatchSnapshot()
      })

      test('import src 为绝对路径', () => {
        const wxmlStr = `
          <import src="/pages/template/template"/>
          <template is="template_demo"></template>
        `
        const template = `
          <template name="template_demo">
            <view>模版DEMO</view>
          </template>
        `
        jest.spyOn(path, 'resolve').mockReturnValue('\\code\\taro_demo\\pages\\template\\template')
        jest.spyOn(path, 'relative').mockReturnValue('../template/template')
        jest.spyOn(fs, 'readFileSync').mockReturnValue(template)
        jest.spyOn(fs, 'existsSync').mockReturnValue(true)
        const dirPath = 'import_absoulte_path'
        const { wxml, imports }: any = parseWXML(dirPath, wxmlStr)
        const wxmlCode = generateMinimalEscapeCode(wxml)
        const importsCode = generateMinimalEscapeCode(imports[0].ast)
        expect(wxmlCode).toBe('<TemplateDemoTmpl></TemplateDemoTmpl>')
        expect(importsCode).toMatchSnapshot()
      })
    })

    describe('import 异常情况', () => {
      // 还原模拟函数
      afterEach(() => {
        jest.restoreAllMocks()
      })

      test('当 import 没有 src', () => {
        const wxml = `<import/>`
        const dirPath = 'import_no_src'
        expect(() => parseWXML(dirPath, wxml)).toThrowError('import 标签必须包含 `src` 属性')
      })
    })

    describe('include 正常情况', () => {
      // 还原模拟函数
      afterEach(() => {
        jest.restoreAllMocks()
      })

      test('include 引入 header文件', () => {
        const header = '<text>header.wxml</text>'
        option.wxml = `<include src="../header/header"></include>`
        option.script = 'Page({})'
        option.path = 'include'
        jest.spyOn(fs, 'readFileSync').mockReturnValue(header)
        const { ast }: any = parse(option)
        const wxmlCode = generateMinimalEscapeCode(ast)
        expect(wxmlCode).toMatchSnapshot()
      })
    })

    describe('include 异常情况', () => {
      // 还原模拟函数
      afterEach(() => {
        jest.restoreAllMocks()
      })

      test('include 没有src', () => {
        const wxml = `<include/>`
        const dirPath = 'include_no_src'
        expect(() => parseWXML(dirPath, wxml)).toThrowError('include 标签必须包含 `src` 属性')
      })
    })
  })
})
