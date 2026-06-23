/* eslint-disable no-console */

import { updatePkgJson } from '../../utils'

import type { IPluginContext } from '@tarojs/service'

const getDeps = (version: TailwindCSSVersion): Deps => {
  const deps: Deps = {
    devDependencies: {
      tailwindcss: version === '4x' ? '^4.1.7' : '3.4.17',
      'weapp-tailwindcss': '^4.1.7',
      '@tailwindcss/postcss': '^4.1.7',
    },
  }

  return deps
}

export async function updateDeps(options: { ctx: IPluginContext, tailwindcssVersion: TailwindCSSVersion }) {
  const { ctx, tailwindcssVersion } = options
  const patch: PackageJson = { ...getDeps(tailwindcssVersion) }
  if (tailwindcssVersion === '4x') {
    // 这是为了给 tailwindcss@4 打上支持 rpx 单位的补丁，否则它会把 rpx 认为是一种颜色
    patch.scripts = { postinstall: 'weapp-tw patch' }
  }
  return updatePkgJson(ctx, patch)
}
