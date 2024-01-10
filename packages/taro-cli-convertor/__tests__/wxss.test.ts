import Convertor from '../src/index'
import { clearMockFiles, getResMapFile, setMockFiles, updateMockFiles } from './__mocks__/fs-extra.js'
import { DEMO_JS_FILE_INFO, root } from './data/fileData'
import { removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

const path = require('path')

jest.mock('path')

describe('引入外部wxss文件', () => {
  beforeAll(() => {
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('相对路径引入外部wxss', async () => {
    const wxssStr = `
      @import "../common.wxss";
      .scrollarea {
        flex: 1;
        overflow-y: hidden;
      }
    `
    const WITHOUT_WXSS_DEMO = {
      '/pages/common.wxss':`
        page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          margin-top: 80px;
        }
      `,
      '/pages/index/index.wxss': wxssStr
    }
    setMockFiles(root, WITHOUT_WXSS_DEMO)
    const convertor = new Convertor(root, false)
    await convertor.traverseStyle(path.join(root,'/pages/index/index.wxss'), wxssStr)
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('绝对路径引入外部wxss', async () => {
    const wxssStr = `
      @import "/pages/common.wxss";
      .scrollarea {
        flex: 1;
        overflow-y: hidden;
      }
    `
    const WITHOUT_WXSS_DEMO = {
      '/pages/common.wxss':`
        page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          margin-top: 80px;
        }
      `,
      '/pages/index/index.wxss': wxssStr
    }
    setMockFiles(root, WITHOUT_WXSS_DEMO)
    const convertor = new Convertor(root, false)
    await convertor.traverseStyle(path.join(root,'/pages/index/index.wxss'), wxssStr)
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('引入外部wxss，无后缀', async () => {
    const wxssStr = `
      @import "/pages/common";
      .scrollarea {
        flex: 1;
        overflow-y: hidden;
      }
    `
    const WITHOUT_WXSS_DEMO = {
      '/pages/common.wxss':`
        page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          margin-top: 80px;
        }
      `,
      '/pages/index/index.wxss': wxssStr
    }
    setMockFiles(root, WITHOUT_WXSS_DEMO)
    const convertor = new Convertor(root, false)
    await convertor.traverseStyle(path.join(root,'/pages/index/index.wxss'), wxssStr)
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })

  test('拷贝三方字体包到转换后的工程', async () => {
    const wxssStr = `
      @font-face {
        font-family: "font3";
        src: url("../../fonts/Algerian.ttf");
      }
    `
    const DEMO_FONTS = {
      '/fonts/Algerian.ttf':'字体二进制',
      '/pages/index/index.wxss': wxssStr
    }
    setMockFiles(root, DEMO_JS_FILE_INFO)
    updateMockFiles(root, DEMO_FONTS)
    const convertor = new Convertor(root, false)
    await convertor.traverseStyle(path.join(root,'/pages/index/index.wxss'), wxssStr)
    const resFileMap = getResMapFile()
    expect(resFileMap).toMatchSnapshot()
  })
  
})
