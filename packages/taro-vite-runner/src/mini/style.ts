import path from 'path'

import type { OutputAsset } from 'rollup'
import type { TaroCompiler } from 'src/utils/compiler/mini'
import type { PluginOption } from 'vite'

export default function (compiler: TaroCompiler): PluginOption {
  return {
    name: 'taro:vite-style',
    generateBundle (_opts, bundle) {
      if (compiler) {
        const nativeStyleExt = compiler.fileType.style
        const appStyleFileName = `app${nativeStyleExt}`
        const commonStyleChunks = compiler.commonChunks.map(item => `${item}${nativeStyleExt}`)
        const commonStyleFileNames: string[] = []
        let appStyleChunk: OutputAsset | null = null

        for (const name in bundle) {
          const chunk = bundle[name]
          if (chunk.type === 'chunk') {
            const importedCss = chunk.viteMetadata?.importedCss
            if (importedCss && importedCss.size > 0) {
              for (const item of importedCss) {
                const chunkFileName = chunk.fileName
                const fileName = chunkFileName.replace(path.extname(chunkFileName), nativeStyleExt)
                bundle[item].fileName = fileName
                if (fileName === appStyleFileName) {
                  appStyleChunk = bundle[item] as OutputAsset
                } else if (commonStyleChunks.includes(path.basename(fileName))) {
                  commonStyleFileNames.push(fileName)
                }
              }
            }
          }
        }

        // 小程序全局样式文件中引入 common chunks 中的公共样式文件
        if (appStyleChunk) {
          const APP_STYLE_NAME = 'app-origin' + nativeStyleExt
          const sourceDir = compiler.sourceDir
          this.emitFile({
            type: 'asset',
            fileName: APP_STYLE_NAME,
            source: appStyleChunk.source
          })
          appStyleChunk.source = commonStyleFileNames.reduce((prev, current) => {
            return prev + `@import "${path.relative(sourceDir, path.join(sourceDir, current))}";\n`
          }, `@import "${APP_STYLE_NAME}";\n`)
        }
      }
    }
  }
}
