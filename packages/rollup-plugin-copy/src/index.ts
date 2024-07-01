import path from 'node:path'

import { fs } from '@tarojs/helper'

const cwd = process.cwd()

interface ITarget {
  readonly src: string
  readonly dest: string
}

interface IOptions {
  hook?: string
  targets?: ITarget[]
}

export default function handleRollupCopy ({
  targets = [],
  hook = 'buildEnd',
}: IOptions) {
  // Note: 因为 rollup 的 watch 模式下，hook 会被多次调用，所以这里需要做一个标记
  let hasWatched = false
  const isWatchMode = process.argv.includes('-w') || process.argv.includes('--watch')
  return {
    name: 'rollup-plugin:taro-copy',
    async [hook] () {
      if (hasWatched) return

      for (const item of targets) {
        try {
          let src = item.src
          let dest = item.dest
          const { base, dir } = path.parse(src)
          dest = !dir ? dest : path.join(dest, base)

          src = path.join(cwd, src)
          dest = path.join(cwd, dest)
          if (path.extname(src)) {
            fs.ensureDirSync(path.dirname(dest))
          } else {
            fs.ensureDirSync(dest)
          }

          const stat = fs.statSync(src)
          if (stat.isDirectory()) {
            fs.copySync(src, dest, { recursive: true })
            isWatchMode && fs.watch(src, { recursive: true }, (_event, filename) => {
              if (!filename) return
              fs.copyFileSync(path.join(src, filename), path.join(dest, filename))
            })
          } else if (stat.isFile()) {
            fs.copyFileSync(src, dest)
            isWatchMode && fs.watchFile(src, () => {
              fs.copyFileSync(path.join(src), dest)
            })
          }
        } catch (error) {
          console.error(error)
        }
      }

      hasWatched = true
    }
  }
}
