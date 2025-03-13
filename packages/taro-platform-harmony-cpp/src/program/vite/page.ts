import path from 'node:path'

import { isObject, isString } from '@tarojs/shared'
import { TARO_COMP_SUFFIX } from '@tarojs/vite-runner/dist/harmony/entry'
import { escapePath, prettyPrintJson } from '@tarojs/vite-runner/dist/utils'

import { genRawFileName, getProjectId, PKG_NAME, SEP_RGX } from '../../utils'
import { fixImportCode } from '../rollup/global-plugin'
import { loadLibraryFunctionName } from '../template/entry'
import { STYLE_SUFFIX } from './style'

import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'
import type Parser from '@tarojs/vite-runner/dist/harmony/template/page'
import type { OutputBundle, OutputChunk, PluginContext } from 'rollup'
import type { Plugin, PluginOption } from 'vite'
import type Harmony from '..'

declare class PageParser extends Parser {
  public appPath: (typeof Parser.prototype)['appPath']
  public appConfig: (typeof Parser.prototype)['appConfig']
}

export type TPageMeta = TaroHarmonyPageMeta & {
  entryOption: TaroHarmonyPageMeta['config'] | false
  config: {
    entryOption: TaroHarmonyPageMeta['config'] | false
    routeOptions: Record<string, any>
  }
}

