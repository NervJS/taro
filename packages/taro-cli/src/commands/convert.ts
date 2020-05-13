import { Kernel } from '@tarojs/service'

export default function convert (kernel: Kernel, {
  appPath,
  isHelp
}: {
  appPath: string,
  isHelp?: boolean
}) {
  kernel.run({
    name: 'convert',
    opts: {
      appPath,
      isHelp
    }
  })
}
