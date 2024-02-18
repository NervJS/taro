

// @proxyClassSign('')
class NativeApi {

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getWindowInfo (): any {
    return ''
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getSystemInfoSync (): any {
    return ''
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getSystemSetting (): any {
    return ''
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAppBaseInfo (): any {
    return ''
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAppAuthorizeSetting (): any {
    return ''
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  navigateToMiniProgram (options: any) {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setNavigationBarColor (options: any) {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getMenuButtonBoundingClientRect (): any {
    return ''
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  request (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  saveDataUrlToFile (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  copyFileToSandboxCache (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  saveImageToPhotosAlbum (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  chooseMediaAssets (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  getVideoInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  getImageInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  compressVideo (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  getLocation (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  openDocument (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  login (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  getUserInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  openSetting (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  getSetting (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  setKeepScreenOn (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  onUserCaptureScreen (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  offUserCaptureScreen (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  hideKeyboard (options?: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  makePhoneCall (options: any): any {
    return options
  }

  // NativeUpdateManager
  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  applyUpdate (): any {}

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  onCheckForUpdate (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  onUpdateFailed (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  onUpdateReady (options: any): any {
    return options
  }

  // NativeAContextApi
  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  createInnerAudioContext (): any {
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  innerAudioPlay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false })
  innerAudioOnPlay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false })
  innerAudioOnStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false })
  innerAudioOnError (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false })
  innerAudioOnEnded (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextVolume (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextVolume (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextStartTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextStartTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextPlaybackRate (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextPlaybackRate (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextPaused (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextPaused (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextObeyMuteSwitch (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextObeyMuteSwitch (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextLoop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextLoop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextDuration (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextDuration (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextCurrentTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextCurrentTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextBuffered (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextBuffered (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextAutoplay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextAutoplay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  getAudioContextSrc (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  setAudioContextSrc (option: any, _: number) {
    return option
  }

  // NativeUploadFile
  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  uploadFile (options: any): any {
    return options
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  abort (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  offHeadersReceived (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  offProgressUpdate (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  onHeadersReceived (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  onProgressUpdate (option: any, _: number): any {
    return option
  }

  // NativeFileSystemManager
  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  getFileManager (): any {}

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  access (option: any): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true })
  saveFile (option: any): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  getFileInfo (option: any): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false })
  readFile (option: any): any {
    return option
  }

  // @ts-ignore
  @window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true })
  readFileSync (option: any): any {
    return option
  }
}

const native = new NativeApi()

export default native


