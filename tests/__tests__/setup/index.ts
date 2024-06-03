import { createFsFromVolume, Volume } from 'memfs'

jest.mock('webpack', () => {
  const originalModule = jest.requireActual('webpack')
  const webpack = config => {
    const compiler = originalModule(config)
    const fs = createFsFromVolume(new Volume())

    compiler.inputFileSystem._writeVirtualFile = () => {}
    compiler.outputFileSystem = fs

    return compiler
  }
  jest.unmock('webpack')
  return webpack
})

jest.mock('@tarojs/helper', () => {
  const originalModule = jest.requireActual('@tarojs/helper')
  return {
    __esModule: true,
    ...originalModule,
    printLog () {}
  }
})
