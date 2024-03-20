// @proxyClassSign('')
class NativeApi {
  // @ts-ignore
  @window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true })
  harmonyNavigateTo(options: any) {
    return options
  }
}

const nativeApi = new NativeApi()
export default nativeApi
