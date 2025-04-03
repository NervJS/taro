/* eslint-disable no-console */
import path from 'node:path'

import { chalk, fs } from '@tarojs/helper'
import { readJsonSync } from '@tarojs/vite-runner/dist/utils/compiler/harmony'

export const PLATFORM_NAME = 'harmony_cpp'
export const PACKAGE_NAME = '@tarojs/plugin-platform-harmony-cpp'
export const PLUGIN_NAME = 'TaroHarmonyCPP'
export const NPM_DIR = 'npm'

export const CPP_LIBRARY_NAME = 'libTaroHarmonyLibrary.so'
export const CPP_LIBRARY_PATH = 'file:./src/main/cpp/types/taro-native-node'

export const HARMONY_SCOPES = [/^@system\./, /^@ohos\./, /^@hmscore\//, /^@(jd|taro)-oh\//]

export * from './constant'
export * from './file'

export function checkDebug() {
  return process.argv.includes('--debug') || process.argv.includes('-D')
}

export function getProcessArg (name: string, defaultValue = '') {
  const argv = process.argv
  const index = process.argv.findIndex(arg => arg.startsWith(`--${name}`))
  if (index > -1) {
    if (argv[index].includes('=')) {
      return argv[index].split('=')[1] ?? defaultValue
    } else {
      return argv[index + 1] ?? defaultValue
    }
  }
  return defaultValue
}

export const isDebug = checkDebug()

export function getProjectId (name = '') {
  const pkg = readJsonSync(path.posix.join(process.cwd(), 'package.json'))
  return `${pkg.name || name}@${pkg.version || '0.0.1'}`
}

export const SEP_RGX = /[\\/]+/g
export function isLocalPath (path: string) {
  return /^([.\\/]|[A-z]:)/.test(path)
}

export function parseLocalPath (fileName: string, sourcePath: string, sourceValue: string) {
  return sourceValue.startsWith('.')
    ? path.posix.join(path.dirname(fileName), sourceValue)
    : path.relative(sourcePath, sourceValue).replace(SEP_RGX, '/')
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
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

export function updateBuildProfile (buildProfilePath: string, hapName = 'entry') {
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
          '',
          // pages
          'toLocation',
          '',
          // '@tarojs/runtime',
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
        option.arkOptions.obfuscation.ruleOptions ||= {}
        option.arkOptions.obfuscation.ruleOptions.files ||= []
        const obfuscations = [
          './consumer-rules.txt',
          './src/main/cpp/types/taro-native-node/obfuscation-rules.txt',
        ]
        if (hapName !== 'entry') {
          option.arkOptions.obfuscation.ruleOptions.enable = true
          option.arkOptions.obfuscation.consumerFiles ||= []
          const files: string[] = option.arkOptions.obfuscation.consumerFiles
          if (!files.includes(obfuscations[0])) {
            files.push(...obfuscations)
          }
        } else {
          const files: string[] = option.arkOptions.obfuscation.ruleOptions.files
          if (!files.includes(obfuscations[0])) {
            files.push(...obfuscations)
          }
        }
      })
    }
    fs.writeJSONSync(buildProfilePath, profile, { spaces: 2 })
  } catch (error) {
    console.warn(chalk.red('更新鸿蒙配置失败：', error))
  }
}
