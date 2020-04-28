import { Kernel } from '@tarojs/service'

export default function update (kernel: Kernel, {
  appPath,
  updateType,
  version,
  isHelp
}: {
  appPath: string,
  updateType: string,
  version?: string,
  isHelp?: boolean
}) {
  kernel.run({
    name: 'update',
    opts: {
      appPath,
      updateType,
      version,
      isHelp
    }
  })
}
