import path from 'node:path'

import { fs, META_TYPE, promoteRelativePath, resolveMainFilePath, taroJsComponents } from '@tarojs/helper'
import { urlToRequest } from 'loader-utils'

import { componentConfig } from '../utils/component'
import { addRequireToSource } from '../utils/webpack'
import {
  baseCompName,
  customWrapperName,
  STYLE_ISOLATION_APPLY_SHARED,
  STYLE_ISOLATION_SHARED,
} from './MiniPlugin'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { AppConfig, Config } from '@tarojs/taro'
import type { Compilation, Compiler } from 'webpack'
import type {
  IOptions,
} from './MiniPlugin'
import type TaroMiniPlugin from './MiniPlugin'

export const subPackageIndieCustomWrapperRootsKey = '__taroSubPackageIndieCustomWrapperRoots'

export type SubPackageIndieConfig = NonNullable<AppConfig['subPackageIndie']>[number]
export type NormalizedSubPackageIndieConfig = {
  mainPackageRoot: string
  subPackageRoots: string[]
  disableRecursiveComponentRoots: Set<string>
}
export type SubPackageIndieMatch = {
  config: NormalizedSubPackageIndieConfig
  root: string
  isMainPackageRoot: boolean
}

const PLUGIN_NAME = 'TaroSubPackageIndiePlugin'

export default class SubPackageIndiePlugin {
  miniPlugin: TaroMiniPlugin
  options: IOptions
  moduleRequestMap = new Map<string, Map<string, string>>()

  constructor (miniPlugin: TaroMiniPlugin) {
    this.miniPlugin = miniPlugin
    this.options = miniPlugin.options
  }

