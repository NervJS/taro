import { Kernel } from '@tarojs/service'

export default function customCommand (
  command: string,
  kernel: Kernel,
  args: { _: string[], [key: string]: any }
) {
  if (typeof command === 'string') {
    const options: any = {}
    Object.keys(args).forEach(key => {
      if (key !== '_') {
        options[key] = args[key]
      }
    })
    kernel.run({
      name: command,
      opts: {
        _: args._,
        options,
        isHelp: options.h
      }
    })
  }
}
