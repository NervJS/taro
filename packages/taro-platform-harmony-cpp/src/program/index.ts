import { execSync } from 'node:child_process'
import path from 'node:path'

import { chalk, defaultMainFields, fs, NODE_MODULES, recursiveMerge, resolveSync } from '@tarojs/helper'
import { HarmonyOS_ArkTS as HarmonyOS } from '@tarojs/plugin-platform-harmony-ets/dist'

import { NPM_DIR, PACKAGE_NAME, PLATFORM_NAME, RAWFILE_FOLDER, readJsonSync, sleep } from '../utils'
import generateDefinition, { findDTSFile, getPkgFile } from './rollup/definition'
import globalPlugin from './rollup/global-plugin'
import generatePackage from './rollup/package'
import EntryParser, { entryFileName, entryLibraryFileName } from './template/entry'
import injectEnv from './vite/inject-env'
import pagePlugin from './vite/page'
import pageResourcePlugin from './vite/page-resource'
import renderPlugin from './vite/render'
import stylePlugin from './vite/style'

import type { Alias } from '@rollup/plugin-alias'
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

  initialDependencies: string[] = []

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

    this.buildTransaction.addWrapper({
      close() {
        // that.generateInitialEntry()
      },
    })
    // Note: 注入 Taro Hooks 相关依赖
    this.apiEntryList = [
      /(@tarojs[\\/]plugin-platform-harmony|plugin-platform-harmony.*)[\\/]dist[\\/]runtime[\\/]apis\.js/,
    ]
    this.externalDeps.push(['@tarojs/shared', /^@tarojs[\\/]shared$/])
    this.externalDeps.push(['react-reconciler', /^react-reconciler$/])
    this.externalDeps.push(['react-reconciler/constants', /^react-reconciler[\\/]constants/])
    this.externalDeps.push(['scheduler', /^scheduler$/])
    this.externalDeps.push(['tslib', /^tslib$/])
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
    return path.resolve(this.harmonyCppPluginPath, 'dist', './runtime/apis')
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
    if (this.ctx.runOpts?.options?.args?.onlyBundle) {
      that.ctx.modifyViteConfig?.((opt) => {
        opt.viteConfig.plugins.push(
          pagePlugin.call(this, opt),
          renderPlugin.call(this, opt),
          stylePlugin.call(this, opt),
          globalPlugin.call(this, opt),
          injectEnv.call(this, opt)
        )
      })
    } else {
      that.ctx.modifyViteConfig?.((opt) => {
        opt.viteConfig.plugins.push(
          pageResourcePlugin.call(this, opt),
          pagePlugin.call(this, opt),
          renderPlugin.call(this, opt),
          // resourcePlugin.call(this, opt),
          stylePlugin.call(this, opt),
          globalPlugin.call(this, opt),
          injectEnv.call(this, opt)
        )
      })
    }
  }

  async moveLibraries(lib: string, target = '', basedir = this.ctx.paths.appPath, sync = false): Promise<void> {
    let outputPath = target.replace(new RegExp(`\\b${NODE_MODULES}\\b`), NPM_DIR)
    if (
      this.ctx.runOpts.config.chorePackagePrefix ||
      [
        /@tarojs[\\/]taro[\\/]types/,
        /@tarojs[\\/]components(?![\\/]tag\b)/,
        /@tarojs[\\/]plugin-platform-harmony-ets[\\/]dist[\\/]components-harmony-ets/,
        /@tarojs[\\/]plugin-platform-harmony-cpp[\\/]dist[\\/]runtime[\\/]runtime-harmony/,
        /[\\/]src[\\/]main[\\/]resources[\\/]/,
      ].findIndex(rgx => rgx.test(target)) > -1
    ) {
      return super.moveLibraries(lib, target, basedir, sync)
    }

    const inputPath = resolveSync(lib, {
      basedir,
      extensions: this.extensions,
      mainFields: [...defaultMainFields],
      preserveSymlinks: false,
    })
    if (!inputPath) {
      return super.moveLibraries(lib, target, basedir, sync)
    }

    const isFile = path.basename(inputPath).includes(path.basename(lib))
    if (isFile) {
      outputPath = path.join(
        path.dirname(outputPath),
        path.basename(outputPath, path.extname(outputPath)),
      )
    }

    console.log(`开始移动 ${chalk.yellow(inputPath)} 到 ${outputPath}...\n`) // eslint-disable-line no-console

    const aliasOptions: Alias[] = []
    const externalInclude: (string | RegExp)[] = []
    const externalExclude: (string | RegExp)[] = []
    if (/@tarojs[\\/]runtime$/.test(outputPath)) {
      externalInclude.push(/@tarojs[\\/]plugin-framework-react[\\/]dist[\\/]runtime/)
      externalExclude.push(/@tarojs[\\/]runtime/)
    } else if (/@tarojs[\\/]taro$/.test(outputPath)) {
      externalExclude.push(/@tarojs[\\/]plugin-platform-harmony-ets[\\/]dist[\\/]apis/)
    } else if (lib === 'react/jsx-runtime') {
      aliasOptions.push({
        find: '../',
        replacement: 'react',
      })
    } else if (lib === 'react-reconciler') {
      aliasOptions.push(
        {
          find: '../../react',
          replacement: 'react',
        },
        {
          find: '../../scheduler',
          replacement: 'scheduler',
        }
      )
    }
    const outputFile = isFile ? outputPath + '.js' : path.join(outputPath, 'index.js')
    const needDeclaration = /@tarojs[\\/](runtime|taro)/.test(outputPath)
    if (!fs.existsSync(inputPath)) {
      await sleep(100)
    }
    try {
      await generatePackage.call(this, {
        input: inputPath,
        output: outputFile,
        aliasOptions,
        externalsOptions: {
          include: externalInclude,
          exclude: externalExclude,
        },
        replaceOptions: {
          ...this.defineConstants,
          global: 'globalThis',
        },
        declaration: needDeclaration,
      })
      this.initialDependencies.push(getPkgFile(outputFile, NPM_DIR))
    } catch (error) {
      console.error(`移动 ${chalk.yellow(inputPath)} 到 ${outputPath} 失败：${error.message}\n`, error.stack) // eslint-disable-line no-console
    }
    // Note: 非 ETS 依赖需要能注入到 JSVM 中
    const resourcesFile = outputFile.replace(/[\\/]ets[\\/]/g, '/resources/rawfile/')
    fs.moveSync(outputFile, resourcesFile, { overwrite: true })
    // generateV8Cache(resourcesFile)

    let outputDir = path.dirname(outputFile)
    while (fs.readdirSync(outputDir, { recursive: true }).length === 0) {
      fs.removeSync(outputDir)
      outputDir = path.dirname(outputDir)
    }

    if (!needDeclaration) return
    const dtsPath = isFile ? outputPath + '.d.ts' : path.join(outputPath, 'index.d.ts')
    if (fs.existsSync(dtsPath)) {
      if (!fs.readFileSync(dtsPath, 'utf8')) {
        const dts = findDTSFile(lib, basedir, NPM_DIR)
        if (dts) {
          if (lib.startsWith('react/')) {
            console.log(`将从 ${dts} 复制 ${chalk.yellow(lib)} 类型文件...\n`) // eslint-disable-line no-console
            fs.copyFileSync(dts!, dtsPath)
          } else {
            console.log(`将基于 ${dts} 生成 ${chalk.yellow(lib)} 类型文件...\n`) // eslint-disable-line no-console
            try {
              await generateDefinition.call(this, {
                input: dts,
                output: dtsPath,
                aliasOptions,
              })
            } catch (error) {
              console.error(`生成 ${chalk.yellow(lib)} 类型文件失败：${error.message}\n`, error.stack) // eslint-disable-line no-console
            }
          }
        } else {
          return fs.removeSync(dtsPath) // Note: 空类型文件会导致强类型校验失败
        }
      }

      // Note: 生成 index.d.ts 时，移除多余的类型声明
      let code = fs.readFileSync(dtsPath, 'utf8')
      code = code
        .replace(/\/\/\/\s*<reference\stypes=+.*\/>\s*\n/g, '') // Note: 移除多余的类型声明
      fs.writeFileSync(dtsPath, code)
    }
    console.log(`移动 ${chalk.yellow(inputPath)} 到 ${outputPath} 成功。\n`) // eslint-disable-line no-console
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
    fs.writeJsonSync(packageJsonFile, pkg, { spaces: 2 })

    let ohpmPath = ohpm
    let localOhpmPath = ''
    try {
      localOhpmPath = execSync(`${process?.platform === 'win32' ? 'where' : 'which'} ohpm`)
        .toString()
        .replace(/\n/, '')
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

  generateInitialEntry() {
    const { chorePackagePrefix, outputRoot } = this.ctx.runOpts.config
    if (!chorePackagePrefix) {
      const parser = new EntryParser(this.initialDependencies)

      fs.writeFileSync(path.join(outputRoot, NPM_DIR, `${entryFileName}.ets`), parser.parse())
      fs.writeFileSync(
        path.join(outputRoot, '..', RAWFILE_FOLDER, NPM_DIR, `${entryLibraryFileName}.js`),
        parser.parseLibrary()
      )
    }
  }
}
