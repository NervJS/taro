/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { UPDATE_PACKAGE_LIST } from '@tarojs/helper'
import * as _ from 'lodash/fp'
import * as npmCheck from 'npm-check'

import { getPkgVersion } from '../util'

interface ErrorLine {
  desc: string
  valid: boolean
}

const mustInstalledTaroPkg = [
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/mini-runner',
  '@tarojs/webpack-runner',
  'babel-preset-taro',
  'eslint-config-taro'
]

const cliVersion = getPkgVersion()
const isPkgInstalled = _.get('isInstalled')
const isPkgNotInstalled = _.negate(isPkgInstalled)

async function checkPkgs ({ appPath }) {
  let errorLines: ErrorLine[] = []
  const pkgs = await npmCheck({
    cwd: appPath
  })
    .then(currentState => currentState.get('packages'))

  errorLines = _.concat(errorLines, pkgsNotInstalled(pkgs))
  errorLines = _.concat(errorLines, taroShouldUpdate(pkgs))
  errorLines = _.concat(errorLines, taroOutdate(pkgs))
  errorLines = _.compact(errorLines)

  return {
    desc: '检查依赖',
    lines: errorLines
  }
}

function pkgsNotInstalled (pkgs): ErrorLine[] {
  const uninstalledPkgs = _.filter(isPkgNotInstalled, pkgs)
  const lines = _.map(
    pkg =>
      Object({
        desc: `使用到的依赖 ${pkg.moduleName} 还没有安装`,
        valid: false
      }),
    uninstalledPkgs
  )
  return lines
}

function taroShouldUpdate (pkgs): ErrorLine[] {
  // sort 是为了 UPDATE_PACKAGE_LIST 顺序改变也不影响单测结果
  const list = UPDATE_PACKAGE_LIST
    .sort()
    .map(item => {
      const taroPkg = pkgs.find(pkg => pkg.moduleName === item)

      if (!taroPkg) {
        if (!mustInstalledTaroPkg.includes(item)) return null

        return {
          desc: `请安装 Taro 依赖: ${item}`,
          valid: true
        }
      }

      const { moduleName, installed, latest } = taroPkg

      if (installed === cliVersion) {
        if (installed === latest) return null

        return {
          desc: `依赖 ${moduleName} 可更新到最新版本 ${latest}，当前安装版本为 ${installed}`,
          valid: true
        }
      }

      return {
        desc: `依赖 ${moduleName} (${installed}) 与当前使用的 Taro CLI (${cliVersion}) 版本不一致, 请更新为统一的版本`,
        valid: false
      }
    })

  return _.compact(list)
}

function taroOutdate (pkgs): ErrorLine[] {
  const list: ErrorLine[] = []
  pkgs.forEach(({ moduleName, isInstalled }) => {
    if (!UPDATE_PACKAGE_LIST.includes(moduleName) && /^@tarojs/.test(moduleName) && !/^@tarojs\/plugin-/.test(moduleName)) {
      list.push({
        desc: `Taro 3 不再依赖 ${moduleName}，可以${isInstalled ? '卸载' : '从 package.json 移除'}`,
        valid: true
      })
    }
  })
  return list
}

export default checkPkgs
