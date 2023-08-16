import { transformAsync } from '@babel/core'
import path from 'path'
import ts from 'typescript'

import type * as BabelCore from '@babel/core'
import type { PluginOption } from 'vite'
import type { HarmonyBuildConfig } from '../utils/types'

export class EtsHelper {
  code: string
  codeBuffer: Record<string, Map<string, string>> = {}

  REGEX_ETS_GRAMMAR = /(?<=\s)struct\s*[^{}]+\{|(@\S+)\s*\n/
  REGEX_MODIFIER = /\s((@\S+)\s*\n)+/
  REGEX_STRUCT = /(?<=\s)struct\s*[^{}]+\{/

  structVarList = ['createReactApp', 'createPageConfig', 'component', 'ReactMeta', 'TaroElement', 'TaroView', 'TaroText', 'TaroImage', 'hilog']

  // eslint-disable-next-line no-useless-constructor
  constructor(protected appPath: string, protected taroConfig: HarmonyBuildConfig) {}

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
    // FIXME 临时方案，后续需要通过 acorn 语法树解析使用的变量
    replaceCode += `${codeId}(${this.structVarList.join(', ')})`
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
    let insertVarMap = ''
    if (bufferMap) {
      for (const [codeId, codeBufferStr] of bufferMap) {
        code = code?.replace(new RegExp(`${fileId}\\s${exportStruct}?${codeId}${params}?(;\n)?`), (_, _id, _export, vars) => {
          if (vars) {
            insertVarMap = parseVars(vars, this.structVarList)
          }
          return codeBufferStr
        })
      }
    } else {
      code = code?.replace(new RegExp(`${fileId}\\s${exportStruct}?(__TARO_ETS_[^\\(\\s;]+)${params}?(;\n)?`, 'g'), (_, id, _export, codeId, vars) => {
        const bufferMap = this.codeBuffer[id]
        if (bufferMap && bufferMap.has(codeId)) {
          const codeBufferStr = bufferMap.get(codeId) || ''
          if (vars) {
            insertVarMap = parseVars(vars, this.structVarList)
          }
          return codeBufferStr
        }
        return ''
      }) || ''
    }

    // FIXME 临时方案，仅支持 function、class 类型
    function parseVars (vars = '', list: string[] = []) {
      return vars
        .slice(1, -1).split(',')
        .map(v => v.trim())
        .reduce((p, v, i) => {
          if (list[i] !== v) {
            p += `var ${list[i]} = ${v};\n`
          }
          return p
        }, '')
    }
    code = code.replace(/(import\s[^'"]*['"][^'"]*['"];?\n)*/, s => `${s}\n${insertVarMap}`)

    return code
  }

  resolveAbsoluteRequire (id: string, code: string) {
    const isInvalidFirst = /^[^a-z@/\\]/i.test(id)
    const realImporter = id.slice(isInvalidFirst ? 1 : 0)
    const { sourceRoot = 'src' } = this.taroConfig
    const targetRoot = path.resolve(this.appPath, sourceRoot)
    const outputFile = path.resolve(
      this.taroConfig.outputRoot || 'dist',
      realImporter.startsWith('/') ? path.relative(targetRoot, realImporter) : realImporter
    )
    const outputDir = path.dirname(outputFile)
    return code.replace(/(?:import\s|from\s|require\()['"]([^.][^'"\s]+)['"]\)?/g, (src, p1) => {
      if (p1.startsWith(this.taroConfig.outputRoot || 'dist')) {
        let relativePath = path.relative(outputDir, p1)
        relativePath = /^\.{1,2}[\\/]/.test(relativePath)
          ? relativePath
          : /^\.{1,2}$/.test(relativePath)
            ? `${relativePath}/`
            : `./${relativePath}`

        return src.replace(p1, relativePath)
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

export default function (appPath: string, taroConfig: HarmonyBuildConfig): PluginOption {
  const helper = new EtsHelper(appPath, taroConfig)

  return {
    name: 'taro:vite-ets',
    enforce: 'pre',
    async transform (code, id) {
      if (/\.ets(\?\S*)?$/.test(id)) {
        // FIXME 通过 acornInjectPlugins 注入 struct 语法编译插件
        code = helper.transEtsCode(id, code)
      }
      if (/\.(et|j|t)sx?|\.vue/.test(id)) {
        const result = await transformAsync(code, {
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
      opts.__vite_skip_esbuild__ = true
      const id = chunk.facadeModuleId || chunk.fileName
      const etsSuffix = /\.ets(\?\S*)?$/
      if (etsSuffix.test(id) || chunk.moduleIds?.some(id => etsSuffix.test(id))) {
        code = helper.recoverEtsCode(id, code)
      }

      return helper.resolveAbsoluteRequire(id, code)
    },
  }
}
