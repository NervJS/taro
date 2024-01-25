
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

  @jsBridgeMode({ isAsync: true, autoRelease: false })
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
  innerAudioStop (): any {
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioPlay (): any {
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioOnPlay (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioOnStop (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioOnError (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioOnEnded (option: any): void {
    return option
  }

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextVolume () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextVolume () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextStartTime () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextStartTime () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextPlaybackRate () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextPlaybackRate () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextPaused () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextPaused () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextObeyMuteSwitch () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextObeyMuteSwitch () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextLoop () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextLoop () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextDuration () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextDuration () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextCurrentTime () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextCurrentTime () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextBuffered () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextBuffered () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextAutoplay () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextAutoplay () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextSrc () {}

  @jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextSrc () {}

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

  @jsBridgeMode({ isAsync: true, autoRelease: false })
  onHeadersReceived (option: any): any {
    return option
  }

  @jsBridgeMode({ isAsync: true, autoRelease: false })
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


