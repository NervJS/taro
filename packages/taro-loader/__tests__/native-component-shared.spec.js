import nativeComponentLoader from '../src/native-component'

// F6:native-components 共享运行时(方案二 split)loader 注入验证。
// mock webpack LoaderContext:getOptions() 返回 loader options,_compilation 提供 outputOptions。
function runLoader (options, resourcePath = '/src/components/badge/index') {
  const ctx = {
    getOptions: () => options,
    resourcePath,
    context: '/src/components/badge',
    utils: { contextify: (_ctx, req) => req },
    _compilation: { outputOptions: { globalObject: 'wx' } },
  }
  return nativeComponentLoader.call(ctx, 'export default {}')
}

const baseLoaderMeta = {
  importFrameworkStatement: '',
  frameworkArgs: 'react, ReactDOM',
  creatorLocation: '@tarojs/plugin-framework-react/dist/runtime',
  isNeedRawLoader: false,
}

describe('native-component loader — F6 共享运行时注入', () => {
  it('非共享运行时:config 不含 isNativeShared/pkgId/globalKey/appId(vanilla 零变化)', () => {
    const result = runLoader({
      loaderMeta: baseLoaderMeta,
      config: {},
      name: 'components/badge/index',
      behaviorsName: 'behaviors',
    })
    // 产物含 createNativeComponentConfig 调用
    expect(result).toMatch('createNativeComponentConfig(component, react, ReactDOM)')
    // vanilla 不注入 F6 字段
    expect(result).not.toMatch('isNativeShared')
    expect(result).not.toMatch('__nativeComponentApps')
  })

  it('共享运行时:config 注入 isNativeShared/pkgId/globalKey/appId', () => {
    const result = runLoader({
      loaderMeta: baseLoaderMeta,
      config: {},
      name: 'components/badge/index',
      behaviorsName: 'behaviors',
      sharedRuntime: true,
      sharedRuntimePkgId: 'webpackJsonp_native',
      sharedRuntimeGlobalKey: '__TARO_RT_ASYNC_V1__',
    })
    // config 序列化进产物,应含 F6 四字段
    expect(result).toMatch('"isNativeShared":true')
    expect(result).toMatch('"pkgId":"webpackJsonp_native"')
    expect(result).toMatch('"globalKey":"__TARO_RT_ASYNC_V1__"')
    expect(result).toMatch('"appId":"webpackJsonp_native"')
  })

  it('共享运行时:pkgId 不同产出不同注入(多包隔离)', () => {
    const mk = (pkgId) => runLoader({
      loaderMeta: baseLoaderMeta,
      config: {},
      name: 'components/badge/index',
      behaviorsName: 'behaviors',
      sharedRuntime: true,
      sharedRuntimePkgId: pkgId,
      sharedRuntimeGlobalKey: '__TARO_RT_ASYNC_V1__',
    })
    expect(mk('pkg_a')).toMatch('"pkgId":"pkg_a"')
    expect(mk('pkg_b')).toMatch('"pkgId":"pkg_b"')
  })
})
