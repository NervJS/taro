import { transformSync } from '@babel/core'
import path from 'path'
import ts from 'typescript'

import { parseRelativePath } from '../utils'

import type * as BabelCore from '@babel/core'
import type { ViteHarmonyBuildConfig, ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { Plugin, ResolvedConfig } from 'vite'

export class EtsHelper {
  code: string
  codeBuffer: Record<string, Map<string, string>> = {}

  REGEX_ETS_GRAMMAR = /(?<=\s)struct\s*[^{}]+\{|(@\S+)\s*\n/
  REGEX_MODIFIER = /\s((@\S+)\s*\n)+/
  REGEX_STRUCT = /(?<=\s)struct\s*[^{}]+\{/

  // Note: 收集暂存代码块中使用到的变量，避免被抖动掉
  // FIXME: Modifier 中使用到的变量未被记录，暂时需要提前声明
  structVars = new Set<string>()

  // eslint-disable-next-line no-useless-constructor
  constructor(protected appPath: string, protected taroConfig: ViteHarmonyBuildConfig) {}

  transEtsCode (id: string, code: string) {
    code = this.transStruct(id, code)
    code = this.transModifier(id, code)

    const { outputText } = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Preserve,
      },
    })
    return outputText
  }

  transStruct (id: string, code: string, count = 0) {
    const that = this
    // Note 基于 acorn 将 ETS struct 与装饰器转换为字符串
    const startIndex = code.search(this.REGEX_STRUCT)
    if (startIndex === -1) return code

    const [start, end] = this.findScope(code.slice(startIndex))
    if (start === -1 || end === -1) {
      throw new Error('ETS struct 作用范围缺失')
    }
    const bufferMap = this.codeBuffer[id] ||= new Map()
    const codeBufferStr = code.slice(startIndex, startIndex + end + 1)
    const codeId = `__TARO_ETS_STRUCT${count === 0 ? '' : `_${count}`}__`
    if (bufferMap.has(codeId)) {
      throw new Error(`ETS struct 作用范围冲突: ${codeId}`)
    } else {
      bufferMap.set(codeId, codeBufferStr)
    }
    let replaceCode = `/** id="${id}" */ `
    let name = code.match(this.REGEX_STRUCT)?.[0] || ''
    name = name.split(' ')[1] || ''
    if (name) {
      replaceCode += `export const ${name} = `
    }
    const codeBuffer = codeBufferStr
      .replace('struct', 'class')
      .replace(/(\n\s*)([A-Z][A-z]+)\s?\(([^()]*)\)\s?\{/g, (_, p1, p2) => `${p1}function ${p2}() {`)
      .replace(/(}\s*)\./g, '$1')

    try {
      transformSync(codeBuffer, {
        filename: id,
        parserOpts: {
          plugins: [
            'typescript',
          ],
        },
        plugins: [
          [
            function etsPlugin (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> {
              const t = babel.types
              return {
                name: 'taro-ets-plugin',
                visitor: {
                  Identifier(path) {
                    const node = path.node
                    if (t.isIdentifier(node) && node.loc) {
                      that.structVars.add(node.name)
                    }
                  }
                },
              }
            }
          ]
        ]
      })
    } catch (error) {
      console.error(error)
    }
    // FIXME 临时方案，后续需要通过 acorn 语法树解析使用的变量
    replaceCode += `${codeId}(${Array.from(this.structVars).join(', ')})`
    code = code.replace(codeBufferStr, replaceCode)
    return this.transStruct(id, code, count + 1)
  }

  transModifier (id: string, code: string, count = 0) {
    let isClear = true
    const bufferMap = this.codeBuffer[id] ||= new Map()
    const codeId = `__TARO_ETS_MODIFIER${count === 0 ? '' : `_${count}`}__`
    if (bufferMap.has(codeId)) {
      throw new Error(`ETS modifier 标识冲突: ${codeId}`)
    } else {
      code = code.replace(this.REGEX_MODIFIER, (str) => {
        isClear = false
        bufferMap.set(codeId, str)
        return `/** id="${id}" */ ${codeId}\n`
      })
    }
    if (isClear) {
      return code
    } else {
      return this.transModifier(id, code, count + 1)
    }
  }

  recoverEtsCode (id: string, code: string) {
    const fileId = '/\\*\\*\\sid="(.*)"\\s\\*/'
    const exportStruct = '((?:export\\s)?(?:const|var|let)\\s\\S*\\s=\\s)'
    const params = '(\\([^\\)]*\\))'
    const bufferMap = this.codeBuffer[id]
    if (bufferMap) {
      for (const [codeId, codeBufferStr] of bufferMap) {
        code = code?.replace(new RegExp(`${fileId}\\s${exportStruct}?${codeId}${params}?(;\n)?`), (_, _id, _export, vars) => {
          return parseCodeVars(codeBufferStr, vars, Array.from(this.structVars))
        })
      }
    } else {
      code = code?.replace(new RegExp(`${fileId}\\s${exportStruct}?(__TARO_ETS_[^\\(\\s;]+)${params}?(;\n)?`, 'g'), (_, id, _export, codeId, vars) => {
        const bufferMap = this.codeBuffer[id]
        if (bufferMap && bufferMap.has(codeId)) {
          const codeBufferStr = bufferMap.get(codeId) || ''
          return parseCodeVars(codeBufferStr, vars, Array.from(this.structVars))
        }
        return ''
      }) || ''
    }

    function parseCodeVars (code = '', vars = '', list: string[] = []) {
      if (!vars) return code

      const delimiters = ['(?![\\.\'"`])\\b', '\\b(?![\\.\'"`])']

      const varList = vars.slice(1, -1).split(',')
      varList.forEach((v, i) => {
        v = v.trim()
        if (list[i] !== v) {
          const pattern = new RegExp(
            `${delimiters[0]}${list[i].replace(/[\\/\-$]/g, '\\$1')}(${delimiters[1]})`,
            'g'
          )
          code = code.replace(pattern, () => v)
        }
      })

      return code
    }

    return code
  }

  resolveAbsoluteRequire (id: string, code: string) {
    const isInvalidFirst = /^[^a-z@/\\]/i.test(id)
    const realImporter = id.slice(isInvalidFirst ? 1 : 0)
    const { sourceRoot = 'src' } = this.taroConfig
    const targetRoot = path.resolve(this.appPath, sourceRoot)
    const outputFile = path.resolve(
      this.taroConfig.outputRoot || 'dist',
      path.isAbsolute(realImporter) ? path.relative(targetRoot, realImporter) : realImporter
    )
    const outputDir = path.dirname(outputFile)
    return code.replace(/(?:import\s|from\s|require\()['"]([^.][^'"\s]+)['"]\)?/g, (src, p1) => {
      if (p1.startsWith(this.taroConfig.outputRoot || 'dist')) {
        return src.replace(p1, parseRelativePath(outputDir, p1))
      }

      return src
    })
  }

  findScope (str: string, position = 0, flags = ['{', '}']) {
    const start = str.indexOf(flags[0], position)
    if (start === -1) return [-1, -1]

    let end = str.indexOf(flags[1], start + 1)
    let restFloor = 1
    if (end === -1) {
      throw new Error(`获取 ${str.slice(start, end)} 作用范围失败`)
    } else {
      let i = start + 1
      while (restFloor > 0) {
        const j = str.slice(i + 1).search(new RegExp(`[${flags.join('')}]`))
        if (i === -1 || j === -1) {
          throw new Error(`获取 ${str.slice(start, end)} 作用范围失败 ${start} ${i} ${str[i]} ${restFloor} ${j}`)
        }
        i += j + 1
        str[i] === flags[0] ? restFloor++ : restFloor--
      }
      end = position + i
    }
    return [start, end]
  }
}

const etsMapCache = new WeakMap<ResolvedConfig, EtsHelper>()
export default async function (viteCompilerContext: ViteHarmonyCompilerContext): Promise<Plugin> {
  const name = 'taro:vite-ets'
  const { taroConfig, cwd: appPath } = viteCompilerContext
  let helper: EtsHelper

  let viteConfig: ResolvedConfig

  return {
    name,
    enforce: 'pre',
    configResolved (config) {
      viteConfig = config
    },
    buildStart () {
      if (etsMapCache.has(viteConfig)) {
        helper = etsMapCache.get(viteConfig) as EtsHelper
      } else {
        helper = new EtsHelper(appPath, taroConfig)
        etsMapCache.set(viteConfig, helper)
      }
    },
    transform (code, id) {
      if (/\.ets(\?\S*)?$/.test(id)) {
        // FIXME 通过 acornInjectPlugins 注入 struct 语法编译插件
        code = helper.transEtsCode(id, code)
      }
      if (/(\.(et|j|t)sx?|\.vue)$/.test(id.split('?')[0])) {
        const result = transformSync(code, {
          filename: id,
          plugins: [
            [
              function renameImportPlugin (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> {
                const t = babel.types
                return {
                  name: 'taro-rename-import-plugin',
                  visitor: {
                    ImportDeclaration (ast) {
                      if (ast.node.source.value !== '@tarojs/components') return

                      const newSpecifiers = ast.node.specifiers.map(node => {
                        if (t.isImportSpecifier(node)) {
                          const { imported, local } = node
                          const property = t.isIdentifier(imported) ? imported.name : imported.value
                          return t.importSpecifier(local, t.identifier(`Taro${property}TagName`))
                        }
                        return node
                      })
                      ast.node.specifiers = newSpecifiers
                    },
                  },
                }
              }
            ],
          ],
        })
        return {
          code: result?.code || code,
          map: result?.map || null,
        }
      }
    },
    renderChunk (code, chunk, opts: any) {
      // TODO ETS 文件改为 prebuilt-chunk 输出，输出前 resolve 依赖
      const id = chunk.facadeModuleId || chunk.fileName
      const etsSuffix = /\.ets(\?\S*)?$/
      if (etsSuffix.test(id) || etsSuffix.test(chunk.fileName) || chunk.moduleIds?.some(id => etsSuffix.test(id))) {
        opts.__vite_skip_esbuild__ = true
        code = `// @ts-nocheck\n${helper.recoverEtsCode(id, code)}`
        return helper.resolveAbsoluteRequire(id, code)
      }
    },
    // Note: 识别项目内 ets 文件并注入到 Harmony 项目中
  }
}
