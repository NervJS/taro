import { Kernel } from '@tarojs/service'
import * as path from 'path'

interface IRunOptions {
  options?: Record<string, string | boolean>
  args?: string[]
}

interface IRun {
  (appPath: string, options?: IRunOptions): Promise<Kernel>
}

export function run (name: string, presets: string[] = []): IRun {
  return async function (appPath, opts = {}) {
    const { options = {}, args = [] } = opts
    const kernel = new Kernel({
      appPath: appPath,
      presets: [
        path.resolve(__dirname, '../__mocks__', 'presets.ts'),
        ...presets.map(e => path.isAbsolute(e) ? e : path.resolve(__dirname, '../../presets', `${e}.ts`))
      ],
      plugins: []
    })
    kernel.optsPlugins ||= []

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
