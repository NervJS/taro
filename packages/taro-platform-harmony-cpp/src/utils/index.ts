import path from 'node:path'

import { fs } from '@tarojs/helper'

export const PLATFORM_NAME = 'harmony_cpp'
export const PACKAGE_NAME = '@tarojs/plugin-platform-harmony-cpp'
export const PLUGIN_NAME = 'TaroHarmonyCPP'
export const NPM_DIR = 'npm'

export const CPP_LIBRARY_NAME = 'libTaroHarmonyLibrary.so'
export const CPP_LIBRARY_PATH = 'file:./src/main/cpp/types/taro-native-node'

export const HARMONY_SCOPES = [/^@system\./, /^@ohos\./, /^@hmscore\//, /^@jd-oh\//]

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
  const pkg = fs.readJsonSync(path.posix.join(process.cwd(), 'package.json'))
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
