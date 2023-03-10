import { isString } from '@tarojs/shared'
import path from 'path'
import { build } from 'vite'
import { Target,viteStaticCopy } from 'vite-plugin-static-copy'

import h5Preset from './h5'
import miniPreset from './mini'
import { componentConfig } from './template/component'

import type { UserConfig } from 'vite'
import type { MiniBuildConfig } from './utils/types'

function covertCopyOptions (taroConfig: MiniBuildConfig) {
  const copy = taroConfig.copy
  const copyOptions: Target[] = []
  copy?.patterns.forEach(({ from, to }) => {
    const { base, ext } = path.parse(to)
    to = to
      .replace(new RegExp('^' + taroConfig.outputRoot + '/'), '')
    let rename

    if (ext) {
      to = to.replace(base, '')
      rename = base
    } else {
      rename = '/'
    }


    copyOptions.push({
      src: from,
      dest: to,
      rename
    })
  })
  return copyOptions
}

export default async function (appPath: string, taroConfig: MiniBuildConfig) {
  const plugins: UserConfig['plugins'] = []

  if (process.env.TARO_ENV === 'h5') {
    plugins.push(h5Preset())
  } else {
    plugins.push(miniPreset(appPath, taroConfig))
  }

  if (taroConfig.copy?.patterns?.length) {
    plugins.push(viteStaticCopy({
      targets: covertCopyOptions(taroConfig)
    }))
  }

  if (!isString(taroConfig.compiler) && taroConfig.compiler?.vitePlugins?.length) {
    plugins.push(...taroConfig.compiler.vitePlugins)
  }

  const commonConfig: UserConfig = {
    // root: cwd
    // base: /
    // mode: ?
    // define
    // resolve
    // esbuild
    // css
    plugins
  }

  taroConfig.modifyViteConfig?.(commonConfig, componentConfig)

  await build(commonConfig)
}
