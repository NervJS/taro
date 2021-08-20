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

import { getPkgVersion } from '../../util'

export default (ctx: IPluginContext) => {
  ctx.registerMethod('generateFrameworkInfo', () => {
    const { getInstalledNpmPkgVersion, processTypeEnum, printLog, chalk } = ctx.helper
    const { nodeModulesPath } = ctx.paths
    const { date, outputRoot } = ctx.initialConfig
    const frameworkInfoFileName = '.frameworkinfo'
    const frameworkName = '@tarojs/runtime'
    const frameworkVersion = getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)

    if (frameworkVersion) {
      const frameworkinfo = {
        toolName: 'Taro',
        toolCliVersion: getPkgVersion(),
        toolFrameworkVersion: frameworkVersion,
        createTime: date ? new Date(date).getTime() : Date.now()
      }
      ctx.writeFileToDist({
        filePath: frameworkInfoFileName,
        content: JSON.stringify(frameworkinfo, null, 2)
      })
      printLog(processTypeEnum.GENERATE, '框架信息', `${outputRoot}/${frameworkInfoFileName}`)
    } else {
      printLog(processTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误！`))
    }
  })
}
