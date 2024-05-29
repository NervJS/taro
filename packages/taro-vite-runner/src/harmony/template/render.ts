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

@Builder
function createChildItem (item: TaroElement, createLazyChildren?: (node: TaroElement) => void) {
  ${this.generateRenderExtraComponentsCondition()}${this.generateRenderNativeCondition()}${this.generateRenderCompileModeCondition()}if (item.tagName === 'SCROLL-VIEW' || item._st?.hmStyle.overflow === 'scroll') {
    if (item.getAttribute('type') === 'custom') {
      TaroScrollList({ node: item as TaroScrollViewElement, createLazyChildren: createLazyChildren })
    } else {
      TaroScrollView({ node: item as TaroScrollViewElement, createLazyChildren: createLazyChildren })
    }
  } else if (item.tagName === 'VIEW') {
    TaroView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'TEXT' || item.nodeType === NodeType.TEXT_NODE) {
    TaroText({ node: item as TaroTextElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'IMAGE') {
    TaroImage({ node: item as TaroImageElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'BUTTON') {
    TaroButton({ node: item as TaroButtonElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'SLIDER') {
    TaroSlider({ node: item as TaroSliderElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'SWITCH') {
    TaroSwitch({ node: item as TaroSwitchElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'INPUT') {
    TaroInput({ node: item as TaroInputElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'SWIPER') {
    TaroSwiper({ node: item as TaroSwiperElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'SWIPER-ITEM') {
    TaroView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'INNER-HTML') {
    TaroInnerHtml({ node: item as TaroInnerHtmlElement, createChildItem: createChildItem })
  } else if (item.tagName === 'RICH-TEXT') {
    TaroRichText({ node: item as TaroRichTextElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'ICON') {
    TaroIcon({ node: item as TaroIconElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'TEXT-AREA') {
    TaroTextArea({ node: item as TaroTextAreaElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'CHECKBOX-GROUP') {
    TaroCheckboxGroup({ node: item as TaroCheckboxGroupElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'CHECKBOX') {
    TaroCheckbox({ node: item as TaroCheckboxElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'RADIO-GROUP') {
    TaroRadioGroup({ node: item as TaroRadioGroupElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'PROGRESS') {
    TaroProgress({ node: item as  TaroProgressElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'MOVABLE-VIEW') {
    TaroMovableView({ node: item as TaroMovableViewElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'MOVABLE-AREA') {
    TaroMovableArea({ node: item as TaroMovableAreaElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'CANVAS') {
    TaroCanvas({ node: item as TaroAny as TaroCanvasElement })
  } else if (item.tagName === 'RADIO') {
    TaroRadio({ node: item as TaroRadioElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'LABEL') {
    TaroLabel({ node: item as TaroLabelElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'PICKER') {
    TaroPicker({ node: item as TaroPickerElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'FORM') {
    TaroForm({ node: item as TaroFormElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'VIDEO') {
    TaroVideo({ node: item as TaroVideoElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'WEB-VIEW') {
    TaroWebView({ node: item as TaroWebViewElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'PAGE-META') {
    TaroPageMeta({ node: item as TaroPageMetaElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'NAVIGATION-BAR') {
    TaroNavigationBar({ node: item as TaroNavigationBarElement, createLazyChildren: createLazyChildren })
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
        const nativePath = path.relative(this.context.sourceDir, nativeMeta.scriptPath).replace(/\.ets$/, '');
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
    ${name}(item._attrs as TaroAny)
  } else `
    })

    return code
  }
}
