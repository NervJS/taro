import path from 'node:path'

import { isFunction } from '@tarojs/shared'

import type { PageParser } from '@tarojs/vite-runner/dist/harmony/template'
import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'
import type { IChildComponent } from '@tarojs/vite-runner/dist/harmony/template/render'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type Harmony from '..'

export default function (this: Harmony): PluginOption {
  const that = this

  return {
    name: 'taro:vite-harmony-template-render',
    enforce: 'pre',
    async buildStart (this: PluginContext) {
      const pluginContext = this
      const { runnerUtils } = that.context

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = await getViteHarmonyCompilerContext(pluginContext)

      if (compiler) {
        compiler.extraComponents?.push('WaterFlowView')
        compiler.extraComponents?.push('WaterFlow')
        compiler.extraComponents?.push('List')

        compiler.loaderMeta ||= {}
        compiler.loaderMeta.modifyHarmonyRenderChild = function (list: IChildComponent[]) {
          const comps = list.filter(item => ![
            'View', 'Button', 'Text', 'Image', 'Icon', 'Input', 'TextArea', 'Swiper', 'ScrollView', 'ScrollList', 'StickySection',
            'ListView', 'MovableArea', 'MovableView', 'Picker', 'WaterFlow', 'WaterFlowView', 'List', 'Canvas', 'Process',
            'Label', 'CheckboxGroup', 'Checkbox', 'RadioGroup', 'Radio', 'Form',
          ].includes(item.name) && item.type !== 'TaroViewElement')
          list.splice(0, list.length, ...comps, {
            name: 'XComponent',
            type: 'TaroElement',
            fullArgument: '{ pageId: item?._nid }',
          })
          // list.forEach(e => {
          //   e.extra = [
          //     `${e.extra || ''}`,
          //     `.onSizeChange((pre, post) => {`,
          //     `    if (pre.width === 0 && pre.height === 0) {`,
          //     `      TaroNativeModule.setTaroNodeAttribute(item, '_style4cpp', \`height:\${post.height}px;width:\${post.width}px;\`)`,
          //     `    }`,
          //     `  })`,
          //   ].filter(e => !!e).join('\n')
          // })
        }
        compiler.loaderMeta.modifyHarmonyRenderCode = function (code: string) {
          const importStr = [
            `import { ComponentContent, FrameNode, NodeController, UIContext } from '@kit.ArkUI'`,
            `import { TaroNativeModule } from '@tarojs/runtime'`,
            `import { TaroXComponent } from '@tarojs/components'`,
          ]
          const codeArr = code.split('\n')
          const idx = codeArr.findIndex(item => !/^(\s*|import\s.+)$/.test(item))
          importStr.push(...codeArr.splice(0, idx))

          return this.transArr2Str([
            ...importStr,
            '',
            ...codeArr,
            '',
            `@Builder
function createEtsComponent (item: TaroElement) {
  Stack () {
    createChildItem(item, createLazyChildren)
  }
}`,
            `
@Builder
function createEmptyEtsComponent (_item: TaroElement) {
  Stack () {}
}

class TaroEmptyBuilderData {
  _nid: number = -1
  tagName: string = 'VIEW'
  _nativeUpdateTrigger: number = 0
  _nodeInfo: Record<string, number> | undefined = undefined
}

function isValidTaroBuilderData (data?: TaroElement): boolean {
  if (data === null || data === undefined) {
    return false
  }

  return typeof data._nid === 'number' && !!data.tagName
}

const TARO_BUILDER_LOG_PREFIX = '[TaroHarmony][EtsBuilder]'

function getTaroBuilderUIContext (): UIContext | undefined {
  const currentContext: UIContext | undefined = Current.uiContext
  if (currentContext) {
    return currentContext
  }

  const pageContext: UIContext | undefined = Current.page?.getUIContext?.()
  if (pageContext) {
    Current.uiContext = pageContext
  }
  return pageContext
}

export function initEtsBuilder (router = '') {
  TaroNativeModule.registerEtsBuilder((data: TaroElement): ComponentContent<TaroElement> | undefined => {
    const uiContext = getTaroBuilderUIContext()
    const nid = data?._nid || -1
    const tagName = data?.tagName || 'UNKNOWN'

    if (!uiContext) {
      console.error(TARO_BUILDER_LOG_PREFIX + ' missing uiContext router=' + router + ' nid=' + nid + ' tag=' + tagName)
      return undefined
    }

    if (!isValidTaroBuilderData(data)) {
      console.warn(TARO_BUILDER_LOG_PREFIX + ' invalid data router=' + router + ' nid=' + nid + ' tag=' + tagName)
      return new ComponentContent<TaroElement>(uiContext, wrapBuilder(createEmptyEtsComponent), new TaroEmptyBuilderData() as TaroElement)
    }
    return new ComponentContent<TaroElement>(uiContext, wrapBuilder(createEtsComponent), data)
  }, router)
}`, // Note: 直接在 render 中注册会被忽略，需要在 XComponent 中注册
            '',
          ])
        }
      }

      const modifyPageOrComp = (config: TaroHarmonyPageMeta) => {
        const oddModifyPageImport = config.modifyPageImport
        config.modifyPageImport = function (this: PageParser, importStr: string[], page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) {
          if (isFunction(oddModifyPageImport)) {
            oddModifyPageImport.call(this, importStr, page)
          }

          const { sourceRoot = 'src' } = this.buildConfig
          const targetRoot = path.resolve(this.appPath, sourceRoot)
          const renderPath = path.resolve(targetRoot, 'render')
          importStr.push(`import { initEtsBuilder } from "${renderPath}"`)
        }
      }
      compiler?.pages?.forEach?.(modifyPageOrComp)
      compiler?.components?.forEach?.(modifyPageOrComp)
    },
  }
}
