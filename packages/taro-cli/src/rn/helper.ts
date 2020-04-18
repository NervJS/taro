import * as Util from '../util'
import * as path from 'path'
import * as fs from 'fs-extra'
import { processTypeEnum } from '../util/constants'
import chalk from 'chalk'
import { exec } from 'child_process'

export function hasRNDep (appPath) {
  const pkgJson = require(path.join(appPath, 'package.json'))
  return Boolean(pkgJson.dependencies['react-native'])
}

export function installDep (path: string) {
  return new Promise((resolve, reject) => {
    console.log()
    console.log(chalk.yellow('开始安装依赖~'))
    process.chdir(path)
    let command
    if (Util.shouldUseYarn()) {
      command = 'yarn'
    } else if (Util.shouldUseCnpm()) {
      command = 'cnpm install'
    } else {
      command = 'npm install'
    }
    exec(command, (err, stdout, stderr) => {
      if (err) reject()
      else {
        console.log(stdout)
        console.log(stderr)
      }
      resolve()
    })
  })
}

export function updatePkgJson (appPath) {
  const version = Util.getPkgVersion()
  const RNDep = `{
    "@tarojs/components-rn": "^${version}",
    "@tarojs/taro-rn": "^${version}",
    "@tarojs/rn-runner": "^${version}",
    "@tarojs/taro-router-rn": "^${version}",
    "@tarojs/taro-redux-rn": "^${version}",
    "react": "16.8.0",
    "react-native": "0.59.9",
    "redux": "^4.0.0",
    "tslib": "^1.8.0"
  }
  `
  return new Promise((resolve, reject) => {
    const pkgJson = require(path.join(appPath, 'package.json'))
    // 未安装 RN 依赖,则更新 pkgjson,并重新安装依赖
    if (!hasRNDep(appPath)) {
      pkgJson.dependencies = Object.assign({}, pkgJson.dependencies, JSON.parse(RNDep.replace(/(\r\n|\n|\r|\s+)/gm, '')))
      fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(pkgJson, null, 2))
      Util.printLog(processTypeEnum.GENERATE, 'package.json', path.join(appPath, 'package.json'))
      installDep(appPath).then(() => {
        resolve()
      })
    } else {
      resolve()
    }
  })
}