  apply () {
    this.miniPlugin.hooks.modifyEntries.tap(PLUGIN_NAME, entries => {
      const shouldSkipRootEntries = this.hasSubPackageIndieMainPackageRoot() && this.options.newBlended
      if (!shouldSkipRootEntries) return entries

      return {
        ...entries,
        skipRootComp: true,
        skipRootWrapper: true,
      }
    })

    this.miniPlugin.hooks.afterResolveModule.tap(PLUGIN_NAME, (resolveData: any) => {
      if (!this.options.newBlended) return

      const issuer: string | undefined = resolveData.contextInfo?.issuer
      const request: string | undefined = resolveData.request
      const resource: string | undefined = resolveData.createData?.resource || resolveData.resource

      if (issuer && request && resource) {
        this.setResolvedRequestResource(issuer, request, resource)
      }

      if (resolveData.request !== taroJsComponents) return
      if (!issuer || !issuer.startsWith(this.options.sourceDir)) return

      const componentName = this.miniPlugin.getComponentName(issuer)
      const root = this.isInSubPackageIndieRoot(componentName)
      if (!root) return

      resolveData.dependencies.forEach((dependency: any) => {
        if (dependency.ids?.length > 0) {
          dependency.ids.forEach((id: string) => {
            const dashedName = this.toDashedComponentName(id)
            if (!componentConfig.scopedIncludes.has(root)) {
              componentConfig.scopedIncludes.set(root, new Set())
            }
            componentConfig.scopedIncludes.get(root)!.add(dashedName)
          })
        }
      })
    })

    this.miniPlugin.hooks.modifyChunkRequire.tap(PLUGIN_NAME, (result, chunkId, miniType) => {
      if (!this.options.newBlended) return result

      if (this.miniPlugin.nativeComponents.has(chunkId) || miniType === META_TYPE.STATIC) {
        const isSubPackageIndie = this.isInSubPackageIndieRoot(chunkId)
        if (isSubPackageIndie) {
          return {
            source: result.source,
            handled: true,
          }
        }
      } else if (miniType === META_TYPE.PAGE) {
        const subPackageIndieRoot = this.isInSubPackageIndieRoot(chunkId)
        if (subPackageIndieRoot) {
          return {
            source: addRequireToSource(chunkId, result.source, [{ name: `${subPackageIndieRoot}/app` }]),
            handled: true,
          }
        }
      }

      return result
    })

    this.miniPlugin.hooks.modifySkipRootTemplates.tap(PLUGIN_NAME, skip => {
      return skip || (this.hasSubPackageIndieMainPackageRoot() && this.options.newBlended)
    })

    this.miniPlugin.hooks.generateExtraFiles.tap(PLUGIN_NAME, (customWrapperRoots, compilation, compiler) => {
      if (!this.options.newBlended) return customWrapperRoots
      if (!this.getSubPackageIndieConfigs().length) return customWrapperRoots

      const roots = this.generateSubPackageIndieFiles(compilation, compiler, this.options.template, 'base')
      ;(compilation as any)[subPackageIndieCustomWrapperRootsKey] = roots

      return roots
    })

    this.miniPlugin.hooks.modifyComponentConfig.tap(PLUGIN_NAME, ({ config, component }, customWrapperRoots) => {
      const indieMatch = this.getSubPackageIndieMatch(component.name)
      if (!indieMatch || component.isNative) return

      const importBaseCompPath = this.getRootRelativePath(component.path, indieMatch.root, this.miniPlugin.getTargetFilePath(baseCompName, ''))
      const importCustomWrapperPath = this.getRootRelativePath(component.path, indieMatch.root, this.miniPlugin.getTargetFilePath(customWrapperName, ''))

      config.content.usingComponents = {
        ...config.content.usingComponents,
      }

      const isRootUsingCustomWrapper = customWrapperRoots.has(indieMatch.root)
      const isRootRecursiveDisabled = this.isRecursiveComponentDisabledForRoot(indieMatch.root)

      if (isRootUsingCustomWrapper && !isRootRecursiveDisabled && !config.content.usingComponents[customWrapperName]) {
        config.content.usingComponents[customWrapperName] = importCustomWrapperPath
      }
      if (!this.options.template.isSupportRecursive && !isRootRecursiveDisabled && !config.content.usingComponents[baseCompName]) {
        config.content.usingComponents[baseCompName] = importBaseCompPath
      }
    })

    this.miniPlugin.hooks.modifyPageConfig.tap(PLUGIN_NAME, (context, page, customWrapperRoots) => {
      const subPackageIndieRoot = this.isInSubPackageIndieRoot(page.name)
      if (!subPackageIndieRoot) return context

      const isPageRecursiveDisabled = this.isRecursiveComponentDisabledForRoot(subPackageIndieRoot)
      const shouldUseCustomWrapper = customWrapperRoots.has(subPackageIndieRoot) && !isPageRecursiveDisabled

      return {
        ...context,
        importBaseTemplatePath: this.getRootRelativePath(page.path, subPackageIndieRoot, this.miniPlugin.getTemplatePath('base')),
        importBaseCompPath: this.getRootRelativePath(page.path, subPackageIndieRoot, this.miniPlugin.getTargetFilePath(baseCompName, '')),
        importCustomWrapperPath: this.getRootRelativePath(page.path, subPackageIndieRoot, this.miniPlugin.getTargetFilePath(customWrapperName, '')),
        shouldUseCustomWrapper,
        isPageRecursiveDisabled,
      }
    })

    this.miniPlugin.hooks.afterGenerateFiles.tap(PLUGIN_NAME, (compilation, compiler) => {
      if (this.hasSubPackageIndieMainPackageRoot() && this.options.newBlended) {
        this.generateMainPackageRuntimeFiles(compilation, compiler)
      }
    })

    this.miniPlugin.hooks.optimizeAssets.tap(PLUGIN_NAME, compilation => {
      if (!this.options.newBlended) return

      const hasSubPackageIndieCustomWrapperRoots = (compilation as any)[subPackageIndieCustomWrapperRootsKey] instanceof Set
      const subPackageIndieCustomWrapperRoots: Set<string> = hasSubPackageIndieCustomWrapperRoots
        ? (compilation as any)[subPackageIndieCustomWrapperRootsKey]
        : new Set<string>()

      this.getAllIndieRoots().forEach(root => {
        if (this.isRecursiveComponentDisabledForRoot(root)) {
          delete compilation.assets[`${root}/${baseCompName}.js`]
          delete compilation.assets[`${root}/${baseCompName}${this.options.fileType.config}`]
          delete compilation.assets[`${root}/${baseCompName}${this.options.fileType.templ}`]
          delete compilation.assets[`${root}/${customWrapperName}.js`]
          delete compilation.assets[`${root}/${customWrapperName}${this.options.fileType.config}`]
          delete compilation.assets[`${root}/${customWrapperName}${this.options.fileType.templ}`]
          return
        }

        const isRootUsingCustomWrapper = hasSubPackageIndieCustomWrapperRoots
          ? subPackageIndieCustomWrapperRoots.has(root)
          : this.isSubPackageIndieRootUsingCustomWrapper(
            compilation,
            root,
            this.getScopedSubPackageIndieComponentConfig(compilation, root).thirdPartyComponents
          )
        if (isRootUsingCustomWrapper) return
        delete compilation.assets[`${root}/${customWrapperName}.js`]
        delete compilation.assets[`${root}/${customWrapperName}${this.options.fileType.config}`]
        delete compilation.assets[`${root}/${customWrapperName}${this.options.fileType.templ}`]
      })

      if (this.hasSubPackageIndieMainPackageRoot()) {
        const styleExt = this.options.fileType.style
        const runtimeChunks = ['app', ...this.options.commonChunks]

        runtimeChunks.forEach(chunkName => {
          delete compilation.assets[`${chunkName}.js`]
          delete compilation.assets[`${chunkName}${styleExt}`]
        })

        delete compilation.assets[`app-origin${styleExt}`]
        delete compilation.assets[`${baseCompName}.js`]
        delete compilation.assets[`${customWrapperName}.js`]
      }
    })

    this.miniPlugin.hooks.modifyConfig.tap(PLUGIN_NAME, (config, componentName) => {
      const subPackageIndieRoot = this.isInSubPackageIndieRoot(componentName)
      if (subPackageIndieRoot && this.miniPlugin.nativeComponents.has(componentName)) {
        const styleIsolation = this.options.template.isSupportRecursive
          ? STYLE_ISOLATION_APPLY_SHARED
          : STYLE_ISOLATION_SHARED
        ;(config as any).styleIsolation = (config as any).styleIsolation || styleIsolation
        ;(config as any).isNewBlended = true
      }
      return config
    })

    this.miniPlugin.hooks.modifyShouldProcessStyles.tap(PLUGIN_NAME, shouldProcess => {
      const hasMainPackageRoot = this.hasSubPackageIndieMainPackageRoot() && this.options.newBlended
      return shouldProcess || hasMainPackageRoot
    })

    this.miniPlugin.hooks.modifyStyleImport.tap(PLUGIN_NAME, (context, page) => {
      if (!this.options.newBlended) return context

      const indieMatch = this.getSubPackageIndieMatch(page.name)
      if (!indieMatch) return context

      if (this.miniPlugin.nativeComponents.has(page.name)) {
        if (indieMatch.isMainPackageRoot) {
          return {
            ...context,
            importStatement: `@import ${JSON.stringify(urlToRequest('./app' + this.options.fileType.style))};\n`,
            shouldSkip: false,
            isMainPackageRoot: true,
          }
        }

        return {
          ...context,
          importStatement: '',
          shouldSkip: true,
          isMainPackageRoot: false,
        }
      }

      if (indieMatch.isMainPackageRoot) {
        return {
          ...context,
          importStatement: `@import ${JSON.stringify(urlToRequest('./app' + this.options.fileType.style))};\n`,
          shouldSkip: false,
          isMainPackageRoot: true,
        }
      }

      return context
    })
  }

