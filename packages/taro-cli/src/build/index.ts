import * as path from 'path'

import { Kernel } from '@tarojs/service'

export default function build ({
  platform,
  appPath,
  isWatch,
  release,
  port,
  ui,
  uiIndex,
  page,
  component,
  envHasBeenSet = false
}: {
  platform: string,
  appPath: string,
  isWatch: boolean,
  release?: boolean
  port?: number
  ui?: boolean
  uiIndex?: string
  page?: string
  component?: string
  envHasBeenSet?: boolean
}) {
  let isProduction = false
  if (!envHasBeenSet) {
    isProduction = process.env.NODE_ENV === 'production' || !isWatch
  }
  const kernel = new Kernel({
    appPath,
    isWatch,
    isProduction,
    presets: [
      path.resolve(__dirname, '..', 'presets', 'index.js')
    ]
  })
  kernel.run({
    name: 'build',
    opts: {
      platform,
      isWatch,
      isProduction,
      release,
      port,
      ui,
      uiIndex,
      page,
      component
    }
  })
}
