'use strict'

import { normalizePath } from '@tarojs/helper'

import Convertor from '../src/index'
import { clearMockFiles, getResMapFile, setMockFiles, updateMockFiles } from './__mocks__/fs-extra.js'
import { CONVERT_CONFIG_DATA, DEMO_JS_FILE_INFO, root } from './data/fileData'

const path = require('path')

jest.mock('path')

describe('convert.config.json配置转换', () => {
  let convert
  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('适配convert.config.json，对匹配json内路径的文件，在其被导入时所在的文件夹不做转换', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    updateMockFiles(root, CONVERT_CONFIG_DATA)

    convert = new Convertor(root, false)
    convert.generateScriptFiles(new Set([normalizePath(path.join(root, '/mps/index/index.js'))]))
    const resFileMap = getResMapFile()
    expect(resFileMap.get('/wxProject/taroConvert/src/mps/index/index.js')).toEqual(
      CONVERT_CONFIG_DATA['/mps/index/index.js']
    )
  })
})
