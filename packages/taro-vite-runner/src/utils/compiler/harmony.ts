import path from 'node:path'

import {
  chalk,
  fs,
  isAliasPath,
  readConfig,
  recursiveMerge,
  replaceAliasPath,
  resolveMainFilePath,
  resolveSync,
} from '@tarojs/helper'
import { isArray, isFunction } from '@tarojs/shared'
import JSON5 from 'json5'

import defaultConfig from '../../defaultConfig/defaultConfig.harmony'
import { QUERY_IS_NATIVE_SCRIPT } from '../../harmony/ets'
import { TARO_TABBAR_PAGE_PATH } from '../../harmony/page'
import { componentConfig } from '../../utils/component'
import { parseRelativePath } from '..'
import { CompilerContext } from './base'

import type { AppConfig, PageConfig } from '@tarojs/taro'
import type {
  ViteAppMeta,
  ViteFileType,
  ViteHarmonyBuildConfig,
  ViteHarmonyCompilerContext,
  ViteNativeCompMeta,
  VitePageMeta,
} from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'

export function readJsonSync(file: string) {
  const ext = path.extname(file)
  if (ext === '.json5') {
    const raw = fs.readFileSync(file, 'utf-8')
    return JSON5.parse(raw)
  }
  return fs.readJSONSync(file)
}

export class TaroCompilerContext extends CompilerContext<ViteHarmonyBuildConfig> implements ViteHarmonyCompilerContext {
  commonChunks: string[]
  fileType: ViteFileType
  useETS: boolean
  useJSON5: boolean
  // 用于插件去拓展额外的组件
  extraComponents: string[] = []
  nativeExt = ['.ets']
  nativeComponents = new Map<string, ViteNativeCompMeta>()
  ohpmPackageList: string[] = []

  constructor(appPath: string, taroConfig: ViteHarmonyBuildConfig) {
    super(appPath, taroConfig)

    // 收集所有配置定义的鸿蒙
    this.ohpmPackageList = Object.values(this.taroConfig?.harmony?.ohPackage ?? {}).reduce((acc, cur) => {
      return [...acc, ...Object.keys(cur)]
    }, [])

    this.fileType = this.taroConfig.fileType
    this.useETS = taroConfig.useETS !== false
    this.useJSON5 = taroConfig.useJSON5 !== false
    this.commonChunks = this.getCommonChunks()
    this.app = this.getApp()
    this.pages = this.getPages()
    this.collectNativeComponents(this.app)
    if (this.taroConfig.isBuildNativeComp) {
      this.components = this.getComponents()

      this.components?.length > 0 &&
        this.components.forEach((component) => {
          this.collectNativeComponents(component)
        })
    }
  }

  processConfig() {
    this.taroConfig = recursiveMerge({}, defaultConfig, this.rawTaroConfig)
  }

  getCommonChunks() {
    const { commonChunks } = this.taroConfig
    const defaultCommonChunks = ['runtime', 'vendors', 'taro', 'common']
    let customCommonChunks: string[] = defaultCommonChunks
    if (isFunction(commonChunks)) {
      customCommonChunks = (commonChunks as ((commonChunks: string[]) => string[]))(defaultCommonChunks.concat()) || defaultCommonChunks
    } else if (isArray(commonChunks) && commonChunks!.length) {
      customCommonChunks = commonChunks as string[]
    }
    return customCommonChunks
  }

  compilePage = (pageName: string): VitePageMeta => {
    const { sourceDir, frameworkExts, nativeExt } = this

    const scriptPath = resolveMainFilePath(path.join(sourceDir, pageName), frameworkExts)
    const nativePath = resolveMainFilePath(path.join(sourceDir, pageName), nativeExt)
    const configPath = this.getConfigFilePath(scriptPath)
    const config: PageConfig = readConfig(configPath, this.taroConfig) || {}

    const pageMeta = {
      name: pageName,
      scriptPath,
      configPath,
      config,
      isNative: this.isNativePageORComponent(nativePath),
    }

    this.filesConfig[this.getConfigFilePath(pageMeta.name)] = {
      path: configPath,
      content: config,
    }

    // 编译原生组件的时候，不要把 pages 里引用的自定义组件带上
    if (!this.taroConfig.isBuildNativeComp) {
      this.collectNativeComponents(pageMeta)
    }
    this.configFileList.push(pageMeta.configPath)

    return pageMeta
  }

  resolvePageImportPath (scriptPath: string, importPath: string) {
    const alias = this.taroConfig.alias
    if (isAliasPath(importPath, alias)) {
      importPath = replaceAliasPath(scriptPath, importPath, alias)
    }
    return importPath
  }

