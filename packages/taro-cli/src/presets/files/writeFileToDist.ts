import * as path from 'path'

export default (ctx) => {
  ctx.registerMethod('writeFileToDist', ({ filePath, content }) => {
    const { outputPath } = ctx.paths
    const { printLog, processTypeEnum, fs } = ctx.helper
    if (path.isAbsolute(filePath)) {
      printLog(processTypeEnum.ERROR, `ctx.writeFileToDist 不能接受绝对路径`)
      return
    }
    const absFilePath = path.join(outputPath, filePath)
    fs.ensureDirSync(path.dirname(absFilePath))
    fs.writeFileSync(absFilePath, content)
  })
}
