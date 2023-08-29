import { fs } from '@tarojs/helper'
import path from 'path'
import { normalizePath } from 'vite'

import { componentConfig } from '../template/component'
import { isRelativePath, isVirtualModule } from '../utils'

import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/compiler/mini'

const QUERY_IS_NATIVE_SCRIPT = '?isNativeScript='
export const QUERY_IS_NATIVE_PAGE = QUERY_IS_NATIVE_SCRIPT + 'page'
export const QUERY_IS_NATIVE_COMP = QUERY_IS_NATIVE_SCRIPT + 'comp'
const IS_NATIVE_SCRIPT_REG = new RegExp(`\\${QUERY_IS_NATIVE_SCRIPT}(page|comp)$`)
const QUERY_IS_NATIVE_STYLE = '?isNativeStyle=true'
const IS_NATIVE_STYLE_REG = new RegExp(`\\${QUERY_IS_NATIVE_STYLE}`)

export default function (compiler: TaroCompiler | undefined): PluginOption {
  // todo 这个插件逻辑不是很清晰 待验证
  const { taroConfig } = compiler as TaroCompiler
  return {
    name: 'taro:vite-native-support',
    enforce: 'pre',
    buildEnd () {
      compiler = undefined
    },
    resolveId (id) {
      if (!compiler) return
      if (IS_NATIVE_STYLE_REG.test(id)) {
        return id
      }
    },
    async load (id) {
      if (!compiler) return

      if (IS_NATIVE_SCRIPT_REG.test(id)) {
        let type: 'page' | 'comp' = 'page'
        const target = id.replace(IS_NATIVE_SCRIPT_REG, (_, $1) => {
          type = $1
          return ''
        })

        let stylePath = ''

        if (type === 'page') {
          for (const page of compiler.pages) {
            if (page.isNative && page.scriptPath === target && page.cssPath && fs.existsSync(page.cssPath)) {
              stylePath = compiler.getTargetFilePath(page.cssPath, '.scss')
              break
            }
          }
        } else {
          for (const comp of compiler.nativeComponents.values()) {
            if (comp.scriptPath === target && comp.cssPath && fs.existsSync(comp.cssPath)) {
              stylePath = compiler.getTargetFilePath(comp.cssPath, '.scss')
              break
            }
          }
        }

        if (stylePath) return {
          code: [
            `import "${target}";\n`,
            stylePath ? `import "${stylePath}${QUERY_IS_NATIVE_STYLE}";\n` : ''
          ].join('')
        }
      } else if (IS_NATIVE_STYLE_REG.test(id)) {
        let source = id.replace(new RegExp(`\\${QUERY_IS_NATIVE_STYLE}`), '')
        source = compiler.getTargetFilePath(source, compiler.fileType.style)
        const code = await fs.readFile(source, 'utf-8')
        return {
          code
        }
      }
    },
    moduleParsed ({ id, ast }) {
      if (!isVirtualModule(id) && /\.[jt]sx/.test(id)) {
        const walk = require('acorn-walk')

        walk.simple(ast, {
          CallExpression: node => {
            const callee = node.callee
            if (callee.type === 'MemberExpression') {
              if (callee.property.name !== 'createElement') {
                return
              }
            } else {
              const nameOfCallee = callee.name
              if (
                // 兼容 react17 new jsx transtrom
                !(/_?jsxs?/.test(nameOfCallee)) &&
                // 兼容 Vue 3.0 渲染函数及 JSX
                !(nameOfCallee?.includes('createVNode')) &&
                !(nameOfCallee?.includes('createBlock')) &&
                !(nameOfCallee?.includes('createElementVNode')) &&
                !(nameOfCallee?.includes('createElementBlock')) &&
                !(nameOfCallee?.includes('resolveComponent')) // 收集使用解析函数的组件名称
                // TODO: 兼容 vue 2.0 渲染函数及 JSX，函数名 h 与 _c 在压缩后太常见，需要做更多限制后才能兼容
                // nameOfCallee !== 'h' && nameOfCallee !== '_c'
              ) {
                return
              }
            }

            const [type, prop] = node.arguments
            const componentName = type.name

            type.value && taroConfig.onParseCreateElement?.(type.value, componentConfig)

            if (componentName === 'CustomWrapper' && !componentConfig.thirdPartyComponents.get('custom-wrapper')) {
              componentConfig.thirdPartyComponents.set('custom-wrapper', new Set())
            }
            if (componentConfig.thirdPartyComponents.size === 0) {
              return
            }
            const attrs = componentConfig.thirdPartyComponents.get(type.value)

            if (attrs == null || !prop || prop.type !== 'ObjectExpression') {
              return
            }

            prop.properties
              .filter(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name !== 'children' && p.key.name !== 'id')
              .forEach(p => attrs.add(p.key.name))
          }
        })
      }
    },
  }
}

export function miniTemplateLoader (ctx: PluginContext, templatePath: string, sourceDir: string): string {
  const source = fs.readFileSync(templatePath).toString()
  /**
   * 两种fix方案：
   * 1. 用任意xml标签包裹source，使之变成较标准的xml格式（含有一个根节点）
   * 2. 修改 sax.parser 的第一个参数为 true，启用严格模式
   *    2.1 该模式下小程序模板中的标签或属性不会处理（例如写入<Import SrC="..." />不会处理成<import src="..." />，而是保持原样
   *    2.2 该模式将认为传入的xml为非标准的，无需标准化，且不按照以根节点模式处理，因此可以正常解析小程序模板
   *
   * 推荐方案1，这样在构建时会正常打入需要的包，但是若用户有 SrC 类似的写法导致引用失败，则可直接修正，不会认为是打包出现了问题
   **/
  const sourceWithRoot = `<root>${source}</root>`
  const parser = require('sax').parser(false, { lowercase: true })
  const requests: string[] = []

  parser.onattribute = ({ name, value }) => {
    if (name === 'src' && isRelativePath(value)) {
      const request = path.resolve(path.dirname(templatePath), value)
      requests.push(normalizePath(request))
    }
  }
  parser.onend = async () => {
    for (let i = 0; i < requests.length; i++) {
      ctx.emitFile({
        type: 'asset',
        fileName: requests[i].replace(sourceDir, '').replace(/^\//, ''),
        source: await fs.readFile(requests[i])
      })
      ctx.addWatchFile(requests[i])
    }
  }
  parser.write(sourceWithRoot).close()

  ctx.addWatchFile(templatePath)

  return source
}
