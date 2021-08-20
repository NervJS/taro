/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { Kernel } from '@tarojs/service'

export default function customCommand (
  command: string,
  kernel: Kernel,
  args: { _: string[], [key: string]: any }
) {
  if (typeof command === 'string') {
    const options: any = {}
    const excludeKeys = ['_', 'version', 'v', 'help', 'h']
    Object.keys(args).forEach(key => {
      if (!excludeKeys.includes(key)) {
        options[key] = args[key]
      }
    })

    // 设置环境变量
    process.env.NODE_ENV = process.env.NODE_ENV || options.env || (options.isWatch ? 'development' : 'production')
    if (options.platform) {
      process.env.TARO_ENV = options.platform
    }

    kernel.run({
      name: command,
      opts: {
        _: args._,
        options,
        isHelp: args.h
      }
    })
  }
}
