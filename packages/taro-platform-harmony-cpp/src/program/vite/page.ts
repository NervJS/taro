import { isFunction, isObject, isString } from '@tarojs/shared'
import { escapePath } from '@tarojs/vite-runner/dist/utils'

import { getProjectId } from '../../utils'

import type { PageParser, TPageMeta } from '@tarojs/vite-runner/dist/harmony/template'
import type { PluginContext } from 'rollup'
import type { Plugin, PluginOption } from 'vite'
import type Harmony from '..'

export default function (this: Harmony): PluginOption {
  const that = this
  const projectId = getProjectId()
  function genUniPageId(page: TPageMeta) {
    return `${projectId}:${page.originName || page.name}`
  }
  const name = 'taro:vite-harmony-template-page'

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

      if (compiler?.pages instanceof Array || compiler?.components instanceof Array) {
        compiler.loaderMeta ||= {}
        const oddModifyEntryFile = compiler.loaderMeta.modifyEntryFile
        compiler.loaderMeta.modifyEntryFile = function (
          this: PageParser,
          type = '',
          rawId = '',
          rawCode = '',
          page: TPageMeta
        ) {
          if (type === 'page') {
            const isPure = isPureComp(page)
            const { creatorLocation, frameworkArgs, importFrameworkStatement } = this.loaderMeta
            const isBlended = this.buildConfig.blended || this.buildConfig.isBuildNativeComp
            const createFn = isPure
              ? 'createNativeComponentConfig'
              : isBlended
                ? 'createNativePageConfig'
                : 'createPageConfig'
            const pageId = genUniPageId(page)

            const createPageOrComponent = `${createFn}(component, ${
              isPure || isBlended ? `'${pageId}', ${frameworkArgs}` : `'${pageId}', config`})`

            return this.transArr2Str([
              `import { ${createFn} } from '${creatorLocation}'`,
              ...((importFrameworkStatement as string) || '').split('\n'),
              `import component from "${escapePath(rawId)}"`,
              isBlended ? 'import { initPxTransform } from "@tarojs/taro"' : null,
              `export const config = ${this.prettyPrintJson(page.config)}`,
              // FIXME: InitPxTransform放在这里会导致多component相互影响
              isBlended ? this.getInitPxTransform() : null,
              page?.config.enableShareTimeline ? 'component.enableShareTimeline = true' : null,
              page?.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : null,
              `export default (config = {}) => ${createPageOrComponent}`,
            ])
          }

          return isFunction(oddModifyEntryFile) ? oddModifyEntryFile.call(this, type, rawId, rawCode, page) : rawCode
        }

        const oddModifyInstantiate = compiler.loaderMeta.modifyInstantiate
        compiler.loaderMeta.modifyInstantiate = function (this: PageParser, code = '', type = '', page: TPageMeta) {
          if (type === 'page') {
            const componentName = (page.config as any)?.componentName
            if (isString(componentName)) {
              code = code.replace(/export\sdefault\sstruct\sIndex/, `export struct ${componentName}`)
            }
          }

          return isFunction(oddModifyInstantiate) ? oddModifyInstantiate.call(this, code, type, page) : code
        }

        const parsePageOrComp = (config: TPageMeta) => {
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
            importStr.unshift('import { navigateBack } from "@tarojs/taro"')
            importStr.unshift('import oh_window from "@ohos.window"')
            importStr.unshift('import { TaroXComponent } from "@tarojs/components"')
            importStr.unshift('import { TaroNativeModule, initStyleSheetConfig, systemContext, WINDOW_STATE } from "@tarojs/runtime"')
            importStr.unshift('import { NodeContent } from "@ohos.arkui.node"')
            importStr.unshift('import display from "@ohos.display"')
          }

          config.modifyRenderState = function (this: PageParser, state: (string | null)[], page: TPageMeta) {
            const isPure = isPureComp(page)
            state.push(
              this.renderState(
                {
                  decorator: isPure ? 'Local' : 'State',
                  name: 'params',
                  type: 'TaroObject',
                  foreach: () => '{}',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  name: '__layoutSize',
                  type: 'TaroAny',
                  foreach: () => 'null',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  name: 'areaChange',
                  type: 'TaroAny',
                  foreach: () => 'null',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  name: '__pageName',
                  type: 'TaroAny',
                  foreach: () => 'null',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'params',
                  type: 'TaroObject',
                  foreach: () => '{}',
                  disabled: !this.buildConfig.isBuildNativeComp,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'statusBarHeight',
                  type: 'number',
                  foreach: () => 'getSystemInfoSync().statusBarHeight || 0',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'isHideTitleBar',
                  type: 'boolean',
                  foreach: () => this.appConfig.window?.navigationStyle === 'custom'
                    ? `config.navigationStyle !== 'default'`
                    : `config.navigationStyle === 'custom'`,
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
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
                  name: 'isShown',
                  type: 'boolean',
                  foreach: () => 'true',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  name: 'nodeContent',
                  type: 'Content',
                  foreach: () => 'new NodeContent()',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'isReady',
                  type: 'boolean',
                  foreach: () => 'false',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
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
            )
            if (isPureComp(page)) {
              state.unshift(
                this.renderState(
                  {
                    decorator: 'State',
                    name: 'currentRouter',
                    type: '(TaroObject | null)',
                    foreach: () => 'null',
                  },
                  this.isTabbarPage
                ),
              )
            }
          }
          config.modifyPageParams = (_: string) => {
            return 'this.params'
          }

          config.modifyPageAppear = function (appearStr: string, page: TPageMeta) {
            const isPure = isPureComp(page)
            const appearCode: (string | null)[] = isPure
              ? [
                `initEtsBuilder('${genUniPageId(page)}')`,
                `TaroNativeModule.initStylesheet('${genUniPageId(page)}', styleJson, initStyleSheetConfig(this.params._layout_, this.getNavHeight()))`,
              ]
              : [
                `initEtsBuilder('${genUniPageId(page)}')`,
                'this.__layoutSize = this.params._layout_',
                `this.__pageName = '${page.name}'`,
                `systemContext.windowWidth = ${config.config.windowArea?.width || 'this.params._layout_?.width'}`,
                `systemContext.windowHeight = ${config.config.windowArea?.height || 'this.params._layout_?.height'}`,
                `TaroNativeModule.initStylesheet('${genUniPageId(page)}', styleJson, initStyleSheetConfig({ width: systemContext.windowWidth, height: systemContext.windowHeight}, this.getNavHeight()))`,
              ]
            if (!isPure) {
              appearCode.push(
                'Current.$r = (path: string): Resource => {',
                '  return $r(path)',
                '}',
                'let currentSplit = false',
                'let pendingAreaChange: TaroAny',
                `const resizeFn = (canSplit: boolean, size: TaroAny, sizeChange: boolean) => {`,
                `  const _display = display.getDefaultDisplaySync()`,
                `  const orientation = _display.orientation`,
                `  const idPortrait = orientation == display.Orientation.PORTRAIT || orientation == display.Orientation.PORTRAIT_INVERTED`,
                `  const _sysInfo: TaroAny = getSystemInfoSync()`,
                `  callFn(this.page?.onResize, this, {`,
                `    size: {`,
                // @ts-ignore
                `      windowWidth: ${config.config.windowArea?.width || 'size?.width'},`,
                // @ts-ignore
                `      windowHeight: ${config.config.windowArea?.height || 'size?.height'},`,
                `      screenWidth: _sysInfo.screenWidth,`,
                `      screenHeight: _sysInfo.screenHeight,`,
                `    },`,
                `    deviceOrientation: idPortrait ? "portrait" : "landscape",`,
                `    foldDisplayMode: _sysInfo.foldDisplayMode,`,
                `    canSplit: canSplit,`,
                `    reason: sizeChange ? "size" : "statusBar"`,
                `  })`,
                `}`,
                `const avoidAreaChange = (res: TaroAny) => {`,
                `  const statusHeight: number = px2vp(res.area.topRect.height);`,
                `  if (Math.abs(this.statusBarHeight - statusHeight) < 0.1) return;`,
                `  this.statusBarHeight = statusHeight;`,
                `  TaroNativeModule.UpdateEnvRule('${genUniPageId(page)}', initStyleSheetConfig({ width: this.__layoutSize.width, height: this.__layoutSize.height}, this.getNavHeight()), this.node?._nid)`,
                `  resizeFn(currentSplit, this.__layoutSize, false)`,
                `}`,
                `const windowStage: TaroAny = AppStorage.get(WINDOW_STATE);`,
                'this.areaChange = (res: TaroAny) => {',
                '  if (res.type !== oh_window.AvoidAreaType.TYPE_SYSTEM)  return;',
                '  if (!this.isShown) {',
                '    if (!pendingAreaChange) {',
                '      pendingAreaChange = () => { avoidAreaChange(res) }',
                '    }',
                '  } else {',
                '    avoidAreaChange(res)',
                '  }',
                '}',
                `windowStage.getMainWindowSync().on('avoidAreaChange', this.areaChange)`,
              )
            }
            appearCode.push(
              appearStr,
            )
            return this.transArr2Str(appearCode.filter(Boolean))
          }

          config.modifyPageDisappear = function (_disappearStr: string) {
            return this.transArr2Str(
              [
                `this.handlePageDetach()`,
                'if (this.areaChange) {',
                '  const windowStage: TaroAny = AppStorage.get(WINDOW_STATE);',
                `  windowStage.getMainWindowSync().off('avoidAreaChange', this.areaChange)`,
                '}'
              ]
            )
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
                  '.onStateChange(bindFn(this.handleRefreshStatus, this))'
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
            const handlePageAppearMethods = methods.find((item) => item.name === 'handlePageAppear')
            if (handlePageAppearMethods) {
              const methodsBodyList = handlePageAppearMethods.body?.split('\n') || []
              let insertIndex = methodsBodyList.findIndex((item) => item.startsWith('const params'))
              insertIndex = methodsBodyList.findIndex((item) => item.includes('this.node = instance'))
              if (insertIndex >= 0) {
                methodsBodyList?.splice(
                  insertIndex + 1,
                  0,
                  ...[
                    '  TaroNativeModule.buildTaroNode(this.nodeContent, instance._nid)',
                    '  this.isReady = true',
                    isPure ? `  this.currentRouter = Current.router` : null,
                    isPure ? `  eventCenter.on(this.currentRouter?.getEventName('onResize') || '', this.handlePageResizeEvent)` : null,
                  ].filter(isString),
                )

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

            const disabledMethods = ['onPageShow', 'onPageHide']
            if (isPure) {
              disabledMethods.unshift('getPageState')
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
            )
            methods.push({
              name: 'handlePageDetach',
              type: 'arrow',
              body: this.transArr2Str([
                `if (!this.isReady) return`,
                '',
                `this.isReady = false`,
                isPure
                  ? `eventCenter.off(this.currentRouter?.getEventName('onResize'), this.handlePageResizeEvent)`
                  : null,
                `callFn(this.page?.onUnload, this)`,
              ]),
            })

            if (!isPure) {
              const index = methods.findIndex((e) => e.name === 'renderTitle')
              methods.splice(index, 1, {
                name: 'renderTitle',
                decorators: ['Builder'],
                body: this.transArr2Str([
                  `Flex({`,
                  `  direction: FlexDirection.Row,`,
                  `  justifyContent: FlexAlign.Start,`,
                  `  alignItems: ItemAlign.Center,`,
                  `}) {`,
                  `${
                    this.transArr2Str(!this.isTabbarPage && !this.buildConfig.isBuildNativeComp
                    // FIXME 这里 pageStack 更新问题，需要第二次才能显示 Home 按钮
                      ? [
                        `if (this.pageStack[0].path !== this.entryPagePath && this.navigationBarHomeBtn && this.pageStack.length === 1) {`,
                        `    Image($r('app.media.taro_home'))`,
                        // FIXME `      .height(convertNumber2VP(40 / 7.5, 'vw'))`,
                        // FIXME `      .width(convertNumber2VP(40 / 7.5, 'vw'))`,
                        // FIXME `      .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })`,
                        `      .fillColor((this.navigationBarTextStyle || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                        `      .objectFit(ImageFit.Contain)`,
                        `      .onClick(() => {`,
                        // FIXME `        router.replaceUrl({`,
                        // FIXME `          url: this.tabBarList.find(e => e.pagePath === this.entryPagePath) ? '${TARO_TABBAR_PAGE_PATH}' : this.entryPagePath,`,
                        // FIXME `          params: {`,
                        // FIXME `            '$page': this.entryPagePath,`,
                        // FIXME `          },`,
                        // FIXME `        })`,
                        `      })`,
                        `  } else if (this.pageStack.length > 1) {`,
                        `    Image($r('app.media.taro_arrow_left'))`,
                        // FIXME `      .height(convertNumber2VP(40 / 7.5, 'vw'))`,
                        // FIXME `      .width(convertNumber2VP(40 / 7.5, 'vw'))`,
                        // FIXME `      .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })`,
                        `      .fillColor((this.navigationBarTextStyle || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                        `      .objectFit(ImageFit.Contain)`,
                        `      .onClick(() => {`,
                        `        router.back()`,
                        `      })`,
                        `  }`,
                      ] : [], 2)}`,
                  `  Text(this.navigationBarTitleText${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTitleText || ''}')`,
                  // FIXME `    .margin({ left: convertNumber2VP(40 / 7.5, 'vw') })`,
                  // FIXME `    .fontSize(convertNumber2VP(32 / 7.5, 'vw'))`,
                  `    .fontColor((this.navigationBarTextStyle${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                  `  if (this.navigationBarLoading${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''}) {`,
                  `    LoadingProgress()`,
                  // FIXME `      .margin({ left: convertNumber2VP(10 / 7.5, 'vw') })`,
                  // FIXME `      .height(convertNumber2VP(40 / 7.5, 'vw'))`,
                  // FIXME `      .width(convertNumber2VP(40 / 7.5, 'vw'))`,
                  `      .color((this.navigationBarTextStyle${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                  `  }`,
                  `}`,
                  `.height('100%')`,
                  `.width('100%')`,
                  `.backgroundColor(this.navigationBarBackgroundColor${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarBackgroundColor || '#000000'}')`,
                  `.padding({`,
                  `  top: px2vp(sysInfo.safeArea?.top || 0),`,
                  `})`,
                  `.zIndex(1)`,
                  // 'NavBar({',
                  // // '  isAdaptStatusBar: true,', 由于内置 windowStage 为 undefined 实际无效
                  // '  isAutoDark: true,',
                  // `  statusBarHeight: this.statusBarHeight,`,
                  // `  bgColor: this.navigationBarBackgroundColor || '${
                  //   this.appConfig.window?.navigationBarBackgroundColor || '#000000'
                  // }',`,
                  // `  mainTitleText: new TextParam(this.navigationBarTitleText || '${
                  //   this.appConfig.window?.navigationBarTitleText || ''
                  // }', null, this.navigationBarTextStyle || '${
                  //   this.appConfig.window?.navigationBarTextStyle || 'white'
                  // }', null),`,
                  // '  useBackIcon: true,',
                  // '  onBackClick: () => {',
                  // '    navigateBack()', // 需要拦截适配返回，组件提供的返回与 NavDestination 不兼容
                  // '    return true',
                  // '  },',
                  // '})',
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
                name: 'handlePageResizeEvent',
                type: 'arrow',
                params: ['option: TaroObject'],
                body: this.transArr2Str([
                  `TaroNativeModule.UpdateStylesheet('${genUniPageId(page)}', styleJson, initStyleSheetConfig(option.size, this.getNavHeight()), this.node?._nid)`
                ]),
              })
            }
          }
        }
        compiler?.pages?.forEach(parsePageOrComp)
        compiler?.components?.forEach(parsePageOrComp)
      }
    },
  }
}
