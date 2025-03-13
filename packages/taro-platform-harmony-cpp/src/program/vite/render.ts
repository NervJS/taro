import path from 'node:path'

import { isFunction } from '@tarojs/shared'

import { PKG_NAME } from '../../utils/constant'

import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'
import type Parser from '@tarojs/vite-runner/dist/harmony/template/page'
import type { IChildComponent } from '@tarojs/vite-runner/dist/harmony/template/render'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type Harmony from '..'

declare class PageParser extends Parser {
  public appPath: typeof Parser.prototype['appPath']
  public appConfig: typeof Parser.prototype['appConfig']
}

export default function (this: Harmony): PluginOption {
  const that = this

  return {
    name: 'taro:vite-harmony-render',
    enforce: 'pre',
    buildStart (this: PluginContext) {
      const pluginContext = this
      const { runnerUtils } = that.context

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)

      if (compiler) {
        compiler.extraComponents?.push('WaterFlowView')
        compiler.extraComponents?.push('WaterFlow')
        compiler.extraComponents?.push('List')

        compiler.loaderMeta ||= {}
        compiler.loaderMeta.modifyHarmonyRenderChild = function (list: IChildComponent[]) {
          const comps = list.filter(item => ![
            'View', 'Button', 'Text', 'Image', 'Icon', 'Input', 'TextArea', 'Swiper', 'ScrollView', 'ScrollList', 'StickySection',
            'ListView', 'MovableArea', 'MovableView', 'Picker', 'WaterFlow', 'WaterFlowView', 'List', 'Canvas', 'Process',
            'Label', 'CheckboxGroup', 'Checkbox', 'RadioGroup', 'Radio', 'Form', 'Video'
          ].includes(item.name) && item.type !== 'TaroViewElement')
          list.splice(0, list.length, ...comps)
          // FIXME 这里的调整只能作用于 taro 打包的原生组件，对于第三方组件无效 Note: 主仓调整后移除
          list.forEach(e => {
            if (e.fullArgument === 'item._attrs as TaroAny') {
              e.fullArgument = '{ _updateTrigger: item._updateTrigger, _nid: item._nid, props: item._attrs.props }'
            }
          })
          // list.forEach(e => {
          //   e.extra = [
          //     `${e.extra || ''}`,
          //     `.onSizeChange((pre, post) => {`,
          //     `    if (pre.width === 0 && pre.height === 0) {`,
          //     `      Current.nativeModule.setTaroNodeAttribute(item, '_style4cpp', \`height:\${post.height}px;width:\${post.width}px;\`)`,
          //     `    }`,
          //     `  })`,
          //   ].filter(e => !!e).join('\n')
          // })
        }
        compiler.loaderMeta.modifyHarmonyRenderCode = function (code: string) {
          const importStr = [
            `import { ComponentContent, FrameNode, NodeController, UIContext } from '@kit.ArkUI'`,
            `import { Current } from '${PKG_NAME}/dist/runtime/runtime-harmony'`,
            `import { TaroXComponent } from '@tarojs/components'`,
          ]
          const codeArr = code.split('\n')
          let idx = codeArr.findIndex(item => !/^(\s*|import\s.+)$/.test(item))
          importStr.push(...codeArr.splice(0, idx).filter(e => !/\bCurrent\b/.test(e)))

          idx = codeArr.findIndex(item => /function\s+createChildItem/.test(item))
          codeArr.splice(idx, 1, `function createChildItem (item: TaroElement) {`)
          idx = codeArr.findIndex(item => /createChildItem\(item,\screateLazyChildren\)/.test(item))
          codeArr.splice(idx, 1, codeArr[idx].replace('createChildItem(item, createLazyChildren)', 'createChildItem(item)'))

          return this.transArr2Str([
            ...importStr,
            '',
            ...codeArr,
            '',
            `@Builder
function createEtsComponent (item: TaroElement) {
  Stack () {
    createChildItem(item)
  }
}`,
            `
export function initEtsBuilder (router = '') {
  Current.nativeModule.registerEtsBuilder((data: TaroElement): ComponentContent<TaroElement> => {
    console.info("registerEtsBuilder app storage has value: " + Current.uiContext?.instanceId_)
    console.info("registerEtsBuilder: " + data._nid)
    return new ComponentContent<TaroElement>(Current.uiContext, wrapBuilder(createEtsComponent), data)
  }, router)
}`, // Note: 直接在 render 中注册会被忽略，需要在 XComponent 中注册
            '',
          ])
        }
      }

      if (compiler?.components instanceof Array) {
        compiler.components.forEach((config: TaroHarmonyPageMeta) => {
          const oddModifyPageImport = config.modifyPageImport
          config.modifyPageImport = function (this: PageParser, importStr: string[], page: TaroHarmonyPageMeta) {
            if (isFunction(oddModifyPageImport)) {
              oddModifyPageImport.call(this, importStr, page)
            }

            const { sourceRoot = 'src' } = this.buildConfig
            const targetRoot = path.resolve(this.appPath, sourceRoot)
            const renderPath = path.resolve(targetRoot, 'render')
            importStr.push(`import { initEtsBuilder } from "${renderPath}"`)
          }
        })
      }
    },
  }
}
