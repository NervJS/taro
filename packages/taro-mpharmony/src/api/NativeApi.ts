
// @proxyClassSign('')
class NativeApi {
  getWindowInfoBridgeSync () {
    return ''
  }

  getSystemInfoSyncBridgeSync () {
    return ''
  }

  getSystemSettingBridgeSync () {
    return ''
  }

  getAppBaseInfoBridgeSync () {
    return ''
  }

  getAppAuthorizeSettingBridgeSync () {
    return ''
  }

  navigateToMiniProgramBridgeAsync (options: any) {
    return options
  }

  setNavigationBarColorBridgeSync (options: any) {
    return options
  }

  getMenuButtonBoundingClientRectBridgeSync () {
    return ''

  }

  requestBridgeAsync (options: any) {
    return options
  }

  downloadFileBridgeAsync (options: any) {
    return options
  }

  uploadFileBridgeAsync (options: any) {
    return options
  }

  saveDataUrlToFileBridgeAsync (options: any) {
    return options
  }

  copyFileToSandboxCacheBridgeSync (options: any) {
    return options
  }

  saveImageToPhotosAlbumBridgeAsync (options: any) {
    return options
  }

  chooseMediaAssetsBridgeAsync (options: any, mode: object) {
    return [options, mode]
  }

  getVideoInfoBridgeAsync (options: any) {
    return options
  }

  getImageInfoBridgeAsync (options: any) {
    return options
  }

  compressVideoBridgeAsync (options: any) {
    return options
  }

  getLocationBridgeAsync (options: any) {
    return options
  }

  openDocumentBridgeAsync (options: any) {
    return options
  }

  loginBridgeAsync (options: any) {
    return options
  }

  getUserInfoBridgeAsync (options: any) {
    return options
  }


  openSettingBridgeAsync (options: any) {
    return options
  }

  getSettingBridgeAsync (options: any) {
    return options
  }

  setKeepScreenOnBridgeAsync (options: any) {
    return options
  }

  onUserCaptureScreenBridgeSync (options: any) {
    return options
  }

  hideKeyboardBridgeSync (options: any) {
    return options
  }

  makePhoneCallBridgeAsync (options: any) {
    return options
  }

  // NativeAContextApi
  createInnerAudioContextBridgeSync () {
  }

  stopBridgeSync () {
  }

  playBridgeSync () {
  }

  onPlayBridgeSync (option: any): void {
    return option
  }

  onStopBridgeSync (option: any): void {
    return option
  }

  onErrorBridgeSync (option: any): void {
    return option
  }

  onEndedBridgeSync (option: any): void {
    return option
  }

  // NativeUploadFile
  abortBridgeAsync (option: any): any {
    return option
  }

  offHeadersReceivedBridgeAsync (option: any): any {
    return option
  }

  offProgressUpdateBridgeAsync (option: any): any {
    return option
  }

  onHeadersReceivedBridgeAsync (option: any): any {
    return option
  }

  onProgressUpdateBridgeAsync (option: any): any {
    return option
  }

  // NativeFileSystemManager
  accessBridgeAsync (option: any): any {
    return option
  }

  saveFileBridgeAsync (option: any): any {
    return option
  }

  getFileInfoBridgeAsync (option: any): any {
    return option
  }

  readFileBridgeAsync (option: any): any {
    return option
  }

  readFileSyncBridgeSync (option: any): any {
    return option
  }
}

// @ts-ignore
const native = window.MethodChannel.createNativeApiProxy(new NativeApi())

export default native


