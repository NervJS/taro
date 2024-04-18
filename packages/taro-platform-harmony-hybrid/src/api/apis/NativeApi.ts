import { HybridProxy } from './NativeApiHybridProxy'
import { NativeDataChangeListener, SyncCacheProxyHandler } from './NativeApiSyncCacheProxy'
// @ts-ignore
const syncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true }) || (target => target)
// @ts-ignore
const syncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false }) || (target => target)
// @ts-ignore
const asyncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true }) || (target => target)
// @ts-ignore
const asyncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false }) || (target => target)

export class NativeApi {
  /**
   * 获取哪些Api的数据需要缓存。
   * @return  string[] Api的方法名数组
   */
  // @ts-ignore
  @(syncAndRelease)
  enableCacheMethodNames (): string[] {
    return []
  }

  /**
   * 系统层获取到监听器。
   * 1.系统层，保存listener
   * 2.系统层，监听系统数据变化，发生变化后，调用listener.change(methodName)即可。
   */
  // @ts-ignore
  @(syncAndRelease)
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  obtainNativeChangeListener (listener: NativeDataChangeListener | null) {
    return null
  }


  // @ts-ignore
  @(syncAndRelease)
  getWindowInfo (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  getDeviceInfo (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  getSystemInfoSync (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  getSystemSetting (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  getAppBaseInfo (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  getAppAuthorizeSetting (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  navigateToMiniProgram (options: any) {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  setNavigationBarColor (options: any) {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getMenuButtonBoundingClientRect (): any {
    return ''
  }

  // @ts-ignore
  @(syncAndRelease)
  request (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  saveDataUrlToFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  copyFileToSandboxCache (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  startAccelerometer (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  stopAccelerometer (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onAccelerometerChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  offAccelerometerChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  startCompass (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  stopCompass (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onCompassChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  offCompassChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  startGyroscope (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  stopGyroscope (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onGyroscopeChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  saveImageToPhotosAlbum (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  chooseMediaAssets (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getVideoInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getImageInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  compressVideo (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getLocation (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  openDocument (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  login (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  setNavigationStyle (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getUserInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  openSetting (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  getSetting (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  setKeepScreenOn (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onUserCaptureScreen (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  offUserCaptureScreen (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onLocationChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  offLocationChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  setScreenBrightness (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getScreenBrightness (options: any): any {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onMemoryWarning (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  offMemoryWarning (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  hideKeyboard (options?: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  onKeyboardHeightChange (options?: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  offKeyboardHeightChange (options?: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  makePhoneCall (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getSavedFileList (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  removeSavedFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  getSavedFileInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  addPhoneContact (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  scanCode (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  vibrateShort (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  vibrateLong (options: any): any {
    return options
  }

  // NativeUpdateManager
  // @ts-ignore
  @(syncAndRelease)
  applyUpdate (): any {}

  // @ts-ignore
  @(syncAndRelease)
  onCheckForUpdate (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  onUpdateFailed (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  onUpdateReady (options: any): any {
    return options
  }

  // NativeAContextApi
  // @ts-ignore
  @(syncAndRelease)
  createInnerAudioContext (): any {}

  // @ts-ignore
  @(syncAndRelease)
  innerAudioStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  innerAudioPlay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndNotRelease)
  innerAudioOnPlay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndNotRelease)
  innerAudioOnStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndNotRelease)
  innerAudioOnError (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndNotRelease)
  innerAudioOnEnded (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextVolume (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextVolume (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextStartTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextStartTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextPlaybackRate (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextPlaybackRate (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextPaused (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextPaused (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextObeyMuteSwitch (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextObeyMuteSwitch (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextLoop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextLoop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextDuration (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextDuration (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextCurrentTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextCurrentTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextBuffered (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextBuffered (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextAutoplay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextAutoplay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getAudioContextSrc (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setAudioContextSrc (option: any, _: number) {
    return option
  }

  // NativeUploadFile
  // @ts-ignore
  @(asyncAndNotRelease)
  uploadFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  downloadFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  abort (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  offHeadersReceived (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  offProgressUpdate (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onHeadersReceived (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onProgressUpdate (option: any, _: number): any {
    return option
  }

  // NativeFileSystemManager
  // @ts-ignore
  @(syncAndRelease)
  getFileManager (): any {}

  // @ts-ignore
  @(asyncAndNotRelease)
  access (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  saveFile (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  getFileInfo (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  readFile (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  readFileSync (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  openAppAuthorizeSetting (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  requestSubscribeMessage (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  closeBLEConnection (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  createBLEConnection (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getBLEDeviceCharacteristics (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getBLEDeviceRSSI (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getBLEDeviceServices (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  notifyBLECharacteristicValueChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onBLECharacteristicValueChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onBLEConnectionStateChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  readBLECharacteristicValue (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  setBLEMTU (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  writeBLECharacteristicValue (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  closeBluetoothAdapter (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getBluetoothAdapterState (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getBluetoothDevices (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getConnectedBluetoothDevices (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  offBluetoothAdapterStateChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  offBluetoothDeviceFound (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onBluetoothAdapterStateChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onBluetoothDeviceFound (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  openBluetoothAdapter (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  startBluetoothDevicesDiscovery (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  stopBluetoothDevicesDiscovery (option: any): any {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  getExecStatus (option: any): any {
    // 获取缓存数据
    return option
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  setStorage (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndRelease)
  removeStorage (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndRelease)
  getStorage (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndRelease)
  getStorageInfo (option: any): any {
    return option
  }

  // @ts-ignore
  @(asyncAndRelease)
  clearStorage (option: any): any {
    return option
  }
}

export class ProxyChain {
  private target: any

  constructor (target: object) {
    this.target = target
  }

  // 添加一个新的Proxy处理器
  addHandler (handler: (target: any) => ProxyHandler<any>): ProxyChain {
    const h = handler(this.target)
    this.target = new Proxy(this.target, h)
    return this
  }

  // 创建并获取最终的Proxy对象
  getProxy (): any {
    return this.target
  }
}

/**
 * 链式Proxy
 * 通过[addHandler]添加ProxyHandler
 * 通过[getProxy]获取最终的target
 */
const native = new ProxyChain(new NativeApi())
  .addHandler((target) => new SyncCacheProxyHandler(target))
  // HybridProxy第一个false是默认走jsb，true是走纯js， 第二个false是不走osChannel
  .addHandler((target) => new HybridProxy(false, false, target))
  .getProxy()

export default native
