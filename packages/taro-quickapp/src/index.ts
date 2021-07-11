import QuickApp from './program'
import type { IPluginContext } from '@tarojs/service'
import { downloadGithubRepoLatestRelease } from './compile-utils'
import path from 'path'
import { execSync } from 'child_process'
import ora from 'ora'
import defaultManifestJSON from './manifest.default.json'

// 让其它平台插件可以继承此平台
export { QuickApp }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'quickapp',
    useConfigName: 'mini',
    async fn ({ config }) {
      const { appPath } = ctx.paths
      const {
        isWatch,
        port,
        release
      } = ctx.runOpts
      const {
        fs,
        printLog,
        processTypeEnum,
        chalk,
        shouldUseYarn,
        isWindows,
        shouldUseCnpm,
        unzip
      } = ctx.helper

      const originalOutputRoot = config.outputRoot

      const isReady = await prepareQuickAppEnvironment({
        originalOutputRoot,
        fs,
        appPath,
        chalk,
        printLog,
        shouldUseYarn,
        isWindows,
        shouldUseCnpm,
        unzip
      })
      if (!isReady) {
        printLog(processTypeEnum.ERROR, chalk.red('快应用环境准备失败，请重试！'))
        process.exit(0)
      }

      // 读取 project.quickapp.json
      const quickappJSONPath = path.join(appPath, 'project.quickapp.json')
      let quickappJSON
      if (fs.existsSync(quickappJSONPath)) {
        quickappJSON = fs.readJSONSync(quickappJSONPath)
      } else {
        printLog(processTypeEnum.WARNING, '缺少配置', `检测到项目目录下未添加 ${chalk.bold('project.quickapp.json')} 文件，将使用默认配置，参考文档 https://nervjs.github.io/taro/docs/project-config.html`)
        quickappJSON = defaultManifestJSON
      }

      config.outputRoot = `${originalOutputRoot}/src`
      ctx.paths.outputPath = `${ctx.paths.outputPath}/src`
      config.isBuildQuickapp = true
      config.quickappJSON = quickappJSON

      const program = new QuickApp(ctx, config)
      await program.start()

      if (process.env.TARO_ENV === 'unexist') {
        await runQuickApp({
          isWatch,
          originalOutputRoot,
          port,
          release
        })
      }
    }
  })
}

async function prepareQuickAppEnvironment ({
  originalOutputRoot,
  fs,
  appPath,
  chalk,
  printLog,
  shouldUseYarn,
  isWindows,
  shouldUseCnpm,
  unzip
}) {
  const cwd = process.cwd()
  let isReady = false
  let needDownload = false
  let needInstall = false
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
    printLog('remind', `${chalk.green('✔ ')} 快应用容器已经准备好`)
  }
  process.chdir(originalOutputRoot)
  if (fs.existsSync(path.join(originalOutputRoot, 'node_modules'))) {
    needInstall = false
  } else {
    needInstall = true
  }
  if (needInstall) {
    let command
    if (shouldUseYarn()) {
      if (!isWindows) {
        command = 'NODE_ENV=development yarn install'
      } else {
        command = 'yarn install'
      }
    } else if (shouldUseCnpm()) {
      if (!isWindows) {
        command = 'NODE_ENV=development cnpm install'
      } else {
        command = 'cnpm install'
      }
    } else {
      if (!isWindows) {
        command = 'NODE_ENV=development npm install'
      } else {
        command = 'npm install'
      }
    }
    const installSpinner = ora('安装快应用依赖环境, 需要一会儿...').start()
    try {
      const stdout = execSync(command)
      installSpinner.color = 'green'
      installSpinner.succeed('安装成功')
      printLog('remind', `${stdout}`)
      isReady = true
    } catch (error) {
      installSpinner.color = 'red'
      installSpinner.fail(chalk.red(`快应用依赖环境安装失败，请进入 ${path.basename(originalOutputRoot)} 重新安装！`))
      printLog('error', `${error}`)
      isReady = false
    }
  } else {
    printLog('remind', `${chalk.green('✔ ')} 快应用依赖已经安装好`)
    isReady = true
  }
  process.chdir(cwd)
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
