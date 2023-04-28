import * as babel from '@babel/core'
import { fs } from '@tarojs/helper'
import { createFsFromVolume, IFs, Volume } from 'memfs'
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
          const header = /app\.config/.test(configPath)
            ? 'function defineAppConfig(config){ return config };\r\n'
            : 'function definePageConfig(config){ return config };\r\n'
          const code = header + res!.code as string
          // eslint-disable-next-line no-eval
          return eval(code)
        }
      } else {
        const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue']
        for (const ext of extensions) {
          const tempPath = configPath.replace('.config', ext)
          if (fs.existsSync(tempPath)) {
            configPath = tempPath
            const sfcSource = fs.readFileSync(configPath, 'utf8')
            const dpcReg = /definePageConfig\(\{[\w\W]+?\}\)/g
            const matches = sfcSource.match(dpcReg)
            if (matches && matches.length === 1) {
              const header = 'function definePageConfig(config){ return config };\r\n'
              const code = header + matches[0]
              // eslint-disable-next-line no-eval
              return eval(code as string)
            }
          }
        }
      }
      return {}
    },
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
