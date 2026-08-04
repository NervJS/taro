import * as path from 'node:path'

import { defaultMainFields, fs, isEmptyObject, NODE_MODULES, resolveSync } from '@tarojs/helper'

import { apiLoader, HARMONY_SCOPES, PACKAGE_NAME, parseRelativePath, PLATFORM_NAME } from '../utils'
import { TaroPlatformHarmony } from './harmony'

import type { IPluginContext, TConfig } from '@tarojs/service'
import type { ILoaderMeta } from '@tarojs/taro/types/compile/config/plugin'

const frameworkAlias = {
  solid: 'solid',
  vue3: 'vue3',
}

export default class Harmony extends TaroPlatformHarmony {
  platform = PLATFORM_NAME
  globalObject = 'globalThis'
  fileType = {
    templ: '.hml',
    style: '.css',
    config: '.json',
    script: '.js'
  }

  useETS = true
  useJSON5 = true
  runtimePath: string[] | string = []
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-harmony-ets`
  apiEntryList = [
    /(@tarojs[\\/]plugin-platform-harmony-ets|taro-platform-harmony)[\\/]dist[\\/]apis[\\/]index\.ts/,
  ]

  #defineConstants: Record<string, string> = {}

  constructor(ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    const that = this
    this.setupTransaction.addWrapper({
      close() {
        that.modifyViteConfig()
      },
    })

    ctx.onBuildFinish(() => {
      const outDir = path.resolve(process.cwd(), config.outputRoot)
      that.handleResourceEmit(outDir)
    })
  }

  get framework() {
    return this.ctx.initialConfig.framework || 'react'
  }

  get aliasFramework(): string {
    return frameworkAlias[this.framework] || 'react'
  }

  get apiLibrary() {
    return path.resolve(__dirname, './apis')
  }

  get apiEntry() {
    return this.apiEntryList
  }

  get componentLibrary() {
    return path.resolve(__dirname, './components-harmony-ets')
  }

  get runtimeLibrary() {
    return path.resolve(__dirname, './runtime-ets')
  }

  get runtimeFrameworkLibrary() {
    return path.resolve(__dirname, `./runtime-framework/${this.aliasFramework}`)
  }

  get defineConstants() {
    if (!isEmptyObject(this.#defineConstants)) {
      return this.#defineConstants
    }

    this.config.env ||= {}
    this.config.defineConstants ||= {}
    this.#defineConstants = {
      ...this.config.defineConstants,
    }
    const env = [...Object.entries(this.config.env), ...Object.entries(process.env)]

    env.forEach(([key, value]) => {
      this.#defineConstants[`process.env.${key}`] = JSON.stringify(value)
    })

    return this.#defineConstants
  }

  extensions = ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs', '.mts', '.vue', '.ets', '.d.ts']

  excludeLibraries: (string | RegExp)[] = []

  externalDeps: [string, RegExp, string?][] = [
    ['@tarojs/components/types', /^@tarojs[\\/]components[\\/]types/],
    ['@tarojs/components', /^@tarojs[\\/]components([\\/].+)?$/, this.componentLibrary],
    ['@tarojs/react', /^@tarojs[\\/]react$/],
    ['@tarojs/runtime', /^@tarojs[\\/]runtime([\\/]ets[\\/].*)?$/, this.runtimeLibrary],
    ['@tarojs/taro/types', /^@tarojs[\\/]taro[\\/]types/],
    ['@tarojs/taro', /^@tarojs[\\/]taro$/, this.apiLibrary],
    ['@tarojs/plugin-framework-react/dist/runtime', /^@tarojs[\\/]plugin-framework-react[\\/]dist[\\/]runtime$/, this.runtimeFrameworkLibrary],
    ['react', /^react$|react[\\/]cjs/],
    ['react/jsx-runtime', /^react[\\/]jsx-runtime$/], // Note: React 环境下自动注入，避免重复
  ]

  harmonyScope = [...HARMONY_SCOPES]

  indexOfLibraries(lib: string) {
    return this.externalDeps.findIndex(([_, rgx]) => rgx.test(lib))
  }

  removeFromLibraries(lib: string) {
    const index = this.indexOfLibraries(lib)
    if (index > -1) {
      this.externalDeps.splice(index, 1)
    }
  }

  moveLibraries(lib: string, target = '', basedir = this.ctx.paths.appPath, sync = false) {
    if (!lib) return
    if (this.excludeLibraries.some(e => typeof e === 'string' ? e === lib : e.test(lib))) return

    const { outputRoot, chorePackagePrefix } = this.ctx.runOpts.config
    if (sync) {
      const targetPath = path.join(outputRoot, NODE_MODULES)
      // FIXME 不支持 alias 配置
      const libName = lib
      lib = resolveSync(lib, {
        basedir,
        extensions: this.extensions,
        mainFields: ['unpkg', ...defaultMainFields],
        preserveSymlinks: false,
      }) || ''
      // Note: 跳过 node 相关或未能找到的依赖
      if (!lib || !path.isAbsolute(lib)) {
        return this.removeFromLibraries(libName)
      }
      let ext = path.extname(lib)
      const libDir = lib.replace(/.*[\\/]node_modules[\\/]/, '')
      const basename = path.basename(lib, ext)
      if (['.cjs', '.mjs'].includes(ext)) {
        ext = '.js'
      } else if (ext === '.mts') {
        ext = '.ts'
      }

      if (ext === '.js') {
        let typeName = `@types/${libName.replace('@', '').replace(/\//g, '__')}`
        let typePath = resolveSync(typeName, {
          basedir,
          extensions: this.extensions,
          mainFields: [...defaultMainFields],
          preserveSymlinks: false,
        })
        if (!typePath) {
          typeName = path.join(path.dirname(lib), `${basename}.d.ts`)
          typePath = resolveSync(typeName, {
            basedir,
            extensions: this.extensions,
            mainFields: [...defaultMainFields],
            preserveSymlinks: false,
          })
        }
        if (typePath) {
          this.moveLibraries(
            typePath,
            path.extname(target)
              ? path.join(path.dirname(target), `${basename}.d.ts`)
              : path.join(target, `index.d.ts`),
            basedir
          )
        }
      }

      if (ext) {
        const code = fs.readFileSync(lib, { encoding: 'utf8' })
        if (
          (/(?:import\s|from\s|require\()['"]([\\/.][^'"\s]+)['"]\)?/g.test(code) ||
          /\/{3}\s<reference\spath=['"][^'"\s]+['"]\s\/>/g.test(code)) &&
          `${libName}${path.extname(libDir)}` !== libDir
        ) {
          // Note: 文件包含包内引用的依赖
          const pkgPath = path.relative(libName, libDir)
          if (new RegExp(`^index(${this.extensions.map(e => e.replace('.', '\\.')).join('|')})$`).test(pkgPath)) {
            // Note: 入口为 index 场景
            lib = path.dirname(lib)
          } else if (!/[\\/]/.test(pkgPath)) {
            // FIXME: 非 index 入口文件场景，可能存在入口文件引用 index 但该文件被覆盖的情况，需要额外处理
            const isDTS = /\.d\.ts$/.test(target)
            target = path.join(target, `index${isDTS ? '.d.ts' : ext}`)
          } else {
            // FIXME 多级目录，可能存在入口不为 index 或者引用一级目录文件的情况，需要额外处理
            const dir = path.dirname(pkgPath)
            if (libDir.includes(NODE_MODULES)) {
              target = path.join(target, dir)
            }
            lib = path.dirname(lib)
          }
        } else if (path.isAbsolute(libDir)) {
          // Note: 本地 link 的依赖
          const isDTS = /\.d\.ts$/.test(target)
          target = path.extname(target)
            ? path.join(path.dirname(target), `${basename}${ext}`)
            : path.join(target, `index${isDTS ? '.d.ts' : ext}`)
        } else {
          const libPath = path.relative(targetPath, target)
          if (libDir !== libPath) {
            if (path.relative(libPath, libDir).startsWith('.')) {
              target = path.join(targetPath, libDir)
            } else {
              target = path.join(targetPath, libName, `index${ext}`)
            }
          }
        }
      }
    }

