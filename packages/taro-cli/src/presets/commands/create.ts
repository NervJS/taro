import { IPluginContext } from '@tarojs/service'

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
}

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'create',
    optionsMap: {
      '--name [name]': '名称',
      '--description [description]': '介绍',
      '--type [type]': '模版类型(page(默认)|plugin-command|plugin-build)'
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
      const { chalk } = ctx.helper
      const { appPath } = ctx.paths

      switch (type) {
        case createTemplateTypeEnum.PAGE: {
          if (typeof name !== 'string') {
            return console.log(chalk.red('请输入需要创建的页面名称'))
          }

          const Page = require('../../create/page').default
          const page = new Page({
            pageName: name,
            projectDir: appPath,
            description,
            framework: ctx.initialConfig.framework
          })

          page.create()
          break
        }
        case createTemplateTypeEnum.PLUGIN_COMMAND:
        case createTemplateTypeEnum.PLUGIN_BUILD:
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
