
function jsBridgeMode (mode: {isAsync: boolean, autoRelease?: boolean}) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name
    descriptor.value = function (...args: any[]) {
      // @ts-ignore
      return window.MethodChannel.methodCallByNative(className, key, args, mode?.isAsync ?? true, mode?.autoRelease ?? true)
    }
  }
}


// @proxyClassSign('')
class NativeApi {

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getWindowInfo (): any {
    return ''
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getSystemInfoSync (): any {
    return ''
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getSystemSetting (): any {
    return ''
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAppBaseInfo (): any {
    return ''
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAppAuthorizeSetting (): any {
    return ''
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  navigateToMiniProgram (options: any) {
    return options
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setNavigationBarColor (options: any) {
    return options
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getMenuButtonBoundingClientRect (): any {
    return ''
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  request (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  downloadFile (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  saveDataUrlToFile (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  copyFileToSandboxCache (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  saveImageToPhotosAlbum (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  chooseMediaAssets (options: any, mode: object): any {
    return [options, mode]
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  getVideoInfo (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  getImageInfo (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  compressVideo (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  getLocation (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  openDocument (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  login (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  getUserInfo (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  openSetting (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  getSetting (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  setKeepScreenOn (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  onUserCaptureScreen (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  hideKeyboard (options?: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  makePhoneCall (options: any): any {
    return options
  }

  // NativeAContextApi
  @jsBridgeMode({ isAsync: false, autoRelease: true })
  createInnerAudioContext (): any {
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  stop (): any {
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  play (): any {
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  onPlay (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  onStop (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  onError (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  onEnded (option: any): void {
    return option
  }

  // NativeUploadFile
  @jsBridgeMode({ isAsync: true, autoRelease: false })
  uploadFile (options: any): any {
    return options
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  abort (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  offHeadersReceived (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  offProgressUpdate (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  onHeadersReceived (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  onProgressUpdate (option: any): any {
    return option
  }

  // NativeFileSystemManager
  @jsBridgeMode({ isAsync: true, autoRelease: false })
  access (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: true })
  saveFile (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: false })
  getFileInfo (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: false })
  readFile (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  readFileSync (option: any): any {
    return option
  }
}

// @ts-ignore
const native = window.MethodChannel.createNativeApiProxy(new NativeApi())
// const native = new NativeApi()

export default native


