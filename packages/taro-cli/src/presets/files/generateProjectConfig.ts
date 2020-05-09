import * as path from 'path'

import { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerMethod('generateProjectConfig', ({ srcConfigName, distConfigName }) => {
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
