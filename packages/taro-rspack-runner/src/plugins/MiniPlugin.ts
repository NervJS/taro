import { META_TYPE, SCRIPT_EXT } from '@tarojs/helper'
import { addRequireToSourceWith } from '@tarojs/runner-utils/bundler/loadChunks'
import {
  type IBaseMiniPluginOptions,
  type IBaseMiniPluginResolvedOptions,
  BaseMiniPlugin,
  collectBuildNativePages,
  injectNativeComponentCommonStyles
} from '@tarojs/runner-utils/bundler/miniPlugin'

import {
  type IMiniEntryMeta,
  buildEntryRequestWithQuery,
  buildTemplateRequestWithQuery,
  componentConfig,
  setMiniEntryContext,
  syncModuleComponentMetas
} from '../utils/context'
import { getChunkIdOrName, wrapAssetsForModifyHook } from '../utils/rspack'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'

import type { Compilation, Compiler } from '@rspack/core'
import type { Config } from '@tarojs/taro'
import type { MiniCombination } from '../rspack/mini'

const PLUGIN_NAME = 'TaroMiniPlugin'

function collectChunkGroupDeps (
  chunks: Iterable<any>,
  commonChunks: string[],
  getChunkId: (chunk: any) => string
): Map<string, { name: string }[]> {
  const fileChunks = new Map<string, { name: string }[]>()
  for (const chunk of chunks) {
    const id = getChunkId(chunk)
    if (commonChunks.includes(id)) continue

    const deps: { name: string }[] = []
    for (const group of chunk.groupsIterable) {
      group.chunks.forEach((c: any) => {
        const currentChunkId = getChunkId(c)
        if (id === currentChunkId) return
        deps.push({ name: currentChunkId })
      })
    }
    fileChunks.set(id, deps)
  }
  return fileChunks
}

export type ITaroMiniPluginOptions = IBaseMiniPluginOptions<MiniCombination>
export type IOptions = IBaseMiniPluginResolvedOptions<MiniCombination>

export default class TaroMiniPlugin extends BaseMiniPlugin<MiniCombination, IOptions> {
  entryMetaMap = new Map<string, IMiniEntryMeta>()
  entryKeyMap = new Map<string, IMiniEntryMeta>()

  constructor (options: ITaroMiniPluginOptions) {
    super(options)
    if (!this.options.frameworkExts.length) {
      this.options.frameworkExts = SCRIPT_EXT
    }
  }

  apply (compiler: Compiler) {
    const config = this.options.combination.config
    const origModifyBuildAssets = config.modifyBuildAssets
    if (typeof origModifyBuildAssets === 'function') {
      config.modifyBuildAssets = (assets: any, miniPlugin: any) =>
        origModifyBuildAssets(wrapAssetsForModifyHook(assets), miniPlugin)
    }
    try {
      super.apply(compiler)
    } finally {
      if (typeof origModifyBuildAssets === 'function') {
        config.modifyBuildAssets = origModifyBuildAssets
      }
    }
  }

  public getComponentConfig () {
    return componentConfig
  }

  protected getTemplateDir () {
    return this.options.sourceDir
  }

  private getVirtualTemplateAnchor () {
    return (typeof this.appEntry === 'string' && this.appEntry) || require.resolve('../../index.js')
  }

  getCompTemplatePath () {
    const templateName = this.isWeappSubPackageIndieEnabled() ? 'comp-new-blended' : 'comp'
    return buildTemplateRequestWithQuery(this.getVirtualTemplateAnchor(), templateName)
  }

  getCustomWrapperTemplatePath () {
    return buildTemplateRequestWithQuery(this.getVirtualTemplateAnchor(), 'custom-wrapper')
  }

  async optimizeMiniFiles (compilation: any, compiler: any) {
    await super.optimizeMiniFiles(compilation, compiler)
    Object.keys(this.filesConfig).forEach(name => {
      delete compilation.assets[`${name}.js`]
      delete compilation.assets[`${name}.js.map`]
    })
  }

  protected onBeforeRun () {
    super.onBeforeRun()
    this.entryMetaMap.clear()
    this.entryKeyMap.clear()
  }

  protected onAfterRun () {
    setMiniEntryContext(this.entryMetaMap, (entryName: string, resourcePath: string) => {
      const meta = this.entryMetaMap.get(entryName)
      if (!meta) return null

      const resolved = this.getEntryLoaderConfig(meta.miniType, meta.name, resourcePath)
      if (!resolved) return null

      return {
        loader: require.resolve(resolved.loaderName),
        options: resolved.options
      }
    })
  }

  protected createLoadChunksPlugin () {
    const { commonChunks, combination, framework, isBuildPlugin } = this.options
    return new TaroLoadChunksPlugin({
      commonChunks,
      isBuildPlugin,
      addChunkPages: combination.config.addChunkPages,
      pages: this.pages,
      framework,
      appConfig: this.appConfig,
      onParseCreateElement: combination.config.onParseCreateElement
    })
  }