  getRootRelativePath (fromPath: string, root: string, targetPath: string) {
    return promoteRelativePath(path.relative(fromPath, path.join(this.options.sourceDir, root, targetPath)))
  }

  normalizeIndieRoot (root: string): string {
    if (root.endsWith('/index')) {
      return path.dirname(root)
    }
    return root
  }

  parseIndieRootConfig (rootConfig: string | { path: string, disableRecursiveComponent?: boolean }): { path: string, disableRecursiveComponent: boolean } {
    if (typeof rootConfig === 'string') {
      return { path: this.normalizeIndieRoot(rootConfig), disableRecursiveComponent: false }
    }
    return {
      path: this.normalizeIndieRoot(rootConfig.path),
      disableRecursiveComponent: !!rootConfig.disableRecursiveComponent,
    }
  }

  getSubPackageIndieConfigs (): NormalizedSubPackageIndieConfig[] {
    const subPackageIndie = this.miniPlugin.appConfig?.subPackageIndie
    if (!Array.isArray(subPackageIndie)) return []

    return subPackageIndie.map(({ mainPackageRoot, subPackageRoots = [] }: SubPackageIndieConfig) => {
      const mainParsed = this.parseIndieRootConfig(mainPackageRoot)
      const subParsedList = subPackageRoots.map(root => this.parseIndieRootConfig(root))
      const disableRecursiveComponentRoots = new Set<string>()

      if (mainParsed.disableRecursiveComponent) {
        disableRecursiveComponentRoots.add(mainParsed.path)
      }
      subParsedList.forEach(sub => {
        if (sub.disableRecursiveComponent) {
          disableRecursiveComponentRoots.add(sub.path)
        }
      })

      return {
        mainPackageRoot: mainParsed.path,
        subPackageRoots: Array.from(new Set(subParsedList.map(sub => sub.path))),
        disableRecursiveComponentRoots,
      }
    })
  }

  getAllIndieRoots (): string[] {
    return Array.from(new Set(
      this.getSubPackageIndieConfigs().flatMap(({ mainPackageRoot, subPackageRoots }) => [mainPackageRoot, ...subPackageRoots])
    ))
  }

  getAllMainPackageRoots (): string[] {
    return Array.from(new Set(this.getSubPackageIndieConfigs().map(item => item.mainPackageRoot)))
  }

  hasSubPackageIndieMainPackageRoot (): boolean {
    return this.getAllMainPackageRoots().length > 0
  }

  isRecursiveComponentDisabledForRoot (root: string): boolean {
    return this.getSubPackageIndieConfigs().some(config => config.disableRecursiveComponentRoots.has(root))
  }

