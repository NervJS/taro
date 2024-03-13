// @proxyClassSign('')
class NativeApi {
  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  harmonyNavigateTo(options: any) {
    return options
  }
}

export const nativeApi = new NativeApi()
