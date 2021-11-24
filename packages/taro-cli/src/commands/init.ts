import { Kernel } from '@tarojs/service'

export default function init (kernel: Kernel, {
  appPath,
  projectName,
  description,
  typescript,
  templateSource,
  clone,
  template,
  css,
  isHelp
}: {
  appPath: string,
  projectName?: string,
  description?: string
  typescript?: boolean,
  templateSource?: string,
  clone?: boolean,
  template?: string,
  css?: string,
  isHelp?: boolean
}) {
  kernel.run({
    name: 'init',
    opts: {
      appPath,
      projectName,
      description,
      typescript,
      templateSource,
      clone,
      template,
      css,
      isHelp
    }
  })
}
