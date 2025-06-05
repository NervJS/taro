/* eslint-disable no-console */
import { readPkgJson } from '../../utils'
import { updateBabelConfig } from './babel'
import { updateConfig } from './config'

import type { IPluginContext } from '@tarojs/service'

export async function es5Generator(ctx: IPluginContext) {
  await updateBrowserList(ctx)
  await updateConfig(ctx)
  await updateBabelConfig(ctx)
  console.log('✅ 启用「编译为 ES5」成功')
}

async function updateBrowserList(ctx: IPluginContext) {
  const { fs } = ctx.helper
  const browserslistrc = `${ctx.paths.appPath}/.browserslistrc`
  if (await fs.pathExists(browserslistrc)) {
    await fs.writeFile(browserslistrc, 'last 3 versions\nAndroid >= 4.1\nios >= 8\n', { encoding: 'utf-8', flag: 'w' })
    return
  }
  const pkgJson = readPkgJson(ctx)
  pkgJson.browserslist = {
    development: ['defaults and fully supports es6-module', 'maintained node versions'],
    production: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
  }
  await fs.outputJson(`${ctx.paths.appPath}/package.json`, pkgJson, {
    encoding: 'utf-8',
    spaces: 2,
  })
  console.log('✅ 更新 browserslist 成功\n')
}
