export * from './event'

export type TaroAny = any
export type TaroFunc = (...args: TaroAny[]) => TaroAny
export type TaroIndent = string | number | boolean | undefined | null
export type TaroObject = Record<string | number | symbol, TaroAny>