  getSubPackageIndieMatch (pageName: string): SubPackageIndieMatch | null {
    if (!this.options.newBlended) return null

    const configs = this.getSubPackageIndieConfigs()

    for (const config of configs) {
      if (pageName.startsWith(config.mainPackageRoot + '/') || pageName === config.mainPackageRoot) {
        return {
          config,
          root: config.mainPackageRoot,
          isMainPackageRoot: true,
        }
      }

      for (const root of config.subPackageRoots) {
        if (pageName.startsWith(root + '/') || pageName === root) {
          return {
            config,
            root,
            isMainPackageRoot: false,
          }
        }
      }
    }

    return null
  }

  isInSubPackageIndieRoot (pageName: string): string | null {
    return this.getSubPackageIndieMatch(pageName)?.root || null
  }

  getModuleSourceContent (module: any): string {
    try {
      const source = module?.originalSource?.()
      if (!source || typeof source.source !== 'function') return ''
      return String(source.source() || '')
    } catch (_err) {
      return ''
    }
  }

  getModuleResource (module: any): string | undefined {
    const resource = module?.resource || module?.rootModule?.resource
    return typeof resource === 'string' ? resource : undefined
  }

  collectFlattenedModules (module: any, collected: Set<any>, visited = new Set<any>()) {
    if (!module || visited.has(module)) return

    visited.add(module)
    collected.add(module)

    const nestedModuleCollections = [module.rootModule, module.modules, module._modules]

    nestedModuleCollections.forEach(item => {
      if (!item) return

      if (item && typeof item[Symbol.iterator] === 'function') {
        for (const nested of item) {
          this.collectFlattenedModules(nested, collected, visited)
        }
      } else {
        this.collectFlattenedModules(item, collected, visited)
      }
    })
  }

  getCompilationModuleResourceMap (compilation: Compilation) {
    const moduleMap = new Map<string, any>()

    for (const module of compilation.modules as Iterable<any>) {
      const flattenedModules = new Set<any>()
      this.collectFlattenedModules(module, flattenedModules)

      flattenedModules.forEach(flattenedModule => {
        const resource = this.getModuleResource(flattenedModule)
        if (resource) {
          moduleMap.set(resource, flattenedModule)
        }
      })
    }

    return moduleMap
  }

  getChunksBySubPackageIndieRoot (compilation: Compilation, root: string) {
    const chunks = new Set<any>()

    this.getSubPackageIndieEntriesByRoot(root).forEach(({ name }) => {
      const entryChunk = Array.from(compilation.chunks).find(chunk => chunk.name === name)
      if (!entryChunk) return

      chunks.add(entryChunk)
      entryChunk.groupsIterable.forEach(group => {
        group.chunks.forEach(chunk => chunks.add(chunk))
      })
    })

    return chunks
  }

  getSubPackageIndieModules (compilation: Compilation, root: string) {
    const modules = new Set<any>()

    this.getChunksBySubPackageIndieRoot(compilation, root).forEach(chunk => {
      for (const module of compilation.chunkGraph.getChunkModulesIterable(chunk)) {
        this.collectFlattenedModules(module, modules)
      }
    })

    return modules
  }

  normalizeModuleRequestMapKey (resource: string | undefined) {
    if (!resource || typeof resource !== 'string') return null

    const resourceWithoutLoader = resource.split('!').pop()
    if (!resourceWithoutLoader) return null

    const resourcePath = resourceWithoutLoader.split('?')[0]
    if (!resourcePath) return null

    return path.normalize(resourcePath)
  }

  getModuleRequestMapKeys (resource: string | undefined) {
    const keys = new Set<string>()

    if (resource && typeof resource === 'string') {
      keys.add(resource)
    }

    const normalizedResource = this.normalizeModuleRequestMapKey(resource)
    if (normalizedResource) {
      keys.add(normalizedResource)
    }

    return Array.from(keys)
  }

  setResolvedRequestResource (issuer: string, request: string, resource: string) {
    this.getModuleRequestMapKeys(issuer).forEach(key => {
      if (!this.moduleRequestMap.has(key)) {
        this.moduleRequestMap.set(key, new Map())
      }

      this.moduleRequestMap.get(key)!.set(request, resource)
    })
  }

  getResolvedRequestResource (issuerResource: string | undefined, request: string) {
    for (const key of this.getModuleRequestMapKeys(issuerResource)) {
      const resolvedResource = this.moduleRequestMap.get(key)?.get(request)
      if (resolvedResource) return resolvedResource
    }
  }

