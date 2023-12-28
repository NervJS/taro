import Convertor from '../src'
import { clearMockFiles,normalizePath,resFileMap, setMockFiles  } from './__mocks__/fs-extra'
import { DEMO_JS_FILE_INFO, root } from './data/fileData'
import { removeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(removeBackslashesSerializer)

const pathSystem = require('path')

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs') 
  return {
    ...originalModule,
    promises: {
      ...originalModule.promises,
      writeFile: jest.fn().mockImplementation((path,data)=>{
        let resPath = ''
        if(pathSystem.isAbsolute(path)){
          resPath = normalizePath(path).split(root)[1]
        }
        if(Buffer.isBuffer(data)){
          data = Buffer.from(data).toString('utf8')
        }
        resFileMap.set(root + resPath, data)
        console.log(resFileMap,'*************mock的fs操作*************')
      })
    },
  }
})

describe('小程序转换生成配置文件', () => {
  beforeAll(()=>{
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
    jest.restoreAllMocks()
  })
  
  test('配置文件生成', (done) => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    const convertor = new Convertor(root, false)
    convertor.framework = 'react'
    convertor.generateConfigFiles()
    setTimeout(() => {
      console.log(resFileMap,'/////////////////打印test结果/////////////////')
      expect(resFileMap).toMatchSnapshot()
      done() 
    }, 4000) 
  })
})

