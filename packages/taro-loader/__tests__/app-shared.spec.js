import { runInNewContext } from 'node:vm'

import { transformSync } from '@babel/core'

import appLoader from '../src/app'

function executeAppLoader (sharedRuntime) {
  const options = {
    loaderMeta: {
      importFrameworkStatement: '',
      frameworkArgs: 'null, null, config',
      creator: 'createReactApp',
      creatorLocation: '@tarojs/plugin-framework-react/dist/runtime',
    },
    config: { appId: 'custom-app' },
    runtimePath: [],
    pxTransformConfig: { designWidth: 750, deviceRatio: {} },
    sharedRuntime,
    sharedRuntimePkgId: 'checkoutPkg',
    sharedRuntimeGlobalKey: '__testShared',
  }
  const generated = appLoader.call({
    getOptions: () => options,
    resourcePath: '/src/app.tsx',
    context: '/src',
    utils: { contextify: (_ctx, req) => req },
    _compilation: { outputOptions: { globalObject: 'wx' } },
  }, 'export default {}')
  const code = transformSync(generated, {
    configFile: false,
    babelrc: false,
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  }).code
  let receivedConfig
  const shared = {}
  const modules = {
    '@tarojs/runtime': { window: {} },
    '@tarojs/plugin-framework-react/dist/runtime': {
      createReactApp (_component, _react, _dom, config) {
        receivedConfig = config
        return {}
      },
    },
    '@tarojs/taro': { initPxTransform () {} },
  }
  runInNewContext(code, {
    wx: { __testShared: shared },
    exports: {},
    App: app => app,
    require (name) {
      if (name in modules) return modules[name]
      if (name.startsWith('!')) return { __esModule: true, default: () => null }
      throw new Error(`Unexpected app dependency: ${name}`)
    },
  })
  return { receivedConfig, shared }
}

describe('shared app loader query compatibility gate', () => {
  it('shared App passes package marker to the framework before creating its rendering container', () => {
    const { receivedConfig, shared } = executeAppLoader(true)
    expect(receivedConfig.appId).toBe('checkoutPkg')
    expect(receivedConfig.__taroSharedRuntimePkgId).toBe('checkoutPkg')
    expect(shared.__currentPkgId).toBe('checkoutPkg')
  })

  it('non-shared custom appId does not opt into shared root lookup', () => {
    const { receivedConfig, shared } = executeAppLoader(false)
    expect(receivedConfig).toEqual({ appId: 'custom-app' })
    expect(shared.__currentPkgId).toBeUndefined()
  })
})
