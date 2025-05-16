/// <reference types="@tarojs/plugin-platform-harmony-ets/types/harmony" />
declare module '@jd-oh/*'
declare module '@taro-oh/*'
declare module '@hmscore/*'
declare module '@ohos.*'
declare module '@system.*'
declare module '@kit.*'

declare module '@kit.AbilityKit' {
  namespace common {
    type BaseContext = any
    export { BaseContext }
  }
}
declare module '@ohos.base' {
  export = any
}
declare module '@ohos.web.webview' {
  export = any
}
declare module '@ohos.window' {
  export = any
}

declare module 'libTaroHarmonyLibrary.so' {
  export = any
  // export * from '../cpp/types/taro-native-node/index.d.ts'
}
