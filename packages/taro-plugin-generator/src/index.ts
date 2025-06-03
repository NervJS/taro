import * as inquirer from 'inquirer'

import { tailwindcssGenerator } from './generators/tailwindcss'
import { safely } from './utils/error'

import type { IPluginContext } from '@tarojs/service'

/**
 * 命令行扩展
 */
export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'new',
    // 命令钩子
    async fn() {
      const choices = {
        tailwindcss: 'tailwindcss',
      }

      const answer = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: '启用可选功能',
        choices: [{ name: '启用「Tailwind CSS」支持', value: choices.tailwindcss }],
      })

      switch (answer.choice) {
        case choices.tailwindcss: {
          await safely(() => tailwindcssGenerator(ctx))
          break
        }
        default: {
          break
        }
      }
    },
  })
}
