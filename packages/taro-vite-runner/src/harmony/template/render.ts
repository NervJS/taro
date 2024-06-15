import path from 'node:path'

import { resolveAbsoluteRequire } from '../../utils'
import BaseParser from './base'

import type { TRollupResolveMethod } from '@tarojs/taro/types/compile/config/plugin'
import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'

export interface IChildComponent {
  name: string
  condition?: string
  type?: string
  args?: string[]
  extra?: string
}

const STANDARD_COMPONENT_LIST = [
  'Image',
  'Text',
  'View',
  'Icon',
  'Form',
  'Label',
  'Input',
  'Video',
  'Button',
  'Picker',
  'Slider',
  'Switch',
  'Swiper',
  'WebView',
  'TextArea',
  'RichText',
  'Progress',
  'InnerHtml',
  'ScrollView',
  'MovableArea',
  'MovableView',
  'Radio',
  'Canvas',
  'RadioGroup',
  'CheckboxGroup',
  'Checkbox',
  'PageMeta',
  'NavigationBar',
  'ScrollList',
  'ListView',
  'StickySection',
]

const RUNTIME_TYPE_LIST = [
  'TaroAny',
  'TaroElement',
  'TaroOtherElement',
  'TaroViewElement',
  'TaroScrollViewElement',
  'TaroImageElement',
  'TaroButtonElement',
  'TaroTextElement',
  'TaroFormElement',
  'TaroIconElement',
  'TaroLabelElement',
  'TaroPickerElement',
  'TaroInputElement',
  'TaroTextAreaElement',
  'TaroCheckboxGroupElement',
  'TaroCheckboxElement',
  'TaroRadioGroupElement',
  'TaroRadioElement',
  'TaroRichTextElement',
  'TaroVideoElement',
  'TaroProgressElement',
  'TaroMovableAreaElement',
  'TaroMovableViewElement',
  'TaroSwiperElement',
  // 'TaroSwiperItemElement',
  'TaroSwitchElement',
  'TaroSliderElement',
  'TaroCanvasElement',
  'TaroWebViewElement',
  'TaroInnerHtmlElement',
  'TaroPageMetaElement',
  'TaroNavigationBarElement',
]

export default class RenderParser extends BaseParser {
  constructor(protected template: Map<string, string>, protected context: ViteHarmonyCompilerContext) {
    super()
  }

