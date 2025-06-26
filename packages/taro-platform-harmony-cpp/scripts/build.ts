import { execSync } from 'node:child_process'
import path from 'node:path'

import { chalk, fs } from '@tarojs/helper'

import JDHarmony from '../src/program'
import { CPP_LIBRARY_NAME, CPP_LIBRARY_PATH, fixBuildProfile, isDebug, PACKAGE_NAME, STATIC_FOLDER_NAME, updateBuildProfile } from '../src/utils'
import { PKG_DEPENDENCIES, PKG_NAME, PKG_VERSION } from '../src/utils/constant'
import { appPath, buildProfilePath, config, etsOutDir, hapName, libName, npmDir, outputRoot, workspaceRoot } from './constant'

const isBuildHar = process.argv.includes('--har')

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

const deps = [...lib.externalDeps]
deps.forEach(([libName, _, target]) => {
  if (libName.startsWith(PACKAGE_NAME)) {
    lib.moveLibraries(libName.replace(PACKAGE_NAME, './'), path.resolve(npmDir, libName), appPath, false)
  } else {
    lib.moveLibraries(target || libName, path.resolve(npmDir, libName), appPath, !target)
  }
})

process.on('exit', () => {
  fixBuildProfile(etsOutDir, outputRoot)
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

  if (isBuildHar) {
    try {
      execSync(`which node & node -v`, {
        cwd: path.resolve(workspaceRoot, libName),
        stdio: 'inherit'
      })
      console.log(`开始构建 ${chalk.yellow('har')} 包...`) // eslint-disable-line no-console
      execSync(`hvigorw assembleHar --mode module -p module=library@default -p product=default -p buildMode=${isDebug ? 'debug' : 'release'} --no-daemon --no-incremental`, {
        cwd: path.resolve(workspaceRoot, libName),
        stdio: 'inherit'
      })
      console.log(`构建 ${chalk.yellow('har')} 包完成。`) // eslint-disable-line no-console

      const harPath = path.resolve(workspaceRoot, STATIC_FOLDER_NAME, `${PKG_NAME}-${PKG_VERSION}.har`)
      fs.emptyDirSync(path.dirname(harPath))
      fs.copyFileSync(
        path.resolve(outputRoot, 'build/default/outputs/default/library.har'),
        path.resolve(harPath)
      )
    } catch (err) {
      console.error(err)
    }
  }
})
