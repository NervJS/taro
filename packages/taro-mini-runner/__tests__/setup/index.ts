import * as fs from 'fs'
import * as babel from '@babel/core'
import { createFsFromVolume, Volume, IFs } from 'memfs'
import * as joinPath from 'memory-fs/lib/join'

interface EnsuredFs extends IFs {
  join: () => string
}

function ensureWebpackMemoryFs (fs: IFs): EnsuredFs {
  const newFs: EnsuredFs = Object.create(fs)
  newFs.join = joinPath

  return newFs
}

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
    readConfig: (configPath: string) => {
      if (fs.existsSync(configPath)) {
        if (/\.json$/.test(configPath)) {
          return require(configPath)
        } else if (/\.(js|ts)$/.test(configPath)) {
          const res = babel.transformFileSync(configPath, {
            presets: [['@babel/env']],
            plugins: ['@babel/plugin-proposal-class-properties']
          })
          // eslint-disable-next-line no-eval
          return eval(res!.code as string)
        }
      }
      return {}
    },
    printLog () {}
  }
})

jest.mock('../../src/utils/logHelper', () => {
  const originalModule = jest.requireActual('../../src/utils/logHelper')
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
