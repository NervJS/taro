import type { PluginOption } from 'vite'

export default function (): PluginOption {
  function transformStruct (code: string, position = 0) {
    // Note 基于 acorn 将 ETS struct 与装饰器转换为字符串
    const searchStr = code.slice(position)
    const startIndex = searchStr.search(/(@.+\s*)*\s*struct\s*.+\{/ig)
    if (startIndex === -1) return code

    let endIndex = searchStr.indexOf('}', startIndex)
    let restFloor = 1
    if (endIndex === -1) {
      throw new Error('ETS struct 缺少 }')
    } else {
      let i = searchStr.indexOf('{', startIndex)
      while (restFloor > 0) {
        const j = searchStr.slice(i + 1).search(/[{}]/)
        if (i === -1 || j === -1) {
          throw new Error('ETS struct 缺少 }')
        }
        i += j + 1
        searchStr[i] === '{' ? restFloor++ : restFloor--
      }
      endIndex = i
    }
    code = transformStruct(code, endIndex + 1)
    return code.replace(
      searchStr.substring(startIndex, endIndex + 1),
      str => `createEtsStruct(\`${str.replace(/`/g, '\\`')}\`)`
    )
  }

  return {
    name: 'taro:vite-ets',
    enforce: 'pre',
    transform (code, id) {
      if (/\.ets(\?\S*)?$/.test(id)) {
        // FIXME 通过 acornInjectPlugins 注入 struct 语法编译插件
        return transformStruct(code)
      }
    },
    renderChunk (code, chunk, opts: any) {
      opts.__vite_skip_esbuild__ = true
      const id = chunk.fileName
      if (/\.ets(\?\S*)?$/.test(id)) {
        return code.replace('createEtsStruct(`', '').replace('`)', '')
      }
    },
  }
}
