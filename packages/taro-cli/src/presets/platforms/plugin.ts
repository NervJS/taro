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
  ctx.registerPlatform({
    name: 'plugin',
    useConfigName: 'mini',
    async fn ({ config }) {
      const {
        options,
        _
      } = ctx.runOpts
      const { chalk, PLATFORMS } = ctx.helper
      const { WEAPP, ALIPAY } = PLATFORMS
      const typeMap = {
        [WEAPP]: '微信',
        [ALIPAY]: '支付宝'
      }
      const { plugin, isWatch } = options
      if (plugin !== WEAPP && plugin !== ALIPAY) {
        console.log(chalk.red('目前插件编译仅支持 微信/支付宝 小程序！'))
        return
      }
      console.log(chalk.green(`开始编译${typeMap[plugin]}小程序插件`))
      async function buildPlugin (type) {
        process.env.TARO_ENV = type
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: true,
              isWatch,
              outputRoot: `${config.outputRoot}`,
              platform: type,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: type
            }),
            _
          }
        })
        await ctx.applyPlugins({
          name: 'build',
          opts: {
            config: {
              ...config,
              isBuildPlugin: false,
              isWatch,
              outputRoot: `${config.outputRoot}/miniprogram`,
              platform: type,
              needClearOutput: false
            },
            options: Object.assign({}, options, {
              platform: type
            }),
            _
          }
        })
      }

      buildPlugin(plugin)
    }
  })
}
