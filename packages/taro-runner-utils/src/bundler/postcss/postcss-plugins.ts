import path from 'node:path'

import { isNpmPkg, resolveSync } from '@tarojs/helper'

import type { Func, TogglableOptions } from '@tarojs/taro/types/compile'

export const getPostcssPlugins = function (
  appPath: string,
  option: [string, TogglableOptions<Record<string, unknown>>, Func?][] = []
) {
  const plugins: any[] = []
  option.forEach(([pluginName, pluginOption, pluginPkg]) => {
    if (!pluginOption || ['cssModules', 'url'].includes(pluginName)) return
    if (Object.hasOwnProperty.call(pluginOption, 'enable') && !pluginOption.enable) return

    if (pluginPkg) {
      plugins.push(pluginPkg(pluginOption.config || {}))
      return
    }

    if (!isNpmPkg(pluginName)) {
      pluginName = path.isAbsolute(pluginName) ? pluginName : path.join(appPath, pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: appPath }) || ''
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少 postcss 插件 "${pluginName}", 已忽略` : e
      // eslint-disable-next-line no-console
      console.log(msg)
    }
  })

  return plugins
}
