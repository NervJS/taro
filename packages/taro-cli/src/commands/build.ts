import { Kernel } from '@tarojs/service'

export default function build (kernel: Kernel, {
  platform,
  isWatch,
  release,
  port,
  env,
  ui,
  uiIndex,
  page,
  component,
  envHasBeenSet = false,
  plugin,
  isHelp,
  deviceType,
  resetCache
}: {
  platform: string,
  isWatch: boolean,
  release?: boolean
  port?: number
  env?: string
  ui?: boolean
  uiIndex?: string
  page?: string
  component?: string
  envHasBeenSet?: boolean
  plugin?: string | boolean
  isHelp?: boolean,
  deviceType?: string,
  resetCache?: boolean
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
  let nodeEnv = process.env.NODE_ENV || env
  if (!nodeEnv) {
    if (isWatch) {
      nodeEnv = 'development'
    } else {
      nodeEnv = 'production'
    }
  }
  process.env.NODE_ENV = nodeEnv
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
      plugin,
      isHelp,
      deviceType,
      resetCache
    }
  })
}
