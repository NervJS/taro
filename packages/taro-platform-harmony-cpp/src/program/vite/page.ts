import path from 'node:path'

import { fs } from '@tarojs/helper'
import { isFunction, isObject, isString } from '@tarojs/shared'
import { TARO_TABBAR_PAGE_PATH } from '@tarojs/vite-runner/dist/harmony/page'
import { escapePath } from '@tarojs/vite-runner/dist/utils'

import { getProjectId } from '../../utils'

import type { PageParser, TPageMeta } from '@tarojs/vite-runner/dist/harmony/template'
import type { PluginContext } from 'rollup'
import type { Plugin, PluginOption } from 'vite'
import type Harmony from '..'

type TCPageMeta = TPageMeta & {
  isPure?: boolean
}

const REMOTE_RESOURCE_REG = /^(?:https?:)?\/\//i
const MEDIA_NAME_REG = /[^a-zA-Z0-9_]/g

function normalizeMediaResourceName (filePath = '', usedNames = new Map<string, number>()) {
  const ext = path.extname(filePath)
  const baseName = path.basename(filePath, ext) || 'icon'
  let name = `taro_tabbar_${baseName}`.replace(MEDIA_NAME_REG, '_').toLowerCase()
  if (/^[0-9]/.test(name)) {
    name = `_${name}`
  }

  const count = usedNames.get(name) || 0
  usedNames.set(name, count + 1)
  return count > 0 ? `${name}_${count}` : name
}

