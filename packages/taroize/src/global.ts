export const usedComponents = new Set<string>()

export const errors: string[] = []

export const globals = {
  hasCatchTrue: false
}

export const resetGlobals = () => {
  globals.hasCatchTrue = false
  // tslint:disable-next-line: no-use-before-declare
  THIRD_PARTY_COMPONENTS.clear()
}

export const THIRD_PARTY_COMPONENTS = new Set<string>()
