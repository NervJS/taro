import * as path from 'path'

export const usedComponents = new Set<string>()

export const errors: string[] = []

export const globals = {
  hasCatchTrue: false,
  logFilePath: '',
}

export const THIRD_PARTY_COMPONENTS = new Set<string>()

export const resetGlobals = (rootPath) => {
  globals.hasCatchTrue = false
  globals.logFilePath = path.join(rootPath, 'taroConvert', '.convert', 'convert.log')
  THIRD_PARTY_COMPONENTS.clear()
}
