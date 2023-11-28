import { defaultMainFields, fs, isEmptyObject, NODE_MODULES, resolveSync } from '@tarojs/helper'
import { VITE_COMPILER_LABEL } from '@tarojs/runner-utils'
import { isFunction } from '@tarojs/shared'
import * as path from 'path'

import { HARMONY_SCOPES, PACKAGE_NAME, PLATFORM_NAME } from '../utils'
import { TaroPlatformHarmony } from './harmony'

import type { IPluginContext, TConfig } from '@tarojs/service'

const frameworkAlias = {
  solid: 'solid',
  vue: 'vue2',
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

  #defineConstants: Record<string, string> = {}

  constructor(ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close() {
        this.modifyViteConfig()
      },
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

    const { config } = this.ctx.runOpts
    const runtime = config.runtime || {}
    // FIXME 小程序运行时包含的变量，后续需要从鸿蒙运行时中排除
    const runtimeConstants = {
      ENABLE_INNER_HTML: runtime.enableInnerHTML ?? true,
      ENABLE_ADJACENT_HTML: runtime.enableAdjacentHTML ?? false,
      ENABLE_SIZE_APIS: runtime.enableSizeAPIs ?? false,
      ENABLE_TEMPLATE_CONTENT: runtime.enableTemplateContent ?? false,
      ENABLE_CLONE_NODE: runtime.enableCloneNode ?? false,
      ENABLE_CONTAINS: runtime.enableContains ?? false,
      ENABLE_MUTATION_OBSERVER: runtime.enableMutationObserver ?? false,
    }

    this.config.env ||= {}
    this.config.defineConstants ||= {}
    this.#defineConstants = {
      ...runtimeConstants,
      ...this.config.defineConstants,
    }
    const env = [...Object.entries(this.config.env), ...Object.entries(process.env)]
    env.forEach(([key, value]) => {
      this.#defineConstants[`process.env.${key}`] = JSON.stringify(value)
    })
  }

  externalDeps: [string, RegExp, string?][] = [
    ['@tarojs/components/types', /^@tarojs[\\/]components[\\/]types/],
    ['@tarojs/components', /^@tarojs[\\/]components([\\/].+)?$/, this.componentLibrary],
    ['@tarojs/react', /^@tarojs[\\/]react$/],
    ['@tarojs/runtime', /^@tarojs[\\/]runtime$/, this.runtimeLibrary],
    ['@tarojs/taro', /^@tarojs[\\/]taro$/, this.apiLibrary],
    ['@tarojs/plugin-framework-react/dist/runtime', /^@tarojs[\\/]plugin-framework-react[\\/]dist[\\/]runtime$/, this.runtimeFrameworkLibrary],
    ['react', /^react$|react[\\/]cjs/],
    ['react/jsx-runtime', /^react[\\/]jsx-runtime$/], // Note: React 环境下自动注入，避免重复
  ]

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

    if (sync) {
      // FIXME 不支持 alias 配置
      const libName = lib
      lib = resolveSync(lib, {
        basedir,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs', '.mts', '.vue', '.ets', '.d.ts'],
        mainFields: ['unpkg', ...defaultMainFields],
        preserveSymlinks: false,
      }) || ''
      // Note: 跳过 node 相关或未能找到的依赖
      if (!lib || /^[^/]/.test(lib)) {
        return this.removeFromLibraries(libName)
      }
      let ext = path.extname(lib)
      const basename = path.basename(lib, ext)
      if (['.cjs', '.mjs'].includes(ext)) {
        ext = '.js'
      } else if (ext === '.mts') {
        ext = '.ts'
      }
      if (basename === 'index' || basename === 'index.d') {
        lib = path.dirname(lib)
        if (ext === '.js') {
          const typeName = `@types/${libName.replace('@', '').replace(/\//g, '__')}`
          const typePath = resolveSync(typeName, {
            basedir,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs', '.mts', '.vue', '.ets', '.d.ts'],
            mainFields: [...defaultMainFields],
          })
          if (typePath) {
            this.moveLibraries(typePath, path.join(target, 'index.d.ts'), basedir)
          }
        }
      } else if (basename === path.basename(target, ext)) {
        target = path.join(path.dirname(target), `${basename}${ext}`)
        if (ext === '.js') {
          const typeName = path.join(path.dirname(lib), `${basename}.d.ts`)
          const typePath = resolveSync(typeName, {
            basedir,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs', '.mts', '.vue', '.ets', '.d.ts'],
            mainFields: [...defaultMainFields],
          })
          if (typePath) {
            this.moveLibraries(
              typePath,
              path.join(path.dirname(target), `${basename}.d.ts`),
              basedir
            )
          }
        }
      } else {
        target = path.join(target, `index${ext}`)
      }
    }

    const stat = fs.lstatSync(lib)
    if (stat.isDirectory()) {
      const files = fs.readdirSync(lib)
      files.forEach((file) => {
        this.moveLibraries(path.join(lib, file), path.join(target, file))
      })
    } else if (stat.isFile()) {
      let code = fs.readFileSync(lib, { encoding: 'utf8' })
      code = code.replace(/(?:import\s|from\s|require\()['"]([^.][^'"\s]+)['"]\)?/g, (src, p1) => {
        const { outputRoot } = this.ctx.runOpts.config
        const targetPath = path.join(outputRoot, NODE_MODULES, p1)
        let relativePath = path.relative(path.dirname(target), targetPath)
        relativePath = /^\.{1,2}[\\/]/.test(relativePath)
          ? relativePath
          : /^\.{1,2}$/.test(relativePath)
            ? `${relativePath}/`
            : `./${relativePath}`
        if (HARMONY_SCOPES.every(e => !e.test(p1))) {
          if (this.indexOfLibraries(p1) === -1) {
            this.externalDeps.push([p1, new RegExp(`^${p1.replace(/([-\\/$])/g, '\\$1')}$`)])
            this.moveLibraries(p1, targetPath, path.dirname(lib), true)
          }
          return src.replace(p1, relativePath.replace(new RegExp(`\\b${NODE_MODULES}\\b`), 'npm'))
        }

        return src
      })

      const define = {
        ...this.defineConstants
      }
      if ([/(@tarojs[\\/]runtime|taro-runtime)[\\/]dist/].some(e => e.test(lib))) {
        define.global = 'globalThis'
      }
      code = this.replaceDefineValue(code, define)
      const ext = path.extname(target)
      if (['.ts', '.ets'].includes(ext)) {
        code = '// @ts-nocheck\n' + code
      }
      fs.ensureDirSync(path.dirname(target.replace(new RegExp(`\\b${NODE_MODULES}\\b`), 'npm')))
      fs.writeFileSync(target.replace(new RegExp(`\\b${NODE_MODULES}\\b`), 'npm'), code)
    } else if (stat.isSymbolicLink()) {
      const realPath = fs.realpathSync(lib, { encoding: 'utf8' })
      this.moveLibraries(realPath, target, basedir)
    }
  }

  replaceDefineValue (code: string, define: Record<string, string>) {
    Object.keys(define).forEach(key => {
      code = code.replace(new RegExp(`\\b${key}\\b`, 'g'), define[key])
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
    const { outputRoot } = config

    // @ts-ignore
    if (that.framework === 'solid') {
      that.externalDeps.push([
        '@tarojs/plugin-framework-react/dist/runtime/reconciler',
        /^@tarojs\/plugin-framework-react\/dist\/runtime\/reconciler$/,
        path.join(this.runtimeFrameworkLibrary, 'reconciler')
      ])
      that.externalDeps.push([
        'solid-js/universal',
        /^solid-js\/universal$/,
      ])
    }

    function modifyResolveId({
      source = '', importer = '', options = {}, name = 'modifyResolveId', resolve
    }) {
      if (isFunction(resolve)) {
        if (source === that.runtimePath || that.runtimePath.includes(source)) {
          return resolve('@tarojs/runtime', importer, options)
        }
      }

      // Note: 映射 Taro 相关依赖到注入 taro 目录
      if (that.indexOfLibraries(source) > -1) {
        return {
          external: 'resolve',
          id: path.join(outputRoot, 'npm', source),
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
          name: 'taro:vite-h5-loader-meta',
          async buildStart () {
            await this.load({ id: VITE_COMPILER_LABEL })
            const info = this.getModuleInfo(VITE_COMPILER_LABEL)
            const compiler = info?.meta.viteCompilerContext
            if (compiler) {
              switch (that.framework) {
                // @ts-ignore
                case 'solid':
                  compiler.loaderMeta ||= {}
                  compiler.loaderMeta.importFrameworkStatement = ``
                  compiler.mockAppStatement = `
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
}
