import { Kernel } from '@tarojs/service'

export default function build (kernel: Kernel, {
  platform,
  isWatch,
  release,
  port,
  ui,
  uiIndex,
  page,
  component,
  envHasBeenSet = false,
  plugin
}: {
  platform: string,
  isWatch: boolean,
  release?: boolean
  port?: number
  ui?: boolean
  uiIndex?: string
  page?: string
  component?: string
  envHasBeenSet?: boolean
  plugin?: string | boolean
}) {
  if (plugin) {
    if (typeof plugin === 'boolean') {
      plugin = 'weapp'
    }
    platform = 'plugin'
  }
  if (platform === 'plugin') {
    plugin = plugin || 'weapp'
  }
  if (ui) {
    platform = 'ui'
  }
  process.env.TARO_ENV = platform
  kernel.run({
    name: 'build',
    opts: {
      platform,
      isWatch,
      release,
      port,
      ui,
      uiIndex,
      page,
      component,
      envHasBeenSet,
      plugin
    }
  })
}
