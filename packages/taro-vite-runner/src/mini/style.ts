import path from 'node:path'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { OutputAsset } from 'rollup'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  return {
    name: 'taro:vite-style',
    generateBundle (_opts, bundle) {
      if (viteCompilerContext) {
        const nativeStyleExt = viteCompilerContext.fileType.style
        const appStyleFileName = `app${nativeStyleExt}`
        const commonStyleChunks = viteCompilerContext.commonChunks.map(item => `${item}${nativeStyleExt}`)
        const commonStyleFileNames: string[] = []
        const styleAssetFileNames = new Map<string, Set<string>>()
        let appStyleChunk: OutputAsset | null = null

        for (const name in bundle) {
          const chunk = bundle[name]
          if (chunk.type === 'chunk') {
            const importedCss = chunk.viteMetadata?.importedCss
            if (importedCss && importedCss.size > 0) {
              for (const item of importedCss) {
                const chunkFileName = chunk.fileName
                const fileName = chunkFileName.replace(path.extname(chunkFileName), nativeStyleExt)
                const fileNames = styleAssetFileNames.get(item) || new Set<string>()
                fileNames.add(fileName)
                styleAssetFileNames.set(item, fileNames)

                if (commonStyleChunks.includes(path.basename(fileName)) && !commonStyleFileNames.includes(fileName)) {
                  commonStyleFileNames.push(fileName)
                }
              }
            }
          }
        }

        for (const [item, fileNames] of styleAssetFileNames) {
          const styleChunk = bundle[item] as OutputAsset
          const primaryFileName = fileNames.has(appStyleFileName) ? appStyleFileName : fileNames.values().next().value!
          styleChunk.fileName = primaryFileName

          for (const fileName of fileNames) {
            if (fileName !== primaryFileName) {
              this.emitFile({
                type: 'asset',
                fileName,
                source: styleChunk.source
              })
            }
          }

          if (primaryFileName === appStyleFileName) {
            appStyleChunk = styleChunk
          }
        }

        // 小程序全局样式文件中引入 common chunks 中的公共样式文件
        if (appStyleChunk) {
          const APP_STYLE_NAME = 'app-origin' + nativeStyleExt
          const sourceDir = viteCompilerContext.sourceDir
          this.emitFile({
            type: 'asset',
            fileName: APP_STYLE_NAME,
            source: appStyleChunk.source
          })
          appStyleChunk.source = commonStyleFileNames.reduce((prev, current) => {
            return prev + `@import "${path.relative(sourceDir, path.join(sourceDir, current))}";\n`
          }, `@import "${APP_STYLE_NAME}";\n`)
        }
        if (!appStyleChunk && commonStyleFileNames.length > 0) {
          const sourceDir = viteCompilerContext.sourceDir
          this.emitFile({
            type: 'asset',
            fileName: appStyleFileName,
            source: commonStyleFileNames
              .map((i) => `@import "${path.relative(sourceDir, path.join(sourceDir, i))}";`)
              .join('\n')
          })
        }
      }
    }
  }
}
