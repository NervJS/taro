export const usedComponents = new Set<string>()

export const errors: string[] = []

/* taroize 模块中的全局变量 */
interface Globals {
  rootPath: string // 根路径
  hasCatchTrue: boolean
  logFilePath: string // 日志文件路径
  currentParseFile: string // 当前解析文件 (转换报告涉及的字段)
  errCodeMsgs: any[] // 错误代码信息列表 (转换报告涉及的字段)
  logFileContent: string
}

export const globals: Globals = {
  rootPath: '',
  hasCatchTrue: false,
  logFilePath: '',
  currentParseFile: '',
  errCodeMsgs: [],
  logFileContent: ''
}

export const THIRD_PARTY_COMPONENTS = new Set<string>()

export const resetGlobals = (rootPath, logFilePath) => {
  globals.rootPath = rootPath
  globals.hasCatchTrue = false
  globals.logFilePath = logFilePath
  globals.errCodeMsgs = []
  THIRD_PARTY_COMPONENTS.clear()
}