  getResolvedModuleByResource (moduleResourceMap: Map<string, any>, resource: string) {
    const exactModule = moduleResourceMap.get(resource)
    if (exactModule) return exactModule

    const normalizedResource = this.normalizeModuleRequestMapKey(resource)
    if (!normalizedResource) return null

    const normalizedModule = moduleResourceMap.get(normalizedResource)
    if (normalizedModule) return normalizedModule

    for (const [moduleResource, module] of moduleResourceMap.entries()) {
      if (this.normalizeModuleRequestMapKey(moduleResource) === normalizedResource) {
        return module
      }
    }

    return null
  }

  resolveRequestedModule (
    moduleResourceMap: Map<string, any>,
    issuerModule: any,
    request: string
  ) {
    const issuerResource = this.getModuleResource(issuerModule)
    const resolvedResource = this.getResolvedRequestResource(issuerResource, request)

    if (resolvedResource) {
      const resolvedModule = this.getResolvedModuleByResource(moduleResourceMap, resolvedResource)
      if (resolvedModule) return resolvedModule
    }

    if (issuerResource && /^[.\\/]/.test(request)) {
      const requestPath = path.resolve(path.dirname(issuerResource), request)
      const resolvedPath = resolveMainFilePath(requestPath)
      const requestModule = this.getResolvedModuleByResource(moduleResourceMap, resolvedPath)
      if (requestModule) return requestModule
    }

    for (const module of moduleResourceMap.values()) {
      if (!module) continue

      if (module.rawRequest === request || module.userRequest === request || module.request === request) {
        return module
      }
    }

    return null
  }

  resolveImportBindingToTaroComponentName (
    moduleResourceMap: Map<string, any>,
    issuerModule: any,
    binding: any,
    propertyName?: string,
    visited = new Set<string>()
  ): string | null {
    if (!binding?.source) return null

    if (binding.kind === 'namespace') {
      if (!propertyName) return null

      if (binding.source === taroJsComponents) {
        return propertyName
      }

      const targetModule = this.resolveRequestedModule(moduleResourceMap, issuerModule, binding.source)
      if (!targetModule) {
        if (!/^[.\\/]/.test(binding.source)) {
          return propertyName
        }
        return null
      }

      return this.resolveModuleExportToTaroComponentName(moduleResourceMap, targetModule, propertyName, visited)
    }

    const importedName = binding.imported || propertyName
    if (!importedName || importedName === 'default') return null

    if (binding.source === taroJsComponents) {
      return importedName
    }

    const targetModule = this.resolveRequestedModule(moduleResourceMap, issuerModule, binding.source)
    if (!targetModule) {
      if (!/^[.\\/]/.test(binding.source)) {
        return importedName
      }
      return null
    }

    return this.resolveModuleExportToTaroComponentName(moduleResourceMap, targetModule, importedName, visited)
  }

  resolveModuleExportToTaroComponentName (
    moduleResourceMap: Map<string, any>,
    module: any,
    exportName: string,
    visited = new Set<string>()
  ): string | null {
    const moduleResource = this.getModuleResource(module)
    if (!moduleResource) return null

    const visitKey = `${moduleResource}::${exportName}`
    if (visited.has(visitKey)) return null
    visited.add(visitKey)

    const exportBinding = module?.exportBindings?.[exportName]
    if (exportBinding) {
      if (exportBinding.kind === 'reexport' && exportBinding.source) {
        if (exportBinding.source === taroJsComponents) {
          return exportBinding.imported || exportName
        }

        const targetModule = this.resolveRequestedModule(moduleResourceMap, module, exportBinding.source)
        if (targetModule) {
          const resolvedName = this.resolveModuleExportToTaroComponentName(
            moduleResourceMap,
            targetModule,
            exportBinding.imported || exportName,
            visited
          )

          if (resolvedName) return resolvedName
        }
      }

      if (exportBinding.kind === 'local' && exportBinding.local) {
        const importedBinding = module?.importedBindings?.[exportBinding.local]
        if (importedBinding) {
          const resolvedName = this.resolveImportBindingToTaroComponentName(
            moduleResourceMap,
            module,
            importedBinding,
            undefined,
            visited
          )

          if (resolvedName) return resolvedName
        }
      }
    }

    for (const source of module?.exportAllSources || []) {
      if (source === taroJsComponents) {
        return exportName
      }

      const targetModule = this.resolveRequestedModule(moduleResourceMap, module, source)
      if (!targetModule) continue

      const resolvedName = this.resolveModuleExportToTaroComponentName(moduleResourceMap, targetModule, exportName, visited)
      if (resolvedName) return resolvedName
    }

    return null
  }

