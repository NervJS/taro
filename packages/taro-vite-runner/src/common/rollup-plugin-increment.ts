import { isFunction } from '@tarojs/shared'

import type { PluginOption } from 'vite'

interface IOption {
  comparisonId?: (id: string, watchFiles: Set<string>) => boolean
  force?: boolean | ((id: string) => boolean)
  // 每次编译时需要保留更新的文件
  include?: (string | RegExp)[]
}

export default function ({ include = [], comparisonId, force = false }: IOption = {}): PluginOption {
  let firstGenerate = true
  const files = new Set<string>()
  return {
    name: 'taro:rollup-watch-increment',
    watchChange(id, { event }) {
      if (isFunction(force) && force(id) === true) {
        firstGenerate = true
      } else if (firstGenerate) {
        firstGenerate = false
      }

      if (['create', 'update'].includes(event)) {
        files.add(id)
      }
    },
    generateBundle(_outputOpts, bundle) {
      if (firstGenerate || !this.meta.watchMode || force === true) return

      const chunks = Object.values(bundle)
      for (const chunk of chunks) {
        if (files.has(chunk.fileName)) continue
        if (include.some(f => {
          if (typeof f === 'string') return chunk.fileName === f
          else return f.test(chunk.fileName)
        })) {
          files.add(chunk.fileName)
        } else if (chunk.type === 'chunk') {
          const moduleIds = Object.keys(chunk.modules)
          if (moduleIds.some(id => files.has(id) || (isFunction(comparisonId) && comparisonId(id, files)))) {
            files.add(chunk.fileName)
            files.add(`${chunk.fileName}.map`)
          }
        }
      }

      chunks.forEach(chunk => {
        if (!files.has(chunk.fileName)) {
          delete bundle[chunk.fileName]
        }
      })

      files.clear()
    }
  }
}
