import { Kernel } from '@tarojs/service'

export default function doctor (kernel: Kernel, {
  appPath,
  isHelp
}: {
  appPath: string,
  isHelp?: boolean
}) {
  kernel.run({
    name: 'doctor',
    opts: {
      appPath,
      isHelp
    }
  })
}
