import { Kernel } from '@tarojs/service'

export default function convert (kernel: Kernel, {
  appPath
}: {
  appPath: string
}) {
  kernel.run({
    name: 'convert',
    opts: {
      appPath
    }
  })
}