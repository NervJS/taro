import * as path from 'path'
import { TaroPlatformBase } from '@tarojs/service'
import { META_TYPE, fs, chalk } from '@tarojs/helper'
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

      this.modifyHostPackageDep(dest)
    })
  }

  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      chain.merge({
        externals: [
          function (_context, request, callback) {
            if (isHarmonyRequest(request)) {
              return callback(null, 'commonjs ' + request)
            }
            callback()
          }
        ]
      })
    })
  }

  async modifyHostPackageDep (dest) {
    const hmsDeps = {
      '@hmscore/hms-js-base': '^6.1.0-300',
      '@hmscore/hms-jsb-account': '^1.0.300'
    }
    const packageJsonFile = path.resolve(dest, '../../../../../package.json')

    const isExists = await fs.pathExists(packageJsonFile)
    if (!isExists) return

    const data = await fs.readFile(packageJsonFile)
    let packageJson = data.toString()

    packageJson = JSON.parse(packageJson)
    // @ts-ignore
    if (!packageJson.dependencies) {
      // @ts-ignore
      packageJson.dependencies = hmsDeps
    } else {
      for (const hmsDep in hmsDeps) {
        // @ts-ignore
        packageJson.dependencies[hmsDep] = hmsDeps[hmsDep]
      }
    }
    packageJson = JSON.stringify(packageJson)

    await fs.writeFile(packageJsonFile, packageJson)
  }
}

/**
 * 引用的依赖是否 Harmony 全局注入的依赖，如果是则 Webpack 不需要处理，直接 external 掉
 * @param request 引用的依赖
 */
function isHarmonyRequest (request: string): boolean {
  const systemReg = /^@system\./
  const ohosReg = /^@ohos\./
  const hmscoreReg = /^@hmscore\//
  if (systemReg.test(request) || ohosReg.test(request) || hmscoreReg.test(request)) {
    return true
  }
  return false
}

function modifyHarmonyConfig (route, { projectPath, hapName, jsFAName }) {
  const hapConfigPath = path.join(projectPath, hapName, 'src/main/config.json')
  fs.readJson(hapConfigPath)
    .then(config => {
      config.module.js ||= []
      const jsFAs = config.module.js
      const target = jsFAs.find(item => item.name === jsFAName)
      if (target) {
        if (JSON.stringify(target.pages) === JSON.stringify(route)) return
        target.pages = route
        target.window = {
          designWidth: 750,
          autoDesignWidth: false
        }
      } else {
        jsFAs.push({
          pages: route,
          name: jsFAName,
          window: {
            designWidth: 750,
            autoDesignWidth: false
          }
        })
      }
      return fs.writeJson(hapConfigPath, config, { spaces: 2 })
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(chalk.red('设置鸿蒙 Hap 配置失败：', err))
    })
}
