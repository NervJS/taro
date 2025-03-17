/* eslint-disable no-console */
import path from 'node:path'

import { chalk, fs, NPM_DIR } from '@tarojs/helper'
import { readJsonSync } from '@tarojs/vite-runner/dist/utils/compiler/harmony'
import { DEFAULT_TERSER_OPTIONS } from '@tarojs/vite-runner/dist/utils/constants'

import HarmonyCPP from './program'
import { CPP_LIBRARY_NAME, CPP_LIBRARY_PATH, getProcessArg, PLATFORM_NAME, SEP_RGX } from './utils'
import { PKG_DEPENDENCIES, PKG_NAME, PKG_VERSION, PROJECT_DEPENDENCIES_NAME } from './utils/constant'

import type { IPluginContext } from '@tarojs/service'
import type { IHarmonyConfig } from '@tarojs/taro/types/compile'

const argProjectPath = getProcessArg('lib')
const argHapName = getProcessArg('hap')

export interface IOptions {
  useConfigName?: string
  /** @default false */
  useChoreLibrary?: boolean
}

export default (ctx: IPluginContext, options: IOptions = {}) => {
  // 合并 harmony 编译配置到 opts
  ctx.modifyRunnerOpts(({ opts }) => {
    if (opts.platform !== PLATFORM_NAME) return

    opts.ohPackage ||= {}
    opts.ohPackage.dependencies ||= {}

    if (options.useChoreLibrary) {
      opts.chorePackagePrefix ||= `${PKG_NAME}/src/main/ets/${NPM_DIR}`
      opts.ohPackage.dependencies[PKG_NAME] ||= `^${PKG_VERSION}`
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

      if (options.useChoreLibrary === false) {
        const { projectPath, hapName = 'entry', outputRoot } = config
        if (hapName !== 'entry') { // Note: 如果是 entry 不需要重写 BuildProfile 路径
          fixBuildProfile(outputRoot, path.join(outputRoot, '../../..'))
        }

        const buildProfilePath = path.join(projectPath, hapName, `build-profile.${program.useJSON5 !== false ? 'json5' : 'json'}`)
        if (!fs.existsSync(buildProfilePath)) {
          console.log(
            chalk.yellow(
              `目标路径配置文件缺失，可能是非法的 Harmony 模块: ${buildProfilePath}`
            )
          )
        }
        try {
          const profile = readJsonSync(buildProfilePath)
          profile.buildOption.externalNativeOptions = {
            ...profile.externalNativeOptions,
            path: './src/main/cpp/CMakeLists.txt',
            arguments: '-DCMAKE_JOB_POOL_COMPILE:STRING=compile -DCMAKE_JOB_POOL_LINK:STRING=link -DCMAKE_JOB_POOLS:STRING=compile=8;link=8',
            cppFlags: '',
            abiFilters: [
              'arm64-v8a'
            ]
          }
          if (profile.buildOptionSet instanceof Array) {
            fs.writeFileSync(
              path.join(buildProfilePath, '..', 'consumer-rules.txt'),
              [
                '-keep-property-name',
                '# pages',
                'toLocation',
                '# @tarojs/runtime',
                'designRatio',
                'densityDPI',
                'densityPixels',
                'deviceWidth',
                'deviceHeight',
                'viewportWidth',
                'viewportHeight',
                'safeArea',
                'scaledDensity',
                'orientation',
                'content',
                'selectorList',
              ].join('\n')
            )
            profile.buildOptionSet.forEach((option) => {
              option.arkOptions ||= {}
              option.arkOptions.obfuscation ||= {}
              option.arkOptions.obfuscation.consumerFiles ||= []
              option.arkOptions.obfuscation.consumerFiles.push(
                './consumer-rules.txt',
                './src/main/cpp/types/taro-native-node/obfuscation-rules.txt',
              )
            })
          }
          fs.writeJSONSync(buildProfilePath, profile, { spaces: 2 })
        } catch (error) {
          console.warn(chalk.red('更新鸿蒙配置失败：', error))
        }
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

export function fixBuildProfile(lib = '', outputRoot = '') {
  const stats = fs.statSync(lib)
  if (stats.isDirectory()) {
    fs.readdirSync(lib).forEach((item) => fixBuildProfile(path.join(lib, item), outputRoot))
  } else if (stats.isFile() && lib.endsWith('.ets')) {
    let data = fs.readFileSync(lib, 'utf-8')
    const buildProfilePath = path.resolve(outputRoot, 'BuildProfile')
    const rgx = /import\s+(\S+)\s+from\s*['"]BuildProfile['"]/
    if (rgx.test(data)) {
      data = data.replace(rgx, (_, p1) => {
        return `import ${p1} from '${path.relative(path.dirname(lib), buildProfilePath).replace(SEP_RGX, '/')}'`
      })
      fs.writeFileSync(lib, data, 'utf-8')
    }
  }
}
