import * as path from 'path'
import { execSync } from 'child_process'

import * as ora from 'ora'

import {
  unzip,
  recursiveReplaceObjectKeys
} from '../../util'
import { downloadGithubRepoLatestRelease } from '../../util/dowload'
import * as defaultManifestJSON from '../../config/manifest.default.json'

export default (ctx) => {
  ctx.registerPlatform({
    name: 'quickapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath, nodeModulesPath } = ctx.paths
      const {
        isWatch,
        port,
        release
      } = ctx.runOpts
      const {
        npm,
        fs,
        printLog,
        processTypeEnum,
        chalk,
        shouldUseYarn,
        isWindows,
        shouldUseCnpm
      } = ctx.helper

      // 读取 project.quickapp.json
      const quickappJSONPath = path.join(appPath, 'project.quickapp.json')
      let quickappJSON
      if (fs.existsSync(quickappJSONPath)) {
        quickappJSON = fs.readJSONSync(quickappJSONPath)
      } else {
        printLog(processTypeEnum.WARNING, '缺少配置', `检测到项目目录下未添加 ${chalk.bold('project.quickapp.json')} 文件，将使用默认配置，参考文档 https://nervjs.github.io/taro/docs/project-config.html`)
        quickappJSON = defaultManifestJSON
      }

      const originalOutputRoot = config.outputRoot
      config.outputRoot = `${originalOutputRoot}/src`

      // 准备 miniRunner 参数
      const miniRunnerOpts = {
        ...config,
        nodeModulesPath,
        buildAdapter: config.platform,
        isBuildPlugin: false,
        globalObject: 'global',
        fileType: {
          templ: '.ux',
          style: '.css',
          config: '.json',
          script: '.js'
        },
        isUseComponentBuildPage: false,
        quickappJSON,
        isBuildQuickapp: true
      }

      ctx.modifyBuildTempFileContent(({ tempFiles }) => {
        const replaceKeyMap = {
          navigationBarTitleText: 'titleBarText',
          navigationBarBackgroundColor: 'titleBarBackgroundColor',
          navigationBarTextStyle: 'titleBarTextColor',
          pageOrientation: 'orientation',
          backgroundTextStyle: false,
          onReachBottomDistance: false,
          backgroundColorBottom: false,
          backgroundColorTop: false
        }
        Object.keys(tempFiles).forEach(key => {
          const item = tempFiles[key]
          if (item.config) {
            recursiveReplaceObjectKeys(item.config, replaceKeyMap)
          }
        })
      })

      // build with webpack
      const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
      await miniRunner(appPath, miniRunnerOpts)

      const isReady = await prepareQuickAppEnvironment({
        originalOutputRoot,
        fs,
        appPath,
        chalk,
        shouldUseYarn,
        isWindows,
        shouldUseCnpm
      })
      if (!isReady) {
        console.log()
        console.log(chalk.red('快应用环境准备失败，请重试！'))
        process.exit(0)
      }
      await runQuickApp({
        isWatch,
        originalOutputRoot,
        port,
        release
      })
    }
  })
}

async function prepareQuickAppEnvironment ({
  originalOutputRoot,
  fs,
  appPath,
  chalk,
  shouldUseYarn,
  isWindows,
  shouldUseCnpm
}) {
  let isReady = false
  let needDownload = false
  let needInstall = false
  console.log()
  if (fs.existsSync(path.join(originalOutputRoot, 'sign'))) {
    needDownload = false
  } else {
    needDownload = true
  }
  if (needDownload) {
    const getSpinner = ora('开始下载快应用运行容器...').start()
    await downloadGithubRepoLatestRelease('NervJS/quickapp-container', appPath, originalOutputRoot)
    await unzip(path.join(originalOutputRoot, 'download_temp.zip'))
    getSpinner.succeed('快应用运行容器下载完成')
  } else {
    console.log(`${chalk.green('✔ ')} 快应用容器已经准备好`)
  }
  process.chdir(originalOutputRoot)
  console.log()
  if (fs.existsSync(path.join(originalOutputRoot, 'node_modules'))) {
    needInstall = false
  } else {
    needInstall = true
  }
  if (needInstall) {
    let command
    if (shouldUseYarn()) {
      if(!isWindows) {
        command = 'NODE_ENV=development yarn install'
      } else {
        command = 'yarn install'
      }
    } else if (shouldUseCnpm()) {
      if(!isWindows) {
        command = 'NODE_ENV=development cnpm install'
      } else {
        command = 'cnpm install'
      }
    } else {
      if(!isWindows) {
        command = 'NODE_ENV=development npm install'
      } else {
        command = 'npm install'
      }
    }
    const installSpinner = ora(`安装快应用依赖环境, 需要一会儿...`).start()
    try {
      const stdout = execSync(command)
      installSpinner.color = 'green'
      installSpinner.succeed('安装成功')
      console.log(`${stdout}`)
      isReady = true
    } catch (error) {
      installSpinner.color = 'red'
      installSpinner.fail(chalk.red(`快应用依赖环境安装失败，请进入 ${path.basename(originalOutputRoot)} 重新安装！`))
      console.log(`${error}`)
      isReady = false
    }
  } else {
    console.log(`${chalk.green('✔ ')} 快应用依赖已经安装好`)
    isReady = true
  }
  return isReady
}

async function runQuickApp ({
  isWatch,
  originalOutputRoot,
  port,
  release
}: {
  isWatch: boolean | void,
  originalOutputRoot: string,
  port?: number,
  release?: boolean
}) {
  const { compile } = require(require.resolve('hap-toolkit/lib/commands/compile', { paths: [originalOutputRoot] }))
  if (isWatch) {
    const { launchServer } = require(require.resolve('@hap-toolkit/server', { paths: [originalOutputRoot] }))
    launchServer({
      port: port || 12306,
      watch: isWatch,
      clearRecords: false,
      disableADB: false
    })
    compile('native', 'dev', true)
  } else {
    if (!release) {
      compile('native', 'dev', false)
    } else {
      compile('native', 'prod', false)
    }
  }
}
