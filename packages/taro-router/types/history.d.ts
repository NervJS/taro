declare module '@tarojs/router/types/history' {
  interface StateEvent extends Event {
    action?: 'pushState' | 'replaceState' | 'popState'
    state?: any
    unused?: string
    url?: string | URL | null
  }
}
