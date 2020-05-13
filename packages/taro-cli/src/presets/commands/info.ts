import * as path from 'path'

import * as envinfo from 'envinfo'
import { IPluginContext } from '@tarojs/service'

import { getPkgVersion } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'info',
    async fn () {
      const { rn } = ctx.runOpts
      const { fs, chalk, PROJECT_CONFIG } = ctx.helper
      const { appPath } = ctx.paths
      if (!fs.existsSync(path.join(appPath, PROJECT_CONFIG))) {
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
  const npmPackages = ctx.helper.UPDATE_PACKAGE_LIST.concat(['react', 'react-native', 'nervjs', 'expo', 'taro-ui'])
  const info = await envinfo.run(Object.assign({}, {
    System: ['OS', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm'],
    npmPackages,
    npmGlobalPackages: ['typescript']
  }, options), {
    title: `Taro CLI ${getPkgVersion()} environment info`
  })
  console.log(info)
}
