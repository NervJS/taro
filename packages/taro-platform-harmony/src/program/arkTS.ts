import { defaultMainFields, fs, NODE_MODULES, resolveSync } from '@tarojs/helper'
import * as path from 'path'

import { HARMONY_SCOPES, PACKAGE_NAME, PLATFORM_NAME } from '../utils'
import { TaroPlatformHarmony } from './harmony'

import type { IPluginContext, TConfig } from '@tarojs/service'

export default class Harmony extends TaroPlatformHarmony {
  platform = PLATFORM_NAME
  globalObject = 'globalThis'
  fileType = {
    templ: '.hml',
    style: '.css',
    config: '.json',
    script: '.ets'
  }

  useETS = true
  useJSON5 = true
  runtimePath: string[] | string = `${PACKAGE_NAME}/dist/runtime-ets`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-harmony-ets`

  constructor(ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close() {
        this.modifyViteConfig()
      },
    })
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
    return path.resolve(__dirname, './runtime-framework/react')
  }

  externalDeps: [string, RegExp, string?][] = [
    ['@tarojs/components', /^@tarojs\/components/, this.componentLibrary],
    ['@tarojs/react', /^@tarojs\/react$/],
    ['@tarojs/runtime', /^@tarojs\/runtime$/, this.runtimeLibrary],
    ['@tarojs/taro', /^@tarojs\/taro$/, this.apiLibrary],
    ['@tarojs/plugin-framework-react/dist/runtime', /^@tarojs\/plugin-framework-react\/dist\/runtime$/, this.runtimeFrameworkLibrary],
    ['react', /^react$/],
    ['react/jsx-runtime', /^react\/jsx-runtime$/], // Note: React 环境下自动注入，避免重复
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
        mainFields: [...defaultMainFields],
      }) || ''
      // Note: 跳过 node 相关或未能找到的依赖
      if (!lib || /^[^/]/.test(lib)) {
        return this.removeFromLibraries(libName)
      }
      const ext = path.extname(lib)
      const basename = path.basename(lib, ext)
      if (basename === 'index') {
        lib = path.dirname(lib)
        if (ext === '.js') {
          const typeName = `@types/${libName.replace('@', '').replace(/\//g, '__')}`
          const typePath = resolveSync(typeName, {
            basedir,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.vue', '.ets', '.d.ts'],
            mainFields: [...defaultMainFields],
          })
          if (typePath) {
            this.moveLibraries(typePath, path.join(target, 'index.d.ts'), basedir)
          }
        }
      } else if (basename === path.basename(target, ext)) {
        target = path.join(path.dirname(target), `${basename}${ext}`)
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
          return src.replace(p1, relativePath)
        }

        return src
      })
      const define = {}
      // FIXME 临时方案，后续考虑获取配置 define、env 配置
      Object.keys(process.env).forEach(key => {
        define[`process.env.${key}`] = JSON.stringify(process.env[key])
      })
      code = this.replaceDefineValue(code, define)
      const ext = path.extname(target)
      if (['.ts', '.ets'].includes(ext)) {
        code = '// @ts-nocheck\n' + code
      }
      fs.ensureDirSync(path.dirname(target))
      fs.writeFileSync(target, code)
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

    that.ctx.modifyViteConfig?.(({ viteConfig }) => {
      function externalPlugin() {
        const name = 'taro:vite-harmony-external'
        return {
          name,
          enforce: 'pre',
          resolveId (source = '', importer = '', options: any = {}) {
            if (source === that.runtimePath) {
              return this.resolve('@tarojs/runtime', importer, options)
            }

            // Note: 映射 Taro 相关依赖到注入 taro 目录
            if (that.indexOfLibraries(source) > -1) {
              return {
                external: 'resolve',
                id: path.join(outputRoot, NODE_MODULES, source),
                resolvedBy: name,
              }
            }
          },
        }
      }

      const targetPath = path.join(outputRoot, NODE_MODULES)
      // Note: 注入 Taro 相关依赖
      this.externalDeps.forEach(([libName, _, target]) => {
        this.moveLibraries(target || libName, path.resolve(targetPath, libName), appPath, !target)
      })
      viteConfig.plugins.push(externalPlugin())
    })
  }
}