  generate(fileName: string, name = 'TaroRender', resolve?: TRollupResolveMethod) {
    const { cwd: appPath, loaderMeta, taroConfig } = this.context
    const { outputRoot = 'dist', sourceRoot = 'src' } = taroConfig
    const { modifyResolveId } = loaderMeta

    const compList = [
      ...STANDARD_COMPONENT_LIST,
      ...this.context.extraComponents,
    ].filter(e => typeof e === 'string')

    const importList = [
      `import { ${compList.map(e => `Taro${e}`).join(', ')} } from '@tarojs/components'`,
      ...Object.values(this.context.nativeComponents).map((meta) => {
        if (meta.isPackage) {
          return `import ${meta.name} from '${meta.scriptPath}'`
        } else {
          const nativePath = path.relative(this.context.sourceDir, meta.scriptPath).replace(/\.ets$/, '')
          return `import ${meta.name} from './${nativePath}'`
        }
      }),
      ...Object.keys(this.template).map((key) => {
        return `import ${key} from './static/${key}`
      }),
      `import { Current, NodeType } from '@tarojs/runtime'`,
      '',
      `import type { ${RUNTIME_TYPE_LIST.join(', ')} } from '@tarojs/runtime'`,
    ]

    const ChildComponentList: IChildComponent[] = [{
      name: 'ScrollList',
      condition: `(item.tagName === 'SCROLL-VIEW' || item._st?.hmStyle.overflow === 'scroll') && item.getAttribute('type') === 'custom'`,
      type: 'TaroScrollViewElement',
    }, {
      name: 'ScrollView',
      condition: `item.tagName === 'SCROLL-VIEW' || item._st?.hmStyle.overflow === 'scroll'`,
      type: 'TaroScrollViewElement',
    }, {
      name: 'View',
      condition: `item.tagName === 'VIEW'`,
      type: 'TaroViewElement',
    }, {
      name: 'Text',
      condition: `item.tagName === 'TEXT' || item.nodeType === NodeType.TEXT_NODE'`,
      type: 'TaroTextElement',
    }, {
      name: 'Image',
      condition: `item.tagName === 'IMAGE'`,
      type: 'TaroImageElement',
    }, {
      name: 'Button',
      condition: `item.tagName === 'BUTTON'`,
      type: 'TaroButtonElement',
    }, {
      name: 'Slider',
      condition: `item.tagName === 'SLIDER'`,
      type: 'TaroSliderElement',
    }, {
      name: 'Switch',
      condition: `item.tagName === 'SWITCH'`,
      type: 'TaroSwitchElement',
    }, {
      name: 'Input',
      condition: `item.tagName === 'INPUT'`,
      type: 'TaroInputElement',
    }, {
      name: 'Swiper',
      condition: `item.tagName === 'SWIPER'`,
      type: 'TaroSwiperElement',
    }, {
      name: 'View',
      condition: `item.tagName === 'SWIPER-ITEM'`,
      type: 'TaroViewElement',
    }, {
      name: 'InnerHtml',
      condition: `item.tagName === 'INNER-HTML'`,
      type: 'TaroInnerHtmlElement',
    }, {
      name: 'RichText',
      condition: `item.tagName === 'RICH-TEXT'`,
      type: 'TaroRichTextElement',
    }, {
      name: 'Icon',
      condition: `item.tagName === 'ICON'`,
      type: 'TaroIconElement',
    }, {
      name: 'TextArea',
      condition: `item.tagName === 'TEXT-AREA'`,
      type: 'TaroTextAreaElement',
    }, {
      name: 'CheckboxGroup',
      condition: `item.tagName === 'CHECKBOX-GROUP'`,
      type: 'TaroCheckboxGroupElement',
    }, {
      name: 'Checkbox',
      condition: `item.tagName === 'CHECKBOX'`,
      type: 'TaroCheckboxElement',
    }, {
      name: 'RadioGroup',
      condition: `item.tagName === 'RADIO-GROUP'`,
      type: 'TaroRadioGroupElement',
    }, {
      name: 'Radio',
      condition: `item.tagName === 'RADIO'`,
      type: 'TaroRadioElement',
    }, {
      name: 'Progress',
      condition: `item.tagName === 'PROGRESS'`,
      type: 'TaroProgressElement',
    }, {
      name: 'MovableView',
      condition: `item.tagName === 'MOVABLE-VIEW'`,
      type: 'TaroMovableViewElement',
    }, {
      name: 'MovableArea',
      condition: `item.tagName === 'MOVABLE-AREA'`,
      type: 'TaroMovableAreaElement',
    }, {
      name: 'Canvas',
      condition: `item.tagName === 'CANVAS'`,
      type: 'TaroAny as TaroCanvasElement',
    }, {
      name: 'Label',
      condition: `item.tagName === 'LABEL'`,
      type: 'TaroLabelElement',
    }, {
      name: 'Picker',
      condition: `item.tagName === 'PICKER'`,
      type: 'TaroPickerElement',
    }, {
      name: 'Form',
      condition: `item.tagName === 'FORM'`,
      type: 'TaroFormElement',
    }, {
      name: 'Video',
      condition: `item.tagName === 'VIDEO'`,
      type: 'TaroVideoElement',
    }, {
      name: 'WebView',
      condition: `item.tagName === 'WEB-VIEW'`,
      type: 'TaroWebViewElement',
    }, {
      name: 'PageMeta',
      condition: `item.tagName === 'PAGE-META'`,
      type: 'TaroPageMetaElement',
    }, {
      name: 'NavigationBar',
      condition: `item.tagName === 'NAVIGATION-BAR'`,
      type: 'TaroNavigationBarElement',

    }, {
      name: 'StickySection',
      condition: `item.tagName === 'STICKY-SECTION'`,
      type: 'TaroViewElement',
    }, {
      name: 'ListView',
      condition: `item.tagName === 'LIST-VIEW'`,
      type: 'TaroViewElement',
    }, {
      name: 'View',
      type: 'TaroViewElement',
    }]

    this.context.extraComponents.forEach((component) => {
      ChildComponentList.unshift({
        name: component,
        condition: `item.tagName === '${component
          .replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1')
          .toUpperCase()}'`,
        args: ['createLazyChildren', 'createChildItem'],
      })
    })

    this.context.nativeComponents.forEach((meta) => {
      const { name } = meta
      ChildComponentList.unshift({
        name,
        condition: `item.tagName === '${name.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase()}'`,
        args: [],
      })
    })

    this.template.forEach((_, key) => {
      const keyData = key.split('_')
      const name = keyData[keyData.length - 1]
      ChildComponentList.unshift({
        name: key,
        condition: `item._attrs?.compileMode === '${name}'`,
        type: 'TaroViewElement',
        args: [],
      })
    })

    const code = this.transArr2Str([
      ...importList,
      '',
      this.generateNativeComponentNamesInit(),
      '',
      `@Builder
function createChildItem (item: TaroElement, createLazyChildren?: (node: TaroElement, layer?: number) => void) {
${this.transArr2Str(ChildComponentList.map(this.generateComponentCreated).join(' else ').split('\n'), 2)}
}`,
      '',
      `@Builder
function createLazyChildren (node: TaroElement, layer = 0) {
  LazyForEach(node, (item: TaroElement) => {
    if (!item._nodeInfo || item._nodeInfo.layer === layer) {
      createChildItem(item, createLazyChildren)
    }
  }, (item: TaroElement) => \`\${item._nid}-\${item._nativeUpdateTrigger}-\${item._nodeInfo?.layer || 0}\`)
}

export { createChildItem, createLazyChildren }`,
      '',
    ])

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

  generateComponentCreated ({ name = '', condition = '', type = 'TaroAny', args = ['createLazyChildren'], extra = '' }: IChildComponent) {
    name = `Taro${name}`

    return `${condition ? `if (${condition}) ` : ''}{
  ${name}({ node: item as ${type}${args.length > 0 ? `, ${args.join(', ')}` : ''} })${extra}
}`
  }

  generateNativeComponentNamesInit() {
    if (this.context.nativeComponents.size === 0) return ''
    const commentsList: string[] = []

    this.context.nativeComponents.forEach((nativeMeta) => {
      const { name } = nativeMeta
      // 这段逻辑服务于 @Builder 的更新，是通过父节点把这个节点重新渲染，这里排除掉package的情况，package一般逻辑复杂会用 @Component 实现组件
      commentsList.push(name.replace(new RegExp('(?<=.)([A-Z])', 'g'), '-$1').toUpperCase())
    })

    return `Current.nativeComponentNames = [${commentsList.map((item) => `"${item}"`).join(', ')}]`
  }
}
