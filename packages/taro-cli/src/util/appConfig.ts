import { IPluginContext } from '@tarojs/service'
import { isString } from '@tarojs/shared'
import { AppConfig } from '@tarojs/taro'

/**
 * 按需编译功能，只编译指定的页面或组件
 * @param appConfig
 * @param args
 */
export function extractCompileEntry(
  appConfig: AppConfig,
  args: { _: string[], [key: string]: any },
  ctx: IPluginContext
): void {
  const { chalk } = ctx.helper

  const extractType = isString(args.pages) ? 'pages' : isString(args.components) ? 'components' : ''
  if (!extractType) return

  const entries = args[extractType].split(',').map(item => item.trim()).filter(Boolean)
  if (!entries.length) {
    console.log(chalk.yellow(`按需编译开启失败，请指定要编译的${extractType}`))
    return
  }

  appConfig[extractType] = entries
  appConfig.subPackages = []
  console.log(chalk.green(`已开启按需编译，仅编译以下${extractType}: ${appConfig[extractType]}`))
}
