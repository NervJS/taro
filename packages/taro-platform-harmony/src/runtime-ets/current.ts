export const context: any = {
  resolver: null
}

// @ts-nocheck
export const Current: any = {
  app: null,
  uiContext: null,
  router: {},
  taro: {},
  contextPromise: new Promise(resolve => {
    context.resolver = resolve

    return resolve
  }),
  createHarmonyElement: null
}

export const getCurrentInstance = () => Current
