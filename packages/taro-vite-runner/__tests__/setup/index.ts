import { createFsFromVolume, Volume } from 'memfs'

jest.mock('vite', () => {
  const originalModule = jest.requireActual('vite')
  const vite = config => {
    const compiler = originalModule(config)
    const fs = createFsFromVolume(new Volume())

    compiler.inputFileSystem._writeVirtualFile = () => {}
    compiler.outputFileSystem = fs

    return compiler
  }
  jest.unmock('vite')
  return vite
})

jest.mock('@tarojs/helper', () => {
  const originalModule = jest.requireActual('@tarojs/helper')
  return {
    __esModule: true,
    ...originalModule,
    printLog () {}
  }
})