  collectNativeComponents(meta: ViteAppMeta | VitePageMeta | ViteNativeCompMeta): ViteNativeCompMeta[] {
    const { name, scriptPath, config } = meta
    const { usingComponents } = config

    const list: ViteNativeCompMeta[] = []
    if (!usingComponents) return list

    Object.entries(usingComponents).forEach(([compName, value]) => {
      const compPath = value instanceof Array ? value[0] : value
      const exportName = value instanceof Array ? value[1] : 'default'
      usingComponents[compName] = this.resolvePageImportPath(scriptPath, compPath)

      // 如果是鸿蒙的包
      if (this.ohpmPackageList?.length && new RegExp(`^(${this.ohpmPackageList.join('|')})`).test(compPath)) {
        const nativeCompMeta: ViteNativeCompMeta = {
          name: compName,
          exportName,
          scriptPath: compPath,
          config: {},
          configPath: '',
          isNative: true,
          templatePath: compPath,
          isPackage: true,
        }
        this.nativeComponents.set(compPath, nativeCompMeta)
        return
      }

      const compScriptPath = resolveMainFilePath(path.resolve(path.dirname(scriptPath), compPath))

      if (this.nativeComponents.has(compScriptPath)) return

      const ETSPath = this.getETSPath(compScriptPath)

      if (!fs.existsSync(compScriptPath) || !ETSPath) {
        return this.logger.warn(`找不到页面 ${name} 依赖的自定义组件：${compScriptPath}`)
      }

      const nativeCompMeta: ViteNativeCompMeta = {
        name: compName.replace(/(\w)-(\w)/g, (_, p1, p2) => {
          return p1 + p2.toUpperCase()
        }),
        exportName,
        scriptPath: compScriptPath,
        config: {},
        configPath: '',
        templatePath: ETSPath,
        isNative: true,
      }
      this.nativeComponents.set(compScriptPath, nativeCompMeta)
      if (!componentConfig.thirdPartyComponents.has(compName) && !meta.isNative) {
        componentConfig.thirdPartyComponents.set(compName, new Set())
      }

      list.push(...this.collectNativeComponents(nativeCompMeta), nativeCompMeta)
    })
    return list
  }

  generateNativeComponent (rollupCtx: PluginContext, meta: ViteNativeCompMeta, implicitlyLoadedAfterOneOf: string[] = []) {
    if (meta.isGenerated || meta.isPackage) return

    rollupCtx.emitFile({
      type: 'chunk',
      id: meta.templatePath + QUERY_IS_NATIVE_SCRIPT,
      fileName: path.relative(this.sourceDir, meta.templatePath) + QUERY_IS_NATIVE_SCRIPT,
      implicitlyLoadedAfterOneOf
    })
    meta.isGenerated = true
  }

  modifyHarmonyResources(id = '', data: any = {}) {
    const { outputRoot = 'dist' } = this.taroConfig
    const [, key, value] = id.match(/^\$(.+):(.+)$/) || []
    if (!key || !value) {
      return console.warn(chalk.red(`无效的资源 ID：${id}`))
    }
    const isProfile = key === 'profile'
    const targetPath = path.join(path.resolve(outputRoot, '..'), 'resources/base', isProfile ? 'profile' : 'element')
    const fileName = `${isProfile ? value : key}.json`
    const configPath = path.join(targetPath, fileName)
    let config = {}
    try {
      config = readJsonSync(configPath)
    } catch (e) {} // eslint-disable-line no-empty
    if (isProfile) {
      Object.assign(config, data)
    } else {
      const list = config[key] || []
      const idx = list.findIndex((item) => item.name === value)
      if (idx >= 0) {
        list[idx].value = data
      } else {
        list.push({
          name: value,
          value: data,
        })
      }
    }
    fs.ensureDirSync(path.dirname(configPath))
    fs.writeJsonSync(configPath, config, { spaces: 2 })
  }

