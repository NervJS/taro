import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { chalk } from '@tarojs/helper'
import * as child_process from 'child_process'
import * as semver from 'semver'

import { printDevelopmentTip } from '../../util'

import type { IPluginContext } from '@tarojs/service'

function checkReactNativeDependencies (packageInfo): boolean {
  const packageNames = ['react', 'react-native', '@tarojs/taro-rn', '@tarojs/rn-runner']
  const { dependencies = {}, devDependencies = {} } = packageInfo
  for (let i = 0; i < packageNames.length; i++) {
    if (!dependencies[packageNames[i]] && !devDependencies[packageNames[i]]) {
      return false
    }
  }
  return true
}

function hasReactNativeBabelPreset (packageInfo): boolean {
  const presets = ['@react-native/babel-preset', 'metro-react-native-babel-preset']
  return ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].some(group =>
    presets.some(preset => Object.prototype.hasOwnProperty.call(packageInfo[group] || {}, preset))
  )
}

function usesReactNative073 (packageInfo): boolean {
  const ranges = ['dependencies', 'devDependencies']
    .filter(group => Object.prototype.hasOwnProperty.call(packageInfo[group] || {}, 'react-native'))
    .map(group => packageInfo[group]['react-native'])

  return ranges.length > 0 && ranges.every(range => {
    if (typeof range !== 'string' || !range.trim()) return false
    const validRange = semver.validRange(range)
    if (!validRange) return false
    const minimum = semver.minVersion(validRange)
    return minimum !== null && minimum.prerelease.length === 0 &&
      semver.subset(validRange, '>=0.73.0 <0.74.0')
  })
}

function makeSureReactNativeInstalled (workspaceRoot: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const packageInfo = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'package.json'), {
      encoding: 'utf8'
    }))

    const coreInstalled = checkReactNativeDependencies(packageInfo)
    const presetDeclared = hasReactNativeBabelPreset(packageInfo)
    if (coreInstalled && (presetDeclared || !usesReactNative073(packageInfo))) {
      resolve()
    } else {
      // 便于开发时切换版本
      const devTag = process.env.DEVTAG || ''
      console.log('Installing React-Native related packages:')
      const babelPreset = '@react-native/babel-preset@^0.73.18'
      let packages = coreInstalled
        ? babelPreset
        : `react@^18.2.0 react-dom@^18.2.0 react-native@^0.73.1 @react-native/metro-config@^0.73.2 expo@~50.0.2 @tarojs/taro-rn${devTag} @tarojs/components-rn${devTag} @tarojs/rn-runner${devTag} @tarojs/rn-supporter${devTag} @tarojs/runtime-rn${devTag}`
      if (!coreInstalled && !presetDeclared) packages += ` ${babelPreset}`
      console.log(packages)
      // windows下不加引号的话，package.json中添加的依赖不会自动带上^
      packages = packages.split(' ').map(str => `"${str}"`).join(' ')
      let installCmd = `npm install ${packages} --save`
      if (fs.existsSync(path.join(workspaceRoot, 'yarn.lock'))) {
        installCmd = `yarn add ${packages}${coreInstalled ? '' : ' --force'}`
      }
      if (fs.existsSync(path.join(workspaceRoot, 'pnpm-lock.yaml'))) {
        installCmd = `pnpm add ${packages}`
      }
      child_process.exec(installCmd, { cwd: workspaceRoot }, error => {
        if (error) {
          reject(error)
          return
        }
        console.log(chalk.green(`React-Native related packages have been installed successfully.${os.EOL}${os.EOL}`))
        console.log(`${chalk.yellow('ATTEHNTION')}: Package.json has been modified automatically, please submit it by yourself.${os.EOL}${os.EOL}`)
        resolve()
      })
    }
  })
}

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'rn',
    useConfigName: 'rn',
    async fn ({ config }) {
      const { appPath, nodeModulesPath } = ctx.paths
      const { npm } = ctx.helper
      const {
        deviceType = 'android',
        port,
        resetCache,
        publicPath,
        bundleOutput,
        sourcemapOutput,
        sourceMapUrl,
        sourcemapSourcesRoot,
        assetsDest,
        qr
      } = ctx.runOpts.options

      printDevelopmentTip('rn')

      // 准备 rnRunner 参数
      const rnRunnerOpts = {
        ...config,
        nodeModulesPath,
        deviceType,
        port,
        qr,
        resetCache,
        publicPath,
        bundleOutput,
        sourcemapOutput,
        sourceMapUrl,
        sourcemapSourcesRoot,
        assetsDest,
        buildAdapter: config.platform,
      }

      if (!rnRunnerOpts.entry) {
        rnRunnerOpts.entry = 'app'
      }

      makeSureReactNativeInstalled(appPath).then(async () => {
        // build with metro
        const rnRunner = await npm.getNpmPkg('@tarojs/rn-runner', appPath)
        await rnRunner(appPath, rnRunnerOpts)
      }, error => {
        console.log(chalk.red('Error when detecting React-Native packages:'))
        console.log(error)
        console.log(`${chalk.greenBright('TIP')}: 1) Try to remove React-Native dependencies in package.json and shoot again; 2) Install the packages above manually.`)
      })
    }
  })
}
