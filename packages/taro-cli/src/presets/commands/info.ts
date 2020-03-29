import * as path from 'path'

import * as envinfo from 'envinfo'

import { getPkgVersion } from '../../util'

export default (ctx) => {
  ctx.registerCommand({
    name: 'info',
    async fn () {
      const { rn } = ctx.runOpts
      const { fs } = ctx.helper
      const { appPath } = ctx.paths
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
  const npmPackages = ctx.helper.UPDATE_PACKAGE_LIST.concat(['react', 'react-native', 'nervjs', 'expo'])
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