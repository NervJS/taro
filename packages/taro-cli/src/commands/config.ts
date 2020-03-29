import { Kernel } from '@tarojs/service'

export default function config (kernel: Kernel, {
  cmd,
  key,
  value,
  json
}: {
  cmd: string,
  key?: string,
  value?: string,
  json?: boolean
}) {
  kernel.run({
    name: 'config',
    opts: {
      cmd,
      key,
      value,
      json
    }
  })
}