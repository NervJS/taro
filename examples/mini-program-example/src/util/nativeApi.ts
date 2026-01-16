// @ts-ignore
const sync = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true }) || (target => target)

// @proxyClassSign('')
class NativeApi {
  @sync
  navigateToTaroHybrid(_options: any) {}


  @sync
  navigateToNative(_options: any){}
}

const nativeApi = new NativeApi()
export default nativeApi
