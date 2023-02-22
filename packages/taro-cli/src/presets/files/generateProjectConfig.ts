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

import { IPluginContext } from '@tarojs/service'
import * as path from 'path'

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

    if (ctx.initialConfig.logger?.quiet === false) {
      printLog(processTypeEnum.GENERATE, '工具配置', `${outputPath}/${distConfigName}`)
    }
  })
}
