export const usedComponents = new Set<string>()

export const errors: string[] = []

export const globals = {
  hasCatchTrue: false
}

export const resetGlobals = () => {
  globals.hasCatchTrue = false
}
