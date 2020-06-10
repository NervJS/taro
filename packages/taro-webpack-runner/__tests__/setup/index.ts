import * as fs from 'fs'
import * as babel from '@babel/core'

jest.mock('@tencent/tarojs-helper', () => {
  const originalModule = jest.requireActual('@tencent/tarojs-helper')
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
    }
  }
})
