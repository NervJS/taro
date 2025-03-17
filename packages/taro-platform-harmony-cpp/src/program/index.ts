import { execSync } from 'node:child_process'
import path from 'node:path'

import { chalk, fs, recursiveMerge, resolveSync } from '@tarojs/helper'
import { HarmonyOS_ArkTS as HarmonyOS } from '@tarojs/plugin-platform-harmony-ets/dist'

import { NPM_DIR, PACKAGE_NAME, PLATFORM_NAME, readJsonSync } from '../utils'
import appPlugin from './vite/app'
import injectEnv from './vite/inject-env'
import pagePlugin from './vite/page'
import renderPlugin from './vite/render'
import resourcePlugin from './vite/resource'
import stylePlugin from './vite/style'

import type { IPluginContext, TConfig } from '@tarojs/service'
import type { IHarmonyConfig } from '@tarojs/taro/types/compile'
import type { IOptions } from '../index'

export default class Harmony extends HarmonyOS {
  platform = PLATFORM_NAME
  runtimePath = `${PACKAGE_NAME}/dist/runtime/runtime-harmony`

  useETS = true
  useJSON5 = true

  get context() {
    return this.ctx
  }

  constructor(ctx: IPluginContext, config: TConfig, public option: IOptions) {
    // @ts-ignore
    super(ctx, config) // Note: link 时，ctx 类型可能无法对齐，此处忽略类型检查
    const that = this
    this.externalDeps.push([this.runtimePath, new RegExp(`^${this.runtimePath.replace(/([-\\/$])/g, '\\$1')}$`)])
    this.externalDeps.forEach(e => {
      if (e[0] === '@tarojs/react') {
        e[2] = this.runtimeFrameworkReconciler
      }
    })
    this.harmonyScope.push(/@jd-oh\//, /@kit\./, /^BuildProfile$/)
    this.setupTransaction.addWrapper({
      init() {
        that.modifyPageConfig()
      },
    })
    // Note: 注入 Taro Hooks 相关依赖
    this.apiEntryList = [
      /(@tarojs[\\/]plugin-platform-harmony-cpp|plugin-platform-harmony-cpp)[\\/]dist[\\/]runtime[\\/]apischunk[\\/]index\.js/,
    ]
  }

  get harmonyPluginPath () {
    let packagePath = ''
    try {
      // Note: 本地或通过包引入
      packagePath = path.dirname(resolveSync('@tarojs/plugin-platform-harmony-ets')!)
    } catch (e) {} // eslint-disable-line no-empty
    if (!packagePath) {
      // Note: Link 引入
      packagePath = path.dirname(resolveSync('@tarojs/plugin-platform-harmony-ets', { basedir: process.cwd() })!)
    }
    return packagePath
  }

  get harmonyCppPluginPath () {
    let packagePath = ''
    try {
      // Note: 本地或通过包引入
      packagePath = path.dirname(resolveSync(PACKAGE_NAME)!)
    } catch (e) {} // eslint-disable-line no-empty
    if (!packagePath) {
      try {
        // Note: Link 引入
        packagePath = path.dirname(resolveSync(PACKAGE_NAME, { basedir: process.cwd() })!)
      } catch (e) {} // eslint-disable-line no-empty
    }
    if (!packagePath) {
      // Note: 本地 build-library 时，可能会找不到自己，此时使用 process.cwd() 作为 fallback
      packagePath = process.cwd()
    }
    return packagePath
  }

  get apiLibrary() {
    return path.resolve(this.harmonyCppPluginPath, 'dist', './runtime/apischunk')
  }

  get componentLibrary() {
    return path.join(this.harmonyCppPluginPath, 'dist', './runtime/components')
  }

  get runtimeLibrary() {
    return path.join(this.harmonyCppPluginPath, 'dist', './runtime/runtime-cpp')
  }

  get runtimeFrameworkLibrary() {
    return path.join(this.harmonyCppPluginPath, 'dist', `./runtime/framework`)
  }

  get runtimeFrameworkReconciler() {
    return path.join(this.harmonyCppPluginPath, 'dist', `./runtime/framework-reconciler`)
  }

  modifyPageConfig(): void {
    const that = this
    that.ctx.modifyViteConfig?.(opt => {
      opt.viteConfig.plugins.push(
        appPlugin.call(this, opt),
        pagePlugin.call(this, opt),
        renderPlugin.call(this, opt),
        resourcePlugin.call(this, opt),
        stylePlugin.call(this, opt),
        injectEnv.call(this, opt),
      )
    })
  }

  // Note: 更新 oh-package 中项目依赖声明
  updateModulePackage (
    outputRoot: string,
    ohPackage: Exclude<IHarmonyConfig['ohPackage'], undefined> = {},
    ohpm?: string,
  ) {
    const packageJsonFile = path.join(outputRoot, `${this.useJSON5 !== false ? 'oh-package.json5' : 'package.json'}`)

    const isExists = fs.pathExistsSync(packageJsonFile)
    if (!isExists) return

    const pkg = recursiveMerge(readJsonSync(packageJsonFile), ohPackage)
    pkg.types = './src/main/ets/npm/@tarojs/taro/index.d.ts'
    fs.writeJsonSync(packageJsonFile, pkg, { spaces: 2 })

    let ohpmPath = ohpm
    let localOhpmPath = ''
    try {
      localOhpmPath = execSync(`${process?.platform === 'win32' ? 'where' : 'which'} ohpm`).toString().replace(/\n/, '')
    } catch (_) {
      localOhpmPath = ''
    }
    ohpmPath = ohpm || localOhpmPath || '~/Library/Huawei/ohpm/bin/ohpm'

    try {
      console.log(`开始 ${chalk.yellow('ohpm install')} 脚本执行...\n`) // eslint-disable-line no-console
      execSync(`${ohpmPath} install`, { cwd: outputRoot, stdio: 'inherit' })
      console.log(`执行 ${chalk.yellow('ohpm install')} 脚本成功。\n`) // eslint-disable-line no-console
    } catch (e) {
      console.error(
        `自动安装依赖失败，请手动执行 ${chalk.yellow(
          'ohpm install'
        )} 或在 DevEco Studio 中打开 oh-package.json5 并点击 ${chalk.yellow('Sync Now')} 按钮`
      )
    }

    if (pkg.main) {
      const mainPath = path.join(outputRoot, pkg.main)
      fs.writeFileSync(mainPath, `export * from './src/main/ets/${NPM_DIR}/@tarojs/taro'`)
    }
  }
}
