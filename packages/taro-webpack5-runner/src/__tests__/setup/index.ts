import { createFsFromVolume, Volume } from 'memfs'

import { ensureWebpackMemoryFs } from '../utils/helper'

jest.mock('webpack', () => {
  const originalModule = jest.requireActual('webpack')
  const webpack = config => {
    const compiler = originalModule(config)
    const fs = createFsFromVolume(new Volume())
    const ensuredFs = ensureWebpackMemoryFs(fs)

    compiler.outputFileSystem = ensuredFs

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

jest.mock('../../utils/logHelper', () => {
  const originalModule = jest.requireActual('../../utils/logHelper')
  return {
    __esModule: true,
    ...originalModule,
    printBuilderError () {},
    bindProdLogger () {},
    bindDevLogger () {},
    printPrerenderSuccess () {},
    printPrerenderFail () {}
  }
})
