/**
 * Modify from https://github.com/ionic-team/stencil-ds-output-targets/blob/main/packages/react-output-target/react-component-lib/utils/dev.ts
 * MIT License https://github.com/ionic-team/stencil-ds-output-targets/blob/main/LICENSE
 */
export const isDevMode = () => {
  return process && process.env && process.env.NODE_ENV === 'development'
}

const warnings: { [key: string]: boolean } = {}

export const deprecationWarning = (key: string, message: string) => {
  if (isDevMode()) {
    if (!warnings[key]) {
      console.warn(message)
      warnings[key] = true
    }
  }
}
