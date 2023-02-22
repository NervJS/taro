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
