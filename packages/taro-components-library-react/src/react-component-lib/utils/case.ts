/**
 * Modify from https://github.com/ionic-team/stencil-ds-output-targets/blob/main/packages/react-output-target/react-component-lib/utils/case.ts
 * MIT License https://github.com/ionic-team/stencil-ds-output-targets/blob/main/LICENSE
 */
export const dashToPascalCase = (str: string) =>
  str
    .toLowerCase()
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
export const camelToDashCase = (str: string) => str.replace(/([A-Z])/g, (m: string) => `-${m[0].toLowerCase()}`)
