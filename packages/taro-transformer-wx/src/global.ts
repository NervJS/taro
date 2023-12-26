export const globals = {
  logFilePath: '',
  currentParseFile: ''
}

export const resetGlobals = (options) => {
  globals.logFilePath = options.logFilePath
}
