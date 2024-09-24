import * as hooks from '../constant'

import type { IPluginContext } from '@tarojs/service'
import type { TSetCustomTemplateConfig } from '../../create/page'

declare const enum createTemplateTypeEnum {
  /**
   * taro页面，taro使用者使用
   */
  PAGE = 'page',
  /**
   * taro插件，用于扩展命令行
   */
  PLUGIN_COMMAND = 'plugin-command',
  /**
   * taro插件，用于扩展编译过程
   */
  PLUGIN_BUILD = 'plugin-build',
  /**
   * taro插件，用于扩展 taro create 自定义模版
  */
  PLUGIN_TEMPLATE = 'plugin-template'
}

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'create',
    optionsMap: {
      '--name [name]': '名称',
      '--dir [dir]': '路径',
      '--subpkg [subpkg]': '分包路径',
      '--description [description]': '介绍',
      '--type [type]': '模版类型(page(默认)|plugin-command|plugin-build|plugin-template)'
    },
    synopsisList: [
      'taro create page',
      'taro create --name=page --description=desc',
      'taro create my-plugin --type=plugin-command',
    ],
    fn ({ _, options }) {
      const type = options.type || createTemplateTypeEnum.PAGE
      const name = _[1] || options.name
      const description = options.description || ''
      const afterCreate = options.afterCreate
      const templateSource = options.templateSource
      const framework = options.framework
      const css = options.css
      const typescript = options.typescript
      const clone = options.clone
      const { chalk } = ctx.helper
      const { appPath } = ctx.paths

      switch (type) {
        case createTemplateTypeEnum.PAGE: {
          if (typeof name !== 'string') {
            return console.log(chalk.red('请输入需要创建的页面名称'))
          }

          const Page = require('../../create/page').default
          const page = new Page({
            clone,
            subPkg: options.subpkg,
            framework,
            css,
            typescript,
            pageDir: options.dir,
            pageName: name,
            projectDir: appPath,
            description,
            templateSource,
            afterCreate,
            async modifyCustomTemplateConfig (cb: TSetCustomTemplateConfig) {
              await ctx.applyPlugins({ name: hooks.MODIFY_CREATE_TEMPLATE, opts: cb })
            }
          })

          page.create()
          break
        }
        case createTemplateTypeEnum.PLUGIN_COMMAND:
        case createTemplateTypeEnum.PLUGIN_BUILD:
        case createTemplateTypeEnum.PLUGIN_TEMPLATE:
        {
          if (typeof name !== 'string') {
            return console.log(chalk.red('请输入需要创建的插件名称'))
          }

          const Plugin = require('../../create/plugin').default
          const plugin = new Plugin({
            pluginName: name,
            projectDir: appPath,
            type,
            description,
            template: 'plugin-compile'
          })

          plugin.create()
          break
        }
        default:
          break
      }
    }
  })
}
