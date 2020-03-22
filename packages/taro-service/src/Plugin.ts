import Kernel from './Kernel'
import { IHook, ICommand } from './utils/types'

export default class Plugin {
  id: string
  path: string
  ctx: Kernel
  constructor (opts) {
    this.id = opts.id
    this.path = opts.path
    this.ctx = opts.ctx
  }

  register (hook: IHook) {
    if (typeof hook.name !== 'string') {
      throw new Error(`插件 ${this.id} 中注册 hook 失败， hook.name 必须是 string 类型`)
    }
    if (typeof hook.fn !== 'function') {
      throw new Error(`插件 ${this.id} 中注册 hook 失败， hook.fn 必须是 function 类型`)
    }
    const hooks = this.ctx.hooks[hook.name] || []
    hook.plugin = this.id
    this.ctx.hooks[hook.name] = hooks.concat(hook)
  }

  registerCommand (command: ICommand) {
    if (this.ctx.commands[command.name]) {
      throw new Error(`${command.name} 命令已存在`)
    }
    this.ctx.commands[command.name] = command
    this.register(command)
  }

  registerMethod (args: string | { name: string, fn?: Function }) {
    let name, fn
    if (typeof args === 'string') {
      name = args
    } else {
      name = args.name
      fn = args.fn
    }
    if (this.ctx.methods[name]) {
      throw `已存在方法 ${name}`
    }
    this.ctx.methods[name] = fn || function (fn: Function) {
      this.register({
        name,
        fn
      })
    }.bind(this)
  }
}
