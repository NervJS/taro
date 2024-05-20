import path from 'path'

import { resolveAbsoluteRequire } from '../../utils'
import BaseParser from './base'

import type { TRollupResolveMethod } from '@tarojs/taro/types/compile/config/plugin'
import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'

export default class RenderParser extends BaseParser {
  constructor (
    protected template: Map<string, string>,
    protected context: ViteHarmonyCompilerContext,
  ) {
    super()
  }

  generate (fileName: string, name = 'TaroRender', resolve?: TRollupResolveMethod) {
    const code = `import {
  TaroImage,
  TaroText,
  TaroView,
  TaroIcon,
  TaroForm,
  TaroLabel,
  TaroInput,
  TaroVideo,
  TaroButton,
  TaroPicker,
  TaroSlider,
  TaroSwitch,
  TaroSwiper,
  TaroWebView,
  TaroTextArea,
  TaroRichText,
  TaroProgress,
  TaroInnerHtml,
  TaroScrollView,
  TaroMovableArea,
  TaroMovableView,
  TaroRadio,
  TaroCanvas,
  TaroRadioGroup,
  TaroCheckboxGroup,
  TaroCheckbox,
  TaroPageMeta,
  TaroNavigationBar,
  TaroScrollList,
  TaroListView,
  TaroStickySection
} from '@tarojs/components'
${this.generateRenderExtraComponentsImport()}${this.generateRenderNativeImport()}${this.generateRenderCompileModeImport()}
import { NodeType } from '@tarojs/runtime'

import type {
  TaroAny,
  TaroViewElement,
  TaroElement,
  TaroImageElement,
  TaroButtonElement,
  TaroTextElement,
  TaroCheckboxElement,
  TaroFormElement,
  TaroIconElement,
  TaroLabelElement,
  TaroPickerElement,
  TaroRadioElement,
  TaroRichTextElement,
  TaroRadioGroupElement,
  TaroInputElement,
  TaroCheckboxGroupElement,
  TaroTextAreaElement,
  TaroVideoElement,
  // TaroSwiperItemElement,
  TaroProgressElement,
  TaroMovableAreaElement,
  TaroMovableViewElement,
  TaroSwiperElement,
  TaroSwitchElement,
  TaroCanvasElement,
  TaroSliderElement,
  TaroScrollViewElement,
  TaroWebViewElement,
  TaroInnerHtmlElement,
  TaroPageMetaElement,
  TaroNavigationBarElement,
} from '@tarojs/runtime'

import {
  isTaroCanvasElement,
  isTaroElement,
  isTaroCheckboxElement,
  isTaroCheckboxGroupElement,
  isTaroFormElement,
  isTaroInputElement,
  isTaroPickerElement,
  isTaroRadioElement,
  isTaroRadioGroupElement,
  isTaroSliderElement,
  isTaroSwitchElement,
  isTaroTextAreaElement,
  isTaroMovableAreaElement,
  isTaroMovableViewElement,
  isTaroButtonElement,
  isTaroIconElement,
  isTaroImageElement,
  isTaroLabelElement,
  isTaroNavigationBarElement,
  isTaroOtherElement,
  isTaroPageMetaElement,
  isTaroRichTextElement,
  isTaroSwiperElement,
  isTaroSwiperItemElement,
  isTaroViewElement,
  isTaroProgressElement,
  isTaroScrollViewElement,
  isTaroTextElement,
  isTaroVideoElement,
  isTaroInnerHtmlElement,
  isTaroWebViewElement,
} from '@tarojs/runtime'


@Builder
function createChildItem (item: TaroElement, createLazyChildren?: (node: TaroElement) => void) {
  ${this.generateRenderExtraComponentsCondition()}${this.generateRenderNativeCondition()}${this.generateRenderCompileModeCondition()}
  if (isTaroScrollViewElement(item) || item._st?.hmStyle.overflow === 'scroll') {
    if (item.getAttribute('type') === 'custom') {
      TaroScrollList({ node: item as TaroScrollViewElement, createLazyChildren: createLazyChildren })
    } else {
      TaroScrollView({ node: item as TaroScrollViewElement, createLazyChildren: createLazyChildren })
    }
  } else if (isTaroViewElement(item)) {
    TaroView({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroTextElement(item) || item.nodeType === NodeType.TEXT_NODE) {
    TaroText({ node: item as TaroTextElement, createLazyChildren: createLazyChildren })
  } else if (isTaroImageElement(item)) {
    TaroImage({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroButtonElement(item)) {
    TaroButton({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroSliderElement(item)) {
    TaroSlider({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroSwitchElement(item)) {
    TaroSwitch({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroInputElement(item)) {
    TaroInput({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroSwiperElement(item)) {
    TaroSwiper({ node: item, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'SWIPER-ITEM') {
    TaroView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  } else if (isTaroInnerHtmlElement(item)) {
    TaroInnerHtml({ node: item, createChildItem: createChildItem })
  } else if (isTaroRichTextElement(item)) {
    TaroRichText({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroIconElement(item)) {
    TaroIcon({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroTextAreaElement(item)) {
    TaroTextArea({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroCheckboxGroupElement(item)) {
    TaroCheckboxGroup({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroCheckboxElement(item)) {
    TaroCheckbox({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroRadioGroupElement(item)) {
    TaroRadioGroup({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroProgressElement(item)) {
    TaroProgress({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroMovableViewElement(item)) {
    TaroMovableView({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroMovableAreaElement(item)) {
    TaroMovableArea({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroCanvasElement(item)) {
    TaroCanvas({ node: item })
  } else if (isTaroRadioElement(item)) {
    TaroRadio({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroLabelElement(item)) {
    TaroLabel({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroPickerElement(item)) {
    TaroPicker({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroFormElement(item)) {
    TaroForm({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroVideoElement(item)) {
    TaroVideo({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroWebViewElement(item)) {
    TaroWebView({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroPageMetaElement(item)) {
    TaroPageMeta({ node: item, createLazyChildren: createLazyChildren })
  } else if (isTaroNavigationBarElement(item)) {
    TaroNavigationBar({ node: item, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'STICKY-SECTION') {
    TaroStickySection({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'LIST-VIEW') {
    TaroListView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  } else {
    TaroView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  }
}

@Builder
function createLazyChildren (node: TaroElement, layer = 0) {
  LazyForEach(node, (item: TaroElement) => {
    if (!item._nodeInfo || item._nodeInfo.layer === layer) {
      if (node.tagName === 'LIST-VIEW') {
        ListItem() {
          createChildItem(item, createLazyChildren)
        }
      } else {
        createChildItem(item, createLazyChildren)
      }
    }
  }, (item: TaroElement) => \`\${item._nid}-\${item._nodeInfo?.layer || 0}\`)
}

export { createChildItem, createLazyChildren }
`

    const { cwd: appPath, loaderMeta, taroConfig } = this.context
    const { outputRoot = 'dist', sourceRoot = 'src' } = taroConfig
    const { modifyResolveId } = loaderMeta
    return resolveAbsoluteRequire({
      name,
      importer: path.resolve(appPath, sourceRoot, fileName),
      code,
      outputRoot,
      targetRoot: path.resolve(appPath, sourceRoot),
      resolve,
      modifyResolveId,
    })
  }

