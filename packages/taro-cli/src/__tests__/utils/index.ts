import * as path from 'path'
import { Kernel } from '@tarojs/service'

interface IRunOptions {
  options?: Record<string, string | boolean>,
  args?: string[]
}

interface IRun {
  (appPath: string, options?: IRunOptions): Promise<Kernel>
}

export function run (name: string): IRun {
  return async function (appPath, opts = {}) {
    const { options = {}, args = [] } = opts
    const kernel = new Kernel({
      appPath: appPath,
      presets: [
        path.resolve(__dirname, '../__mocks__', 'presets.ts')
      ]
    })

    await kernel.run({
      name,
      opts: {
        _: [name, ...args],
        options,
        isHelp: false
      }
    })

    return kernel
  }
}
