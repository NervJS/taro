import { Kernel } from '@tarojs/service'

export default function doctor (kernel: Kernel, {
  appPath
}: {
  appPath: string
}) {
  kernel.run({
    name: 'doctor',
    opts: {
      appPath
    }
  })
}