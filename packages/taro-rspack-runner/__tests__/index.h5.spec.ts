import path from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import build from '../src/index.h5'

const rspackFnMock = vi.hoisted(() => vi.fn((_config: any, callback: (err: Error | null, stats: any) => void) => {
  callback(null, {
    hasErrors: () => false,
    toString: () => ''
  })
}))
const CssExtractRspackPluginMock = vi.hoisted(() => {
  const ctor: any = vi.fn()
  ctor.loader = 'mock-css-extract-loader'
  return ctor
})
const DefinePluginMock = vi.hoisted(() => vi.fn())
const HtmlRspackPluginMock = vi.hoisted(() => vi.fn())
// 真实 @rspack/core 把 DefinePlugin/CssExtractRspackPlugin/HtmlRspackPlugin
// 挂在 rspack 函数对象自身上（index.h5.ts 通过 rspack.DefinePlugin 等方式访问），
// mock 需还原同样的形状，否则这些属性在 mock 下是 undefined。
const rspackMock = vi.hoisted(() => Object.assign(rspackFnMock, {
  DefinePlugin: DefinePluginMock,
  CssExtractRspackPlugin: CssExtractRspackPluginMock,
  HtmlRspackPlugin: HtmlRspackPluginMock
}))

vi.mock('@rspack/core', () => ({
  rspack: rspackMock
}))

const appPath = path.resolve(__dirname, './mock')

const baseConfig = {
  sourceRoot: 'src',
  outputRoot: 'dist',
  entryFileName: 'app',
  framework: 'react',
  publicPath: '/',
  designWidth: 750,
  router: { mode: 'hash' }
}

const loaderMeta = {
  creator: 'createReactApp',
  creatorLocation: '',
  importFrameworkStatement: '',
  frameworkArgs: '',
  importFrameworkName: 'React',
  extraImportForWeb: '',
  execBeforeCreateWebApp: '',
  mockAppStatement: ''
}

describe('rspack-runner build', () => {
  beforeEach(() => {
    rspackFnMock.mockClear()
    DefinePluginMock.mockClear()
    HtmlRspackPluginMock.mockClear()
  })

  it('assembles rspack config from config.runnerInject', async () => {
    const extraRule = { test: /\.marker$/, use: [] }

    await build(appPath, {
      ...baseConfig,
      runnerInject: {
        alias: { '@tarojs/taro': '/mock/taro' },
        loaderMeta,
        extraRules: [extraRule]
      }
    })

    expect(rspackFnMock).toHaveBeenCalledTimes(1)
    const [rspackConfig] = rspackFnMock.mock.calls[0]

    expect(rspackConfig.resolve.alias).toEqual({ '@tarojs/taro': '/mock/taro' })
    expect(rspackConfig.module.rules).toContainEqual(extraRule)
    expect(rspackConfig.entry.app[0]).toContain('app.config')
    expect(DefinePluginMock).toHaveBeenCalledTimes(1)
    expect(HtmlRspackPluginMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to empty alias when config.runnerInject is absent', async () => {
    await build(appPath, { ...baseConfig })

    const [rspackConfig] = rspackFnMock.mock.calls[0]
    expect(rspackConfig.resolve.alias).toEqual({})
    // 兜底场景下也应保留内建规则(app config / script / style),不因缺省 extraRules 而丢失
    expect(rspackConfig.module.rules.length).toBeGreaterThanOrEqual(3)
  })

  it('rejects with a readable error when rspack reports compilation errors', async () => {
    rspackFnMock.mockImplementationOnce((_config: any, callback: any) => {
      callback(null, {
        hasErrors: () => true,
        toString: () => 'mock compilation error'
      })
    })

    await expect(build(appPath, { ...baseConfig })).rejects.toThrow('[rspack-runner] 构建失败')
  })
})
