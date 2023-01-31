export function isFunction (o: unknown): o is (...args: any[]) => any {
  return typeof o === 'function'
}

const VALID_COLOR_REG = /^#[0-9a-fA-F]{6}$/
export const isValidColor = (color) => {
  return VALID_COLOR_REG.test(color)
}
