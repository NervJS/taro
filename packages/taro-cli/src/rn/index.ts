import { BUILD_TYPES } from '../util/constants'
import { IBuildOptions } from '../util/types'
import * as fs from 'fs-extra'
import { setBuildData, setIsProduction, buildWithWebpack, IBuildData } from './buildWithWebpack'
import Builder from '../build'
import * as Util from '../util'
import { hasRNDep, updatePkgJson } from './helper'
import * as path from 'path'
import { execSync, spawn, spawnSync, SpawnSyncOptions } from 'child_process'
import chalk from 'chalk'
// import { convertToJDReact } from '../jdreact/convert_to_jdreact'

const tcpPortUsed = require('tcp-port-used')

// const TEMP_DIR_NAME = 'rn_temp'
const BUNDLE_DIR_NAME = 'rn_bundle'

// 兼容 jdreact
export async function build (
  appPath: string, {watch, type = BUILD_TYPES.RN, envHasBeenSet = false, port = 8081, release}: IBuildOptions,
  customBuildData: Partial<IBuildData> | null | undefined, builder: Builder) {
  process.env.TARO_ENV = BUILD_TYPES.RN
  await Util.checkCliAndFrameworkVersion(appPath, BUILD_TYPES.RN)
  if (!hasRNDep(appPath)) {
    await updatePkgJson(appPath)
  }
  const buildData = setBuildData(appPath, type, customBuildData)
  process.env.TARO_ENV = type
  if (!envHasBeenSet) {
    setIsProduction(process.env.NODE_ENV === 'production' || !watch)
  }
  fs.ensureDirSync(buildData.outputDir)
  await buildWithWebpack({
    appPath,
    watch
  }, builder)
  if (!watch) {
    buildBundle(buildData.outputDir)
    return
  }
  tcpPortUsed.check(port, '127.0.0.1').then((inUse) => {
    if (inUse) {
      console.log(chalk.yellow(`⚠️  端口 ${port} 被占用，启动 Metro Server 失败！`))
      console.log(chalk.yellow(`如果 Metro Server 已启动，请确保 Metro Server 监听目录为：${appPath}。`))
      console.log('\n\n')
    } else {
      try {
        startServerInNewWindow({port, appPath})
        console.log(chalk.green(`启动 Metro Server 成功！监听目录：${appPath}。`))
        console.log('\n\n')
      } catch (e) {
        console.log(chalk.yellow(`🙅 启动 Metro Server 失败，请在${appPath}目录下运行：react-native start 手动启动。`))
        console.log(chalk.red(e))
        console.log('\n\n')
      }
    }
  }).catch(e => {
    console.log(chalk.red(e))
  })
}

function buildBundle (outputDir) {
  fs.ensureDirSync(outputDir)
  // process.chdir(outputDir)
  // 通过 jdreact  构建 bundle
  // if (rnConfig.bundleType === 'jdreact') {
  //   console.log()
  //   console.log(chalk.green('生成JDReact 目录：'))
  //   console.log()
  //   convertToJDReact({
  //     tempPath: this.tempPath, entryBaseName: this.entryBaseName
  //   })
  //   return
  // }
  // 默认打包到 bundle 文件夹
  fs.ensureDirSync(BUNDLE_DIR_NAME)
  execSync(
    `node ./node_modules/react-native/local-cli/cli.js bundle --entry-file ${outputDir}/index.js --bundle-output ./${BUNDLE_DIR_NAME}/index.bundle --assets-dest ./${BUNDLE_DIR_NAME} --dev false`,
    {stdio: 'inherit'})
}

/**
 * @description run packager server
 * copy from react-native/local-cli/runAndroid/runAndroid.js
 */
function startServerInNewWindow ({port, appPath}) {
  // set up OS-specific filenames and commands
  const isWindows = /^win/.test(process.platform)
  const scriptFile = isWindows
    ? 'launchPackager.bat'
    : 'launchPackager.command'
  const packagerEnvFilename = isWindows ? '.packager.bat' : '.packager.env'
  const portExportContent = isWindows
    ? `set RCT_METRO_PORT=${port}`
    : `export RCT_METRO_PORT=${port}`

  // set up the launchpackager.(command|bat) file
  const scriptsDir = path.resolve(appPath, './node_modules', 'react-native', 'scripts')
  const launchPackagerScript = path.resolve(scriptsDir, scriptFile)
  const procConfig: SpawnSyncOptions = {cwd: scriptsDir}
  const terminal = process.env.REACT_TERMINAL

  if (!fs.existsSync(launchPackagerScript)) {
    console.log(chalk.red(launchPackagerScript + '不存在，请检查 reatc-naitve 依赖。'))
  }

  // set up the .packager.(env|bat) file to ensure the packager starts on the right port
  const packagerEnvFile = path.join(
    appPath,
    'node_modules',
    'react-native',
    'scripts',
    packagerEnvFilename
  )

  // ensure we overwrite file by passing the 'w' flag
  fs.writeFileSync(packagerEnvFile, portExportContent, {
    encoding: 'utf8',
    flag: 'w'
  })

  if (process.platform === 'darwin') {
    if (terminal) {
      return spawnSync(
        'open',
        ['-a', terminal, launchPackagerScript],
        procConfig
      )
    }
    return spawnSync('open', [launchPackagerScript], procConfig)
  } else if (process.platform === 'linux') {
    if (terminal) {
      return spawn(
        terminal,
        ['-e', 'sh ' + launchPackagerScript],
        procConfig
      )
    }
    return spawn('sh', [launchPackagerScript], procConfig)
  } else if (/^win/.test(process.platform)) {
    procConfig.stdio = 'ignore'
    return spawn(
      'cmd.exe',
      ['/C', launchPackagerScript],
      procConfig
    )
  } else {
    console.log(
      chalk.red(
        `Cannot start the packager. Unknown platform ${process.platform}`
      )
    )
  }
}
