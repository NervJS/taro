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