  resolveUsedComponentRefToTaroComponentName (moduleResourceMap: Map<string, any>, module: any, componentRef: any) {
    if (!componentRef) return null

    if (componentRef.kind === 'identifier') {
      const binding = module?.importedBindings?.[componentRef.name]
      if (!binding) {
        return componentRef.name
      }

      const resolvedName = this.resolveImportBindingToTaroComponentName(moduleResourceMap, module, binding)
      return resolvedName || componentRef.name
    }

    if (componentRef.kind === 'member') {
      const binding = module?.importedBindings?.[componentRef.object]
      if (!binding) {
        return componentRef.property || null
      }

      const resolvedName = this.resolveImportBindingToTaroComponentName(moduleResourceMap, module, binding, componentRef.property)
      return resolvedName || componentRef.property || null
    }

    return null
  }

  shouldSkipSubPackageIndieModule (module: any, root: string) {
    const resource = this.getModuleResource(module)
    if (typeof resource !== 'string' || !resource.startsWith(this.options.sourceDir)) {
      return false
    }

    const componentName = this.miniPlugin.getComponentName(resource)
    const targetRoot = this.isInSubPackageIndieRoot(componentName)

    return !!targetRoot && targetRoot !== root
  }

  collectModuleResolvedComponentIncludes (compilation: Compilation, root: string) {
    const includes = new Set<string>()
    const moduleResourceMap = this.getCompilationModuleResourceMap(compilation)

    for (const module of this.getSubPackageIndieModules(compilation, root)) {
      if (this.shouldSkipSubPackageIndieModule(module, root)) continue

      for (const elementName of module?.elementNameSet || []) {
        if (!componentConfig.thirdPartyComponents.has(elementName)) {
          includes.add(elementName)
        }
      }

      for (const binding of Object.values(module?.importedBindings || {})) {
        const resolvedComponentName = this.resolveImportBindingToTaroComponentName(
          moduleResourceMap,
          module,
          binding
        )

        if (!resolvedComponentName) continue

        const dashedName = this.toDashedComponentName(resolvedComponentName)
        if (!componentConfig.thirdPartyComponents.has(dashedName)) {
          includes.add(dashedName)
        }
      }

      for (const componentRef of module?.usedComponentRefs || []) {
        const resolvedComponentName = this.resolveUsedComponentRefToTaroComponentName(moduleResourceMap, module, componentRef)
        if (!resolvedComponentName) continue

        const dashedName = this.toDashedComponentName(resolvedComponentName)
        if (!componentConfig.thirdPartyComponents.has(dashedName)) {
          includes.add(dashedName)
        }
      }
    }

    return includes
  }

  expandScopedIncludes (includes: Set<string>) {
    const scopedIncludes = new Set(includes)

    if (scopedIncludes.has('view')) {
      scopedIncludes.add('catch-view')
      scopedIncludes.add('static-view')
      scopedIncludes.add('pure-view')
      scopedIncludes.add('click-view')
    }
    if (scopedIncludes.has('image')) {
      scopedIncludes.add('static-image')
    }
    if (scopedIncludes.has('text')) {
      scopedIncludes.add('static-text')
    }

    return scopedIncludes
  }

  toDashedComponentName (componentName: string) {
    return componentName.replace(/[A-Z]/g, (match, offset) => `${offset === 0 ? '' : '-'}${match.toLowerCase()}`)
  }

  collectScopedInnerComponents (compilation: Compilation, root: string) {
    const includes = new Set<string>()

    const scopedIncludes = componentConfig.scopedIncludes.get(root)
    if (scopedIncludes && scopedIncludes.size > 0) {
      scopedIncludes.forEach(name => includes.add(name))
    }

    this.collectModuleResolvedComponentIncludes(compilation, root).forEach(name => includes.add(name))

    const finalIncludes = includes.size > 0
      ? includes
      : new Set(componentConfig.includes)

    return this.expandScopedIncludes(finalIncludes)
  }

  isSubPackageIndieRootUsingCustomWrapperByModules (compilation: Compilation, root: string) {
    const moduleResourceMap = this.getCompilationModuleResourceMap(compilation)

    for (const module of this.getSubPackageIndieModules(compilation, root)) {
      if (this.shouldSkipSubPackageIndieModule(module, root)) continue

      for (const componentRef of module?.usedComponentRefs || []) {
        const resolvedComponentName = this.resolveUsedComponentRefToTaroComponentName(moduleResourceMap, module, componentRef)
        if (resolvedComponentName === 'CustomWrapper') {
          return true
        }
      }
    }

    return false
  }

  isSubPackageIndieRootUsingCustomWrapper (
    compilation: Compilation,
    root: string,
    scopedThirdPartyComponents?: Map<string, Set<string>>
  ) {
    if (scopedThirdPartyComponents?.has(customWrapperName)) {
      return true
    }

    if (this.isSubPackageIndieRootUsingCustomWrapperByModules(compilation, root)) {
      return true
    }

    return false
  }

