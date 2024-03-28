import type { PluginOption } from 'vite'

export default function (): PluginOption {
  let firstGenerate = true
  const files = new Set<string>()
  return {
    name: 'taro:rollup-watch-increment',
    watchChange(id, { event }) {
      if (firstGenerate) {
        firstGenerate = false
      }

      if (['create', 'update'].includes(event)) {
        files.add(id)
      }
    },
    generateBundle(_outputOpts, bundle) {
      if (firstGenerate || !this.meta.watchMode) return

      for (const chunk of Object.values(bundle)) {
        if (files.has(chunk.fileName)) continue
        if (chunk.type === 'chunk' && Object.keys(chunk.modules).some(id => files.has(id))) continue

        delete bundle[chunk.fileName]
      }

      files.clear()
    }
  }
}
