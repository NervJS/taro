import { Kernel } from '@tarojs/service'

export default function build (kernel: Kernel, {
  platform,
  isWatch,
  port,
  env,
  blended = false,
  envHasBeenSet = false,
  // plugin,
  // release,
  isHelp
}: {
  platform: string
  isWatch: boolean
  port?: number
  env?: string
  blended?: boolean
  envHasBeenSet?: boolean
  // plugin?: string | boolean
  // release?: boolean
  isHelp?: boolean
}) {
  // if (plugin) {
  //   if (typeof plugin === 'boolean') {
  //     plugin = 'weapp'
  //   }
  //   platform = 'plugin'
  // }
  // if (platform === 'plugin') {
  //   plugin = plugin || 'weapp'
  // }
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
      port,
      blended,
      envHasBeenSet,
      // plugin,
      // release,
      isHelp
    }
  })
}
