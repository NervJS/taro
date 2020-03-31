import { addPlatforms } from '@tarojs/helper'

import Kernel from './Kernel'
import { IHook, ICommand, IPlatform } from './utils/types'

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
    const hooks = this.ctx.hooks.get(hook.name) || []
    hook.plugin = this.id
    this.ctx.hooks.set(hook.name, hooks.concat(hook))
  }

  registerCommand (command: ICommand) {
    if (this.ctx.commands.has(command.name)) {
      throw new Error(`命令 ${command.name} 已存在`)
    }
    this.ctx.commands.set(command.name, command)
    this.register(command)
  }

  registerPlatform (platform: IPlatform) {
    if (this.ctx.platforms.has(platform.name)) {
      throw new Error(`适配平台 ${platform.name} 已存在`)
    }
    addPlatforms(platform.name)
    this.ctx.platforms.set(platform.name, platform)
    this.register(platform)
  }

  registerMethod (...args) {
    const { name, fn } = processArgs(args)
    if (this.ctx.methods.has(name)) {
      throw `已存在方法 ${name}`
    }
    this.ctx.methods.set(name, fn || function (fn: Function) {
      this.register({
        name,
        fn
      })
    }.bind(this))
  }
}

function processArgs (args) {
  let name, fn
  if (!args.length) {
    throw '参数为空'
  } else if (args.length === 1) {
    if (typeof args[0] === 'string') {
      name = args[0]
    } else {
      name = args[0].name
      fn = args[0].fn
    }
  } else {
    name = args[0]
    fn = args[1]
  }
  return { name, fn }
}
