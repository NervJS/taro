import { parsePlatforms, parsePlugins } from '../plugin-parser'

import type { KernelLike } from '../query'

/**
 * 构造一个最小 mock Kernel（鸭子类型）。插件归属键用解析路径，
 * 这里直接用 node_modules 风格路径以顺带验证「路径→包名」反解。
 */
function mockKernel(): KernelLike {
  const httpPath = '/proj/node_modules/@tarojs/plugin-http/dist/index.js'
  const weappPath = '/proj/node_modules/@tarojs/plugin-platform-weapp/dist/index.js'
  const noOptsPath = '/proj/node_modules/plugin-noop/index.js'
  return {
    initialConfig: { plugins: [], presets: [] },
    plugins: new Map([
      [httpPath, { id: httpPath, opts: { timeout: 3000 } }],
      [weappPath, { id: weappPath, opts: {} }], // 空对象 opts → 应跳过
      [noOptsPath, { id: noOptsPath, opts: () => 1 }], // 函数 opts → 应跳过
    ]),
    hooks: new Map([
      ['modifyAppConfig', [{ name: 'modifyAppConfig', plugin: httpPath }]],
      // Kernel 的 register 耦合：命令名/平台名也混进 hooks，应被排除
      ['build', [{ name: 'build', plugin: httpPath }]],
      ['weapp', [{ name: 'weapp', plugin: weappPath }]],
    ]),
    commands: new Map([
      ['build', { name: 'build', plugin: httpPath, alias: 'b' }],
    ]),
    platforms: new Map([
      ['weapp', { name: 'weapp', plugin: weappPath }],
    ]),
  }
}

describe('parsePlugins（注入 Kernel）', () => {
  test('遍历 kernel.plugins，id 反解为包名', () => {
    const { plugins } = parsePlugins(mockKernel(), '/proj')
    const ids = plugins.map((p) => p.id)
    expect(ids).toContain('@tarojs/plugin-http')
    expect(ids).toContain('@tarojs/plugin-platform-weapp')
    expect(ids).toContain('plugin-noop')
  })

  test('opts：普通对象填充，空对象与函数形态跳过', () => {
    const { plugins } = parsePlugins(mockKernel(), '/proj')
    const http = plugins.find((p) => p.id === '@tarojs/plugin-http')!
    expect(http.opts).toEqual({ timeout: 3000 })
    const weapp = plugins.find((p) => p.id === '@tarojs/plugin-platform-weapp')!
    expect(weapp.opts).toBeUndefined()
    const noop = plugins.find((p) => p.id === 'plugin-noop')!
    expect(noop.opts).toBeUndefined()
  })

  test('registeredHooks 排除命令名/平台名（不混入 build/weapp）', () => {
    const { plugins } = parsePlugins(mockKernel(), '/proj')
    const http = plugins.find((p) => p.id === '@tarojs/plugin-http')!
    expect(http.registeredHooks).toEqual(['modifyAppConfig'])
    expect(http.registeredHooks).not.toContain('build')
  })

  test('commands / platforms 按插件归属反查', () => {
    const { plugins } = parsePlugins(mockKernel(), '/proj')
    const http = plugins.find((p) => p.id === '@tarojs/plugin-http')!
    expect(http.commands).toEqual([{ name: 'build', alias: 'b' }])
    const weapp = plugins.find((p) => p.id === '@tarojs/plugin-platform-weapp')!
    expect(weapp.platforms).toEqual(['weapp'])
  })

  test('kernel.plugins 缺失 → 空清单不报错', () => {
    const { plugins, warnings } = parsePlugins({}, '/proj')
    expect(plugins).toEqual([])
    expect(warnings).toEqual([])
  })
})

describe('parsePlatforms', () => {
  test('initialConfig.platforms 显式提供时优先', () => {
    const k: KernelLike = { initialConfig: { platforms: ['weapp', 'h5'] } }
    expect(parsePlatforms(k)).toEqual(['weapp', 'h5'])
  })

  test('否则退化为平台注册表全集', () => {
    expect(parsePlatforms(mockKernel())).toEqual(['weapp'])
  })

  test('都没有 → []', () => {
    expect(parsePlatforms({})).toEqual([])
  })
})
