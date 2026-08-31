import path from 'node:path'

import { RSPACK_H5_TARO_ENTRY_RULE, RSPACK_H5_TARO_LOADER_USE } from '@tarojs/helper'
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

describe('rspack-runner build', () => {
  beforeEach(() => {
    rspackFnMock.mockClear()
    DefinePluginMock.mockClear()
    HtmlRspackPluginMock.mockClear()
  })

  it('builds base chain config and lets modifyRspackChain inject alias', async () => {
    await build(appPath, {
      ...baseConfig,
      modifyRspackChain (chain: any) {
        chain.resolve.alias.set('@tarojs/taro', '/mock/taro')
      }
    })

    expect(rspackFnMock).toHaveBeenCalledTimes(1)
    const [rspackConfig] = rspackFnMock.mock.calls[0]

    expect(rspackConfig.resolve.alias).toEqual({ '@tarojs/taro': '/mock/taro' })
    expect(rspackConfig.entry.app[0]).toContain('app.config')
    expect(DefinePluginMock).toHaveBeenCalledTimes(1)
    expect(HtmlRspackPluginMock).toHaveBeenCalledTimes(1)
    // 平台后缀前置,使 .h5.tsx 优先于裸 .tsx 命中
    expect(rspackConfig.resolve.extensions.indexOf('.h5.tsx'))
      .toBeLessThan(rspackConfig.resolve.extensions.indexOf('.tsx'))
  })

  it('modifyRspackChain can append a rule via chain', async () => {
    await build(appPath, {
      ...baseConfig,
      modifyRspackChain (chain: any) {
        chain.module.rule('markerRule').test(/\.marker$/).use('markerLoader').loader('/mock/marker-loader').end().end()
      }
    })

    const [rspackConfig] = rspackFnMock.mock.calls[0]
    const markerRule = rspackConfig.module.rules.find((r: any) => String(r.test) === String(/\.marker$/))
    expect(markerRule).toBeTruthy()
    expect(markerRule.use[0].loader).toBe('/mock/marker-loader')
  })

  it('lets two producers tap the same taroLoader without overwriting disjoint loaderMeta fields', async () => {
    // 模拟 platform-h5 与 framework-react 先后 tap 同一 taroEntry/taroLoader:
    // 前者拼接 extraImportForWeb(字符串增量),后者覆盖 creator(对象字段)。
    // 二者字段不相交,应互不覆盖。
    await build(appPath, {
      ...baseConfig,
      modifyRspackChain (chain: any) {
        const use = chain.module.rule(RSPACK_H5_TARO_ENTRY_RULE).use(RSPACK_H5_TARO_LOADER_USE)
        // 生产者 A(仿 platform-h5):拼接 extraImportForWeb
        use.tap((options: any = {}) => ({
          ...options,
          loaderMeta: {
            ...options.loaderMeta,
            extraImportForWeb: (options.loaderMeta?.extraImportForWeb || '') + 'IMPORT_FROM_H5\n',
          },
        }))
        // 生产者 B(仿 framework-react):覆盖 creator
        use.tap((options: any = {}) => ({
          ...options,
          loaderMeta: {
            ...options.loaderMeta,
            creator: 'createReactAppFromFramework',
          },
        }))
      }
    })

    const [rspackConfig] = rspackFnMock.mock.calls[0]
    const taroEntryRule = rspackConfig.module.rules.find((r: any) => typeof r.test === 'function')
    const loaderMeta = taroEntryRule.use[0].options.loaderMeta
    // A 注入的字段保留(未被 B 的 tap 清除)
    expect(loaderMeta.extraImportForWeb).toContain('IMPORT_FROM_H5')
    // B 注入的字段生效
    expect(loaderMeta.creator).toBe('createReactAppFromFramework')
  })

  it('keeps built-in rules when no chain hook is provided', async () => {
    await build(appPath, { ...baseConfig })

    const [rspackConfig] = rspackFnMock.mock.calls[0]
    // 无 alias 被 set 时,rspack-chain toConfig() 会清理掉空的 resolve.alias(对 rspack 无影响)
    expect(rspackConfig.resolve.alias ?? {}).toEqual({})
    // 兜底场景下也应保留内建规则(taroEntry / script / style)
    expect(rspackConfig.module.rules.length).toBeGreaterThanOrEqual(3)
  })

  it('runs modifyRspackChain after modifyWebpackChain (rspack hook can override)', async () => {
    const order: string[] = []
    await build(appPath, {
      ...baseConfig,
      modifyWebpackChain (chain: any) {
        order.push('webpack')
        chain.resolve.alias.set('shared', '/from-webpack')
      },
      modifyRspackChain (chain: any) {
        order.push('rspack')
        chain.resolve.alias.set('shared', '/from-rspack')
      }
    })

    const [rspackConfig] = rspackFnMock.mock.calls[0]
    expect(order).toEqual(['webpack', 'rspack'])
    // 后跑的 modifyRspackChain 覆盖 modifyWebpackChain 的同名 alias
    expect(rspackConfig.resolve.alias.shared).toBe('/from-rspack')
  })

  it('does not swallow errors thrown inside a chain hook', async () => {
    await expect(build(appPath, {
      ...baseConfig,
      modifyRspackChain () {
        throw new Error('boom from hook')
      }
    })).rejects.toThrow('boom from hook')
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
