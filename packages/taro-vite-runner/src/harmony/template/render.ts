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

  generate (name = 'TaroRender', resolve?: TRollupResolveMethod) {
    const code = `import TaroImage from '@tarojs/components/image'
import TaroText from '@tarojs/components/text'
import TaroView from '@tarojs/components/view'
import TaroIcon from '@tarojs/components/icon'
import TaroForm from '@tarojs/components/form'
import TaroLabel from '@tarojs/components/label'
import TaroInput from '@tarojs/components/input'
import TaroVideo from '@tarojs/components/video'
import TaroButton from '@tarojs/components/button'
import TaroPicker from '@tarojs/components/picker'
import TaroSlider from '@tarojs/components/slider'
import TaroSwitch from '@tarojs/components/switch'
import TaroSwiper from '@tarojs/components/swiper'
import TaroWebView from '@tarojs/components/webView'
import TaroTextArea from '@tarojs/components/textArea'
import TaroRichText from '@tarojs/components/richText'
import TaroProgress from '@tarojs/components/progress'
import TaroInnerHtml from '@tarojs/components/innerHtml'
import TaroScrollView from '@tarojs/components/scrollView'
import TaroMovableArea from '@tarojs/components/movableArea'
import TaroMovableView from '@tarojs/components/movableView'
import { TaroRadio, TaroRadioGroup } from '@tarojs/components/radio'
import { TaroCheckboxGroup, TaroCheckbox } from '@tarojs/components/checkbox'
${this.generateRenderNativeImport()}${this.generateRenderCompileModeImport()}
import { NodeType } from '@tarojs/runtime'

import type {
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
  TaroSliderElement,
  TaroScrollViewElement,
  TaroWebViewElement,
  TaroInnerHtmlElement
} from '@tarojs/runtime'

@Builder
function createChildItem (item: TaroElement, createLazyChildren?: (node: TaroElement) => void) {
  ${this.generateRenderNativeCondition()}${this.generateRenderCompileModeCondition()}if (item.tagName === 'VIEW') {
    TaroView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'TEXT' || item.nodeType === NodeType.TEXT_NODE) {
    TaroText({ node: item as TaroTextElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'IMAGE') {
    TaroImage({ node: item as TaroImageElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'BUTTON') {
    TaroButton({ node: item as TaroButtonElement, createLazyChildren: createLazyChildren })
  } else if (item.tagName === 'SCROLL-VIEW') {
    TaroScrollView({ node: item as TaroScrollViewElement, createLazyChildren: createLazyChildren })
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
  } else {
    TaroView({ node: item as TaroViewElement, createLazyChildren: createLazyChildren })
  }
}

@Builder
function createLazyChildren (node: TaroElement) {
  LazyForEach(node, (item: TaroElement) => {
    createChildItem(item, createLazyChildren)
  }, (item: TaroElement) => item._nid)
}

export { createChildItem, createLazyChildren }
`

    const { cwd: appPath, loaderMeta, taroConfig } = this.context
    const { outputRoot = 'dist', sourceRoot = 'src' } = taroConfig
    const { modifyResolveId } = loaderMeta
    const importer = path.resolve(appPath, sourceRoot)
    return resolveAbsoluteRequire({
      name,
      importer,
      code,
      outputRoot,
      targetRoot: path.resolve(appPath, sourceRoot),
      resolve,
      modifyResolveId,
    })
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
      const nativePath = path.relative(this.context.sourceDir, nativeMeta.scriptPath)
      result = `${result}import ${nativeMeta.name} from '../../../${nativePath}'\n`
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
