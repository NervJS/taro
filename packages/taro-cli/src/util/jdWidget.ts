import * as path from 'node:path'

import type { IPluginContext } from '@tarojs/service'

export function buildJDWidget(ctx: IPluginContext) {
  const { paths } = ctx
  const { outputPath } = paths
  const { config, options } = ctx.runOpts
  const { args } = options
  if (!args.widgetRoot) {
    console.log(ctx.helper.chalk.red('请传入 --widgetRoot 指定需要编译为京东小部件的页面或组件的路径'))
    process.exit(0)
  }
  ctx.modifyAppConfig(({ appConfig }) => {
    appConfig.components = [args.widgetRoot]
  })

  config.outputRoot = path.join(outputPath, 'widget')

  ctx.onBuildComplete(() => {
    ctx.helper.fs.writeJSONSync(
      path.join(config.outputRoot, 'project.config.json'),
      {
        compileType: 'widget',
        widgetRoot: args.widgetRoot,
      },
      {
        encoding: 'utf-8',
        spaces: 2,
      }
    )
  })
}
