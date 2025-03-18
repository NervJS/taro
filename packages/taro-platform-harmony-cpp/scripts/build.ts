import { execSync } from 'node:child_process'
import path from 'node:path'

import { fs } from '@tarojs/helper'

import JDHarmony from '../src/program'
import { CPP_LIBRARY_NAME, CPP_LIBRARY_PATH, fixBuildProfile, isDebug, updateBuildProfile } from '../src/utils'
import { PKG_DEPENDENCIES, PKG_NAME, PKG_VERSION } from '../src/utils/constant'
import { appPath, buildProfilePath, config, etsOutDir, hapName, libName, npmDir, outputRoot, workspaceRoot } from './constant'

/** Note: 默认编译到 harmony_project/library 目录下
 * - 编译到 jd_hm_phone/home_library 目录下: pnpm run build:library -- --lib=jd_hm_phone
 */

if (!fs.existsSync(outputRoot)) {
  execSync(`git clone --recurse-submodules git@github.com:NervJS/taro-harmony-project.git ${libName}`, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: process.env,
  })
}

const lib = new JDHarmony({
  paths: {
    appPath,
  },
  runOpts: {
    config: {
      outputRoot: etsOutDir,
    },
  },
  initialConfig: config,
  onBuildFinish: () => {},
  modifyPageConfig: () => {},
} as any, config, {})

if (isDebug) {
  console.log('当前环境为调试模式') // eslint-disable-line no-console
} else {
  fs.removeSync(etsOutDir)
}

lib.externalDeps.forEach(([libName, _, target]) => {
  lib.moveLibraries(target || libName, path.resolve(npmDir, libName), appPath, !target)
})

process.on('exit', () => {
  fixBuildProfile(etsOutDir)
  updateBuildProfile(buildProfilePath, hapName)
  lib.handleResourceEmit(etsOutDir, appPath)
  lib.updateModulePackage(outputRoot, {
    name: PKG_NAME,
    version: PKG_VERSION,
    author: 'Taro Team',
    dependencies: Object.assign({}, PKG_DEPENDENCIES, {
      [CPP_LIBRARY_NAME]: CPP_LIBRARY_PATH,
    })
  })
})
