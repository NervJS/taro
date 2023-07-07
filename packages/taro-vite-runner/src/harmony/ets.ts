import ts from 'typescript'

import type { PluginOption } from 'vite'

export class EtsHelper {
  code: string
  codeBuffer: Record<string, Map<string, string>> = {}

  REGEX_ETS_GRAMMAR = /(?<=\s)struct\s*[^{}]+\{|(@\S+)\s*\n/
  REGEX_MODIFIER = /\s((@\S+)\s*\n)+/
  REGEX_STRUCT = /(?<=\s)struct\s*[^{}]+\{/

  transEtsCode (id: string, code: string) {
    code = this.transModifier(id, this.transStruct(id, code))

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
    code = code.replace(codeBufferStr, codeId)
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
        return codeId + '\n'
      })
    }
    if (isClear) {
      return code
    } else {
      return this.transModifier(id, code, count + 1)
    }
  }

  recoverEtsCode (id: string, code: string) {
    const bufferMap = this.codeBuffer[id]
    if (!bufferMap) return code

    for (const [codeId, codeBufferStr] of bufferMap) {
      code = code.replace(new RegExp(`${codeId};?`), codeBufferStr)
    }
    return code
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

export default function (): PluginOption {
  const helper = new EtsHelper()

  return {
    name: 'taro:vite-ets',
    enforce: 'pre',
    transform (code, id) {
      if (/\.ets(\?\S*)?$/.test(id)) {
        // FIXME 通过 acornInjectPlugins 注入 struct 语法编译插件
        return helper.transEtsCode(id, code)
      }
    },
    renderChunk (code, chunk, opts: any) {
      opts.__vite_skip_esbuild__ = true
      const id = chunk.facadeModuleId || chunk.fileName
      if (/\.ets(\?\S*)?$/.test(id)) {
        return helper.recoverEtsCode(id, code)
      }
    },
  }
}
