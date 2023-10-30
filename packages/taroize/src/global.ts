export const usedComponents = new Set<string>()

export const errors: string[] = []

export const globals = {
  hasCatchTrue: false,
}

export const THIRD_PARTY_COMPONENTS = new Set<string>()

export const resetGlobals = () => {
  globals.hasCatchTrue = false
  THIRD_PARTY_COMPONENTS.clear()
}