export default function (this: Harmony): PluginOption {
  const that = this
  const projectId = getProjectId()
  const onlyBundle = this.ctx.runOpts?.options?.args?.onlyBundle
  function genUniPageId(page: TPageMeta) {
    return `${projectId}:${page.originName || page.name}`
  }
  const name = 'taro:vite-harmony-page-config'

  return {
    name,
    enforce: 'pre',
    options(opt) {
      if (opt.plugins instanceof Array) {
        // Note: CAPI 模式禁用半编译能力
        const idx = opt.plugins.findIndex((e) => e && (e as Plugin).name === 'taro:vite-compile-mode')
        if (idx >= 0) {
          const compileMode = opt.plugins[idx] as Plugin
          compileMode.name = 'taro:vite-capi-compile-mode'
          delete compileMode.transform
          opt.plugins.splice(idx, 1, compileMode)
        }
      }
    },
    buildStart(this: PluginContext) {
      const pluginContext = this
      const { runnerUtils, runOpts } = that.context
      const isPureComp = (page: TPageMeta) => {
        return runOpts?.options?.args.pure || page.config?.entryOption === false
      }

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)!
      const taroConfig = compiler.taroConfig

      if (compiler?.components instanceof Array) {
        compiler.loaderMeta ||= {}
        compiler.loaderMeta.modifyEntryFile = function (
          this: PageParser,
          type = '',
          rawId = '',
          rawCode = '',
          page: TPageMeta
        ) {
          if (type === 'page') {
            // 输入componetn bundle 模式下的配置文件
            if (onlyBundle) {
              pluginContext.emitFile({
                type: 'asset',
                name: 'index_config',
                fileName: 'index_config.json',
                source: `{ "projectName": "${projectId}", "projectPath": "${page.originName || page.name}" }`,
              })
            }

            const isPure = isPureComp(page)
            const { creatorLocation, frameworkArgs, importFrameworkStatement } = this.loaderMeta
            const isBlended = this.buildConfig.blended || this.buildConfig.isBuildNativeComp
            const createFn = isPure
              ? 'createNativeComponentConfig'
              : isBlended
                ? 'createNativePageConfig'
                : 'createPageConfig'
            const pageId = genUniPageId(page)

            const addedImportStr =
              typeof compiler?.loaderMeta?.addEntryImport === 'function' &&
              compiler?.loaderMeta?.addEntryImport?.formPlugin !== name
                ? compiler.loaderMeta.addEntryImport.call(this)
                : ''
            const addedBodyStr =
              typeof compiler?.loaderMeta?.addEntryBody === 'function' &&
              compiler?.loaderMeta?.addEntryImport?.formPlugin !== name
                ? compiler.loaderMeta.addEntryBody.call(this, page)
                : ''
            const oldEntryWrapperFn =
              typeof compiler?.loaderMeta?.addEntryWrapper === 'function' &&
              compiler?.loaderMeta?.addEntryImport?.formPlugin !== name
                ? compiler.loaderMeta.addEntryWrapper.bind(this)
                : (i: string) => i

            compiler.loaderMeta.addEntryImport = function () {
              if (createFn !== 'createNativeComponentConfig') return addedImportStr
              return `${addedImportStr}
import { eventCenter } from '@tarojs/runtime'
import { useState, useEffect, createElement } from 'react'
              `
            }
            compiler.loaderMeta.addEntryImport.formPlugin = name

            compiler.loaderMeta.addEntryBody = function () {
              if (createFn !== 'createNativeComponentConfig') return addedBodyStr
              return `${addedBodyStr}
function ComponentWrapper ({ Component }) {
  const [componentProps, setComponentProps] = useState({});
  useEffect(function () {
    eventCenter.on('${pageId}AttrsChange', function (attrs) {
      setComponentProps(attrs.node);
    });
  }, []);
  return  createElement(Component, componentProps)
}
              `
            }
            compiler.loaderMeta.addEntryBody.formPlugin = name

            compiler.loaderMeta.addEntryWrapper = function (entryStr) {
              if (createFn !== 'createNativeComponentConfig') return oldEntryWrapperFn(entryStr)
              return oldEntryWrapperFn(`
() => createElement( ComponentWrapper, {Component: ${entryStr}})
            `)
            }
            compiler.loaderMeta.addEntryWrapper.formPlugin = name

            const createPageOrComponent = `${createFn}(${compiler.loaderMeta.addEntryWrapper.call(
              this,
              'component'
            )}, ${isPure || isBlended ? `'${pageId}', ${frameworkArgs}` : `'${pageId}', config`})`

            return this.transArr2Str([
              `import { ${createFn} } from '${creatorLocation}'`,
              ...((importFrameworkStatement as string) || '').split('\n'),
              `import component from "${escapePath(rawId)}"`,
              typeof compiler?.loaderMeta?.addEntryImport === 'function'
                ? compiler.loaderMeta.addEntryImport.call(this)
                : '',
              typeof compiler?.loaderMeta?.addEntryBody === 'function'
                ? compiler.loaderMeta.addEntryBody.call(this, page)
                : '',
              page?.config.enableShareTimeline ? 'component.enableShareTimeline = true' : null,
              page?.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : null,
              `export default (config = {}) => ${createPageOrComponent}`,
            ])
          } else {
            return rawCode
          }
        }

        compiler.loaderMeta.modifyInstantiate = function (this: PageParser, code = '', type = '', page: TPageMeta) {
          if (type === 'page') {
            const componentName = (page.config as any)?.componentName
            if (typeof componentName === 'string') {
              code = code.replace(/export\sdefault\sstruct\sIndex/, `export struct ${componentName}`)
            }
            if (isPureComp(page)) {
              code = code.replace(/@Component/, '@ComponentV2')
            }

            const isBlended = taroConfig.blended || taroConfig.isBuildNativeComp
            return this.transArr2Str([
              `const designConfig: TaroAny = ${this.getInitPxTransform()
                .replace(/(initPxTransform|\(|\))/g, '')
                .replace('},', '} as TaroAny,')}`,
              `const config: TaroObject = ${prettyPrintJson(page?.config)}`,
              isBlended ? this.getInitPxTransform() : null,
              code,
            ])
          }

          return code
        }

        compiler.components.forEach((config: TPageMeta) => {
          if (!isPureComp(config)) {
            config.entryOption = {}
          }

          config.modifyPageImport = function (this: PageParser, importStr: string[], page: TPageMeta) {
            if (!isPureComp(page)) {
              Object.assign(config.entryOption, {
                routeName: page.name,
              })
              if (isObject(page.config?.entryOption)) {
                Object.assign(config.entryOption, page.config.entryOption)
              }
            }

            const rgx = /^(?!import type).*['"]@tarojs[\\/](runtime|taro)['"]/
            let idx = importStr.findIndex((e) => rgx.test(e))
            while (idx > -1) {
              importStr.splice(idx, 1)
              idx = importStr.findIndex((e) => rgx.test(e), idx + 1)
            }
            const typeRgx = /^import type \w+ from/
            idx = importStr.findIndex((str) => typeRgx.test(str))
            while (idx > -1) {
              importStr.splice(idx, 1)
              idx = importStr.findIndex((str) => typeRgx.test(str))
            }
            idx = importStr.findIndex((str) => str.includes('import createComponent'))
            if (idx > -1) {
              importStr.splice(idx, 1)
            }

            importStr.unshift('import { TaroXComponent } from "@tarojs/components"')
            importStr.unshift(
              `import type { TaroLogger, TaroCoreContext, TaroInstance } from "${PKG_NAME}/dist/runtime/runtime-harmony"`
            )
            importStr.unshift(
              `import { initStyleSheetConfig, initPxTransform, navigateBack, getWindowInfo as getSystemInfoSync, Current, eventCenter, ObjectAssign, StandardTaroLogger, TraceJSBundleProviderDecorator,  BundleInfo, bundleInfos2JSBundleProviderWithVersion, AnyJSBundleProvider, ResourceJSBundleProvider, StringJSBundleProvider, systemContext, injectGlobalVariable, TaroWindowUtil } from "${PKG_NAME}/dist/runtime/runtime-harmony"`
            )
            importStr.unshift(
              `import { TaroNativeModule } from "${runOpts.config.chorePackagePrefix}/${PKG_NAME}/dist/runtime/runtime-harmony/harmony-library"`
            )
            importStr.unshift('import hilog from "@ohos.hilog"')
            importStr.unshift('import { NodeContent } from "@ohos.arkui.node"')
            importStr.unshift('import display from "@ohos.display"')
            importStr.unshift('import ConfigurationConstant from "@ohos.app.ability.ConfigurationConstant"')
          }

          config.modifyRenderState = function (this: PageParser, state: (string | null)[], page: TPageMeta) {
            const isPure = isPureComp(page)
            const idx = state.findIndex((e) => e && e.startsWith('onReady?'))
            state.splice(idx, 1)
            // 共有属性
            state.push(
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'params',
                  type: 'TaroObject',
                  foreach: () => '{}',
                  disabled: !this.buildConfig.isBuildNativeComp,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'statusBarHeight',
                  type: 'number',
                  foreach: () => 'px2vp(TaroWindowUtil.getStatusBarHeight())',
                  disabled: !this.buildConfig.isBuildNativeComp,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'isHideTitleBar',
                  type: 'boolean',
                  foreach: () =>
                    this.appConfig.window?.navigationStyle === 'custom'
                      ? `config.navigationStyle !== 'default'`
                      : `config.navigationStyle === 'custom'`,
                  disabled: !this.buildConfig.isBuildNativeComp,
                },
                this.isTabbarPage
              ),

              this.renderState(
                {
                  name: 'nodeContent',
                  type: 'Content',
                  foreach: () => 'new NodeContent()',
                  disabled: !this.buildConfig.isBuildNativeComp,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'isReady',
                  type: 'boolean',
                  foreach: () => 'false',
                  disabled: !this.buildConfig.isBuildNativeComp,
                },
                this.isTabbarPage
              ),

              // Note: for JSVM
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'pageInitEventName',
                  type: 'string',
                  foreach: () => '""',
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'instanceId',
                  type: 'string',
                  foreach: () => '""',
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'pagePath',
                  type: 'string',
                  foreach: () => '""',
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: isPure ? '' : 'StorageLink("TaroCoreContext")',
                  name: isPure ? 'private __taroCoreContext' : 'private taroCoreContext',
                  type: isPure ? 'SubscribedAbstractProperty<TaroCoreContext>' : 'TaroCoreContext | null',
                  foreach: () => (isPure ? `AppStorage.link('TaroCoreContext')` : 'null'),
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  name: 'private logger',
                  type: 'TaroLogger | null',
                  foreach: () => 'null',
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  name: 'taroInstance',
                  type: 'TaroInstance | null',
                  foreach: () => 'null',
                },
                this.isTabbarPage
              )
            )

            // 页面级组件特有
            if (!isPure) {
              state.push(
                this.renderState(
                  {
                    name: '__layoutSize',
                    type: 'TaroAny',
                    foreach: () => 'null',
                    disabled: !this.buildConfig.isBuildNativeComp,
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    decorator: 'State',
                    name: 'pullDownRatio',
                    type: 'number',
                    foreach: () => '1',
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    name: 'isShown',
                    type: 'boolean',
                    foreach: () => 'true',
                    disabled: !this.buildConfig.isBuildNativeComp,
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    name: '__pageName',
                    type: 'TaroAny',
                    foreach: () => 'null',
                    disabled: !this.buildConfig.isBuildNativeComp,
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    decorator: 'State',
                    name: 'isUseCache',
                    type: 'boolean',
                    foreach: () => 'false',
                    disabled: !this.buildConfig.isBuildNativeComp,
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    name: 'isReported',
                    type: 'boolean',
                    foreach: () => 'false',
                    disabled: !this.buildConfig.isBuildNativeComp,
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    decorator: `StorageProp('__TARO_APP_COLOR_MODE') @Watch('onCurrentColorModeChange')`,
                    name: 'currentColorMode',
                    type: 'ConfigurationConstant.ColorMode',
                    foreach: () => 'ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET',
                    disabled: !this.buildConfig.isBuildNativeComp,
                  },
                  this.isTabbarPage
                )
              )
            } else {
              state.unshift(
                this.renderState(
                  {
                    decorator: 'Param',
                    name: '_nid',
                    type: 'number',
                    foreach: () => '0',
                  },
                  this.isTabbarPage
                ),
                this.renderState(
                  {
                    decorator: 'Param',
                    name: '_updateTrigger',
                    type: 'number',
                    foreach: () => '0',
                  },
                  this.isTabbarPage
                )
              )
              state.forEach((item, i) => {
                if (item) {
                  if (/\s(props|params):/.test(item)) {
                    state.splice(i, 1, item.replace(/@State/g, '@Param'))
                  } else if (item.includes('@State')) {
                    state.splice(i, 1, item.replace(/@State/g, '@Local'))
                  }
                }
              })
            }
          }

          config.modifyPageParams = (_: string) => {
            return 'this.params'
          }

          config.modifyPageAppear = function (appearStr: string, page: TPageMeta) {
            const isPure = isPureComp(page)
            const appearCode: (string | null)[] = isPure
              ? [`initEtsBuilder('${genUniPageId(page)}')`]
              : [
                `initEtsBuilder('${genUniPageId(page)}')`,
                'this.__layoutSize = this.params._layout_',
                `this.__pageName = '${page.name}'`,
                'systemContext.windowWidth = this.params._layout_?.width',
                'systemContext.windowHeight = this.params._layout_?.height',
                'injectGlobalVariable(this.params._layout_.width, this.params._layout_.height, this.taroInstance?.getId())',
              ]

            appearCode.push(...appearStr.split('\n').filter((e) => !/initHarmonyElement/.test(e)), 'this.init()')
            return this.transArr2Str(appearCode.filter(Boolean))
          }

          config.modifyPageDisappear = function (_disappearStr: string) {
            return 'this.handlePageDetach()'
          }

          config.modifyPageBuild = function (this: PageParser, _: string, page: TPageMeta) {
            const coreBuildCodeArray = [
              'Stack() {',
              '  if (this.isReady) {',
              '    TaroXComponent({ pageId: (this.node as TaroAny)?._nid, data: this.nodeContent })',
              '  }',
              '}',
              '.align(Alignment.TopStart)',
              '.width("100%")',
              '.constraintSize({',
              '  minHeight: "100%",',
              '})',
              '.onDetach(this.handlePageDetach)',
            ]

            if (!isPureComp(page)) {
              coreBuildCodeArray.push(
                '.backgroundColor(this.pageBackgroundContentColor || this.pageBackgroundColor || "#FFFFFF")'
              )

              if (this.enableRefresh === 1) {
                coreBuildCodeArray.forEach((code, idx) => coreBuildCodeArray.splice(idx, 1, `${' '.repeat(2)}${code}`))
                coreBuildCodeArray.unshift(
                  'Refresh({',
                  '  refreshing: $$this.isRefreshing,',
                  '  builder: this.customRefreshBuilder()',
                  '}) {'
                )
                coreBuildCodeArray.push(
                  '}',
                  '.pullDownRatio(this.pullDownRatio)',
                  '.onStateChange(this.handleRefreshStatus)'
                )
              }

              coreBuildCodeArray.forEach((code, idx) => coreBuildCodeArray.splice(idx, 1, `${' '.repeat(2)}${code}`))
              coreBuildCodeArray.unshift('Navigation() {')
              coreBuildCodeArray.push(
                '}',
                `.backgroundColor(this.pageBackgroundColor || '${
                  this.appConfig?.window?.backgroundColor || '#FFFFFF'
                }')`,
                `.height('100%')`,
                `.width('100%')`,
                `.title({ builder: this.renderTitle, height: this.getNavHeight() })`,
                `.titleMode(NavigationTitleMode.Mini)`,
                `.hideTitleBar(this.isHideTitleBar)`,
                `.hideBackButton(true)`,
                // `.expandSafeArea([SafeAreaType.SYSTEM])`,
                `.mode(NavigationMode.Stack)`
              )
            }

            return this.transArr2Str(coreBuildCodeArray)
          }

          config.modifyPageMethods = function (this: PageParser, methods, page: TPageMeta) {
            const isPure = isPureComp(page)
            const pageId = genUniPageId(page)
            const handlePageAppearMethods = methods.find((item) => item.name === 'handlePageAppear')
            if (handlePageAppearMethods) {
              const methodsBodyList = handlePageAppearMethods.body?.split('\n') || []
              let insertIndex = methodsBodyList.findIndex((item) => item.startsWith('const params'))
              if (insertIndex >= 0) {
                methodsBodyList.splice(insertIndex, 2)
              }
              insertIndex = methodsBodyList.findIndex((item) => item.includes('this.onReady'))
              if (insertIndex >= 0) {
                methodsBodyList?.splice(
                  insertIndex,
                  2,
                  ...[
                    `this.pageInitEventName = "${genUniPageId(page)}" + Date.now()`,
                    isPure ? null : 'Current.page = this',
                    isPure ? null : `this.bindPageEvent()`,
                    this.enableRefresh === 1 && !isPure
                      ? `eventCenter.on('__taroPullDownRefresh', this.handleRefreshStatus)`
                      : null,
                    `eventCenter.once(this.pageInitEventName, (instance: TaroAny) => {`,
                    '  Current.nativeModule.buildTaroNode(this.nodeContent, instance._nid)',
                    `  this.pagePath = instance.$taroPath`,
                    `  this.instanceId = instance.id`,
                    '  this.isReady = true',
                    ...(isPure
                      ? [
                        `  eventCenter.trigger(this.getCurrentInstanceEventName('lifecycle'), 'onShow')`, // Note: 通常定义晚于页面 show 事件, 需要单独触发
                        `  eventCenter.on(this.pagePath + '.lifecycle', this.handlePageEventForward)`,
                      ]
                      : [
                      ]),
                  ].filter(isString)
                )
                methodsBodyList.pop()

                if (taroConfig.isWatch) {
                  handlePageAppearMethods.body = this.transArr2Str([
                    'try {',
                    this.transArr2Str(methodsBodyList, 2),
                    '} catch (error) {',
                    `  console.error('[TARO_LOG] page-appear:', error.message + '\\n' + error.stack)`,
                    '}',
                  ])
                } else {
                  handlePageAppearMethods.body = this.transArr2Str(methodsBodyList)
                }
              }
            }
            const handleRefreshStatusMethods = methods.find((item) => item.name === 'handleRefreshStatus')
            if (handleRefreshStatusMethods) {
              handleRefreshStatusMethods.type = 'arrow'
              handleRefreshStatusMethods.body = this.transArr2Str([
                `if (Current.page !== this) return`,
                '',
                handleRefreshStatusMethods.body?.replace(
                  /(bind|call)Fn\((\S+)(,[^)]*)?\)/gi,
                  (_, _fn, name = '') =>
                    `eventCenter.trigger(this.getCurrentInstanceEventName('lifecycle'), "${name.split('.').pop()}")`
                ),
              ])
            }

            const handleBindPageEventMethods = methods.find((item) => item.name === 'bindPageEvent')
            if (handleBindPageEventMethods) {
              handleBindPageEventMethods.type = 'arrow'
              handleBindPageEventMethods.body = this.transArr2Str([
                `if (Current.page !== this) return`,
                '',
                handleBindPageEventMethods.body,
              ])
            }
            const handleRemovePageEventMethods = methods.find((item) => item.name === 'removePageEvent')
            if (handleRemovePageEventMethods) {
              handleRemovePageEventMethods.type = 'arrow'
              handleRemovePageEventMethods.body = this.transArr2Str([
                `if (Current.page !== this) return`,
                '',
                handleRemovePageEventMethods.body,
              ])
            }

            const disabledMethods = ['getPageState', 'onPageShow', 'onPageHide']
            if (isPure) {
              disabledMethods.push('handleRefreshStatus')
            }
            disabledMethods.forEach((name) => {
              const idx = methods.findIndex((e) => e.name === name)
              if (idx > -1) {
                methods.splice(idx, 1)
              }
            })

            methods.unshift(
              {
                name: 'getNavHeight',
                body: 'return this.isHideTitleBar ? 0 : 48 + this.statusBarHeight',
              },
              {
                name: 'getCurrentInstanceEventName',
                params: ['event: string'],
                body: this.transArr2Str([`return !this.instanceId ? '' : \`\${this.instanceId}.\${event}\``]),
              }
            )
            methods.push({
              name: 'handlePageDetach',
              type: 'arrow',
              body: this.transArr2Str([
                `if (!this.isReady) return`,
                '',
                `this.isReady = false`,
                this.enableRefresh === 1 && !isPure
                  ? `eventCenter.off('__taroPullDownRefresh', this.handleRefreshStatus)`
                  : null,
                isPure
                  ? `eventCenter.off(this.pagePath + '.lifecycle', this.handlePageEventForward)`
                  : `this.removePageEvent()`,
                `eventCenter.trigger(this.getCurrentInstanceEventName('lifecycle'), 'onUnload')`,
              ]),
            })

            if (!isPure) {
              const index = methods.findIndex((e) => e.name === 'renderTitle')
              methods.splice(index, 1, {
                name: 'renderTitle',
                decorators: ['Builder'],
                body: this.transArr2Str([
                  'NavBar({',
                  // '  isAdaptStatusBar: true,', 由于内置 windowStage 为 undefined 实际无效
                  '  isAutoDark: true,',
                  `  statusBarHeight: this.statusBarHeight,`,
                  `  bgColor: this.navigationBarBackgroundColor || '${
                    this.appConfig.window?.navigationBarBackgroundColor || '#000000'
                  }',`,
                  `  mainTitleText: new TextParam(this.navigationBarTitleText || '${
                    this.appConfig.window?.navigationBarTitleText || ''
                  }', null, this.navigationBarTextStyle || '${
                    this.appConfig.window?.navigationBarTextStyle || 'white'
                  }', null),`,
                  '  useBackIcon: true,',
                  '  onBackClick: () => {',
                  '    navigateBack()', // 需要拦截适配返回，组件提供的返回与 NavDestination 不兼容
                  '    return true',
                  '  },',
                  '})',
                ]),
              })

              if (this.enableRefresh === 1) {
                methods.push({
                  name: 'customRefreshBuilder',
                  decorators: ['Builder'],
                  body: this.transArr2Str([
                    'if (config?.backgroundImageUrl) {',
                    '   Image(config?.backgroundImageUrl)',
                    '      .objectFit(ImageFit.Contain)',
                    '      .width(32)',
                    '      .height(32)',
                    '} else {',
                    '    LoadingProgress()',
                    '      .width(32)',
                    '      .height(32)',
                    '}',
                  ]),
                })
                // 禁止页面滚动
                methods.push({
                  name: 'disablePullDown',
                  body: this.transArr2Str(['this.pullDownRatio = 0']),
                })
                // 允许页面滚动
                methods.push({
                  name: 'enablePullDown',
                  body: this.transArr2Str([' this.pullDownRatio = 1']),
                })
              }
            } else {
              methods.push({
                name: 'handlePageEventForward',
                type: 'arrow',
                params: ['eventName: string, args: TaroAny'],
                body: this.transArr2Str([
                  `eventCenter.trigger(this.getCurrentInstanceEventName(eventName), args)`,
                  '',
                  `if (eventName === 'onResize') {`,
                  `  TaroNativeModule.updateStyleSheetBundle(`,
                  `    '${pageId}',`,
                  `    RAW_FILES_STYLE,`,
                  `    initStyleSheetConfig(args[0]?.size, designConfig, this.getNavHeight()),`,
                  `    this.taroCoreContext?.uiAbilityContext.resourceManager!,`,
                  `    this.node?._nid`,
                  `  )`,
                  `}`,
                ]),
              })
            }

            methods.push({
              prefix: 'private',
              name: 'onCurrentColorModeChange',
              body: this.transArr2Str([
                `TaroNativeModule.flushSync(() => {`,
                `  TaroNativeModule.updateStyleSheetBundle(`,
                `    '${pageId}',`,
                `    RAW_FILES_STYLE,`,
                `    initStyleSheetConfig(this.__layoutSize, designConfig, this.getNavHeight()),`,
                `    this.taroCoreContext?.uiAbilityContext.resourceManager!,`,
                `    this.node?._nid`,
                `  );`,
                `})`,
              ])
            })

            const compPath = escapePath(`${page.originName || page.name}${TARO_COMP_SUFFIX}.js`)
            methods.unshift({
              prefix: 'private',
              name: 'init',
              body: this.transArr2Str([
                `this.logger = this.taroCoreContext!.logger.clone("TaroApp")`,
                `const stopTracing: TaroAny = this.logger.clone("init").startTracing()`,
                'try {',
                `  TaroNativeModule.initStyleSheetBundle(`,
                `    '${pageId}',`,
                `    RAW_FILES_STYLE,`,
                `    initStyleSheetConfig(this.params._layout_, designConfig, this.getNavHeight()),`,
                `    this.taroCoreContext?.uiAbilityContext.resourceManager!`,
                `  );`,
                '  const bundleInfos = this.params.bundle as BundleInfo[] ?? []',
                '  this.taroInstance = this.taroCoreContext?.getInstance()!',
                '  const jsBundleProvider: TaroAny = new TraceJSBundleProviderDecorator(',
                `    new AnyJSBundleProvider(`,
                `     new StringJSBundleProvider(`,
                `     \`(() => {globalThis.__page_id = '\${this.pageInitEventName}'})();\``,
                `    , "virtual://${compPath}"),`,
                `      ...bundleInfos2JSBundleProviderWithVersion([...bundleInfos, ...RAW_FILES], this.taroCoreContext?.uiAbilityContext.resourceManager!),`,
                `      new StringJSBundleProvider(\`(() => {`,
                this.transArr2Str(
                  fixImportCode(['import { Current, eventCenter, window, CONTEXT_ACTIONS } from "@tarojs/runtime"'], {
                    chorePackagePrefix: runOpts.config.chorePackagePrefix,
                    projectId,
                    sourcePath: compPath,
                    fileName: page.originName,
                  })
                    .map((e) => e.replace(/:\sTaroAny/g, ''))
                    .join('\n')
                    .split('\n')
                    .concat(
                      [
                        `const params = \${JSON.stringify(this.params)}`,
                        `const createComponent = ${loadLibraryFunctionName}("${compPath}", "default", "${projectId}")`,
                        ...`const page = createComponent(\${JSON.stringify(config)})`.split('\n'),
                        `if (page) {`,
                        isPure
                          ? `  page.props = nativeUIManager.getTaroNodeAttribute({ _nid: \${this._nid} }, 'props')`
                          : null,
                        `  page.onLoad(params, (instance) => {`,
                        `    eventCenter.trigger('\${this.pageInitEventName}', { id: instance.id, _nid: instance._nid, $taroPath: Current.page?.$taroPath })`,
                        `    const pagePath = Current.page?.$taroPath;`,
                        `    const clear = (pageId) => {`,
                        `       if (pagePath == pageId) {`,
                        `         __taro_clearPageTimer('\${this.pageInitEventName}')`,
                        `         window.off(CONTEXT_ACTIONS.DESTORY, clear);`,
                        `       }`,
                        `    }`,
                        `    window.on(CONTEXT_ACTIONS.DESTORY, clear, null);`,
                        `  })`,
                        `}`,
                      ].filter((e) => typeof e === 'string') as string[]
                    )
                    .slice(2),
                  8
                ),
                `      })()\`, 'virtual://${compPath}')`,
                `    ),`,
                '    new StandardTaroLogger((error: TaroAny) => hilog.error(0xBEEF, "TaroJS ERROR", error.getDetails())),',
                '  )',
                '',
                '  if (jsBundleProvider) {',
                '    if (!this?.params?.loadBundleAsync) {',
                '      this.taroInstance.runJSBundleSync(jsBundleProvider)',
                '    } else {',
                '      this.taroInstance.runJSBundle(jsBundleProvider).catch((err: string) => {',
                '        throw new Error(err)',
                '      })',
                '    }',
                '  }',
                '  stopTracing()',
                '} catch (reason) {',
                '  if (typeof reason === "string") {',
                '    this.taroCoreContext!.logger.error(reason)',
                '  } else if (reason instanceof Error) {',
                '    this.taroCoreContext!.logger.error(reason.message)',
                '  } else {',
                '    this.taroCoreContext!.logger.error("Fatal exception")',
                '  }',
                '  stopTracing()',
                '}',
              ]),
            })

            if (isPure) {
              methods.unshift(
                {
                  prefix: '@Computed get',
                  name: 'taroCoreContext',
                  body: this.transArr2Str(['return this.__taroCoreContext.get()']),
                },
                {
                  prefix: `@Monitor('_updateTrigger')`,
                  name: 'handleUpdateTrigger',
                  params: ['_: IMonitor'],
                  body: this.transArr2Str([
                    'if (!this.node) return',
                    '',
                    'this.taroInstance?.runJSBundle(new TraceJSBundleProviderDecorator(',
                    '  new StringJSBundleProvider(`(() => {',
                    this.transArr2Str(
                      fixImportCode(['import { eventCenter } from "@tarojs/runtime"'], {
                        chorePackagePrefix: runOpts.config.chorePackagePrefix,
                        projectId,
                        sourcePath: compPath,
                        fileName: page.originName,
                      })
                        .map((e) => e.replace(/:\sTaroAny/g, ''))
                        .join('\n')
                        .split('\n')
                        .concat(
                          [
                            `eventCenter.trigger('\${this.getCurrentInstanceEventName('lifecycle')}', 'shouldComponentUpdate', {}, {`,
                            `  props: nativeUIManager.getTaroNodeAttribute({ _nid: \${this._nid} }, 'props')`,
                            `})`,
                          ].filter((e) => typeof e === 'string')
                        )
                        .slice(2),
                      4
                    ),
                    `  })();\`, "virtual://${compPath}?update"),`,
                    `  new StandardTaroLogger((error: TaroAny) => hilog.error(0xBEEF, "TaroJS ERROR", error.getDetails())),`,
                    ')).catch((err: Error) => {',
                    '  this.taroCoreContext!.logger.error(err.message)', // Note: 这里抛出错误 ets 不能 catch, 直接打印即可
                    '})',
                  ]),
                }
              )
            }
          }
        })
      }
    },
    generateBundle(_, bundle) {
      if (onlyBundle) {
        Object.keys(bundle).forEach((e) => {
          if (e.includes(TARO_COMP_SUFFIX)) {
            const parsedPath = path.parse(bundle[e].fileName)
            bundle[e].fileName = parsedPath.name + parsedPath.ext
          }
          if (e.endsWith('.ets')) {
            delete bundle[e]
          }
        })
        return
      }

      Object.keys(bundle)
        .filter((id) => id.endsWith('.ets') && !id.includes('render'))
        .forEach((chunkId) => {
          const chunk = bundle[chunkId] as OutputChunk
          const rawFilesJs: string[] = []
          const rawFilesJson: string[] = []
          const rgx = /\bimport\s+['"]([^'"\s]+)['"]\s*[\n;]?/g
          const codeLines = chunk.code
            .replace(/import\s*?(from\s+['"])?[^'"]+['"];?/g, (match) => {
              return match.replace(/\n\s*/g, ' ')
            })
            .split('\n')
            .reduce((acc: string[], item) => {
              const rawPath = rgx.exec(item)?.[1] || ''
              if (rawPath.includes(TARO_COMP_SUFFIX) || rawPath.endsWith('.js')) {
                // 找到带有副作用的依赖
                const ext = path.extname(rawPath)
                const fullPath = path.posix.join(path.dirname(chunkId), ext ? rawPath : `${rawPath}.js`)
                if (rawPath.includes(TARO_COMP_SUFFIX)) {
                  rawFilesJson.push(fullPath.replace(TARO_COMP_SUFFIX, '_style').replace('.js', '.json'))
                }
                rawFilesJs.push(...getTopologicalOrder(bundle, fullPath))
                rawFilesJs.push(fullPath)
              } else {
                acc.push(item)
              }
              return acc
            }, [])
          const idx = codeLines.findIndex((item) => item && !/^(\s*|import\s.+)$/.test(item))
          codeLines.splice(
            idx,
            0,
            `const RAW_FILES = ${prettyPrintJson(
              rawFilesJs.map((item) => {
                const e = item.replace(SEP_RGX, '/')
                return `new BundleInfo('resource', '${genRawFileName(projectId)}/${e}', '${e}', '${
                  projectId.split('@')[1]
                }')`
              })
            ).replace(/"/g, '')}\nconst RAW_FILES_STYLE = ${prettyPrintJson(
              rawFilesJson.reverse().map((item) => {
                const e = item.replace(SEP_RGX, '/')
                return `new BundleInfo('resource', '${genRawFileName(projectId)}/${e}', '${e}', '${
                  projectId.split('@')[1]
                }')`
              })
            ).replace(/"/g, '')}\n`
          )
          chunk.code = codeLines.join('\n')
        })
    },
  }
}

