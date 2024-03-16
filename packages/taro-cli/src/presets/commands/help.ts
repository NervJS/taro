import { chalk } from '@tarojs/helper'

import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'help',
    synopsisList: [
      'taro help [cmd]'
    ],
    async fn ({ _ }) {
      const cmd = _[1]

      if (!cmd) return console.log(chalk.yellow('用法：taro help [cmd]，cmd 不存在！请输入需要查看帮助的命令名称。'))

      ctx.ctx.runHelp(cmd)
    }
  })
}
