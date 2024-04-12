import { parse } from '../src'
import { generateMinimalEscapeCode, removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

const logFileMap = new Map()
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn((path, content):any => {
    logFileMap.set(path, content)
  })
}))

describe('parse', () => {
  afterEach(() => {
    logFileMap.clear()
  })

  describe('template.ts', () => {
    let option: any

    beforeAll(() => {
      option = {
        script: '',
        scriptPath: '',
        wxml: '',
        path: '',
        rootPath: '',
        framework: 'react',
        isApp: false,
        logFilePath: '',
        pluginInfo: {}
      }
    })

    test('公共组件usingComponents的key加到THIRD_PARTY_COMPONENTS', () => {
      // app.json的目录结构以及内容
      /*
      ** /app.json:
      **   "{
      **     "pages": [
      **       "pages/index/index"
      **     ],
      **     "usingComponents": {
      **       "cpt": "/wxProject/miniprogram/components/cpt/cpt"
      **     }
      **   }"
      */
      option.path = '/wxProject/miniprogram'
      option.rootPath = '/wxProject/miniprogram'
      option.logFilePath = '/wxProject/taroConvert/.convert/convert.log'
      option.script = `app({})`
      option.json =
      `{  
          "pages":["pages/index/index"],
          "usingComponents":
          {
          "cpt":"/wxProject/miniprogram/components/cpt/cpt",
          "cpt2":"/wxProject/miniprogram/components/cpt2/cpt2"
          }
      }`
      option.scriptPath = '/wxProject/miniprogram/app.js'
      option.isApp = true
      const { ast } = parse(option)
      const code = generateMinimalEscapeCode(ast)
      expect(code).toMatchSnapshot()
    })
  })
})