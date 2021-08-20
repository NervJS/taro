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

import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerMethod('generateProjectConfig', ({ srcConfigName, distConfigName }) => {
    // 混合模式不需要生成项目配置
    const { blended } = ctx.runOpts
    if (blended) return

    const { appPath, sourcePath, outputPath } = ctx.paths
    const { printLog, processTypeEnum, fs } = ctx.helper
    // 生成 project.config.json
    const projectConfigFileName = srcConfigName
    let projectConfigPath = path.join(appPath, projectConfigFileName)
    if (!fs.existsSync(projectConfigPath)) {
      // 若项目根目录不存在对应平台的 projectConfig 文件，则尝试从源代码目录查找
      projectConfigPath = path.join(sourcePath, projectConfigFileName)
      if (!fs.existsSync(projectConfigPath)) return
    }

    const origProjectConfig = fs.readJSONSync(projectConfigPath)
    // compileType 是 plugin 时不修改 miniprogramRoot 字段
    let distProjectConfig = origProjectConfig
    if (origProjectConfig.compileType !== 'plugin') {
      distProjectConfig = Object.assign({}, origProjectConfig, { miniprogramRoot: './' })
    }
    ctx.writeFileToDist({
      filePath: distConfigName,
      content: JSON.stringify(distProjectConfig, null, 2)
    })
    printLog(processTypeEnum.GENERATE, '工具配置', `${outputPath}/${distConfigName}`)
  })
}
