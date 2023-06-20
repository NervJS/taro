import { fs, META_TYPE } from '@tarojs/helper'
import { TaroPlatformBase } from '@tarojs/service'
import path from 'path'
import { sources } from 'webpack'
import { ConcatSource, RawSource } from 'webpack-sources'

import { components } from '../components'
import { Template } from '../template'
import { isHarmonyRequest, modifyHarmonyConfig, modifyHostPackageDep, PACKAGE_NAME, PLUGIN_NAME } from '../utils'

const EXPORT_PREFIX = 'var __webpack_exports__ = '

export default class Harmony extends TaroPlatformBase {
  platform = 'harmony'
  globalObject = 'globalThis'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components/components-react`
  fileType = {
    templ: '.hml',
    style: '.css',
    config: '.json',
    script: '.js'
  }

  template = new Template() as any

  /**
   * 1. setupTransaction - init
   * 2. setup
   * 3. setupTransaction - close
   * 4. buildTransaction - init
   * 5. build
   * 6. buildTransaction - close
   */
  constructor (ctx, config) {
    super(ctx, config)

    this.addEntry()

    this.setupTransaction.addWrapper({
      close () {
        this.modifyComponents()
        this.modifyPostcssConfigs(config)
        this.modifyWebpackConfig()
      }
    })

    this.modifyTaroExport()
    this.modifyBuildAssets(ctx, config)
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    this.template.mergeComponents(this.ctx, components)
  }

  /**
   * 不需要转 rpx
   */
  modifyPostcssConfigs (config: Record<string, any>) {
    config.postcss ||= {}
    const postcssConfig = config.postcss

    postcssConfig.autoprefixer = {
      enable: false
    }
  }

  /**
   * 模板自定义组件 js
   * 等鸿蒙支持 template 后需要重构
   */
  addEntry () {
    this.ctx.onCompilerMake(async ({ compilation, plugin }) => {
      // container/index.hml
      const filePath = path.resolve(__dirname, 'template/container')
      plugin.addEntry(filePath, 'container/index', META_TYPE.STATIC)
      const dep = plugin.dependencies.get(filePath)
      await new Promise((resolve, reject) => {
        compilation.addEntry(plugin.options.sourceDir, dep, dep.name, err => err ? reject(err) : resolve(null))
      })
    })
  }

  /**
   * 把 app、pages、自定义组件的 js 改造为鸿蒙的 export default 导出形式
   */
  modifyTaroExport () {
    this.ctx.onCompilerMake(({ compilation, compiler }) => {
      const render = this.compiler === 'webpack5'
        ? compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render
        : compilation.chunkTemplate.hooks.renderWithEntry
      render.tap(PLUGIN_NAME, (modules, renderContext) => {
        const chunk = renderContext.chunk ?? renderContext // Webpack4 中 renderContext 实际为 chunk
        const chunkEntryModule = getChunkEntryModule(compilation, chunk, this.compiler)
        if (chunkEntryModule) {
          const entryModule = chunkEntryModule.rootModule ?? chunkEntryModule

          if (checkMetaType(entryModule)) {
            const origin: string = modules._value ? modules._value.toString() : modules.source()
            const editedOrigin = origin.replace(/\(globalThis/, 'var taroExport = (globalThis')

            const source = new ConcatSource()
            source.add(editedOrigin)
            source.add(';')
            source.add(`\nexport default taroExport ? taroExport.default${entryModule.miniType === META_TYPE.STATIC ? '' : '()'} : {};`)
            return source
          }
        }
        return modules
      })
      if (this.compiler === 'webpack5') {
        compilation.hooks.optimizeChunks.tap(PLUGIN_NAME, (chunks) => {
          for (const chunk of chunks) {
            const { chunkGraph, moduleGraph } = compilation
            const chunkEntryModule = getChunkEntryModule(compilation, chunk, this.compiler)
            if (chunkEntryModule) {
              const entryModule = chunkEntryModule.rootModule ?? chunkEntryModule
              const modulesIterable: Iterable<any> = chunkGraph.getOrderedChunkModulesIterable(chunk, compiler.webpack.util.comparators.compareModulesByIdentifier)

              if (checkMetaType(entryModule)) {
                for (const module of modulesIterable) {
                  const moduleUsedExports = moduleGraph.getUsedExports(module, chunk.runtime)
                  if (moduleUsedExports instanceof Set) {
                    if (module.identifier().includes(chunk.name)) {
                      const exportsInfo = moduleGraph.getExportsInfo(module)
                      const used = exportsInfo.getUsedName('default', chunk.runtime)
                      if (used) {
                        exportsInfo.setUsedWithoutInfo(chunk.runtime)
                      }
                    }
                  }
                }
              }
            }
          }
        })
        compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderChunk.tap(PLUGIN_NAME, (modules, renderContext) => {
          const chunk = renderContext.chunk ?? renderContext
          const chunkEntryModule = getChunkEntryModule(compilation, chunk, this.compiler)
          if (chunkEntryModule) {
            const entryModule = chunkEntryModule.rootModule ?? chunkEntryModule

            if (checkMetaType(entryModule)) {
              // @ts-ignore
              const origin: string = modules._value ? modules._value.toString() : modules.source()
              const editedOrigin = origin.replace(EXPORT_PREFIX, 'return ')

              const source = new ConcatSource() as sources.ConcatSource
              source.add(editedOrigin)
              return source
            }
          }
          return modules
        })
      }
    })
  }

  /**
   * 修改最终的编译产物
   * 1. 生成模板自定义组件的 xml、css 文件
   * 2. 删除多余的文件
   * 3. 把 components-harmony 中被使用到的组件移动到输出目录
   */
  modifyBuildAssets (ctx, config) {
    ctx.modifyBuildAssets(({ assets, miniPlugin }) => {
      const scriptExt = miniPlugin.options.fileType.script
      const templateExt = miniPlugin.options.fileType.templ
      const styleExt = miniPlugin.options.fileType.style
      const configExt = miniPlugin.options.fileType.config

      // 模板自定义组件 xml
      const base = `base${templateExt}`
      assets[`container/index${templateExt}`] = assets[base]
      delete assets[base]

      // 模板自定义组件 css
      const styles = Object.keys(assets).filter(key => key.endsWith(styleExt))
      const source = new ConcatSource()
      styles.forEach(file => {
        const re = path.relative('container', file)
        source.add(`@import '${re}';\n`)
      })
      assets[`container/index${styleExt}`] =
        this.compiler === 'webpack5'
          ? new RawSource(`${source.source()}`)
          : {
            size: () => source.source().length,
            source: () => source.source()
          }

      // 不需要生成 json 配置文件
      miniPlugin.pages.forEach(page => {
        delete assets[`${page.name}${configExt}`]
      })

      const appConfig = `app${configExt}`
      // 修改 harmony Hap 的配置文件 config.json，主要是注入路由配置
      const route = JSON.parse(assets[appConfig].source()).pages
      modifyHarmonyConfig(route, config.harmony)
      // 不需要生成 app.json
      delete assets[appConfig]

      // 不需要生成 custom-wrapper
      delete assets[`custom-wrapper${scriptExt}`]
      delete assets[`custom-wrapper${templateExt}`]
      delete assets[`custom-wrapper${configExt}`]

      // 其他冗余文件
      delete assets[`container/global${scriptExt}`]
    })

    // 把 components-harmony 中被使用到的组件移动到输出目录
    ctx.onBuildFinish(() => {
      const dest = path.resolve(process.cwd(), config.outputRoot)
      const compsSrcDir = path.join(__dirname, 'components-harmony')
      const compsDestDir = path.join(dest, 'container/components-harmony')

      fs.ensureDirSync(compsDestDir)
      ;[...this.template.usedNativeComps, 'navbar', 'tabbar', 'utils'].forEach(name => {
        const src = path.join(compsSrcDir, name)
        const dest = path.join(compsDestDir, name)
        fs.copy(src, dest)
      })

      modifyHostPackageDep(dest)
    })
  }

  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const externals = ({ request }, callback) => {
        // Note: 判断引用的依赖是否是 Harmony 全局注入的依赖，如果是则 Webpack 不需要处理，直接 external 掉
        if (isHarmonyRequest(request)) {
          return callback(null, 'commonjs ' + request)
        }
        callback()
      }
      chain.merge({
        externals: [
          this.compiler === 'webpack5'
            ? externals
            : (_context, request, callback) => externals({ request }, callback)
        ]
      })
      chain.plugin('miniPlugin')
        .tap(args => {
          args[0].loaderMeta.modifyInstantiate = function (origin) {
            return origin.replace(/var inst = (App|Page)\(([A-Za-z]+)\(/, 'export default ($2.bind(null, ')
          }
          return args
        })
    })
  }
}

function getChunkEntryModule (compilation, chunk, compiler = 'webpack4') {
  if (compiler === 'webpack5') {
    const chunkGraph = compilation.chunkGraph
    const entryModules = Array.from(chunkGraph.getChunkEntryModulesIterable(chunk))
    if (entryModules.length) {
      return entryModules[0]
    }
  } else {
    return chunk.entryModule
  }
}

function checkMetaType (entryModule) {
  const { miniType } = entryModule

  return miniType === META_TYPE.ENTRY ||
    miniType === META_TYPE.PAGE ||
    (miniType === META_TYPE.STATIC && entryModule.name === 'container/index')
}
