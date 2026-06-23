declare module '@hmscore/*'
declare module '@ohos.*'
declare module '@system.*'

declare function vp2px(value: number): number
declare function px2vp(value: number): number
declare function getContext(page: any): any
declare var focusControl: any
declare var PlayMode: any
declare var animateTo: any
declare var Curve: any
declare var AppStorage: any

declare module '@ohos.data.distributedKVStore' {
  export = any
}
