import { parseWXML } from '../src/wxml'
import { generateMinimalEscapeCode } from './util'

jest.mock('fs')
const fs = require('fs')
const path = require('path')

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
})