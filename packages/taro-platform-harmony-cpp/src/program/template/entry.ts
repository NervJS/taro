import { isDebug, NPM_DIR } from '../../utils'

export const loadLibraryFunctionName = 'loadLibrary'
export const setLibraryFunctionName = 'setLibrary'
export const globalVarName = 'globalThis'
export const taroLibraryVarName = 'TARO_CPP_LIBRARY'
export const projectLibraryName = 'TARO_PROJECT_LIBRARY'
export const entryFileName = '.taro_init'
export const entryLibraryFileName = 'taro_library'

const BaseParser = require('@tarojs/vite-runner/dist/harmony/template/base').default as typeof import('@tarojs/vite-runner/dist/harmony/template/base').default

export default class Parser extends BaseParser {
  protected list: string[] = []

  constructor (_: unknown[]) {
    super()

    this.list.push(...this.depSort)
    // this.list.push(true)
    // this.list.sort((a, b) => {
    //   const x = this.depSort.indexOf(a)
    //   const y = this.depSort.indexOf(b)

    //   if (x >= 0 && y >= 0) return x - y
    //   if (x < 0 && y < 0) return 0
    //   return x < 0 ? 1 : -1
    // })
  }

  depSort = [
    'taro_library.js',
    'tslib.js',
    '@tarojs/shared/index.js',
    '@tarojs/runtime/index.js',
    'react-reconciler/constants.js',
    'react/index.js',
    'scheduler/index.js',
    'react/jsx-runtime.js',
    'react-reconciler/index.js',
    '@tarojs/react/index.js',
    '@tarojs/components/tag.js',
    '@tarojs/plugin-framework-react/dist/runtime/index.js',
    '@tarojs/taro/index.js',
  ]

  preBuildIn = [
    'libTaroHarmonyLibrary.so',
    '@ohos.abilityAccessCtrl',
    '@ohos.app.ability.ConfigurationConstant',
    '@ohos.app.ability.errorManager',
    '@ohos.batteryInfo',
    '@ohos.bundle.bundleManager',
    '@ohos.geoLocationManager',
    '@ohos.data.distributedKVStore',
    '@ohos.data.preferences',
    '@ohos.deviceInfo',
    '@ohos.display',
    '@ohos.document',
    '@ohos.file.fs',
    '@ohos.file.picker',
    '@ohos.fileio',
    '@ohos.hilog',
    '@ohos.hiTraceMeter',
    '@ohos.i18n',
    '@ohos.inputMethodEngine',
    '@ohos.matrix4',
    '@ohos.multimedia.image',
    // '@ohos.multimedia.mediaLibrary', Note: deprecated into @ohos.file.photoAccessHelper => https://developer.huawei.com/consumer/cn/doc/harmonyos-releases-V5/changelogs-for-all-apps-b060-V5#ohosmultimediamedialibrary%E5%8F%98%E6%9B%B4
    '@ohos.net.http',
    '@ohos.net.webSocket',
    '@ohos.pasteboard',
    '@ohos.promptAction',
    '@ohos.request',
    '@ohos.router',
    '@ohos.sensor',
    '@ohos.telephony.call',
    '@ohos.vibrator',
    '@ohos.web.webview',
    '@ohos.window',
    '@ohos.zlib',
    '@system.app',
    '@system.brightness',
    '@system.file',
    '@system.network',
  ]

  postBuildIn = [
    ['./@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony', '@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony'],
    ['./@tarojs/components', '@tarojs/components'],
  ]

  parse () {
    return this.transArr2Str([
      `import hilog from '@ohos.hilog'`,
      '',
      `import {`,
      `  AnyJSBundleProvider,`,
      `  ResourceJSBundleProvider,`,
      `  StringJSBundleProvider,`,
      `  StandardTaroLogger,`,
      `  TaroCoreContext, TaroInstance,`,
      `  TraceJSBundleProviderDecorator`,
      `} from './@tarojs/plugin-platform-harmony-cpp/dist/runtime/runtime-harmony'`,
      '',
      `import type { TaroAny } from './@tarojs/runtime'`,
      '',
      'export let initResolver: TaroAny',
      'export let hasInit: TaroAny',
      '',
      this.generateDependenciesFunction(),
      this.generateRegisterMediaListFunction(),
      '',
      `export function ${loadLibraryFunctionName} (..._: TaroAny) {}`,
      `export function ${setLibraryFunctionName} (..._: TaroAny) {}`,
      '',
    ])
  }

