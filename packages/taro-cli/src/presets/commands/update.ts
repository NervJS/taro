import * as path from 'path'
import { exec } from 'child_process'

import * as getLatestVersion from 'latest-version'
import * as semver from 'semver'
import * as ora from 'ora'

import { getPkgItemByKey } from '../../util'

export default (ctx) => {
  ctx.registerCommand({
    name: 'update',
    async fn () {
      const { appPath, configPath } = ctx.paths
      const { chalk, fs, shouldUseCnpm, shouldUseYarn, PROJECT_CONFIG, UPDATE_PACKAGE_LIST } = ctx.helper
      const { version, updateType } = ctx.runOpts

      const pkgPath = path.join(appPath, 'package.json')
      const pkgName = getPkgItemByKey('name')

      async function getTargetVersion () {
        let targetTaroVersion
        // base on current project taro versions, not base on @tarojs/cli verison
        const currentTaroVersion = require(pkgPath).dependencies['@tarojs/taro']
        if (version) {
          targetTaroVersion = semver.clean(version)
        } else {
          // update to current lastest major.x.x
          try {
            targetTaroVersion = await getLatestVersion(pkgName, {
              version: semver.major(currentTaroVersion).toString()
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
      
      function info () {
        console.log(chalk.red('命令错误:'))
        console.log(`${chalk.green(
          'taro update self [version]')} 更新 Taro 开发工具 taro-cli 到指定版本或当前主版本的最新版本`)
        console.log(`${chalk.green(
          'taro update project [version]')} 更新项目所有 Taro 相关依赖到指定版本或当前主版本的最新版本`)
      }
      
      async function updateSelf () {
        let command
        const targetTaroVersion = await getTargetVersion()
        if (shouldUseCnpm()) {
          command = `cnpm i -g @tarojs/cli@${targetTaroVersion}`
        } else {
          command = `npm i -g @tarojs/cli@${targetTaroVersion}`
        }
      
        const child = exec(command)
      
        const spinner = ora('即将将 Taro 开发工具 taro-cli 更新到最新版本...').start()
      
        child.stdout.on('data', function (data) {
          console.log(data)
          spinner.stop()
        })
        child.stderr.on('data', function (data) {
          console.log(data)
          spinner.stop()
        })
      }

      async function updateProject () {
        if (!configPath ||!fs.existsSync(configPath)) {
          console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是Taro项目根目录!`))
          process.exit(1)
        }
        const packageMap = require(pkgPath)
      
        const version = await getTargetVersion()
        // 获取 NervJS 版本
        const nervJSVersion = `^${await getLatestVersion('nervjs')}`
      
        // 更新 @tarojs/* 版本和 NervJS 版本
        Object.keys(packageMap.dependencies).forEach((key) => {
          if (UPDATE_PACKAGE_LIST.indexOf(key) !== -1) {
            if (key.includes('nerv')) {
              packageMap.dependencies[key] = nervJSVersion
            } else if (key.includes('react-native')) {
              // delete old version react-native,and will update when run taro build
              delete packageMap.dependencies[key]
            } else {
              packageMap.dependencies[key] = version
            }
          }
        })
        Object.keys(packageMap.devDependencies).forEach((key) => {
          if (UPDATE_PACKAGE_LIST.indexOf(key) !== -1) {
            if (key.includes('nerv')) {
              packageMap.devDependencies[key] = nervJSVersion
            } else {
              packageMap.devDependencies[key] = version
            }
          }
        })
      
        // 写入package.json
        try {
          await fs.writeJson(pkgPath, packageMap, {spaces: '\t'})
          console.log(chalk.green('更新项目 package.json 成功！'))
          console.log()
        } catch (err) {
          console.error(err)
        }
      
        let command
        if (shouldUseYarn()) {
          command = 'yarn'
        } else if (shouldUseCnpm()) {
          command = 'cnpm install'
        } else {
          command = 'npm install'
        }
      
        const child = exec(command)
      
        const spinner = ora('即将将项目所有 Taro 相关依赖更新到最新版本...').start()
      
        child.stdout.on('data', function (data) {
          spinner.stop()
          console.log(data)
        })
        child.stderr.on('data', function (data) {
          spinner.stop()
          console.log(data)
        })
      }

      if (!updateType) return info()

      if (updateType === 'self') return updateSelf()

      if (updateType === 'project') return updateProject()

      info()
    }
  })
}
