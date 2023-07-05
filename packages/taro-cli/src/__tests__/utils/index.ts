import { Config, Kernel } from '@tarojs/service'
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

    const config = new Config({
      appPath: appPath,
      disableGlobalConfig: !!options.disableGlobalConfig
    })
    await config.init({
      mode: (options.mode || process.env.NODE_ENV) as string,
      command: name
    })

    const kernel = new Kernel({
      appPath: appPath,
      presets: [
        path.resolve(__dirname, '../__mocks__', 'presets.ts'),
        ...presets.map(e => path.isAbsolute(e) ? e : path.resolve(__dirname, '../../presets', `${e}.ts`))
      ],
      plugins: [],
      config
    })
    kernel.optsPlugins ||= []

    const type = options.type
    if (typeof type === 'string' && !presets.some(e => e.includes(type))) {
      kernel.optsPlugins.push(require.resolve(`@tarojs/plugin-platform-${options.type}`))
    }

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
