/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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
