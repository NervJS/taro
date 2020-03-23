import * as path from 'path'

import { Kernel } from '@tarojs/service'

export default function build ({
  platform,
  appPath
}: {
  platform: string,
  appPath: string
}) {
  const kernel = new Kernel({
    appPath,
    presets: [
      path.resolve(__dirname, '..', 'presets', 'index.js')
    ]
  })
  kernel.run({
    name: 'build',
    opts: {
      platform
    }
  })
}
