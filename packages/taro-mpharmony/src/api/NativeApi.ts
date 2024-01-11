class UpdateManagerBridgeAsync {

  // @ts-ignore
  applyUpdateBridgeAsync () {
  }

  onCheckForUpdateBridgeAsync (callback: Taro.UpdateManager.OnCheckForUpdateCallback) {
    return callback
  }

  // @ts-ignore
  onUpdateFailedBridgeAsync (callback: (res: TaroGeneral.CallbackResult) => void) {
    return callback

  }

  // @ts-ignore
  onUpdateReadyBridgeAsync (callback: (res: TaroGeneral.CallbackResult) => void) {
    return callback
  }
}

class UpdateManager implements Taro.UpdateManager {

  updateManagerBridgeAsync: UpdateManagerBridgeAsync

  constructor (updateManagerBridgeAsync: UpdateManagerBridgeAsync) {
    this.updateManagerBridgeAsync = updateManagerBridgeAsync
  }

  // 类型2：异步调用，res无方法
  // @ts-ignore
  applyUpdate () {
    this.updateManagerBridgeAsync.applyUpdateBridgeAsync()
  }

  // 类型3：持续监听，res无方法
  // @ts-ignore
  onCheckForUpdate (callback: Taro.UpdateManager.OnCheckForUpdateCallback) {
    this.updateManagerBridgeAsync.onCheckForUpdateBridgeAsync(callback)
  }

  // @ts-ignore
  onUpdateFailed (callback: (res: TaroGeneral.CallbackResult) => void) {
    this.updateManagerBridgeAsync.onUpdateFailedBridgeAsync(callback)

  }

  // @ts-ignore
  onUpdateReady (callback: (res: TaroGeneral.CallbackResult) => void) {
    this.updateManagerBridgeAsync.onUpdateReadyBridgeAsync(callback)
  }
}


// @proxyClassSign('')
class NativeApi {


  // 类型1：同步调用
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

  // @ts-ignore
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

  chooseMediaAssetsBridgeAsync (options: any) {
    return options
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

  createInnerAudioContextBridgeAsync (options: any) {
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

  hideKeyboardBridgeAsync (options: any) {
    return options
  }


  makePhoneCallBridgeAsync (options: any) {
    return options
  }

  // 类型2：异步调用，res无方法
  openSystemBluetoothSettingBridgeAsync (options: any) {
    return options
  }

  // 类型3：持续监听，res无方法
  onWindowResizeBridgeAsync (options: any) {
    return options
  }

  // @ts-ignore
  updateManagerBridgeAsync = window.MethodChannel.createNativeApiProxy(new UpdateManagerBridgeAsync())
  // @ts-ignore
  updateManage = new UpdateManager(this.updateManagerBridgeAsync)

  // 类型4
  getUpdateManager () {
    return this.updateManage
  }
}

// @ts-ignore
const native = window.MethodChannel.createNativeApiProxy(new NativeApi())

export default native