  resolveUsingComponentTarget (filePath: string, componentPath: string) {
    if (componentPath.startsWith('plugin://')) return null

    let sourcePath = componentPath

    if (path.isAbsolute(componentPath)) {
      sourcePath = fs.existsSync(componentPath)
        ? componentPath
        : path.resolve(this.options.sourceDir, `.${componentPath}`)
    } else {
      const isRelativePath = /^[.\\/]/
      if (!isRelativePath.test(componentPath)) return null
      sourcePath = path.resolve(path.dirname(filePath), componentPath)
    }

    const targetPath = resolveMainFilePath(sourcePath)
    const targetName = this.miniPlugin.getComponentName(targetPath)

    return {
      path: targetPath,
      name: targetName,
      root: this.isInSubPackageIndieRoot(targetName),
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

  getSubPackageIndieEntriesByRoot (root: string) {
    const entries = new Map<string, any>()

    ;[...this.miniPlugin.pages, ...this.miniPlugin.components].forEach(item => {
      if (this.isInSubPackageIndieRoot(item.name) === root) {
        entries.set(item.name, item)
      }
    })

    return Array.from(entries.values())
  }

  getComponentByName (componentName: string) {
    return [...this.miniPlugin.pages, ...this.miniPlugin.components].find(item => item.name === componentName)
  }

  getScopedSubPackageIndieComponentConfig (compilation: Compilation, root: string) {
    const thirdPartyComponents = new Map<string, Set<string>>()
    const queue = this.getSubPackageIndieEntriesByRoot(root)
    const visited = new Set<string>()

    while (queue.length) {
      const current = queue.shift()
      if (!current || visited.has(current.name)) continue

      visited.add(current.name)

      const fileConfig = this.miniPlugin.filesConfig[this.miniPlugin.getConfigFilePath(current.name)]?.content
      const usingComponents = fileConfig?.usingComponents
      if (!usingComponents) continue

      for (const [componentName, componentValue] of Object.entries(usingComponents)) {
        if (componentName === customWrapperName) {
          this.cloneThirdPartyComponent(thirdPartyComponents, componentName)
          continue
        }

        if (!componentConfig.thirdPartyComponents.has(componentName)) continue

        const componentPath = componentValue instanceof Array ? componentValue[0] : componentValue
        const target = this.resolveUsingComponentTarget(current.path!, componentPath)

        this.cloneThirdPartyComponent(thirdPartyComponents, componentName)

        if (!target) continue

        const targetComponent = this.getComponentByName(target.name)
        if (targetComponent && (!target.root || target.root === root) && !visited.has(targetComponent.name)) {
          queue.push(targetComponent)
        }
      }
    }

    return {
      includes: this.collectScopedInnerComponents(compilation, root),
      exclude: new Set(componentConfig.exclude),
      thirdPartyComponents,
      includeAll: false,
      skipRecursiveComponent: false,
    }
  }

  generateSubPackageIndieScriptFile (compilation: Compilation, compiler: Compiler, filePath: string, content: string) {
    const { RawSource } = compiler.webpack.sources
    compilation.assets[this.miniPlugin.getTargetFilePath(filePath, '.js')] = new RawSource(content)
  }

  createRecursiveComponentWrapperSource (componentName?: string) {
    const args = componentName ? JSON.stringify(componentName) : ''
    return `const registerRecursiveComponent = globalThis.__taroRegisterRecursiveComponent

if (typeof registerRecursiveComponent !== 'function') {
  throw new Error('globalThis.__taroRegisterRecursiveComponent is not a function')
}

registerRecursiveComponent(${args})
`
  }

  generateSubPackageIndieFiles (
    compilation: Compilation,
    compiler: Compiler,
    template: RecursiveTemplate | UnRecursiveTemplate,
    baseTemplateName: string
  ): Set<string> {
    const customWrapperRoots = new Set<string>()
    if (!this.getSubPackageIndieConfigs().length) return customWrapperRoots

    const allIndieRoots = this.getAllIndieRoots()

    allIndieRoots.forEach(root => {
      const scopedComponentConfig = this.getScopedSubPackageIndieComponentConfig(compilation, root)

      const isRecursiveDisabled = this.isRecursiveComponentDisabledForRoot(root)
      if (isRecursiveDisabled) {
        scopedComponentConfig.skipRecursiveComponent = true
      }

      const isRootUsingCustomWrapper = isRecursiveDisabled
        ? false
        : this.isSubPackageIndieRootUsingCustomWrapper(
          compilation,
          root,
          scopedComponentConfig.thirdPartyComponents
        )
      if (isRootUsingCustomWrapper) {
        customWrapperRoots.add(root)
        if (!scopedComponentConfig.thirdPartyComponents.has(customWrapperName)) {
          const attrs = componentConfig.thirdPartyComponents.get(customWrapperName)
          scopedComponentConfig.thirdPartyComponents.set(customWrapperName, new Set(attrs || []))
        }
      }

      this.miniPlugin.generateTemplateFile(
        compilation,
        compiler,
        `${root}/${baseTemplateName}`,
        template.buildTemplate,
        scopedComponentConfig
      )

      this.miniPlugin.generateXSFile(compilation, compiler, `${root}/utils`)

      if (!template.isSupportRecursive && !isRecursiveDisabled) {
        this.generateSubPackageIndieScriptFile(
          compilation,
          compiler,
          `${root}/${baseCompName}`,
          this.createRecursiveComponentWrapperSource()
        )
        this.miniPlugin.generateTemplateFile(
          compilation,
          compiler,
          `${root}/${baseCompName}`,
          template.buildBaseComponentTemplate,
          this.options.fileType.templ
        )

        const compConfig: Record<string, any> = {
          component: true,
          styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
          },
        }
        if (isRootUsingCustomWrapper) {
          compConfig.usingComponents[customWrapperName] = `./${customWrapperName}`
        }
        this.miniPlugin.generateConfigFile(compilation, compiler, `${root}/${baseCompName}`, compConfig as Config & { component?: boolean })
      }

      if (isRootUsingCustomWrapper) {
        this.generateSubPackageIndieScriptFile(
          compilation,
          compiler,
          `${root}/${customWrapperName}`,
          this.createRecursiveComponentWrapperSource(customWrapperName)
        )
        this.miniPlugin.generateTemplateFile(
          compilation,
          compiler,
          `${root}/${customWrapperName}`,
          template.buildCustomComponentTemplate,
          this.options.fileType.templ
        )

        this.miniPlugin.generateConfigFile(compilation, compiler, `${root}/${customWrapperName}`, {
          component: true,
          styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
            [customWrapperName]: `./${customWrapperName}`,
          },
        })
      }
    })

    return customWrapperRoots
  }