  generateRenderExtraComponentsImport () {
    let result = ''
    const extraComponents = this.context.extraComponents

    if (extraComponents.length <= 0) return result

    result = 'import {\n'
    extraComponents.forEach(components => {
      const taroName = `Taro${components}`

      result = `${result}  ${taroName},\n`
    })

    return `${result}} from '@tarojs/components'\n`
  }

  generateRenderExtraComponentsCondition () {
    let result = ''
    const extraComponents = this.context.extraComponents

    if (extraComponents.length <= 0) return result

    extraComponents.forEach(components => {
      const taroName = `Taro${components}`

      result = `${result}if (item.tagName === '${components.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase()}') {
    ${taroName}({ node: item as TaroAny, createLazyChildren, createChildItem })
  } else `
    })

    return result
  }

  generateRenderCompileModeImport () {
    let result = ''

    this.template.forEach((_, key) => {
      result = `${result}import ${key} from './static/${key}'\n`
    })

    return result
  }

  generateRenderNativeImport () {
    let result = ''

    this.context.nativeComponents.forEach((nativeMeta, _) => {
      if (nativeMeta.isPackage) {
        result += `import ${nativeMeta.name} from '${nativeMeta.scriptPath}'\n`
      } else {
        const nativePath = path.relative(this.context.sourceDir, nativeMeta.scriptPath)
        result = `${result}import ${nativeMeta.name} from './${nativePath}'\n`
      }
    })

    return result
  }

  generateRenderCompileModeCondition () {
    let result = ''

    this.template.forEach((_, key) => {
      const keyData = key.split('_')
      const name = keyData[keyData.length - 1]
      result = `${result}if (item._attrs?.compileMode === '${name}') {
    ${key}({ node: item as TaroViewElement })
  } else `
    })

    return result
  }

  generateRenderNativeCondition () {
    let code = ''

    this.context.nativeComponents.forEach((nativeMeta, _) => {
      const { name } = nativeMeta
      code = `${code}if (item.tagName === '${name.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase()}') {
    ${name}({ props: (item._attrs as TaroAny).props })
  } else `
    })

    return code
  }
}
