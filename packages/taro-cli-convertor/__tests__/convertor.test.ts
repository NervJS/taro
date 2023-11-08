'use strict'

import Convertor from '../src/index'
import { clearMockFiles, getResMapFile, setMockFiles } from './__mocks__/fs-extra.js'
import { DEMO_JS_FILE_INFO, DEMO_JS_FILE_INFO_MINIPROGRANROOT, root } from './data/fileData'

describe('微信小程序转换', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('小程序demo转换', () => {
    // 设置初始文件信息
    setMockFiles(root, DEMO_JS_FILE_INFO)

    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('配置miniprogramRoot的demo小程序转换', () => {
    // 设置初始文件信息
    setMockFiles(root, DEMO_JS_FILE_INFO_MINIPROGRANROOT)

    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
})
