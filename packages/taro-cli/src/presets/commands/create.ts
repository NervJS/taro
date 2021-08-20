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

import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'create',
    optionsMap: {
      '--name [name]': '名称',
      '--description [description]': '介绍'
    },
    synopsisList: [
      'taro create page',
      'taro create --name=page --description=desc'
    ],
    fn ({ _, options }) {
      const name = _[1] || options.name
      const description = options.description || ''
      const { chalk } = ctx.helper
      const { appPath } = ctx.paths

      if (typeof name !== 'string') {
        return console.log(chalk.red('请输入需要创建的页面名称'))
      }

      const Page = require('../../create/page').default
      const page = new Page({
        pageName: name,
        projectDir: appPath,
        description,
        framework: ctx.initialConfig.framework
      })

      page.create()
    }
  })
}