  parseLibrary () {
    return this.transArr2Str([
      'function init () {',
      `  globalThis.turboModuleProxy = globalThis.__turboModuleProxy`,
      `  globalThis.get = function requireModule(name) {`,
      `    if (turboModuleProxy != null) {`,
      `      return turboModuleProxy(name)`,
      `    }`,
      `    return null`,
      `  }`,
      `  globalThis.hiTrace = get('HiTraceManager')`,
      '',
      `  if (globalThis.nativeLoggingHook) {`,
      `    const LOG_LEVELS = {`,
      `      trace: 0,`,
      `      info: 1,`,
      `      warn: 2,`,
      `      error: 3`,
      `    }`,
      '',
      `    globalThis.console = {`,
      `      error: (...args) => globalThis.nativeLoggingHook(args.join(' '), LOG_LEVELS.error),`,
      `      info: (...args) => globalThis.nativeLoggingHook(args.join(' '), LOG_LEVELS.info),`,
      `      log: (...args) => globalThis.nativeLoggingHook(args.join(' '), LOG_LEVELS.info),`,
      `      warn: (...args) => globalThis.nativeLoggingHook(args.join(' '), LOG_LEVELS.warn),`,
      `      trace: (...args) => globalThis.nativeLoggingHook(args.join(' '), LOG_LEVELS.trace),`,
      `      debug: (...args) => globalThis.nativeLoggingHook(args.join(' '), LOG_LEVELS.trace),`,
      `    }`,
      `  }`,
      '',
      `  if (globalThis.nativeTimer) {`,
      `    globalThis.setTimeout = (fn, time) => {`,
      `      if (time === undefined) {`,
      `        return globalThis.nativeTimer.setTimeout(fn, 0)`,
      `      }`,
      `      return globalThis.nativeTimer.setTimeout(fn, time)`,
      `    }`,
      `    globalThis.setInterval = (fn, time) => {`,
      `      if (time === undefined) {`,
      `        return globalThis.nativeTimer.setInterval(fn, 0)`,
      `      }`,
      `      return globalThis.nativeTimer.setInterval(fn, time)`,
      `    }`,
      `    globalThis.clearTimeout = (timer) => globalThis.nativeTimer.clearTimeout(timer)`,
      `    globalThis.clearInterval = (timer) => globalThis.nativeTimer.clearInterval(timer)`,
      `    globalThis.__taro_registryTimeout = (pageId, fn, time) => globalThis.nativeTimer.registryTimer(pageId, fn, time, "setTimeout")`,
      `    globalThis.__taro_registryInterval = (pageId, fn, time) => globalThis.nativeTimer.registryTimer(pageId, fn, time, "setInterval")`,
      `    globalThis.__taro_un_registryTimeout = (timer, pageId) => globalThis.nativeTimer.clearTimer(timer, pageId, "clearTimeout")`,
      `    globalThis.__taro_un_registryInterval = (timer, pageId) => globalThis.nativeTimer.clearTimer(timer, pageId, "clearInterval")`,
      `    globalThis.__taro_clearPageTimer = (pageId) => globalThis.nativeTimer.clearPageTimer(pageId)`,
      `    globalThis.requestAnimationFrame = (fn) => globalThis.nativeOtherManager.registryNextTick(fn)`,
      `    globalThis.__taro_registryNextFrame = (pageId, fn) => globalThis.nativeOtherManager.registryNextTick(fn, pageId)`,
      `  }`,
      '',
      `  globalThis.querySelector = globalThis.nativeUIManager.querySelectDOMSync`,
      `  const densityPixels = get('UnitManager').densityPixels()`,
      `  globalThis.px2vp = val => val / densityPixels`,
      `  globalThis.vp2px = val => val * densityPixels`,
      '  globalThis.$r = (value) => {',
      '    const matchRes = value.match(/app\\.media\\.([\\w\\.]+)/)',
      '    let fileName',
      '    if (matchRes && matchRes[1] && Array.isArray(globalThis._resourcesMediaList) &&',
      "        (fileName = globalThis._resourcesMediaList.find(str => str.startsWith(matchRes[1] + '.') || str === matchRes[1]))) {",
      `      return \`resource://app/media/\${fileName}\``,
      '    } else {',
      "      return 'resource://' + value.replace(/\\./g, '/')",
      '    }',
      '  }',
      `  globalThis.Current = {`,
      `    getSyncValue: (key) => {`,
      `      return get('CurrentManager').getCurrentSyncValue(key)`,
      `    },`,
      `    getAsyncValue: (key) => {`,
      `      return get('CurrentManager').getCurrentAsyncValue(key)`,
      `    },`,
      `  }`,
      '',
      this.transArr2Str(this.generateSetLibraryFunction().split('\n'), 2),
      this.transArr2Str(this.generateLoadLibraryFunction().split('\n'), 2),
      `}`,
      '',
      `init()`,
      isDebug ? `console.log('[taro-library]: init setLibrary|loadLibrary')` : null,
    ])
  }

