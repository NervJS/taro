import Convertor from '../src/index'
import { clearMockFiles, getResMapFile, setMockFiles } from './__mocks__/fs-extra.js'
import { root } from './data/fileData'

const path = require('path')

jest.mock('path')

describe('wxss', () => {
  beforeAll(() => {
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
  })

  beforeEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  test('引入外部wxss', async () => {
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
})
