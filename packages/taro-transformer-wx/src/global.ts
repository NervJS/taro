export const globals = {
  logFilePath: '',
  logFileContent: ''
}

export const resetGlobals = (options) => {
  globals.logFilePath = options.logFilePath
}
