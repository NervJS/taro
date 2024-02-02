export const globals = {
  logFilePath: '',
  currentParseFile: '',
  logFileContent: ''
}

export const resetGlobals = (options) => {
  globals.logFilePath = options.logFilePath
}
