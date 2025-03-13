import path from 'node:path'

import { NODE_MODULES } from '@tarojs/helper'
import { PLATFORM_TYPE } from '@tarojs/shared'

import { getProcessArg, PKG_VERSION, PLATFORM_NAME } from '../src/utils'

export const libName = getProcessArg('lib', 'harmony_library')
export const hapName = getProcessArg('hap', 'library')

/** Note: 默认编译到 harmony_library/library 目录下 */

export const appPath = path.dirname(__dirname)
export const workspaceRoot = path.resolve(__dirname, '..', '..', '..')
export const outputRoot = path.resolve(workspaceRoot, libName, hapName)
export const etsOutDir = path.resolve(outputRoot, 'src/main', 'ets')
export const cppOutPath = path.join(libName, hapName, 'src/main', 'cpp')
export const buildProfilePath = path.resolve(outputRoot, 'build-profile.json5')
export const npmDir = path.resolve(etsOutDir, NODE_MODULES)

export const config = {
  defineConstants: {},
  env: {
    FRAMEWORK: 'react',
    NODE_ENV: /[a-z]/.test(PKG_VERSION) ? 'development' : 'production',
    TARO_ENV: PLATFORM_NAME,
    TARO_PLATFORM: PLATFORM_TYPE.HARMONY,
    TARO_VERSION: PKG_VERSION,
    SUPPORT_TARO_POLYFILL: 'disabled',
  },
  framework: 'react',
}
