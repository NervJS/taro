declare module '@tarojs/router/types/api' {
  interface Base {
    success?: (...args: any[]) => void
    fail?: (...args: any[]) => void
    complete?: (...args: any[]) => void
  }

  interface Option extends Base {
    url: string
  }

  interface NavigateBackOption extends Base {
    delta: number
  }
}
