/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { addPlatforms } from '@tarojs/helper'

import type Kernel from './Kernel'
import type { Func, ICommand, IHook, IPlatform } from './utils/types'

export default class Plugin {
  id: string
  path: string
  ctx: Kernel
  optsSchema: Func

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
    const methods = this.ctx.methods.get(name) || []
    methods.push(fn || function (fn: Func) {
      this.register({
        name,
        fn
      })
    }.bind(this))
    this.ctx.methods.set(name, methods)
  }

  addPluginOptsSchema (schema) {
    this.optsSchema = schema
  }
}

function processArgs (args) {
  let name, fn
  if (!args.length) {
    throw new Error('参数为空')
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
