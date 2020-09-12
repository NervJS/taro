import { IPluginContext } from '@tarojs/service'
import scanPageName from '../../create/scanPageName'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'create',
    optionsMap: {
      '--name [name]': '名称',
      '--description [description]': '介绍'
    },
    synopsisList: [
      'taro create page',
      'taro create --name=page --description=desc'
    ],
    fn ({ _, options }) {
      let name = _[1] || options.name
      const description = options.description || ''
      const { chalk } = ctx.helper
      const { appPath } = ctx.paths

      if (typeof name !== 'string') {
        return console.log(chalk.red('请输入需要创建的页面名称'))
      }

      try {
        name = scanPageName(name)
      } catch (error) {
        console.log(chalk.red(error.message))
      }

      const Page = require('../../create/page').default
      const page = new Page({
        pageName: name,
        projectDir: appPath,
        description,
        framework: ctx.initialConfig.framework
      })

      page.create()
    }
  })
}
