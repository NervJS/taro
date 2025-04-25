/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import path from 'node:path'

import { chalk, fs, NPM_DIR } from '@tarojs/helper'
import { DEFAULT_TERSER_OPTIONS } from '@tarojs/vite-runner/dist/utils/constants'

import HarmonyCPP from './program'
import { CPP_LIBRARY_NAME, CPP_LIBRARY_PATH, fixBuildProfile, getProcessArg, PLATFORM_NAME, updateBuildProfile } from './utils'
import { PKG_DEPENDENCIES, PKG_NAME, PKG_VERSION, PROJECT_DEPENDENCIES_NAME } from './utils/constant'

import type { IPluginContext } from '@tarojs/service'
import type { IHarmonyConfig } from '@tarojs/taro/types/compile'

const argProjectPath = getProcessArg('lib')
const argHapName = getProcessArg('hap')

export interface IOptions {
  useConfigName?: string
  /** @default "local" */
  useChoreLibrary?: 'local' | 'remote' | false | string
}

const staticDirname = 'static'
let harName = `${PKG_NAME}-${PKG_VERSION}.har`
if (!fs.existsSync(path.join(__dirname, '..', staticDirname, harName))) {
  harName = require('fast-glob').sync('**/*.har', { cwd: path.join(__dirname, '..', staticDirname) })[0] || ''
  console.log('使用 har', harName)
}
export default (ctx: IPluginContext, options: IOptions = {}) => {
  options.useChoreLibrary = options.useChoreLibrary ?? 'local'

  // 合并 harmony 编译配置到 opts
  ctx.modifyRunnerOpts(({ opts }) => {
    if (opts.platform !== PLATFORM_NAME) return

    opts.ohPackage ||= {}
    opts.ohPackage.dependencies ||= {}

    if (options.useChoreLibrary) {
      opts.chorePackagePrefix ||= `${PKG_NAME}/src/main/ets/${NPM_DIR}`
      if (options.useChoreLibrary === 'local') {
        if (!harName) {
          console.warn(chalk.yellow('未找到 .har 文件。'))
        }
        opts.ohPackage.dependencies[PKG_NAME] ||= `file:../static/${harName}`
      } else if (options.useChoreLibrary === 'remote') {
        opts.ohPackage.dependencies[PKG_NAME] ||= `^${PKG_VERSION}`
      } else {
        opts.ohPackage.dependencies[PKG_NAME] ||= options.useChoreLibrary
      }
      PROJECT_DEPENDENCIES_NAME.forEach(key => {
        opts.ohPackage.dependencies[key] ||= PKG_DEPENDENCIES[key]
      })
    } else {
      Object.keys(PKG_DEPENDENCIES).forEach(key => {
        opts.ohPackage.dependencies[key] ||= PKG_DEPENDENCIES[key]
      })
      opts.ohPackage.dependencies[CPP_LIBRARY_NAME] = CPP_LIBRARY_PATH
    }
    const harmonyConfig = ctx.ctx.initialConfig.harmony
    assertHarmonyConfig(ctx, harmonyConfig)

    const terserOptions = harmonyConfig?.terser || ctx.initialConfig.terser || { config: DEFAULT_TERSER_OPTIONS }
    terserOptions.config ||= {}
    terserOptions.config.output ||= {}
    terserOptions.config.output.comments ||= /^!/ // Note: 避免删除第一行注释影响 rawfile 代码缓存

    harmonyConfig.name ||= 'default'
    harmonyConfig.hapName ||= argHapName || 'entry'
    const { projectPath, hapName } = harmonyConfig

    opts.outputRoot = path.join(argProjectPath || projectPath, hapName, 'src/main', 'ets')
    opts.harmony = harmonyConfig

    ctx.paths.outputPath = opts.outputRoot
  })

  ctx.registerPlatform({
    name: PLATFORM_NAME,
    useConfigName: options.useConfigName || 'harmony',
    async fn ({ config }) {
      const program = new HarmonyCPP(ctx, config, options)
      await program.start()

      const { projectPath, hapName = 'entry', outputRoot } = config
      if (!options.useChoreLibrary) {
        if (hapName !== 'entry') { // Note: 如果是 entry 不需要重写 BuildProfile 路径
          fixBuildProfile(outputRoot, path.join(outputRoot, '../../..'))
        }

        const buildProfilePath = path.join(projectPath, hapName, `build-profile.${program.useJSON5 !== false ? 'json5' : 'json'}`)
        updateBuildProfile(buildProfilePath, hapName)

        const C_API_TXT = chalk.yellow('C-API')
        try {
          const cppOutPath = path.join(projectPath, hapName, 'src/main', 'cpp')
          if (!fs.existsSync(cppOutPath)) {
            console.log(`开始拉取 ${C_API_TXT} 模块...`)
            execSync(`git clone https://github.com/NervJS/taro-harmony-capi-library.git  ${cppOutPath}`, {
              cwd: path.resolve(__dirname, '..', '..', '..'),
              stdio: 'inherit',
              env: process.env,
            })
          }
        } catch (error) {
          console.log(`${C_API_TXT} 获取失败...`) // eslint-disable-line no-console
        }
      } else if (options.useChoreLibrary === 'local' && harName) {
        const harPath = path.join(argProjectPath || projectPath, staticDirname, harName)
        const harDir = path.dirname(harPath)
        fs.ensureDirSync(harDir)
        fs.emptyDirSync(harDir)
        fs.copyFileSync(
          path.join(program.harmonyCppPluginPath, staticDirname, harName),
          harPath
        )
      }
    }
  })
}

function assertHarmonyConfig (ctx: IPluginContext, config): asserts config is IHarmonyConfig {
  const NOTE_INVALID = chalk.red('[✗] ')
  const errorChalk = chalk.hex('#f00')
  const lineChalk = chalk.hex('#fff')

  function throwError (err) {
    console.log(errorChalk(`Taro 配置有误，请检查！ (${ctx.paths.configPath})`))
    console.log(`  ${NOTE_INVALID}${lineChalk(err)}`)
    process.exit(0)
  }

  if (typeof config !== 'object' || !config) {
    throwError('请设置 harmony 编译配置')
  }

  if (!config.projectPath) {
    throwError('请设置 harmony.projectPath')
  }
}
