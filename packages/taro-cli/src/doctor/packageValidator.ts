import * as _ from 'lodash/fp'
import * as npmCheck from 'npm-check'

import { getPkgVersion } from '../util'

const pkgVersion = getPkgVersion()
const isTaroPkg = pkg => /^@tarojs\//.test(pkg.moduleName)
const isCliVersionNotMatch = _.compose(_.negate(_.equals(pkgVersion)), _.get('installed'))
const isPkgInstalled = _.get('isInstalled')
const isPkgNotInstalled = _.negate(isPkgInstalled)

async function checkPkgs ({ appPath }) {
  let errorLines: any[] = []
  const pkgs = await npmCheck({
    cwd: appPath
  })
    .then(_.invoke('all'))
    .then(_.get('packages'))
  const taroPkgs = _.filter(isTaroPkg, pkgs)

  errorLines = _.concat(errorLines, pkgsNotInstalled(pkgs))
  errorLines = _.concat(errorLines, taroShouldUpdate(taroPkgs))
  errorLines = _.concat(errorLines, taroCliVersionNotMatch(taroPkgs))
  errorLines = _.compact(errorLines)

  return {
    desc: '检查依赖',
    lines: errorLines
  }
}

function taroCliVersionNotMatch (pkgs) {
  const pkgsNotMatch = _.filter(pkg => isPkgInstalled(pkg) && isCliVersionNotMatch(pkg), pkgs)
  const lines = _.map(pkg => Object({
    desc: `${pkg.moduleName} (${pkg.installed}) 与当前使用的 @tarojs/cli (${pkgVersion}) 版本不一致, 请更新为统一的版本`,
    valid: false
  }), pkgsNotMatch)
  return lines
}

function taroShouldUpdate (pkgs) {
  // 未安装的依赖的情况下查找更新没有意义
  const taroPkg = _.find(isPkgInstalled, pkgs)
  if (!taroPkg || taroPkg.latest === taroPkg.installed) return []

  return [{
    // 需要正确设置 next 版本以使 npm-check 在判定最新版本时将 rc 版本也算在内
    desc: `检测到最新稳定版本 Taro ${taroPkg.latest} , 当前 cli 版本 ${pkgVersion}`,
    valid: true, // 并非错误,仅提示即可
    solution: `前往 https://github.com/NervJS/taro/releases 了解详情`
  }]
}

function pkgsNotInstalled (pkgs) {
  const uninstalledPkgs = _.filter(isPkgNotInstalled, pkgs)
  const lines = _.map(pkg => Object({
    desc: `使用到的依赖 ${pkg.moduleName} 还没有安装`,
    valid: false
  }), uninstalledPkgs)
  return lines
}

export default checkPkgs
