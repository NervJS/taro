export type TaroIndent = string | number | boolean | undefined | null

// export type TaroAny = Record<string, TaroIndent> | TaroIndent | TaroIndent[] | TaroAny[]

export type TaroAny = any

export type Func = (...args: any[]) => any;