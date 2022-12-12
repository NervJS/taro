export function isFunction (obj: unknown): obj is TFunc {
  return typeof obj === 'function'
}

const VALID_COLOR_REG = /^#[0-9a-fA-F]{6}$/
export const isValidColor = (color: string) => {
  return VALID_COLOR_REG.test(color)
}