function getTopologicalOrder(bundle: OutputBundle, entryChunk: string): string[] {
  const graph = new Map<string, string[]>()
  const indegree = new Map<string, number>()
  const processedChunks = new Set()

  // 初始化图和入度表
  Object.keys(bundle).forEach((id) => {
    graph.set(id, [])
    indegree.set(id, 0)
  })

  // 递归处理依赖项
  function processChunk(id: string) {
    if (processedChunks.has(id)) return

    processedChunks.add(id)
    const chunk = bundle[id] as OutputChunk

    // 构建图和入度表
    if (chunk && chunk.imports) {
      chunk.imports
        .filter(
          (item) =>
            item.includes(TARO_COMP_SUFFIX) ||
            (!new RegExp(`${STYLE_SUFFIX.replace(/([-\\/.$])/g, '\\$1')}\\.js$`).test(item) && item.endsWith('.js'))
        )
        .forEach((dep) => {
          graph.get(dep)?.push(id)
          indegree.set(id, indegree.get(id)! + 1)
          processChunk(dep)
        })
    }
  }

  // 从入口 chunk 开始处理
  processChunk(entryChunk)

  // 拓扑排序
  const queue: string[] = []
  const order: string[] = []

  // 将所有入度为 0 的节点加入队列
  indegree.forEach((value, id: string) => {
    if (value === 0 && processedChunks.has(id)) {
      queue.push(id)
    }
  })

  while (queue.length > 0) {
    const node = queue.shift()
    if (node && node !== entryChunk) {
      order.push(node)

      // 将当前节点的邻接节点的入度减 1
      graph.get(node)?.forEach((neighbor) => {
        indegree.set(neighbor, indegree.get(neighbor)! - 1)
        if (indegree.get(neighbor) === 0) {
          queue.push(neighbor)
        }
      })
    }
  }

  // 检查是否存在环
  if (order.length + 1 !== processedChunks.size) {
    throw new Error('Graph has a cycle, topological sort not possible')
  }

  return order
}