  generateMainPackageRuntimeFiles (compilation: Compilation, _compiler: Compiler) {
    const { commonChunks, fileType } = this.options
    const mainPackageRoots = this.getAllMainPackageRoots()
    if (!mainPackageRoots.length) return

    const styleExt = fileType.style
    const runtimeChunks = ['app', ...commonChunks]

    mainPackageRoots.forEach(mainPackageRoot => {
      runtimeChunks.forEach(chunkName => {
        const jsFile = `${chunkName}.js`
        if (compilation.assets[jsFile]) {
          let jsContent = compilation.assets[jsFile]

          if (chunkName === 'app') {
            const { RawSource } = compilation.compiler?.webpack?.sources || require('webpack').sources
            const originalSource = String((jsContent as any).source?.() || String(jsContent))
            const registrarExpr = `(typeof globalThis.__taroRegisterRecursiveComponent==="function"||(globalThis.__taroRegisterRecursiveComponent=function(componentName){const cache=__webpack_require__.c||{};let createRecursiveComponentConfig;for(const key in cache){const exports=cache[key]&&cache[key].exports;if(exports&&typeof exports.createRecursiveComponentConfig==="function"){createRecursiveComponentConfig=exports.createRecursiveComponentConfig;break;}}if(typeof createRecursiveComponentConfig!=="function"){const modules=__webpack_require__.m||{};for(const moduleId in modules){const moduleFactory=modules[moduleId];if(!moduleFactory||typeof moduleFactory!=="function")continue;const source=String(moduleFactory);if(source.indexOf("createRecursiveComponentConfig")===-1)continue;const exports=__webpack_require__(moduleId);if(exports&&typeof exports.createRecursiveComponentConfig==="function"){createRecursiveComponentConfig=exports.createRecursiveComponentConfig;break;}}}if(typeof createRecursiveComponentConfig!=="function"){throw new Error("Cannot find createRecursiveComponentConfig in webpack modules");}Component(createRecursiveComponentConfig(componentName));}))`
            let patchedSource = originalSource

            if (/,\s*exports\.taroApp\s*=/.test(patchedSource)) {
              patchedSource = patchedSource.replace(/,\s*exports\.taroApp\s*=/, `,${registrarExpr},exports.taroApp=`)
            } else {
              patchedSource = patchedSource.replace(/exports\.taroApp\s*=/, `;${registrarExpr};exports.taroApp=`)
            }

            jsContent = new RawSource(patchedSource)
          }

          compilation.assets[`${mainPackageRoot}/${jsFile}`] = jsContent
        }

        const cssFile = `${chunkName}${styleExt}`
        if (compilation.assets[cssFile]) {
          compilation.assets[`${mainPackageRoot}/${cssFile}`] = compilation.assets[cssFile]
        }
      })

      const appOriginCss = `app-origin${styleExt}`
      if (compilation.assets[appOriginCss]) {
        compilation.assets[`${mainPackageRoot}/${appOriginCss}`] = compilation.assets[appOriginCss]
      }
    })
  }
}
