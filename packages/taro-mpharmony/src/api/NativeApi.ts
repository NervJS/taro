
function jsBridgeMode(mode: {isAsync: boolean, autoRelease?: boolean}){
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name;
    descriptor.value = function (...args: any[]) {
      // @ts-ignore
      return window.MethodChannel.methodCallByNative(className, key, args, mode?.isAsync ?? true, mode?.autoRelease ?? true);
    }
  };
}


// @proxyClassSign('')
class NativeApi {

  @jsBridgeMode({ isAsync: true, autoRelease: true})
  makePhoneCall(options: any) {return options}

  getWindowInfoBridgeSync (): any {
    return ''
  }

  getSystemInfoSyncBridgeSync (): any {
    return ''
  }

  getSystemSettingBridgeSync (): any {
    return ''
  }

  getAppBaseInfoBridgeSync (): any {
    return ''
  }

  getAppAuthorizeSettingBridgeSync (): any {
    return ''
  }

  navigateToMiniProgramBridgeAsync (options: any) {
    return options
  }

  setNavigationBarColorBridgeSync (options: any) {
    return options
  }

  getMenuButtonBoundingClientRectBridgeSync (): any {
    return ''

  }

  requestBridgeAsync (options: any): any {
    return options
  }

  downloadFileBridgeAsync (options: any): any{
    return options
  }

  uploadFileBridgeAsync (options: any): any {
    return options
  }

  saveDataUrlToFileBridgeAsync (options: any): any {
    return options
  }

  copyFileToSandboxCacheBridgeSync (options: any): any {
    return options
  }

  saveImageToPhotosAlbumBridgeAsync (options: any): any {
    return options
  }

  chooseMediaAssetsBridgeAsync (options: any, mode: object): any {
    return [options, mode]
  }

  getVideoInfoBridgeAsync (options: any): any {
    return options
  }

  getImageInfoBridgeAsync (options: any): any {
    return options
  }

  compressVideoBridgeAsync (options: any): any {
    return options
  }

  getLocationBridgeAsync (options: any): any {
    return options
  }

  openDocumentBridgeAsync (options: any): any {
    return options
  }

  loginBridgeAsync (options: any): any {
    return options
  }

  getUserInfoBridgeAsync (options: any): any {
    return options
  }


  openSettingBridgeAsync (options: any): any {
    return options
  }

  getSettingBridgeAsync (options: any): any {
    return options
  }

  setKeepScreenOnBridgeAsync (options: any): any {
    return options
  }

  onUserCaptureScreenBridgeSync (options: any): any {
    return options
  }

  hideKeyboardBridgeSync (options?: any): any {
    return options
  }

  makePhoneCallBridgeAsync (options: any): any {
    return options
  }

  // NativeAContextApi
  createInnerAudioContextBridgeSync (): any {
  }

  stopBridgeSync (): any {
  }

  playBridgeSync (): any {
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
// const native = new NativeApi()

export default native


