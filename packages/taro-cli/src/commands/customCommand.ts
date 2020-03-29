import { Kernel } from '@tarojs/service'

export default function customCommand (
  command: string,
  kernel: Kernel,
  args: {_: string[], [key: string]: any}
) {
  if (typeof command === 'string') {
    const options = {}
    Object.keys(args).forEach(key => {
      if (key !== '_') {
        options[key] = args[key]
      }
    })
    kernel.run({
      name: command,
      opts: {
        _: args._,
        options
      }
    })
  }
}