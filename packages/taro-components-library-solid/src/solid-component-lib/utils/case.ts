export const camelToDashCase = (str: string) =>
  str.replace(/([A-Z])/g, (m: string) => `-${m[0].toLowerCase()}`)

export const isPropNameAnEvent = (propName: string) =>
  propName.startsWith('on') && propName[2] === propName[2].toUpperCase()

export const isReactiveKey = <T extends Record<string, any>>(obj: T, key: keyof T) =>
  Object.getOwnPropertyDescriptor(obj, key).get
