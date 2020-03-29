import { Kernel } from '@tarojs/service'

export default function create (kernel: Kernel, {
  appPath,
  type,
  name,
  description
}: {
  appPath: string,
  type: string,
  name: string,
  description?: string
}) {
  kernel.run({
    name: 'create',
    opts: {
      appPath,
      type,
      name,
      description
    }
  })
}