export * as swc from '@swc/core'
export * as chokidar from 'chokidar'

export const createDebug = (id: string) => require('debug')(id)

export { default as createBabelRegister, injectDefineConfigHeader } from './babelRegister'
export * from './constants'
export * from './esbuild'
export * as npm from './npm'
export { default as createSwcRegister } from './swcRegister'
export * from './terminal'
export * from './utils'
