import path from 'node:path'

export * from './api-loader'
export * from './constants'

export function parseRelativePath (from: string, to: string) {
  const relativePath = path.relative(from, to).replace(/\\/g, '/')

  return /^\.{1,2}[\\/]/.test(relativePath)
    ? relativePath
    : /^\.{1,2}$/.test(relativePath)
      ? `${relativePath}/`
      : `./${relativePath}`
}