function isLocalTabBarIcon (iconPath = '') {
  return !!iconPath &&
    !REMOTE_RESOURCE_REG.test(iconPath) &&
    !/^data:/i.test(iconPath) &&
    !/^\$r\(/.test(iconPath) &&
    !/^resource:\/\//i.test(iconPath)
}

function resolveTabBarIconFile (appPath: string, sourceRoot: string | undefined, iconPath: string) {
  if (path.isAbsolute(iconPath)) {
    return iconPath
  }

  const sourceDir = path.resolve(appPath, sourceRoot || 'src')
  return path.resolve(sourceDir, iconPath.replace(/^\/+/, ''))
}

function getTabBarIconKeys (iconPath: string) {
  const keys = new Set([iconPath])
  if (iconPath.startsWith('./')) {
    keys.add(iconPath.slice(2))
  } else if (!iconPath.startsWith('../') && !iconPath.startsWith('/')) {
    keys.add(`./${iconPath}`)
  }
  return [...keys]
}

function collectTabBarIconResources (parser: PageParser) {
  if (!parser.isTabbarPage) return []

  const list = parser.appConfig?.tabBar?.list || []
  const { outputRoot = 'dist', sourceRoot = 'src' } = parser.buildConfig || {}
  const mediaDir = path.resolve(outputRoot, '..', 'resources', 'base', 'media')
  const usedNames = new Map<string, number>()
  const copied = new Map<string, string>()
  const mappings: [string, string][] = []

  list.forEach(item => {
    ;(['iconPath', 'selectedIconPath'] as const).forEach(key => {
      const iconPath = item?.[key] || ''
      if (!isLocalTabBarIcon(iconPath)) return

      const sourceFile = resolveTabBarIconFile(parser.appPath, sourceRoot, iconPath)
      if (!fs.existsSync(sourceFile)) return

      let resourceName = copied.get(sourceFile)
      if (!resourceName) {
        resourceName = normalizeMediaResourceName(sourceFile, usedNames)
        const targetFile = path.join(mediaDir, `${resourceName}${path.extname(sourceFile)}`)
        fs.ensureDirSync(mediaDir)
        fs.copyFileSync(sourceFile, targetFile)
        copied.set(sourceFile, resourceName)
      }

      getTabBarIconKeys(iconPath).forEach(pathKey => {
        mappings.push([pathKey, resourceName])
      })
    })
  })

  return mappings
}

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
    async buildStart(this: PluginContext) {
      const pluginContext = this
      const { runnerUtils, runOpts } = that.context
      const isPureComp = (page: TCPageMeta | TCPageMeta[]): page is TCPageMeta => {
        if (page instanceof Array) return false
        if (runOpts?.options?.args.pure || page.config?.entryOption === false) {
          page.isPure = true
        } else {
          page.isPure = false
        }
        return page.isPure
      }

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = (await getViteHarmonyCompilerContext(pluginContext))!
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
        compiler.loaderMeta.modifyInstantiate = function (this: PageParser, code = '', type = '', page: TPageMeta | TPageMeta[]) {
          if (type === 'page' && !(page instanceof Array)) {
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
          config.modifyPageImport = function (this: PageParser, importStr: string[], page: TPageMeta | TPageMeta[]) {
            function fixPageEntry (meta: TPageMeta) {
              Object.assign(config.entryOption, {
                routeName: meta.name,
              })
              if (isObject(meta.config?.entryOption)) {
                Object.assign(config.entryOption, meta.config.entryOption)
              }
            }

            if (!isPureComp(page)) {
              if (page instanceof Array) {
                page.forEach(fixPageEntry)
              } else {
                fixPageEntry(page)
              }
            }

            importStr.unshift('import { navigateBack } from "@tarojs/taro"')
            importStr.unshift('import oh_window from "@ohos.window"')
            importStr.unshift('import { TaroXComponent } from "@tarojs/components"')
            importStr.unshift('import { TaroNativeModule, initStyleSheetConfig, systemContext, WINDOW_STATE } from "@tarojs/runtime"')
            importStr.unshift('import { NodeContent } from "@ohos.arkui.node"')
            importStr.unshift('import display from "@ohos.display"')
            importStr.unshift('import { audio } from "@kit.AudioKit"')
          }

          config.modifyRenderState = function (this: PageParser, state: (string | null)[], page: TPageMeta | TPageMeta[]) {
            const isPure = isPureComp(page)
            if (this.isTabbarPage) {
              state.push(`pageContextList: TaroAny[] = [${(page instanceof Array ? page : [page]).map(() => 'null').join(', ')}]`)
            }
            state.push(
              this.renderState(
                {
                  name: '__layoutSize',
                  type: 'TaroAny',
                  foreach: () => 'null',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                false
              ),
              this.renderState(
                {
                  name: 'areaChange',
                  type: 'TaroAny',
                  foreach: () => 'null',
                },
                false
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
                  name: 'params', // FIXME 考虑后续移除该参数
                  type: 'TaroObject',
                  foreach: () => '{}',
                  disabled: !this.buildConfig.isBuildNativeComp && isPure,
                },
                false
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'statusBarHeight',
                  type: 'number',
                  foreach: () => 'getSystemInfoSync().statusBarHeight || 0',
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'isHideTitleBar',
                  type: 'boolean',
                  foreach: (_, index) => {
                    if (this.isTabbarPage) {
                      return this.appConfig.window?.navigationStyle === 'custom'
                        ? `config${index}.navigationStyle !== 'default'`
                        : `config${index}.navigationStyle === 'custom'`
                    } else {
                      return this.appConfig.window?.navigationStyle === 'custom'
                        ? `config.navigationStyle !== 'default'`
                        : `config.navigationStyle === 'custom'`
                    }
                  },
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
                },
                this.isTabbarPage
              ),
              this.renderState(
                {
                  decorator: 'State',
                  name: 'isReady',
                  type: 'boolean',
                  foreach: () => 'false',
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

          config.modifyPageAppear = function (appearStr: string, page: TPageMeta | TPageMeta[]) {
            const isPure = isPureComp(page)
            const appearCode: (string | null)[] = isPure
              ? [
                `initEtsBuilder('${genUniPageId(page)}')`,
                `TaroNativeModule.initStylesheet('${genUniPageId(page)}', styleJson, initStyleSheetConfig(this.params._layout_, this.getNavHeight()))`,
              ]
              : [
                `if (!Current.audioSessionManager) {`,
                `  const audioManager = audio.getAudioManager()`,
                `  Current.audioSessionManager = audioManager.getSessionManager()`,
                `}`,
                `this.activeAudioSession()`,
                ...(page instanceof Array ? [
                  ...page.map(p => `initEtsBuilder('${genUniPageId(p)}')`),
                  ...page.map((p, i) => `this.__pageName[${i}] = '${p.name}'`),
                ] : [
                  `initEtsBuilder('${genUniPageId(page)}')`,
                  `this.__pageName = '${page.name}'`,
                ]),
                'this.__layoutSize = this.params._layout_',
                `systemContext.windowWidth = ${config.config.windowArea?.width || 'this.params._layout_?.width'}`,
                `systemContext.windowHeight = ${config.config.windowArea?.height || 'this.params._layout_?.height'}`,
                ...(page instanceof Array ? [
                  ...page.map((p, i) => `TaroNativeModule.initStylesheet('${genUniPageId(p)}', styleJson${i}, initStyleSheetConfig({ width: systemContext.windowWidth, height: systemContext.windowHeight}, this.getNavHeight()))`),
                ] : [
                  `TaroNativeModule.initStylesheet('${genUniPageId(page)}', styleJson, initStyleSheetConfig({ width: systemContext.windowWidth, height: systemContext.windowHeight}, this.getNavHeight()))`,
                ]),
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
                `  const statusHeight: number = px2vp(res.area.topRect.height)`,
                ...(page instanceof Array
                  ? [
                    `  this.statusBarHeight = this.statusBarHeight.map(() => statusHeight)`,
                    `  this.node.forEach((item: TaroAny, i) => {`,
                    `    if (item?._nid) {`,
                    `      TaroNativeModule.UpdateEnvRule('${getProjectId()}:' + this.__pageName[i], initStyleSheetConfig({ width: this.__layoutSize.width, height: this.__layoutSize.height}, this.getNavHeight()), item._nid)`,
                    `    }`,
                    `  })`
                  ]
                  : [
                    `  this.statusBarHeight = statusHeight`,
                    `  TaroNativeModule.UpdateEnvRule('${genUniPageId(page)}', initStyleSheetConfig({ width: this.__layoutSize.width, height: this.__layoutSize.height}, this.getNavHeight()), this.node?._nid)`,
                  ]),
                `  resizeFn(currentSplit, this.__layoutSize, false)`,
                `}`,
                `const windowStage: TaroAny = AppStorage.get(WINDOW_STATE)`,
                'this.areaChange = (res: TaroAny) => {',
                '  if (res.type !== oh_window.AvoidAreaType.TYPE_SYSTEM)  return',
                '  if (!this.isShown) {',
                '    pendingAreaChange = () => { avoidAreaChange(res) }',
                '  } else {',
                '    avoidAreaChange(res)',
                '  }',
                '}',
                `windowStage.getMainWindowSync().on('avoidAreaChange', this.areaChange)`,
              )
            }
            appearStr = appearStr.replace('const state: TaroAny = this.getPageState()\nif (this.pageStack.length >= state.index) {', [
              'const state: TaroAny = this.getPageState()',
              'this.params = ObjectAssign({}, state.params || {}, this.params || {})',
              'if (this.pageStack.length >= state.index) {',
            ].join('\n'))

            if (this.isTabbarPage) {
              appearStr = appearStr.replace('this.bindTabBarEvent()', [
                'this.bindTabBarEvent()',
                'setTimeout(() => { this.emitPageShow() }, 0)',
              ].join('\n'))
            }

            appearCode.push(appearStr)
            return this.transArr2Str(appearCode.filter(Boolean))
          }

          config.modifyPageDisappear = function (_disappearStr: string) {
            return this.transArr2Str(
              [
                `this.handlePageDetach()`,
                'this.deactivateAudioSession()',
                'if (this.areaChange) {',
                '  const windowStage: TaroAny = AppStorage.get(WINDOW_STATE)',
                `  windowStage.getMainWindowSync().off('avoidAreaChange', this.areaChange)`,
                '}'
              ]
            )
          }
          config.modifyPageBuild = function (this: PageParser, _: string, page: TPageMeta | TPageMeta[]) {
            const coreBuildCodeArray = [
              'Stack() {',
              ...(this.isTabbarPage
                ? [
                  '  if (this.isReady[index]) {',
                  '    TaroXComponent({ pageId: (this.node[index] as TaroAny)?._nid, data: this.nodeContent[index] })',
                ]
                : [
                  '  if (this.isReady) {',
                  '    TaroXComponent({ pageId: (this.node as TaroAny)?._nid, data: this.nodeContent })',
                ]),
              '  }',
              '}',
              '.align(Alignment.TopStart)',
              '.width("100%")',
              '.constraintSize({',
              '  minHeight: "100%",',
              '})',
              ...(this.isTabbarPage ? [] : ['.onDetach(this.handlePageDetach)']),
            ]

            if (!isPureComp(page)) {
              coreBuildCodeArray.push(
                this.isTabbarPage
                  ? '.backgroundColor(this.pageBackgroundContentColor[index] || this.pageBackgroundColor[index] || "#FFFFFF")'
                  : '.backgroundColor(this.pageBackgroundContentColor || this.pageBackgroundColor || "#FFFFFF")'
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
                this.isTabbarPage
                  ? `.backgroundColor(this.pageBackgroundColor[index] || '${
                    this.appConfig?.window?.backgroundColor || '#FFFFFF'
                  }')`
                  : `.backgroundColor(this.pageBackgroundColor || '${
                    this.appConfig?.window?.backgroundColor || '#FFFFFF'
                  }')`,
                `.height('100%')`,
                `.width('100%')`,
                `.title({ builder: this.renderTitle, height: this.getNavHeight() })`,
                `.titleMode(NavigationTitleMode.Mini)`,
                this.isTabbarPage ? `.hideTitleBar(this.isHideTitleBar[index])` : `.hideTitleBar(this.isHideTitleBar)`,
                `.hideBackButton(true)`,
                // `.expandSafeArea([SafeAreaType.SYSTEM])`,
                `.mode(NavigationMode.Stack)`
              )
            }

            if (this.isTabbarPage) {
              coreBuildCodeArray.forEach((code, idx) => coreBuildCodeArray.splice(idx, 1, `${' '.repeat(6)}${code}`))
              coreBuildCodeArray.unshift(
                'Tabs({',
                `  barPosition: this.tabBarPosition !== 'top' ? BarPosition.End : BarPosition.Start,`,
                '  controller: this.tabBarController,',
                '  index: this.tabBarCurrentIndex,',
                '}) {',
                '  ForEach(this.tabBarList, (item: ITabBarItem, index) => {',
                '    TabContent() {',
              )
              coreBuildCodeArray.push(
                `    }.tabBar(this.renderTabItemBuilder(index, item))`,
                `  }, (item: ITabBarItem, index) => \`\${item.key || index}\`)`,
                `}`,
                `.vertical(false)`,
                `.barMode(BarMode.Fixed)`,
                `.scrollable(false)`,
                `.barHeight(this.isTabBarShow ? 56 + this.getTabBarBottomSafeHeight() : 0)`,
                `.animationDuration(this.tabBarAnimationDuration)`,
                `.onChange((index: number) => {`,
                `  if (this.tabBarCurrentIndex !== index) {`,
                `    this.emitPageHide()`,
                `    this.setTabBarCurrentIndex(index)`,
                `  }`,
                `  this.handlePageAppear()`,
                `  this.emitPageShow()`,
                `})`,
                `.backgroundColor(this.tabBarBackgroundColor)`,
              )
            }

            return this.transArr2Str(coreBuildCodeArray)
          }

          config.modifyPageMethods = function (this: PageParser, methods, page: TPageMeta | TPageMeta[]) {
            const isPure = isPureComp(page)
            const handlePageAppearMethods = methods.find((item) => item.name === 'handlePageAppear')
            if (handlePageAppearMethods) {
              const methodsBodyList = handlePageAppearMethods.body?.split('\n') || []
              let insertIndex = methodsBodyList.findIndex((item) => item.startsWith('const params'))
              if (this.isTabbarPage) {
                insertIndex = methodsBodyList.findIndex((item) => item.includes('this.node[index] = instance'))
              } else {
                insertIndex = methodsBodyList.findIndex((item) => item.includes('this.node = instance'))
              }
              if (insertIndex >= 0) {
                methodsBodyList?.splice(
                  insertIndex + 1,
                  0,
                  ...[
                    this.isTabbarPage
                      ? '    TaroNativeModule.buildTaroNode(this.nodeContent[index], instance._nid)'
                      : '  TaroNativeModule.buildTaroNode(this.nodeContent, instance._nid)',
                    this.isTabbarPage ? '    this.isReady[index] = true' : '  this.isReady = true',
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

                if (this.isTabbarPage) {
                  handlePageAppearMethods.body = handlePageAppearMethods.body
                    ?.replace(/this\.page = this\.pageList\[index\]\n\s*callFn\(this\.page\?\.onLoad, this, params,/, [
                      'this.page = this.pageList[index]',
                      '      this.pageContextList[index] = this.page',
                      '      const pageContext: TaroAny = this.getPageContext(index)',
                      '      callFn(this.page?.onLoad, pageContext, params,',
                    ].join('\n'))
                    .replace('callFn(this.page?.onReady, this, params)', 'callFn(this.page?.onReady, pageContext, params)') || handlePageAppearMethods.body
                }
              }
            }

            if (this.isTabbarPage) {
              const onPageShowMethod = methods.find((item) => item.name === 'onPageShow')
              if (onPageShowMethod) {
                onPageShowMethod.body = this.transArr2Str([
                  'this.bindPageEvent()',
                  'const state = this.getPageState()',
                  'if (this.pageStack[this.pageStack.length - 1].path !== state.path) {',
                  '  this.pageStack.length = state.index',
                  '  this.pageStack[state.index - 1] = state',
                  '}',
                  'this.handleSwitchTab({ params: router.getParams() || {} })',
                  'this.emitPageShow()',
                ])
              }

              const onPageHideMethod = methods.find((item) => item.name === 'onPageHide')
              if (onPageHideMethod) {
                onPageHideMethod.body = this.transArr2Str([
                  'this.removePageEvent()',
                  'this.emitPageHide()',
                ])
              }

              const handleSwitchTabMethod = methods.find((item) => item.name === 'handleSwitchTab')
              if (handleSwitchTabMethod) {
                handleSwitchTabMethod.body = handleSwitchTabMethod.body?.replace('this.page?.onHide?.()', 'this.emitPageHide()') || handleSwitchTabMethod.body
              }
            }

            const disabledMethods = this.isTabbarPage ? [] : ['onPageShow', 'onPageHide']
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

            if (this.isTabbarPage) {
              const tabBarIconResources = collectTabBarIconResources(this)
              if (tabBarIconResources.length) {
                const iconMapLines = tabBarIconResources.map(([iconPath, resourceName], index) => {
                  return `${JSON.stringify(iconPath)}: $r('app.media.${resourceName}')${index < tabBarIconResources.length - 1 ? ',' : ''}`
                })

                methods.push({
                  name: 'getTabBarIconResource',
                  params: ['iconPath?: string'],
                  return: 'TaroAny',
                  body: this.transArr2Str([
                    `const iconMap: TaroObject = {`,
                    this.transArr2Str(iconMapLines, 2),
                    `}`,
                    `return iconPath && iconMap[iconPath] ? iconMap[iconPath] : iconPath`,
                  ]),
                })

                const handleSetTabBarItem = methods.find((item) => item.name === 'handleSetTabBarItem')
                if (handleSetTabBarItem) {
                  handleSetTabBarItem.body = this.transArr2Str([
                    `const list = [...this.tabBarList]`,
                    `if (!!list[option.index]) {`,
                    `  const obj = list[option.index]`,
                    `  const odd: ITabBarItem = ObjectAssign(obj)`,
                    `  if (option.iconPath) {`,
                    `    obj.iconPath = option.iconPath`,
                    `    this.tabBarWithImage = true`,
                    `  }`,
                    `  if (option.selectedIconPath) obj.selectedIconPath = option.selectedIconPath`,
                    `  if (option.text) obj.text = option.text`,
                    `  this.updateTabBarKey(option.index, odd)`,
                    `}`,
                    `this.tabBarList = list`,
                  ])
                }

                const renderTabBarInnerBuilder = methods.find((item) => item.name === 'renderTabBarInnerBuilder')
                if (renderTabBarInnerBuilder) {
                  renderTabBarInnerBuilder.body = this.transArr2Str([
                    'Column() {',
                    '  if (this.tabBarWithImage) {',
                    '    Image(this.getTabBarIconResource(this.tabBarCurrentIndex === index && item.selectedIconPath || item.iconPath))',
                    '      .width(24)',
                    '      .height(24)',
                    '      .objectFit(ImageFit.Contain)',
                    '    Text(item.text)',
                    '      .fontColor(this.tabBarCurrentIndex === index ? this.tabBarSelectedColor : this.tabBarColor)',
                    '      .fontSize(10)',
                    '      .fontWeight(this.tabBarCurrentIndex === index ? 500 : 400)',
                    '      .lineHeight(14)',
                    '      .maxLines(1)',
                    '      .textOverflow({ overflow: TextOverflow.Ellipsis })',
                    '      .margin({ top: 7, bottom: 7 })',
                    '  } else {',
                    '    Text(item.text)',
                    '      .fontColor(this.tabBarCurrentIndex === index ? this.tabBarSelectedColor : this.tabBarColor)',
                    '      .fontSize(16)',
                    '      .fontWeight(this.tabBarCurrentIndex === index ? 500 : 400)',
                    '      .lineHeight(22)',
                    '      .maxLines(1)',
                    '      .textOverflow({ overflow: TextOverflow.Ellipsis })',
                    '      .margin({ top: 17, bottom: 7 })',
                    '  }',
                    '}',
                  ])
                }
              }

              const renderTabItemBuilder = methods.find((item) => item.name === 'renderTabItemBuilder')
              if (renderTabItemBuilder) {
                renderTabItemBuilder.body = renderTabItemBuilder.body
                  ?.replace('.width("100%").height("100%")', [
                    '.width("100%")',
                    '.height("100%")',
                    '.padding({ bottom: this.getTabBarBottomSafeHeight() })',
                  ].join('\n')) || renderTabItemBuilder.body
              }
            }

            methods.unshift(
              {
                name: 'getNavHeight',
                body: this.isTabbarPage
                  ? 'return this.isHideTitleBar[this.tabBarCurrentIndex] ? 0 : 48 + this.statusBarHeight[this.tabBarCurrentIndex]'
                  : 'return this.isHideTitleBar ? 0 : 48 + this.statusBarHeight',
              },
            )
            if (this.isTabbarPage) {
              methods.push({
                name: 'getTabBarBottomSafeHeight',
                return: 'number',
                body: this.transArr2Str([
                  `const screenHeight: number = Number(sysInfo.screenHeight || 0)`,
                  `const safeBottom: number = Number(sysInfo.safeArea?.bottom || screenHeight)`,
                  `const bottomSafeHeight: number = screenHeight - safeBottom`,
                  `return bottomSafeHeight > 0 ? bottomSafeHeight : 0`,
                ]),
              })
            }

            methods.push({
              name: 'getPageContext',
              params: this.isTabbarPage ? ['index: number = this.tabBarCurrentIndex'] : [],
              return: 'TaroAny',
              body: this.isTabbarPage
                ? 'return this.pageContextList[index] || this.pageList[index] || this'
                : 'return this',
            })
            methods.push({
              name: 'emitPageShow',
              type: 'arrow',
              body: this.transArr2Str([
                `const pageContext: TaroAny = this.getPageContext()`,
                `callFn(this.page?.onShow, pageContext)`,
                `callFn((this.page as TaroAny)?.componentDidShow, pageContext)`,
              ]),
            })
            methods.push({
              name: 'emitPageHide',
              type: 'arrow',
              body: this.transArr2Str([
                `const pageContext: TaroAny = this.getPageContext()`,
                `callFn(this.page?.onHide, pageContext)`,
                `callFn((this.page as TaroAny)?.componentDidHide, pageContext)`,
              ]),
            })

            methods.push({
              name: 'handlePageDetach',
              type: 'arrow',
              body: this.transArr2Str([
                this.isTabbarPage ? `if (!this.isReady[this.tabBarCurrentIndex]) return` : `if (!this.isReady) return`,
                '',
                this.isTabbarPage ? `this.isReady[this.tabBarCurrentIndex] = false` : `this.isReady = false`,
                isPure
                  ? `eventCenter.off(this.currentRouter?.getEventName('onResize'), this.handlePageResizeEvent)`
                  : null,
                `callFn(this.page?.onUnload, this.getPageContext())`,
              ]),
            })
            methods.push({
              name: 'activeAudioSession',
              type: 'arrow',
              body: this.transArr2Str([
                `if (Current.audioSessionManager) {`,
                `  const manager: audio.AudioSessionManager = Current.audioSessionManager`,
                `  if (!manager.isAudioSessionActivated()) {`,
                `    let strategy: audio.AudioSessionStrategy = {`,
                `      concurrencyMode: audio.AudioConcurrencyMode.CONCURRENCY_PAUSE_OTHERS`,
                `    }`,
                `    manager.activateAudioSession(strategy)`,
                `  }`,
                `}`,
              ]),
            })
            methods.push({
              name: 'deactivateAudioSession',
              type: 'arrow',
              body: this.transArr2Str([
                `if (Current.audioSessionManager) {`,
                `  const manager: audio.AudioSessionManager = Current.audioSessionManager`,
                `  if (manager.isAudioSessionActivated()) {`,
                `    manager.deactivateAudioSession()`,
                `  }`,
                `}`,
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
                        `      .height(convertNumber2VP(40 / 7.5, 'vw'))`,
                        `      .width(convertNumber2VP(40 / 7.5, 'vw'))`,
                        `      .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })`,
                        `      .fillColor((this.navigationBarTextStyle || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                        `      .objectFit(ImageFit.Contain)`,
                        `      .onClick(() => {`,
                        `        router.replaceUrl({`,
                        `          url: this.tabBarList.find(e => e.pagePath === this.entryPagePath) ? '${TARO_TABBAR_PAGE_PATH}' : this.entryPagePath,`,
                        `          params: {`,
                        `            '$page': this.entryPagePath,`,
                        `          },`,
                        `        })`,
                        `      })`,
                        `  } else if (this.pageStack.length > 1) {`,
                        `    Image($r('app.media.taro_arrow_left'))`,
                        `      .height(convertNumber2VP(40 / 7.5, 'vw'))`,
                        `      .width(convertNumber2VP(40 / 7.5, 'vw'))`,
                        `      .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })`,
                        `      .fillColor((this.navigationBarTextStyle || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                        `      .objectFit(ImageFit.Contain)`,
                        `      .onClick(() => {`,
                        `        router.back()`,
                        `      })`,
                        `  }`,
                      ] : [], 2)}`,
                  `  Text(this.navigationBarTitleText${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTitleText || ''}')`,
                  `    .margin({ left: convertNumber2VP(40 / 7.5, 'vw') })`,
                  `    .fontSize(convertNumber2VP(32 / 7.5, 'vw'))`,
                  `    .fontColor((this.navigationBarTextStyle${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''} || '${this.appConfig.window?.navigationBarTextStyle}') !== 'black' ? Color.White : Color.Black)`,
                  `  if (this.navigationBarLoading${this.isTabbarPage ? '[this.tabBarCurrentIndex]' : ''}) {`,
                  `    LoadingProgress()`,
                  `      .margin({ left: convertNumber2VP(10 / 7.5, 'vw') })`,
                  `      .height(convertNumber2VP(40 / 7.5, 'vw'))`,
                  `      .width(convertNumber2VP(40 / 7.5, 'vw'))`,
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
