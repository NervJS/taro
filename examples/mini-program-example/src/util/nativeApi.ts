// @ts-ignore
const decorator = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true }) || (target => target)

// @proxyClassSign('')
class NativeApi {
  // @ts-ignore
  @decorator
  harmonyNavigateTo(options: any) {
    return options
  }
}

const nativeApi = new NativeApi()
export default nativeApi