  generateLoadLibraryFunction () {
    return this.transArr2Str([
      `${globalVarName}.${loadLibraryFunctionName} = function (path = '', name = '', projectId = '') {`,
      `  let moduleLibrary = ${globalVarName}[!projectId ? '${taroLibraryVarName}' : '${projectLibraryName}'] ||= {}`,
      `  if (projectId) moduleLibrary = moduleLibrary[projectId] ||= {}`,
      `  const paths = path.split('/').filter(e => e && !['index.js'].includes(e))`,
      `  let result`,
      `  try {`,
      `    for (let i = 0; i < paths.length; i++) {`,
      `      const path = paths[i]`,
      `      if (!path || path === '.') continue`,
      `      moduleLibrary = (/\\.(m?(j|t)sx?)$/.test(path) || moduleLibrary[path])`,
      `        ? moduleLibrary[path]`,
      `        : ['js', 'mjs', 'jsx', 'ts', 'mts', 'tsx'].map(ext => moduleLibrary[\`\${path}.\${ext}\`]).find(Boolean)`,
      `    }`,
      `    result = moduleLibrary || {}`,
      `    if (name && !['default', '*'].includes(name)) {`,
      `      result = result.default?.[name] || result[name]`,
      `    } else {`,
      `      result = name === '*' ? result : (result?.default || result)`,
      `    }`,
      `  } catch (e) {`,
      `    console.error('[taro-library]: loadLibrary', paths, name, 'err:', e)`,
      `    console.error(e.stack)`,
      `  }`,
      isDebug ? `  console.log('[taro-library]: loadLibrary', paths, name, typeof result)` : null,
      `  return result`,
      `}`,
      '',
    ])
  }

  generateSetLibraryFunction () {
    return this.transArr2Str([
      `${globalVarName}.${setLibraryFunctionName} = function (value, isGlobal, ...paths) {`,
      `  try {`,
      `    const libraryName = isGlobal ? "${taroLibraryVarName}" : "${projectLibraryName}"`,
      `    let preLibrary = ${globalVarName}`,
      `    let library = ${globalVarName}[libraryName] ||= {}`,
      `    let i = 0`,
      `    paths = paths.join('/').split('/').filter(e => e && !['index.js'].includes(e))`,
      isDebug ? `    console.log('[taro-library]: setLibrary', paths, typeof value)` : null,
      `    for (; i < paths.length - 1; i++) {`,
      `      const path = paths[i]`,
      `      if (!path || path === '.') continue`,
      `      preLibrary = library`,
      `      library = library[path] ||= {}`,
      `    }`,
      `    if (paths[i] === '*') {`,
      `      const keys = Object.keys(library)`,
      `      if (keys.length === 0) {`,
      `        preLibrary[paths[i - 1]] = value`,
      `      } else if (library !== value) {`,
      `        keys.forEach(k => {`,
      `          if (!library[k] || !isGlobal) {`,
      `            library[k] = value[k]`,
      `          }`,
      `        })`,
      `      }`,
      `    } else if (!library[paths[i]] || !isGlobal) {`,
      `      library[paths[i]] = value`,
      `    }`,
      `  } catch (e) {`,
      `    console.error('[taro-library]', paths, 'err:', e)`,
      `    console.error(e.stack)`,
      `  }`,
      '}',
      '',
    ])
  }

