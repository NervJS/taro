import { ErrCodeMsg } from './index'

// taro-cli-convertor 模块的全局变量
interface Globals {
  logFilePath: string // 日志文件路径
  errCodeMsgs: ErrCodeMsg[] // 错误代码信息 (转换报告涉及的字段)
  currentParseFile: string // 当前解析的文件 (转换报告涉及的字段)
  logCount: number
  logFileContent: string
}

export const globals: Globals = {
  logFilePath: '',
  errCodeMsgs: [],
  currentParseFile: '',
  logCount: 0,
  logFileContent: '',
}
