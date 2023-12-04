export const usedComponents = new Set<string>()

export const errors: string[] = []

export const globals = {
  rootPath: '',
  hasCatchTrue: false,
  logFilePath: '',
}

export const THIRD_PARTY_COMPONENTS = new Set<string>()

export const resetGlobals = (rootPath, logFilePath) => {
  globals.rootPath = rootPath
  globals.hasCatchTrue = false
  globals.logFilePath = logFilePath
  THIRD_PARTY_COMPONENTS.clear()
}
