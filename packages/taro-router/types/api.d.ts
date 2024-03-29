export interface Base {
  success?: (...args: any[]) => void
  fail?: (...args: any[]) => void
  complete?: (...args: any[]) => void
}

export interface Option extends Base {
  url: string
}

export interface NavigateBackOption extends Base {
  delta: number
}

 export interface NavigateOption extends BaseOption {
  url: string
  events?: Record<string, any>
}