  protected applyEntryHooks (compiler: Compiler) {
    new compiler.webpack.DynamicEntryPlugin(this.options.sourceDir, async () => {
      const entries: Record<string, any> = {}
      this.entryKeyMap.forEach(meta => {
        const needsEntryLoader =
          meta.miniType === META_TYPE.ENTRY ||
          meta.miniType === META_TYPE.PAGE ||
          meta.miniType === META_TYPE.COMPONENT
        const request = needsEntryLoader
          ? buildEntryRequestWithQuery(meta.entryPath, meta.name)
          : meta.entryPath

        const validEntryOptions = { ...meta.options }
        delete validEntryOptions.isNativePage
        entries[meta.name] = {
          import: [request],
          ...validEntryOptions
        }
      })
      return entries
    }).apply(compiler)
  }

  protected onCompilation (compilation: Compilation) {
    compilation.hooks.finishModules.tap(PLUGIN_NAME, () => {
      syncModuleComponentMetas(this.options.combination.config.onParseCreateElement)
    })
  }

  protected async onProcessAssetsAdditional (compilation: Compilation, compiler: Compiler) {
    syncModuleComponentMetas(this.options.combination.config.onParseCreateElement)
    await this.generateMiniFiles(compilation, compiler)
  }

  protected tapEntryChunkRequires (
    compiler: Compiler,
    pluginName: string,
    stageName: string,
    onEntry: (params: {
      id: string
      entryMeta: IMiniEntryMeta
      modules: any
      deps?: { name: string }[]
    }) => any
  ) {
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: stageName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        () => {
          const fileChunks = collectChunkGroupDeps(compilation.chunks, this.options.commonChunks, getChunkIdOrName)
          if (!fileChunks.size) return

          for (const chunk of compilation.chunks) {
            const id = getChunkIdOrName(chunk)
            const entryMeta = this.entryMetaMap.get(id)
            const jsAssetName = `${id}.js`
            const modules = compilation.assets[jsAssetName]
            if (!entryMeta || !modules) continue

            const nextSource = onEntry({ id, entryMeta, modules, deps: fileChunks.get(id) })
            if (nextSource && nextSource !== modules) {
              compilation.assets[jsAssetName] = nextSource
            }
          }
        }
      )
    })
  }

  protected addLoadChunksPlugin (compiler: Compiler) {
    const { ConcatSource } = this.getSources(compiler)
    this.tapEntryChunkRequires(compiler, PLUGIN_NAME, `${PLUGIN_NAME}_LoadChunks`, ({ id, entryMeta, modules, deps }) => {
      const { miniType } = entryMeta
      const modifyResult = this.hooks.modifyChunkRequire.call({ source: modules, handled: false }, id, miniType)
      if (modifyResult?.handled) return modifyResult.source

      if (this.nativeComponents.has(id) || miniType === META_TYPE.STATIC) {
        return deps ? addRequireToSourceWith(ConcatSource, id, modules, deps) : undefined
      }
      if (miniType === META_TYPE.PAGE) {
        return addRequireToSourceWith(ConcatSource, id, modules, [{ name: 'app' }])
      }
    })
  }

  addEntry (entryPath: string, entryName: string, entryType: META_TYPE, options: Record<string, any> = {}) {
    const depKey = entryType === META_TYPE.STATIC ? `${entryPath}#${entryName}` : entryPath
    const meta: IMiniEntryMeta = {
      name: entryName,
      entryPath,
      miniType: entryType,
      options,
      isNativePage: Boolean(options.isNativePage)
    }
    this.entryKeyMap.set(depKey, meta)
    this.entryMetaMap.set(entryName, meta)
  }
}

const BUILD_NATIVE_PLUGIN_NAME = 'BuildNativePlugin'

export class BuildNativePlugin extends TaroMiniPlugin {
  pageLoaderName = '@tarojs/taro-loader/lib/native-component'

  apply (compiler: Compiler) {
    super.apply(compiler)
    this.addLoadChunksPlugin(compiler)
  }

  async run (compiler: Compiler) {
    this.onBeforeRun()
    this.appConfig = await this.getAppConfig()
    this.getPages()
    this.getPagesConfig()
    this.getConfigFiles(compiler)
    this.addEntries()
  }

  getPages () {
    collectBuildNativePages(this)
  }

  addEntries () {
    super.addEntries()
    for (const [key, dep] of this.entryKeyMap.entries()) {
      if (dep.miniType === META_TYPE.ENTRY) {
        this.entryKeyMap.delete(key)
        this.entryMetaMap.delete(dep.name)
        break
      }
    }
  }

  protected addLoadChunksPlugin (compiler: Compiler) {
    const { ConcatSource } = this.getSources(compiler)
    this.tapEntryChunkRequires(compiler, BUILD_NATIVE_PLUGIN_NAME, BUILD_NATIVE_PLUGIN_NAME, ({ id, modules, deps }) => {
      return deps ? addRequireToSourceWith(ConcatSource, id, modules, deps) : undefined
    })
  }

  generateConfigFile (compilation: Compilation, compiler: Compiler, filePath: string, config: Config & { component?: boolean }) {
    if (filePath === this.appEntry) return
    super.generateConfigFile(compilation, compiler, filePath, config)
  }

  injectCommonStyles ({ assets }: Compilation, compiler: Compiler) {
    injectNativeComponentCommonStyles({
      assets,
      sources: this.getSources(compiler),
      pages: this.pages,
      commonChunks: this.options.commonChunks,
      styleExt: this.options.fileType.style
    })
  }
}