    const stat = fs.lstatSync(lib)
    if (stat.isDirectory()) {
      const files = fs.readdirSync(lib)
      files.forEach((file) => {
        if (![NODE_MODULES].includes(file)) {
          this.moveLibraries(path.join(lib, file), path.join(target, file))
        }
      })
    } else if (stat.isFile()) {
      let code = fs.readFileSync(lib, { encoding: 'utf8' })
      if (this.apiEntry.some(e => e.test(lib))) {
        code = apiLoader(code)
      }
      if (this.extensions.includes(path.extname(lib))) {
        // Note: 移除 onpm 不能装载的类型，新版本会导致 ets-loader 抛出 resolvedFileName 异常
        code = code.replace(/\/{3}\s*<reference\s+types=['"]([^'"\s]+)['"]\s*\/>\n*/g, '')
        // Note: 查询 externals 内的依赖，并将它们添加到 externalDeps 中
        code = code.replace(/(?:import\s|from\s|require\()['"]([^\\/.][^'"\s]+)['"]\)?/g, (src, p1 = '') => {
          if (p1.startsWith('node:') || p1.endsWith('.so')) return src

          const { outputRoot } = this.ctx.runOpts.config
          const targetPath = path.join(outputRoot, NODE_MODULES, p1)
          const relativePath = parseRelativePath(path.dirname(target), targetPath)
          if (this.harmonyScope.every(e => !e.test(p1))) {
            if (this.indexOfLibraries(p1) === -1 && !/\.(d\.ts|flow\.js)$/.test(lib)) {
              this.externalDeps.push([p1, new RegExp(`^${p1.replace(/([-\\/$])/g, '\\$1')}$`)])
              this.moveLibraries(p1, targetPath, path.dirname(lib), true)
            }
            return src.replace(p1, relativePath.replace(new RegExp(`\\b${NODE_MODULES}\\b`), 'npm'))
          }

          return src
        })

        const define: Record<string, string> = {
          ...this.defineConstants,
          // Note: React 开发环境可能调用 stack 可能导致 appWrapper 实例变更
          'ReactDebugCurrentFrame.getCurrentStack': 'ReactDebugCurrentFrame.getCurrentStack$',
        }
        if ([/(@tarojs[\\/]runtime|taro-runtime)[\\/]dist/].some(e => e.test(lib))) {
          define.global = 'globalThis'
        }
        const ext = path.extname(target)
        if (![/\.d\.e?tsx?$/, /\.(json|map|md)$/].some(e => e.test(target))) {
          code = this.replaceDefineValue(code, define, ext)
        }
        if (['.ts'].includes(ext)) {
          code = '// @ts-nocheck\n' + code
        }

        // 处理嵌套样式的编译，需要针对ReactElement进行props操作，dev模式下会Object.freeze，所以需要在开发模式下注入Object.freeze来覆盖解锁
        // 处理的方法再taro-platform-harmony/src/runtime-ets/dom/cssNesting: ele.props.style = declaration
        if (/react\/jsx-runtime/.test(lib) && process.env.NODE_ENV === 'development') {
          code = 'Object.freeze = (obj) => obj \n' + code
        }
      }

      // Note: 传入 chorePackagePrefix 时，不生成核心依赖库
      if (!chorePackagePrefix) {
        if (/tarojs[\\/]taro[\\/]types[\\/]index.d.ts/.test(target)) {
          code = `import './global.d.ts'

import './taro.api.d.ts'
import './taro.component.d.ts'
import './taro.config.d.ts'
import './taro.lifecycle.d.ts'

export = Taro
export as namespace Taro

declare const Taro: Taro.TaroStatic

declare namespace Taro {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TaroStatic {}
}
declare global {
  const defineAppConfig: (config: Taro.Config) => Taro.Config
  const definePageConfig: (config: Taro.Config) => Taro.Config
}`
        }
        try {
          const targetPath = target.replace(new RegExp(`\\b${NODE_MODULES}\\b`), 'npm')
          fs.ensureDirSync(path.dirname(targetPath))
          fs.writeFileSync(targetPath, code)
        } catch (e) {
          console.error(`[taro-arkts] inject ${lib} to ${target} failed`, e)
        }
      }
    } else if (stat.isSymbolicLink()) {
      const realPath = fs.realpathSync(lib, { encoding: 'utf8' })
      this.moveLibraries(realPath, target, basedir)
    }
  }

  replaceDefineValue (code: string, define: Record<string, string>, ext = '.js') {
    Object.keys(define).forEach(key => {
      let value = define[key]
      if (/^['"`].*['"`]$/.test(value) && ['.ts', '.tsx', '.ets'].includes(ext)) {
        value = `(${value} as string)`
      }
      code = code.replace(new RegExp(`\\b${key}\\b`, 'g'), value)
    })
    return code
  }

  /**
   * 修改 Vite 配置
   */
  modifyViteConfig() {
    const that = this
    const { appPath } = that.ctx.paths
    const { config } = that.ctx.runOpts
    const { outputRoot, ohPackage = {}, chorePackagePrefix } = config

    if (!that.framework.includes('vue')) {
      that.excludeLibraries.push(/\bvue\b/)
    }
    // @ts-ignore
    if (that.framework === 'solid') {
      that.externalDeps.push([
        '@tarojs/plugin-framework-solid/dist/reconciler',
        /^@tarojs\/plugin-framework-solid\/dist\/reconciler$/,
        path.join(this.runtimeFrameworkLibrary, 'reconciler')
      ])
      that.externalDeps.push([
        'solid-js/universal',
        /^solid-js\/universal$/,
      ])
    }

    const chorePkgRgx = new RegExp(`^${(chorePackagePrefix || '').replace(/[\\/]+/g, '[\\\\/]+').replace(/[-^$*?.|]/g, '\\$&')}`)
    const externals = Object.keys(ohPackage.dependencies || []).concat(Object.keys(ohPackage.devDependencies || []))
    function modifyResolveId({ source = '', name = 'modifyResolveId' }: Parameters<Exclude<ILoaderMeta['modifyResolveId'], undefined>>[0]) {
      if (externals.includes(source) || (chorePackagePrefix && chorePkgRgx.test(source))) {
        return {
          external: true,
          id: source,
          resolvedBy: name,
        }
      } else if (source.includes('css_variables')) {
        return {
          external: true,
          id: path.join(outputRoot, 'css_variables'),
          moduleSideEffects: 'no-treeshake',
          resolvedBy: name,
        }
      }

      if (chorePackagePrefix && that.indexOfLibraries(source) > -1) {
        return {
          external: true,
          id: path.join(chorePackagePrefix, source),
          resolvedBy: name,
        }
      }

      // Note: 映射 Taro 相关依赖到注入 taro 目录
      if (that.indexOfLibraries(source) > -1) {
        return {
          external: 'relative',
          id: path.join(outputRoot, 'npm', source),
          moduleSideEffects: false,
          resolvedBy: name,
        }
      }
    }

    that.ctx.modifyViteConfig?.(({ viteConfig }) => {
      function externalPlugin() {
        const name = 'taro:vite-harmony-external'
        return {
          name,
          enforce: 'pre',
          resolveId (source = '', importer = '', options: any = {}) {
            return modifyResolveId({
              source,
              importer,
              options,
              name,
              resolve: this.resolve,
            })
          },
        }
      }
      function injectLoaderMeta() {
        return {
          name: 'taro:vite-loader-meta',
          async buildStart () {
            const { getViteHarmonyCompilerContext } = that.ctx.runnerUtils
            const compiler = await getViteHarmonyCompilerContext(this)
            if (compiler) {
              switch (that.framework) {
                // @ts-ignore
                case 'solid':
                  compiler.loaderMeta ||= {}
                  compiler.loaderMeta.importFrameworkStatement = ``
                  compiler.loaderMeta.mockAppStatement = `
function App(props) {
  return null
}
`
                  compiler.loaderMeta.frameworkArgs = `config`
                  compiler.loaderMeta.creator = `createSolidApp`
                  compiler.loaderMeta.importFrameworkName = ''
                  break
              }
              compiler.loaderMeta.modifyResolveId = modifyResolveId
            }
          },
        }
      }

      const targetPath = path.join(outputRoot, NODE_MODULES)
      // Note: 注入 Taro 相关依赖
      this.externalDeps.forEach(([libName, _, target]) => {
        this.moveLibraries(target || libName, path.resolve(targetPath, libName), appPath, !target)
      })
      viteConfig.plugins.push(externalPlugin(), injectLoaderMeta())
    })
  }

  handleResourceEmit(outDir: string, basedir = this.ctx.paths.appPath) {
    const resources = path.resolve(outDir, '..', 'resources')
    const mediaPath = 'static/media'
    const mediaSource = resolveSync(`${PACKAGE_NAME}/${mediaPath}`, {
      basedir,
      extensions: this.extensions,
      mainFields: [...defaultMainFields],
      preserveSymlinks: false,
      isFile: (file: string) => {
        try {
          const stat = fs.lstatSync(file)
          return stat.isFile() || (file.endsWith(mediaPath.replace('/', path.sep)) && stat.isDirectory())
        } catch (_) {} // eslint-disable-line no-empty
        return false
      }
    })

    if (mediaSource) {
      this.moveLibraries(mediaSource, path.join(resources, 'base/media'), basedir)
    }
  }
}
