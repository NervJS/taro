import * as inquirer from 'inquirer'
import * as getLatestVersion from 'latest-version'
import * as ora from 'ora'
import * as path from 'path'
import * as semver from 'semver'

import packagesManagement from '../../config/packagesManagement'
import { execCommand, getPkgItemByKey } from '../../util'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'update',
    synopsisList: [
      'taro update self [version]',
      'taro update project [version]'
    ],
    optionsMap: {
      '--npm [npm]': '包管理工具',
      '-h, --help': 'output usage information'
    },
    async fn ({ _, options }) {
      const { npm } = options
      const [, updateType, version] = _ as [string, ('self' | 'project')?, string?]
      const { appPath, configPath } = ctx.paths
      const {
        chalk,
        fs,
        PROJECT_CONFIG,
        UPDATE_PACKAGE_LIST
      } = ctx.helper

      const pkgPath = path.join(appPath, 'package.json')
      const pkgName = getPkgItemByKey('name')
      const conf = {
        npm: null
      }
      const prompts: Record<string, unknown>[] = []

      async function getTargetVersion () {
        let targetTaroVersion

        if (version) {
          targetTaroVersion = semver.clean(version)
        } else {
          try {
            targetTaroVersion = await getLatestVersion(pkgName, {
              version: 'latest'
            })
          } catch (e) {
            targetTaroVersion = await getLatestVersion(pkgName)
          }
        }
        if (!semver.valid(targetTaroVersion)) {
          console.log(chalk.red('命令错误:无效的 version ~'))
          throw Error('无效的 version!')
        }
        return targetTaroVersion
      }

      function execUpdate (command: string, version: string, isSelf = false) {
        const updateTarget = isSelf ? ' CLI ' : ' Taro 项目依赖'
        const spinString = `正在更新${updateTarget}到 v${version} ...`
        const spinner = ora(spinString).start()
        execCommand({ 
          command,
          successCallback (data) {
            spinner.stop()
            console.log(data.replace(/\n$/, ''))
          },
          failCallback (data) {
            spinner.stop()
            spinner.warn(data.replace(/\n$/, ''))
          }
        })
      }

      /** 更新全局的 Taro CLI */
      async function updateSelf () {
        const spinner = ora('正在获取最新版本信息...').start()
        const targetTaroVersion = await getTargetVersion()
        spinner.stop()
        console.log(chalk.green(`Taro 最新版本：${targetTaroVersion}\n`))

        askNpm(conf, prompts)
        const answers = npm ? { npm } : await inquirer.prompt(prompts)

        const command = `${packagesManagement[answers.npm].globalCommand}@${targetTaroVersion}`
        execUpdate(command, targetTaroVersion, true)
      }

      /** 更新当前项目中的 Taro 相关依赖 */
      async function updateProject () {
        if (!configPath || !fs.existsSync(configPath)) {
          console.log(chalk.red(`找不到项目配置文件 ${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
          process.exit(1)
        }
        const packageMap = require(pkgPath)

        const spinner = ora('正在获取最新版本信息...').start()

        const version = await getTargetVersion()

        spinner.stop()

        const oldVersion = packageMap.dependencies['@tarojs/taro']
        // 更新 @tarojs/* 版本和 NervJS 版本
        Object.keys(packageMap.dependencies || {}).forEach((key) => {
          if (UPDATE_PACKAGE_LIST.indexOf(key) !== -1) {
            packageMap.dependencies[key] = version
          }
        })
        Object.keys(packageMap.devDependencies || {}).forEach((key) => {
          if (UPDATE_PACKAGE_LIST.indexOf(key) !== -1) {
            packageMap.devDependencies[key] = version
          }
        })

        // 写入package.json
        try {
          await fs.writeJson(pkgPath, packageMap, { spaces: '\t' })
          console.log(chalk.green(`项目当前 Taro 版本：${oldVersion}，Taro 最新版本：${version}，更新项目 package.json 成功！`))
          console.log()
        } catch (err) {
          console.error(err)
        }

        askNpm(conf, prompts)
        const answers = npm ? { npm } : await inquirer.prompt(prompts)

        const command = packagesManagement[answers.npm].command

        execUpdate(command, version)
      }

      function askNpm (conf, prompts) {
        const packages = [
          {
            name: 'yarn',
            value: 'yarn'
          },
          {
            name: 'pnpm',
            value: 'pnpm'
          },
          {
            name: 'npm',
            value: 'npm'
          },
          {
            name: 'cnpm',
            value: 'cnpm'
          }
        ]

        if ((typeof conf.npm as string | undefined) !== 'string') {
          prompts.push({
            type: 'list',
            name: 'npm',
            message: '请选择包管理工具',
            choices: packages
          })
        }
      }

      if (updateType === 'self') return updateSelf()

      if (updateType === 'project') return updateProject()

      console.log(chalk.red('命令错误:'))
      console.log(`${chalk.green(
        'taro update self [version]')} 更新 Taro 开发工具 taro-cli 到指定版本或 Taro3 的最新版本`)
      console.log(`${chalk.green(
        'taro update project [version]')} 更新项目所有 Taro 相关依赖到指定版本或 Taro3 的最新版本`)
    }
  })
}