  // Note: 修改 harmony Hap 的配置文件，当前仅支持注入路由配置
  modifyHarmonyConfig(config: Partial<AppConfig> = {}) {
    const { tabBar } = config
    const pages = (this.pages || []).map((item) => item.name)
    const { projectPath, hapName = 'entry', outputRoot = 'dist', name = 'default' } = this.taroConfig
    const designWidth = this.taroConfig.designWidth || this.taroConfig.postcss?.pxtransform?.config?.designWidth || 750
    const buildProfilePath = path.join(projectPath, `build-profile.${this.useJSON5 !== false ? 'json5' : 'json'}`)
    const srcPath = `./${hapName}`
    const hapConfigPath = path.join(
      path.resolve(outputRoot, '..'),
      `${this.useJSON5 !== false ? 'module.json5' : 'config.json'}`
    )
    try {
      const profile = readJsonSync(buildProfilePath)
      profile.modules ||= []
      const target = profile.modules[0]
      if (target) {
        target.name = name
        target.srcPath = srcPath
      } else {
        profile.modules.push({
          name,
          srcPath,
          targets: [
            {
              name: 'default',
              applyToProducts: ['default'],
            },
          ],
        })
      }
      fs.writeJsonSync(buildProfilePath, profile, { spaces: 2 })

      const hapConfig = readJsonSync(hapConfigPath)
      const window = {
        designWidth: (typeof designWidth === 'function' ? designWidth() : designWidth) || 750,
        autoDesignWidth: false,
      }
      hapConfig.module ||= {}
      if (this.useJSON5 !== false) {
        let pageMetaId = '$profile:main_pages'
        // Stage 模型
        const target = hapConfig.module
        if (target) {
          const appId = config.appId || 'app'
          const entryPath = path.join(this.taroConfig.outputRoot || 'dist', `${appId}.ets`)
          const srcEntry = parseRelativePath(path.dirname(hapConfigPath), entryPath)
          target.name = name
          target.mainElement = appId
          const ability = target.abilities?.[0]
          if (!this.taroConfig.blended && !this.taroConfig.isBuildNativeComp) {
            if (ability) {
              ability.name = appId
              ability.srcEntry = srcEntry
            } else {
              target.abilities ||= []
              target.abilities.push({
                name: appId,
                srcEntry,
                description: '$string:ability_desc',
                icon: '$media:icon',
                label: '$string:ability_label',
                startWindowIcon: '$media:icon',
                startWindowBackground: '$color:start_window_background',
                exported: true,
              })
            }
          }
          if (typeof target.pages === 'string') {
            pageMetaId = target.pages
          } else {
            target.pages = pageMetaId
          }
        }

        const etsPage: string[] = []
        const tabBarList = tabBar?.list || []
        const tabBarLength = tabBarList.length || 0
        if (tabBarLength > 1) {
          etsPage.push(TARO_TABBAR_PAGE_PATH)
          etsPage.push(...pages.filter((item) => tabBarList.every((tab) => tab.pagePath !== item)))
        } else {
          etsPage.push(...pages)
        }

        if (!this.taroConfig.isBuildNativeComp) {
          this.modifyHarmonyResources(pageMetaId, {
            src: etsPage,
            window,
          })
        }
        /**
         * TOD0: 将 app 其配置为 mainElement 入口
         */
      } else {
        // FA 模型
        hapConfig.module.js ||= []
        const jsFAs = hapConfig.module.js
        const target = jsFAs.find((item) => item.name === name)
        const mode = {
          syntax: this.useETS ? 'ets' : 'hml',
          type: 'pageAbility',
        }
        if (target) {
          if (JSON.stringify(target.pages) === JSON.stringify(pages)) return
          target.mode = mode
          target.pages = pages
          target.window = window
        } else {
          jsFAs.push({
            name,
            mode,
            pages,
            window,
          })
        }
      }
      fs.writeJsonSync(hapConfigPath, hapConfig, { spaces: 2 })
    } catch (error) {
      console.warn(chalk.red('设置鸿蒙 Hap 配置失败：', error))
    }
  }

  // Note: 更新 oh-package 中项目依赖声明
  modifyHostPackage(hmsDeps: Record<string, string> = {}, hmsDevDeps: Record<string, string> = {}) {
    const { projectPath, hapName = 'entry', ohPackage = {} } = this.taroConfig
    const packageJsonFile = path.join(
      projectPath,
      hapName,
      `${this.useJSON5 !== false ? 'oh-package.json5' : 'package.json'}`
    )

    const isExists = fs.pathExistsSync(packageJsonFile)
    if (!isExists) return

    let pkg = readJsonSync(packageJsonFile)
    pkg.dependencies ||= {}
    for (const dep in hmsDeps) {
      pkg.dependencies[dep] = hmsDeps[dep]
    }
    pkg.devDependencies ||= {}
    for (const dep in hmsDevDeps) {
      pkg.devDependencies[dep] = hmsDevDeps[dep]
    }
    pkg = recursiveMerge(pkg, ohPackage)
    fs.writeJsonSync(packageJsonFile, pkg, { spaces: 2 })

    return pkg
  }

  /** 工具函数 */
  getScriptPath(filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.script)
  }

  getStylePath(filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.style)
  }

  getConfigPath(filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.config)
  }

  getETSPath(filePath: string) {
    return resolveSync(filePath, { extensions: this.nativeExt })
  }
}
