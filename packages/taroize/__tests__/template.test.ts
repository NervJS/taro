import { globals } from '../src/global'
import { parseWXML } from '../src/wxml'
import { generateMinimalEscapeCode } from './util'

const fs = require('fs')
const path = require('path')

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('template.ts', () => {
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
      expect(wxmlCode).toMatchSnapshot()
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
      jest.spyOn(path, 'resolve').mockReturnValue('E:\\code\\taro_demo\\pages\\template\\template')
      jest.spyOn(path, 'relative').mockReturnValue('../template/template')
      jest.spyOn(fs, 'readFileSync').mockReturnValue(template)
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      const dirPath = 'import_absoulte_path'
      const { wxml, imports }: any = parseWXML(dirPath, wxmlStr)
      const wxmlCode = generateMinimalEscapeCode(wxml)
      const importsCode = generateMinimalEscapeCode(imports[0].ast)
      expect(wxmlCode).toMatchSnapshot()
      expect(importsCode).toMatchSnapshot()
    })
  })

  describe('import 异常情况', () => {
    test('当 import 没有 src', () => {
      const wxml = `
        <import/>
      `
      const dirPath = 'import_no_src'
      expect(() => parseWXML(dirPath, wxml)).toThrowError('import 标签必须包含 `src` 属性')
    })
  })

  describe('template使用外部wxs工具类', () => {
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
      const dirPath = 'D:\\wechatTest\\template_test\\components\\LunaComponent\\ListHuangye'
      // 模拟全局对象下的文件路径
      const rootPath = globals.rootPath
      Object.defineProperty(globals, 'rootPath', {
        get: jest.fn().mockReturnValue('D:\\wechatTest\\template_test')
      })

      const { imports } = parseWXML(dirPath, wxml)
      const importsCode = generateMinimalEscapeCode(imports[0].ast)
      expect(importsCode).toMatchSnapshot()

      // 还原全局对象下的属性
      Object.defineProperty(globals, 'rootPath', {
        get: () => rootPath
      })
    })
  })
})