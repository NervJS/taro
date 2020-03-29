import { Kernel } from '@tarojs/service'

export default function update (kernel: Kernel, {
  appPath,
  updateType,
  version
}: {
  appPath: string,
  updateType: string,
  version?: string
}) {
  kernel.run({
    name: 'update',
    opts: {
      appPath,
      updateType,
      version
    }
  })
}