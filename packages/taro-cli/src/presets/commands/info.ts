import { isWindows } from '@tarojs/helper'
import { execSync } from 'child_process'
import * as envinfo from 'envinfo'
import * as path from 'path'

import { getPkgVersion } from '../../util'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'info',
    synopsisList: [
      'taro info',
      'taro info rn'
    ],
    async fn ({ _ }) {
      const rn = _[1] === 'rn'
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { appPath, configPath } = ctx.paths

      if (!configPath || !fs.existsSync(configPath)) {
        console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`))
        process.exit(1)
      }

      if (rn) {
        const tempPath = path.join(appPath, '.rn_temp')
        if (fs.lstatSync(tempPath).isDirectory()) {
          process.chdir('.rn_temp')
        }
      }

      await info({}, ctx)
    }
  })
}

async function info (options, ctx) {
  const TITLE = `Taro CLI ${getPkgVersion()} environment info`
  const npmPackages = ctx.helper.UPDATE_PACKAGE_LIST.concat(['react', 'react-native', 'expo', 'taro-ui'])
  const info = await envinfo.run(Object.assign({}, {
    System: ['OS', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages,
    npmGlobalPackages: ['typescript']
  }, options), {
    title: `Taro CLI ${getPkgVersion()} environment info`
  })
  // 由于 envinfo 包实现的问题，window 的 powershell 获取不到 system 里面的 Shell 字段，得通过其他方法来获取
  if(isWindows && !info[TITLE].System.Shell) {
    const windowShell = execSync('echo %ComSpec%').toString().trim()
    Object.assign(info[TITLE].System, {
      Shell: windowShell
    })
  }
  console.log(info)
}
