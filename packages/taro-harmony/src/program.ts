import * as path from 'path'
import { TaroPlatformBase } from '@tarojs/service'
import { META_TYPE, fs } from '@tarojs/helper'
import { ConcatSource } from 'webpack-sources'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@tarojs/plugin-platform-harmony'

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

  template = new Template()

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

    postcssConfig.pxtransform = {
      enable: false
    }

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
    this.ctx.onCompilerMake(({ compilation }) => {
      compilation.chunkTemplate.hooks.renderWithEntry.tap('TaroHarmony', (modules, chunk) => {
        if (chunk.entryModule) {
          const entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          const { miniType } = entryModule

          if (
            miniType === META_TYPE.ENTRY ||
            miniType === META_TYPE.PAGE ||
            (miniType === META_TYPE.STATIC && entryModule.name === 'container/index')
          ) {
            const origin: string = modules._value ? modules._value.toString() : modules.source()
            let editedOrigin = origin.replace(/\(globalThis/, 'var taroExport = (globalThis')
            editedOrigin = editedOrigin.replace(/var inst = (App|Page)\(/, '__webpack_exports__.default = (')

            const source = new ConcatSource()
            source.add(editedOrigin)
            source.add(';')
            source.add('\nexport default taroExport.default;')
            return source
          }
        }
      })
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
      assets[`container/index${styleExt}`] = {
        size: () => source.source().length,
        source: () => source.source()
      }

      // 不需要生成 json 配置文件
      miniPlugin.pages.forEach(page => {
        delete assets[`${page.name}${configExt}`]
      })
      delete assets[`app${configExt}`]

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
    })
  }

  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      chain.merge({
        externals: {
          '@system.app': 'commonjs @system.app',
          '@system.router': 'commonjs @system.router',
          '@ohos.data.storage': 'commonjs @ohos.data.storage',
          '@system.network': 'commonjs @system.network',
          '@ohos.deviceInfo': 'commonjs @ohos.deviceInfo',
          '@system.device': 'commonjs @system.device',
          '@ohos.display': 'commonjs @ohos.display',
          '@ohos.i18n': 'commonjs @ohos.i18n',
          '@system.brightness': 'commonjs @system.brightness',
          '@ohos.telephony.call': 'commonjs @ohos.telephony.call',
          '@ohos.pasteboard': 'commonjs @ohos.pasteboard',
          '@system.prompt': 'commonjs @system.prompt'
        }
      })
    })
  }
}
