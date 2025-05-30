/* eslint-disable no-console */
import { type IPluginContext } from '@tarojs/service'
import * as path from 'path'

import { installDeps, mergePkgJson, readPkgJson } from '../../utils'

const getDeps = (version: TailwindCSSVersion): Deps => {
  const deps: Deps = {
    devDependencies: {
      tailwindcss: version === '4x' ? '^4.1.7' : '3.4.17',
      'weapp-tailwindcss': '^4.1.7',
      '@tailwindcss/postcss': '^4.1.7'
    },
  }

  return deps
}

export async function updateDeps(options: { ctx: IPluginContext, tailwindcssVersion: TailwindCSSVersion }) {
  const { ctx, tailwindcssVersion } = options
  const pkgJson = readPkgJson(ctx)
  const patch: PackageJson = { ...getDeps(tailwindcssVersion) }
  if (tailwindcssVersion === '4x') {
    // 这是为了给 tailwindcss@4 打上支持 rpx 单位的补丁，否则它会把 rpx 认为是一种颜色
    patch.scripts = { postinstall: 'weapp-tw patch' }
  }
  mergePkgJson(pkgJson, patch)

  await ctx.helper.fs.outputJson(path.join(ctx.paths.appPath, 'package.json'), pkgJson, {
    encoding: 'utf-8',
    spaces: 2,
  })

  await installDeps(ctx)
    .then(() => {
      console.log(ctx.helper.chalk.green('\n✅ 安装依赖完成'))
    })
    .catch(() => {
      console.log(ctx.helper.chalk.red('\n❌ 安装依赖失败，请手动安装'))
    })
}
