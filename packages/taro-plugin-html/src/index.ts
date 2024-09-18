import * as path from 'node:path'

import { babelKit } from '@tarojs/helper'
import { isArray, isString } from '@tarojs/shared'

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'

const {
  types: t,
  generate,
  traverse
} = babelKit

export interface IOptions {
  pxtransformBlackList?: any[]
  modifyElements?(inline: string[], block: string[]): void
  enableSizeAPIs?: boolean
}

interface OnParseCreateElementArgs {
  nodeName: string
  componentConfig: IComponentConfig
}

export default (ctx: IPluginContext, options: IOptions) => {
  const inlineElements = ['i', 'abbr', 'select', 'acronym', 'small', 'bdi', 'kbd', 'strong', 'big', 'sub', 'sup', 'br', 'mark', 'meter', 'template', 'cite', 'object', 'time', 'code', 'output', 'u', 'data', 'picture', 'tt', 'datalist', 'var', 'dfn', 'del', 'q', 'em', 's', 'embed', 'samp', 'b']
  const blockElements = ['body', 'svg', 'address', 'fieldset', 'li', 'span', 'article', 'figcaption', 'main', 'aside', 'figure', 'nav', 'blockquote', 'footer', 'ol', 'details', 'p', 'dialog', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'dd', 'header', 'section', 'div', 'hgroup', 'table', 'dl', 'hr', 'ul', 'dt', 'view', 'view-block']
  const specialElements = ['slot', 'form', 'iframe', 'img', 'audio', 'video', 'canvas', 'a', 'input', 'label', 'textarea', 'progress', 'button']

  patchMappingElements(ctx, options, inlineElements, blockElements)

  // 默认允许使用 getBoundingClientRect 等 API
  ctx.modifyWebpackChain(({ chain }) => {
    chain
      .plugin('definePlugin')
      .tap(args => {
        args[0].ENABLE_SIZE_APIS = options.enableSizeAPIs ?? true
        return args
      })
  })
  ctx.registerMethod({
    name: 'onSetupClose',
    fn (platform: TaroPlatformBase) {
      injectRuntimePath(platform)
    }
  })
  // 映射、收集使用到的小程序组件
  ctx.onParseCreateElement(({ nodeName, componentConfig }: OnParseCreateElementArgs) => {
    if (!(
      inlineElements.includes(nodeName) ||
      blockElements.includes(nodeName) ||
      specialElements.includes(nodeName)
    )) return

    const simple = ['audio', 'button', 'canvas', 'form', 'label', 'progress', 'textarea', 'video']
    const special = {
      a: ['navigator'],
      iframe: ['web-view'],
      img: ['image'],
      input: ['input', 'checkbox', 'radio']
    }
    const includes = componentConfig.includes

    if (simple.includes(nodeName) && !includes.has(nodeName)) {
      includes.add(nodeName)
    } else if (nodeName in special) {
      const maps = special[nodeName]
      maps.forEach(item => {
        !includes.has(item) && includes.add(item)
      })
    }
  })
  // 修改 H5 postcss options
  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.platform) return
    modifyPostcssConfigs(opts, options, opts.platform === 'h5')
  })
}

function injectRuntimePath (platform: TaroPlatformBase) {
  const injectedPath = '@tarojs/plugin-html/dist/runtime'
  if (isArray(platform.runtimePath)) {
    platform.runtimePath.push(injectedPath)
  } else if (isString(platform.runtimePath)) {
    platform.runtimePath = [platform.runtimePath, injectedPath]
  }
}

function modifyPostcssConfigs (config: Record<string, any>, options: IOptions, isH5?: boolean) {
  config.postcss ||= {}
  const postcssConfig = config.postcss

  if (!isH5) {
    postcssConfig.htmltransform ||= {
      enable: true
    }
  }

  if (options.pxtransformBlackList) {
    postcssConfig.pxtransform ||= {
      enable: true
    }
    const pxtransformConfig = postcssConfig.pxtransform

    if (pxtransformConfig.enable) {
      pxtransformConfig.config ||= {}
      const config = pxtransformConfig.config
      config.selectorBlackList ||= []
      config.selectorBlackList = config.selectorBlackList.concat(options.pxtransformBlackList)
    }
  }
}

function patchMappingElements (ctx: IPluginContext, options: IOptions, inlineElements: string[], blockElements: string[]) {
  const helper = ctx.helper
  const filePath = path.resolve(__dirname, './runtime.js')
  const content = helper.fs.readFileSync(filePath).toString()
  const ast = babelKit.parse(content, { sourceType: 'unambiguous' })

  if (t.isNode(ast)) {
    options.modifyElements?.(inlineElements, blockElements)

    traverse(ast, {
      VariableDeclarator (path) {
        const node = path.node
        const varId = node.id
        if (varId.type === 'Identifier') {
          if (varId.name === 'inlineElements') {
            node.init = getNewExpression(inlineElements)
          }
          if (varId.name === 'blockElements') {
            node.init = getNewExpression(blockElements)
          }
        }
      }
    })

    const str = generate(ast).code
    helper.fs.writeFileSync(filePath, str)
  }
}

function getNewExpression (elements: string[]) {
  return t.newExpression(
    t.identifier('Set'),
    [t.arrayExpression(elements.map(el => t.stringLiteral(el)))]
  )
}
