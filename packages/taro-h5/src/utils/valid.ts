export function isFunction (obj) {
  return typeof obj === 'function'
}

const VALID_COLOR_REG = /^#[0-9a-fA-F]{6}$/
export const isValidColor = (color) => {
  return VALID_COLOR_REG.test(color)
}
