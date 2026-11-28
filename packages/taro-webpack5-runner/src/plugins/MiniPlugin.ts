import path from 'node:path'

import {
  META_TYPE,
  promoteRelativePath,
  REG_NODE_MODULES_DIR,
} from '@tarojs/helper'
import { addRequireToSourceWith } from '@tarojs/runner-utils/bundler/loadChunks'
import {
  type IBaseMiniPluginOptions,
  type IBaseMiniPluginResolvedOptions,
  type IndependentPackage,
  type MiniPluginHooks,
  baseCompName,
  BaseMiniPlugin,
  customWrapperName,
  STYLE_ISOLATION_APPLY_SHARED,
  STYLE_ISOLATION_SHARED
} from '@tarojs/runner-utils/bundler/miniPlugin'
import { sources } from 'webpack'
import EntryDependency from 'webpack/lib/dependencies/EntryDependency'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig } from '../utils/component'
import { getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import TaroSingleEntryPlugin from './TaroSingleEntryPlugin'

import type { Config } from '@tarojs/taro'
import type { Compilation, Compiler } from 'webpack'
import type { IComponent, IComponentObj } from '../utils/types'
import type { MiniCombination } from '../webpack/MiniCombination'
import type TaroNormalModule from './TaroNormalModule'

export {
  baseCompName,
  customWrapperName,
  STYLE_ISOLATION_APPLY_SHARED,
  STYLE_ISOLATION_SHARED
}
export type { IComponentObj, IndependentPackage, MiniPluginHooks }
export type ITaroMiniPluginOptions = IBaseMiniPluginOptions<MiniCombination>
export type IOptions = IBaseMiniPluginResolvedOptions<MiniCombination>

const PLUGIN_NAME = 'TaroMiniPlugin'
const CHILD_COMPILER_TAG = 'child'

function isLoaderExist (loaders: any[], loaderName: string) {
  return loaders.some(item => item.loader === loaderName)
}

export default class TaroMiniPlugin extends BaseMiniPlugin<MiniCombination, IOptions> {
  dependencies = new Map<string, TaroSingleEntryDependency>()

  public getSources (compiler?: any) {
    return (compiler || this.currentCompiler)?.webpack?.sources || sources
  }

  public getComponentConfig () {
    return componentConfig
  }

  protected getTemplateDir () {
    return path.resolve(__dirname, '..', 'template')
  }

  protected shouldSkipIndependentPageInMainGenerate (page: IComponent) {
    return Boolean(this.getIndependentPackage(page.path))
  }

  protected createLoadChunksPlugin () {
    const { commonChunks, combination, framework, isBuildPlugin } = this.options
    return new TaroLoadChunksPlugin({
      commonChunks,
      isBuildPlugin,
      addChunkPages: combination.config.addChunkPages,
      pages: this.pages,
      framework,
      appConfig: this.appConfig
    })
  }

  protected onMake (compiler: Compiler, compilation: Compilation, promises: Promise<null>[]) {
    this.compileIndependentPages(compiler, compilation, this.dependencies, promises)
  }

  protected onCollectMakeEntryPromises (compilation: Compilation, promises: Promise<null>[]) {
    this.dependencies.forEach(dep => {
      promises.push(new Promise<null>((resolve, reject) => {
        compilation.addEntry(this.options.sourceDir, dep, {
          name: dep.name,
          ...dep.options
        }, err => err ? reject(err) : resolve(null))
      }))
    })
  }

  protected onCompilation (compilation: Compilation, normalModuleFactory: any, compiler: Compiler) {
    compilation.dependencyFactories.set(EntryDependency, normalModuleFactory)
    compilation.dependencyFactories.set(TaroSingleEntryDependency as any, normalModuleFactory)

    compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext, module: any) => {
      const resolved = this.getEntryLoaderConfig(module.miniType, module.name, module.resource)
      if (resolved && !isLoaderExist(module.loaders, resolved.loaderName)) {
        module.loaders.unshift({
          loader: resolved.loaderName,
          options: resolved.options
        })
      }
    })
  }

  protected async onProcessAssetsAdditional (compilation: Compilation, compiler: Compiler) {
    if ((compilation as any).__tag === CHILD_COMPILER_TAG) {
      await this.generateIndependentMiniFiles(compilation, compiler)
    } else {
      await this.generateMiniFiles(compilation, compiler)
    }
  }

  protected applyExtraCompilerPlugins (compiler: Compiler) {
    new TaroNormalModulesPlugin(this.options.combination.config.onParseCreateElement).apply(compiler)
  }

  addLoadChunksPlugin (compiler: Compiler) {
    const fileChunks = new Map<string, { name: string }[]>()

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, chunks => {
        for (const chunk of chunks) {
          const id = getChunkIdOrName(chunk)
          if (this.options.commonChunks.includes(id)) return

          const deps: { name: string }[] = []

          for (const group of chunk.groupsIterable) {
            group.chunks.forEach(chunk => {
              const currentChunkId = getChunkIdOrName(chunk)
              if (id === currentChunkId) return
              deps.push({
                name: currentChunkId
              })
            })
          }

          fileChunks.set(id, deps)
        }
      })
      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(PLUGIN_NAME, (modules, { chunk }) => {
        const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
        if (!chunkEntryModule) return
        const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
        if (fileChunks.size) {
          let source
          const id = getChunkIdOrName(chunk)
          const { miniType } = entryModule as any

          const modifyResult = this.hooks.modifyChunkRequire.call({ source: modules, handled: false }, id, miniType)
          if (modifyResult?.handled) {
            return modifyResult.source
          }

          const { ConcatSource } = this.getSources(compiler)
          const entryChunk = [{ name: 'app' }]
          if (this.nativeComponents.has(id) || miniType === META_TYPE.STATIC) {
            fileChunks.forEach((v, k) => {
              if (k === id) {
                source = addRequireToSourceWith(ConcatSource, id, modules, v)
              }
            })
            return source || modules
          } else if (miniType === META_TYPE.PAGE) {
            return addRequireToSourceWith(ConcatSource, id, modules, entryChunk)
          }
        }
      })
    })
  }

  computeForceCustomWrapperForWebpackMainComp (): boolean {
    return this.computeForceCustomWrapperForMainComp()
  }

  getConfigFiles (compiler: Compiler) {
    super.getConfigFiles(compiler)
    const filesConfig = this.filesConfig

    // webpack createChunkAssets 前一刻，去除所有 config chunks
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.beforeChunkAssets.tap(PLUGIN_NAME, () => {
        const chunks = compilation.chunks
        const configNames = Object.keys(filesConfig)

        for (const chunk of chunks) {
          if (configNames.find(configName => configName === chunk.name)) chunks.delete(chunk)
        }
      })
    })
  }

  addEntry (entryPath: string, entryName: string, entryType: META_TYPE, options = {}) {
    let dep: TaroSingleEntryDependency
    const depKey = entryType === META_TYPE.STATIC ? `${entryPath}#${entryName}` : entryPath
    if (this.dependencies.has(depKey)) {
      dep = this.dependencies.get(depKey)!
      dep.name = entryName
      dep.loc = { name: entryName }
      dep.request = entryPath
      dep.userRequest = entryPath
      dep.miniType = entryType
      dep.options = options
    } else {
      dep = new TaroSingleEntryDependency(entryPath, entryName, { name: entryName }, entryType, options)
    }
    this.dependencies.set(depKey, dep)
  }

  compileIndependentPages (compiler, compilation, dependencies, promises) {
    const independentPackages = this.independentPackages
    if (independentPackages.size) {
      const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin')
      const NaturalChunkIdsPlugin = require('webpack/lib/ids/NaturalChunkIdsPlugin')
      const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin')
      const RuntimeChunkPlugin = require('webpack/lib/optimize/RuntimeChunkPlugin')
      const MiniCssExtractPlugin = require('mini-css-extract-plugin')

      independentPackages.forEach(({ pages, components }, name) => {
        const childCompiler = compilation.createChildCompiler(PLUGIN_NAME, {
          path: `${compiler.options.output.path}/${name}`,
          chunkLoadingGlobal: `subpackage_${name}`
        })
        const compPath = this.getCompTemplatePath()
        childCompiler.inputFileSystem = compiler.inputFileSystem
        childCompiler.outputFileSystem = compiler.outputFileSystem
        childCompiler.context = compiler.context
        new JsonpTemplatePlugin().apply(childCompiler)
        new NaturalChunkIdsPlugin().apply(childCompiler)
        new MiniCssExtractPlugin({
          filename: `[name]${this.options.fileType.style}`,
          chunkFilename: `[name]${this.options.fileType.style}`
        }).apply(childCompiler)
        const constantsReplaceList = this.isWeappSubPackageIndieEnabled()
          ? {
            ...this.options.constantsReplaceList,
            TARO_FORCE_CUSTOM_WRAPPER: JSON.stringify(this.computeForceCustomWrapperForIndieRoot(pages))
          }
          : this.options.constantsReplaceList
        new compiler.webpack.DefinePlugin(constantsReplaceList).apply(childCompiler)
        if (compiler.options.optimization) {
          new SplitChunksPlugin({
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
              common: {
                name: `${name}/common`,
                minChunks: 2,
                priority: 1
              },
              vendors: {
                name: `${name}/vendors`,
                minChunks: 1,
                test: module => {
                  const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
                  return (nodeModulesDirRegx.test(module.resource) && module.resource.indexOf(compPath) < 0)
                },
                priority: 10
              }
            }
          }).apply(childCompiler)
          new RuntimeChunkPlugin({
            name: `${name}/runtime`
          }).apply(childCompiler)
        }
        const childPages = new Set<IComponent>()
        pages.forEach(pagePath => {
          if (dependencies.has(pagePath)) {
            const dep = dependencies.get(pagePath)
            new TaroSingleEntryPlugin(compiler.context, dep?.request, dep?.name, dep?.miniType, dep?.options).apply(childCompiler)
          }
          this.pages.forEach(item => {
            if (item.path === pagePath) {
              childPages.add(item)
            }
          })
          dependencies.delete(pagePath)
        })
        components.forEach(componentPath => {
          if (dependencies.has(componentPath)) {
            const dep = dependencies.get(componentPath)
            new TaroSingleEntryPlugin(compiler.context, dep?.request, dep?.name, dep?.miniType, dep?.options).apply(childCompiler)
          }

          dependencies.delete(componentPath)
        })
        new TaroLoadChunksPlugin({
          commonChunks: [`${name}/runtime`, `${name}/vendors`, `${name}/common`],
          isBuildPlugin: false,
          addChunkPages: this.options.combination.config.addChunkPages,
          pages: childPages,
          framework: this.options.framework,
          isIndependentPackages: true,
          needAddCommon: [`${name}/comp`, `${name}/custom-wrapper`],
          appConfig: this.appConfig
        }).apply(childCompiler)
        new TaroSingleEntryPlugin(compiler.context, this.getCompTemplatePath(), `${name}/comp`, META_TYPE.STATIC).apply(childCompiler)
        new TaroSingleEntryPlugin(compiler.context, this.getCustomWrapperTemplatePath(), `${name}/custom-wrapper`, META_TYPE.STATIC).apply(childCompiler)

        childCompiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
          compilation.__name = name
          compilation.__tag = CHILD_COMPILER_TAG
        })

        promises.push(new Promise((resolve, reject) => {
          childCompiler.runAsChild(err => {
            if (err) {
              return reject(err)
            }
            resolve(null)
          })
        }).catch(err => console.log(err)))
      })
    }
  }

  cloneThirdPartyComponent (
    thirdPartyComponents: Map<string, Set<string>>,
    componentName: string
  ) {
    const attrs = componentConfig.thirdPartyComponents.get(componentName)
    if (!attrs || thirdPartyComponents.has(componentName)) return

    thirdPartyComponents.set(componentName, new Set(attrs))
  }

  /** 生成小程序独立分包的相关文件 */
  async generateIndependentMiniFiles (compilation: Compilation, compiler: Compiler) {
    const { template, sourceDir } = this.options
    const baseTemplateName = 'base'
    const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')
    // @ts-ignore
    const childName = compilation.__name
    this.independentPackages.forEach((_pages, name) => {
      if (name !== childName) return

      this.generateTemplateFile(compilation, compiler, `${name}/${baseTemplateName}`, template.buildTemplate, componentConfig)
      if (!template.isSupportRecursive) {
        const compConfig = {
          component: true,
          styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`
          }
        } as Config & { component?: boolean, usingComponents: Record<string, string> }
        if (!this.isWeappSubPackageIndieEnabled() || isUsingCustomWrapper) {
          compConfig.usingComponents[customWrapperName] = `./${customWrapperName}`
        }
        this.generateConfigFile(compilation, compiler, `${name}/${baseCompName}`, compConfig)
        this.generateTemplateFile(compilation, compiler, `${name}/${baseCompName}`, template.buildBaseComponentTemplate, this.options.fileType.templ)
      }
      this.generateConfigFile(compilation, compiler, `${name}/${customWrapperName}`, {
        component: true,
        styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
        usingComponents: {
          [customWrapperName]: `./${customWrapperName}`
        }
      })
      this.generateTemplateFile(compilation, compiler, `${name}/${customWrapperName}`, template.buildCustomComponentTemplate, this.options.fileType.templ)
      this.generateXSFile(compilation, compiler, `${name}/utils`)
    })

    this.pages.forEach(page => {
      let importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(page.name)]
      let isIndependent = false
      let independentName = ''
      this.independentPackages.forEach(({ pages }, name) => {
        if (pages.includes(page.path) && name === childName) {
          isIndependent = true
          independentName = name
          importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, name, this.getTemplatePath(baseTemplateName))))
        }
      })

      if (!isIndependent) return

      if (!page.isNative) {
        this.generateTemplateFile(compilation, compiler, page.path, template.buildPageTemplate, importBaseTemplatePath, config)
      }

      if (config) {
        const importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, independentName, this.getTargetFilePath(baseCompName, ''))))
        const importCustomWrapperPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, independentName, this.getTargetFilePath(customWrapperName, ''))))
        config.content.usingComponents = {
          ...config.content.usingComponents
        }

        if (isUsingCustomWrapper) {
          config.content.usingComponents[customWrapperName] = importCustomWrapperPath
        }
        if (!template.isSupportRecursive && !page.isNative) {
          config.content.usingComponents[baseCompName] = importBaseCompPath
        }
        this.generateConfigFile(compilation, compiler, page.path, config.content)
      }
    })
  }

  addTarBarFilesToDependencies (compilation: Compilation) {
    this.addTabBarFilesToDependencies(compilation)
  }
}
