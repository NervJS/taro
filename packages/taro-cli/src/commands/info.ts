import { Kernel } from '@tarojs/service'

export default function info (kernel: Kernel, {
  appPath,
  rn
}: {
  appPath: string,
  rn?: boolean
}) {
  kernel.run({
    name: 'info',
    opts: {
      appPath,
      rn
    }
  })
}