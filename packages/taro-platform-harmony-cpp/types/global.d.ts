/// <reference types="@tarojs/runtime" />

// for JSVM
type TFunc = (...args: any[]) => any
declare function get (name: 'EventCenter'): {
  on: (type: string, callback: TFunc) => void
  once: (type: string, callback: TFunc) => void
  off: (type: string, callback: TFunc) => void
  trigger: (type: string, ...args: any[]) => void
}

declare function get (name: 'NativePackageManager'): {
  loadLibrary: (name: string, options: unknown[][]) => Promise<any>
  loadLibrarySync: (name: string, options: unknown[][]) => any
}

declare function get (name: 'WindowManager'): {
  isReadyPromise: () => Promise<void>
  getWindowInfo: () => any
}

declare function get (name: 'StorageManager'): {
  get: (key: string) => any
  has: (key: string) => boolean
}

declare function get (name: 'NetworkManager'): {
  getNetworkType: () => any
  onNetworkStatusChange: (callback: Function) => void
  offNetworkStatusChange: (callback: Function) => void
}