  generateRegisterMediaListFunction () {
    return this.transArr2Str([
      'export async function registerMediaList(list: string[]) {',
      "  const taroCoreContext: TaroCoreContext = AppStorage.get('TaroCoreContext')!",
      '  const instance: TaroInstance = await taroCoreContext?.getInstance()!',
      '  await instance.runJSBundle(',
      '    new TraceJSBundleProviderDecorator(',
      '      new StringJSBundleProvider(',
      `        \`globalThis._resourcesMediaList = \${Array.isArray(list) ? JSON.stringify(list.map(str => str.replace(/.+resources\\/base\\/media\\//, ''))) : '[]'}\`,`,
      `        'virtual://mediaList.json'`,
      `      ),`,
      `      new StandardTaroLogger((error: TaroAny) => hilog.error(0xBEEF, "registerMediaList ERROR", error.getDetails()))`,
      `    )`,
      `  )`,
      '}',
    ])
  }

  generateDependenciesFunction () {
    // Note: 可以考虑修改为按需加载，但是要注意部分同步使用的模块会存在问题
    return this.transArr2Str([
      `export async function initDependencies () {`,
      '  hasInit = new Promise<TaroAny>(resolve => initResolver = resolve)',
      '  try {',
      `    const RAW_FILES = [`,
      ...this.list.map(lib => `      '${`${NPM_DIR}/${lib}`}',`),
      `    ]`,
      // `    ${globalVarName}.${setLibraryFunctionName} = ${setLibraryFunctionName}`,
      // `    ${globalVarName}.${loadLibraryFunctionName} = ${loadLibraryFunctionName}`,
      // `    ${globalVarName}.${taroLibraryVarName} ||= {}`,
      // `    ${globalVarName}.${projectLibraryName} ||= {}`,
      // '',
      // ...this.preBuildIn.map(lib => `    ${globalVarName}.${setLibraryFunctionName}(await import('${
      //   typeof lib === 'string' ? lib : lib[0]
      // }'), true, '${
      //   typeof lib === 'string' ? lib : lib[1]
      // }', '*')`),
      // '',
      // ...this.list.map(lib => `    await ${lib === true ? 'initResolver()' : `import('./${lib}')`}`),
      // '',
      // ...this.postBuildIn.map(lib => `    ${globalVarName}.${setLibraryFunctionName}(await import('${
      //   typeof lib === 'string' ? lib : lib[0]
      // }'), true, '${
      //   typeof lib === 'string' ? lib : lib[1]
      // }', '*')`),
      '',
      `    const taroCoreContext: TaroCoreContext = AppStorage.get('TaroCoreContext')!`,
      `    const instance: TaroInstance = await taroCoreContext?.getInstance()!`,
      '',
      `    // Note: 运行时过大，等待可能会阻塞首屏加载`,
      `    await instance.runJSBundle(new TraceJSBundleProviderDecorator(`,
      `      new AnyJSBundleProvider(`,
      `        ...RAW_FILES.map((item: string): TaroAny => new ResourceJSBundleProvider(taroCoreContext?.uiAbilityContext.resourceManager!, item)),`,
      `        new StringJSBundleProvider(\`(() => {`,
      `  globalThis.loadLibrary("@tarojs/runtime", "initHarmonyElement")()`,
      `  nativeEvent.initNodeEvent({`,
      `    createEvent: globalThis.loadLibrary('@tarojs/runtime', 'createEvent'),`,
      `    createTaroEvent: globalThis.loadLibrary('@tarojs/runtime', 'createTaroEvent'),`,
      `    eventHandler: globalThis.loadLibrary('@tarojs/runtime', 'eventHandler'),`,
      `  })`,
      `  nativeUIManager.initSystemInfo({`,
      `    deviceInfo: globalThis.loadLibrary('@tarojs/taro', 'getDeviceInfo')(),`,
      `  })`,
      `})();\`, 'npm/${entryFileName}?generated'),`,
      `      ),`,
      `      new StandardTaroLogger((error: TaroAny) => hilog.error(0xBEEF, "TaroJS ERROR", error.getDetails())),`,
      `    )).catch((err: Error) => {`,
      `      console.error('[taro-library]', \`\${err}\\n\${err.stack}\`)`,
      `      throw err`,
      `    })`,
      '  } catch (e) {',
      `    console.error('[taro-library]: initDependencies', e)`,
      `    console.error(e.stack)`,
      '  }',
      `}`,
    ])
  }
}
