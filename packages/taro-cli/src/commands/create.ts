import { Kernel } from '@tencent/tarojs-service'

export default function create (kernel: Kernel, {
  appPath,
  type,
  name,
  description,
  isHelp
}: {
  appPath: string,
  type: string,
  name: string,
  description?: string,
  isHelp?: boolean
}) {
  kernel.run({
    name: 'create',
    opts: {
      appPath,
      type,
      name,
      description,
      isHelp
    }
  })
}
