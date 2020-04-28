import { Kernel } from '@tarojs/service'

export default function info (kernel: Kernel, {
  appPath,
  rn,
  isHelp
}: {
  appPath: string,
  rn?: boolean,
  isHelp?: boolean
}) {
  kernel.run({
    name: 'info',
    opts: {
      appPath,
      rn,
      isHelp
    }
  })
}
