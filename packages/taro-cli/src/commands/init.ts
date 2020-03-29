import { Kernel } from '@tarojs/service'

export default function init (kernel: Kernel, {
  appPath,
  projectName,
  typescript,
  templateSource,
  clone,
  template,
  css
}: {
  appPath: string,
  projectName?: string,
  typescript?: boolean,
  templateSource?: string,
  clone?: boolean,
  template?: string,
  css?: string
}) {
  kernel.run({
    name: 'init',
    opts: {
      appPath,
      projectName,
      typescript,
      templateSource,
      clone,
      template,
      css
    }
  })
}