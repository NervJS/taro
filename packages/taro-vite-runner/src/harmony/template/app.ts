import { TARO_TABBAR_PAGE_PATH } from '../page'
import BaseParser from './base'

import type { AppConfig } from '@tarojs/taro'
import type { ViteHarmonyBuildConfig } from '@tarojs/taro/types/compile/viteCompilerContext'

export default class Parser extends BaseParser {
  #setReconciler = ''
  #setReconcilerPost = ''

  constructor (
    protected appPath: string,
    protected appConfig: AppConfig,
    protected buildConfig: ViteHarmonyBuildConfig,
    protected loaderMeta: Record<string, unknown>,
  ) {
    super()
    this.init()
  }

  init () {
    const runtimePath = Array.isArray(this.buildConfig.runtimePath) ? this.buildConfig.runtimePath : [this.buildConfig.runtimePath]
    this.#setReconciler = runtimePath.reduce((res, item) => {
      if (item && /^post:/.test(item)) {
        this.#setReconcilerPost += `import '${item.replace(/^post:/, '')}'\n`
        return res
      } else {
        return res + `import '${item}'\n`
      }
    }, '') || ''
  }

  get pxTransformConfig () {
    const pxTransformOption = this.buildConfig.postcss?.pxtransform || {}
    const pxTransformConfig = pxTransformOption.config || {}
    pxTransformConfig.designWidth = this.buildConfig.designWidth
    pxTransformConfig.deviceRatio = this.buildConfig.deviceRatio
    return pxTransformConfig
  }

  getInitPxTransform () {
    return this.transArr2Str([
      'initPxTransform({',
      this.transArr2Str([
        `designWidth: ${this.pxTransformConfig.designWidth},`,
        `deviceRatio: ${JSON.stringify(this.pxTransformConfig.deviceRatio)},`,
        `baseFontSize: ${this.pxTransformConfig.baseFontSize},`,
        `unitPrecision: ${this.pxTransformConfig.unitPrecision},`,
        `targetUnit: ${JSON.stringify(this.pxTransformConfig.targetUnit)},`,
      ], 2),
      '})',
    ])
  }

  get instantiateApp () {
    const { frameworkArgs, creator, modifyInstantiate } = this.loaderMeta
    const createApp = `${creator}(component, ${frameworkArgs})`

    const { pages = [], entryPagePath = pages[0], tabBar } = this.appConfig
    let entryPath = entryPagePath
    const tabbarList = tabBar?.list || []
    const tabbarIndex = tabbarList.findIndex(item => item.pagePath === entryPagePath)
    if (tabbarIndex >= 0) {
      entryPath = TARO_TABBAR_PAGE_PATH
    }

    let instantiateApp = `export default class EntryAbility extends UIAbility {
app

onCreate(want, launchParam) {
AppStorage.SetOrCreate('__TARO_ENTRY_PAGE_PATH', '${entryPagePath}')
AppStorage.SetOrCreate('__TARO_PAGE_STACK', [])
this.app = ${createApp}
this.app.onLaunch({
  ...want,
  ...launchParam
})
}

onDestroy() {}

onWindowStageCreate(stage) {
context.resolver(this.context)
stage.loadContent('${entryPath}', (err, data) => {
  if (err.code) {
    return this.app?.onError?.call(this, err)
  }
})
}

onWindowStageDestroy() {
this.app?.onUnload?.call(this)
}

onForeground() {
this.app?.onShow?.call(this)
}

onBackground() {
this.app?.onHide?.call(this)
}
}`

    if (typeof modifyInstantiate === 'function') {
      instantiateApp = modifyInstantiate(instantiateApp, 'app')
    }

    return instantiateApp
  }

  parse (rawId: string) {
    const { importFrameworkStatement, creator, creatorLocation } = this.loaderMeta

    return this.transArr2Str([
      // '// @ts-nocheck',
      this.#setReconciler,
      'import UIAbility from "@ohos.app.ability.UIAbility"',
      'import { window, context } from "@tarojs/runtime"',
      `import { ${creator} } from "${creatorLocation}"`,
      'import Taro, { initNativeApi, initPxTransform } from "@tarojs/taro"',
      'import router from "@ohos.router"',
      this.#setReconcilerPost,
      `import component from "${rawId}"`,
      importFrameworkStatement,
      `var config = ${this.prettyPrintJson(this.appConfig)};`,
      'window.__taroAppConfig = config',
      'initNativeApi(Taro)',
      this.getInitPxTransform(),
      this.instantiateApp,
    ])
  }
}
