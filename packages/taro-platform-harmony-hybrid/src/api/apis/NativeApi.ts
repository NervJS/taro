import osChannelApi from './osChannelApi'
import { RequestTask } from './request'

class NativeApi {
  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getWindowInfo (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getDeviceInfo (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getSystemInfoSync (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getSystemSetting (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAppBaseInfo (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAppAuthorizeSetting (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  navigateToMiniProgram (options: any) {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setNavigationBarColor (options: any) {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getMenuButtonBoundingClientRect (): any {
    return ''
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  request (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  saveDataUrlToFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  copyFileToSandboxCache (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  startAccelerometer (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  stopAccelerometer (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onAccelerometerChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offAccelerometerChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  startCompass (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  stopCompass (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onCompassChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offCompassChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  startGyroscope (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  stopGyroscope (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onGyroscopeChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  saveImageToPhotosAlbum (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  chooseMediaAssets (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getVideoInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getImageInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  compressVideo (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getLocation (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  openDocument (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  login (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setNavigationStyle (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getUserInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  openSetting (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  getSetting (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setKeepScreenOn (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onUserCaptureScreen (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offUserCaptureScreen (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onLocationChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offLocationChange (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setScreenBrightness (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getScreenBrightness (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onMemoryWarning (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offMemoryWarning (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  hideKeyboard (options?: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  onKeyboardHeightChange (options?: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offKeyboardHeightChange (options?: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  makePhoneCall (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getSavedFileList (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  removeSavedFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getSavedFileInfo (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  addPhoneContact (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  scanCode (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  vibrateShort (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  vibrateLong (options: any): any {
    return options
  }

  // NativeUpdateManager
  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  applyUpdate (): any {}

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  onCheckForUpdate (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  onUpdateFailed (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  onUpdateReady (options: any): any {
    return options
  }

  // NativeAContextApi
  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  createInnerAudioContext (): any {}

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  innerAudioStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  innerAudioPlay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: false }))
  innerAudioOnPlay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: false }))
  innerAudioOnStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: false }))
  innerAudioOnError (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: false }))
  innerAudioOnEnded (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextVolume (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextVolume (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextStartTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextStartTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextPlaybackRate (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextPlaybackRate (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextPaused (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextPaused (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextObeyMuteSwitch (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextObeyMuteSwitch (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextLoop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextLoop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextDuration (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextDuration (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextCurrentTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextCurrentTime (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextBuffered (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextBuffered (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextAutoplay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextAutoplay (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getAudioContextSrc (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setAudioContextSrc (option: any, _: number) {
    return option
  }

  // NativeUploadFile
  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  uploadFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  downloadFile (options: any): any {
    return options
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  abort (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offHeadersReceived (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offProgressUpdate (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onHeadersReceived (option: any, _: number): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onProgressUpdate (option: any, _: number): any {
    return option
  }

  // NativeFileSystemManager
  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getFileManager (): any {}

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  access (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  saveFile (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  getFileInfo (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  readFile (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  readFileSync (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  openAppAuthorizeSetting (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  requestSubscribeMessage (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  closeBLEConnection (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  createBLEConnection (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getBLEDeviceCharacteristics (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getBLEDeviceRSSI (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getBLEDeviceServices (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  notifyBLECharacteristicValueChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onBLECharacteristicValueChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onBLEConnectionStateChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  readBLECharacteristicValue (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  setBLEMTU (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  writeBLECharacteristicValue (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  closeBluetoothAdapter (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getBluetoothAdapterState (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getBluetoothDevices (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getConnectedBluetoothDevices (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offBluetoothAdapterStateChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  offBluetoothDeviceFound (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onBluetoothAdapterStateChange (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  onBluetoothDeviceFound (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  openBluetoothAdapter (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  startBluetoothDevicesDiscovery (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  stopBluetoothDevicesDiscovery (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: false, autoRelease: true }))
  getExecStatus (option: any): any {
    // 获取缓存数据
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: false }))
  setStorage (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: true }))
  removeStorage (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: true }))
  getStorage (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: true }))
  getStorageInfo (option: any): any {
    return option
  }

  // @ts-ignore
  @(window.MethodChannel?.jsBridgeMode({ isAsync: true, autoRelease: true }))
  clearStorage (option: any): any {
    return option
  }
}

export interface Status {
  done: boolean
  data: string
  errorMsg: string
}

class CacheStorageProxy {
  private cacheMap: Map<any, any>
  private readonly nativeApi: NativeApi
  private readonly asyncToSyncProxy: any

  constructor (nativeApi: NativeApi) {
    this.nativeApi = nativeApi
    this.cacheMap = new Map<string, any>()
    this.asyncToSyncProxy = new Proxy(nativeApi, new AsyncToSyncProxy(this.nativeApi))
  }

  // @ts-ignore
  get (target: { [x: string]: any }, prop: string) {
    if (prop === 'getStorageSync') {
      return (...args: any[]) => {
        const key = args[0].key
        if (this.cacheMap.has(key)) {
          return this.cacheMap.get(key)
        } else {
          const status = this.asyncToSyncProxy.getStorageSync({ key })
          if (status.done && status.errMsg === '') {
            this.cacheMap.set(key, status)
          }
          return status
        }
      }
    }
    if (prop === 'setStorageSync') {
      return (...args: any[]) => {
        const { key, data } = args[0]
        const status = this.asyncToSyncProxy.setStorageSync({ key, data })
        if (status.done && status.errMsg === '') {
          this.cacheMap.set(key, status)
        }
        return status
      }
    }
    return (...args: any[]) => {
      return this.asyncToSyncProxy[prop](...args)
    }
  }
}

class AsyncToSyncProxy {
  private readonly nativeApi: NativeApi
  private readonly STATUS: Status = { done: false, data: '', errorMsg: `search timeout` }
  private methods = ['setStorageSync', 'removeStorageSync', 'getStorageSync', 'getStorageInfoSync', 'clearStorageSync']

  constructor (nativeApi: NativeApi) {
    this.nativeApi = nativeApi
  }

  get (target: { [x: string]: any }, prop: string) {
    if (this.methods.includes(prop)) {
      return (...args: any[]) => {
        const asyncFunc = prop.substring(0, prop.length - 'Sync'.length)
        this.nativeApi[asyncFunc](...args)

        let count = 0
        while (count < 20000) {
          count++
          if (count % 2000 === 0) {
            const status = this.nativeApi.getExecStatus({ method: prop, key: args[0].key })
            if (status.done || status.errorMsg) {
              return status
            }
          }
        }
        return this.STATUS
      }
    }
    return target[prop]
  }
}

class HybridProxy {
  private readonly useAxios: boolean
  private readonly useOsChannel: boolean
  private readonly cacheProxy: any
  private readonly requestApi = 'request'

  constructor (useAxios: boolean, useOsChannel: boolean, nativeApi: NativeApi) {
    this.useAxios = useAxios
    this.useOsChannel = useOsChannel
    this.cacheProxy = new Proxy(nativeApi, new CacheStorageProxy(nativeApi))
  }

  get (_target: any, prop: string) {
    return (...args: any) => {
      if (this.useAxios && prop === this.requestApi) {
        // @ts-ignore
        return new RequestTask(...args)
      }
      if (this.useOsChannel && osChannelApi.hasOwnProperty(prop)) {
        return osChannelApi[prop](...args)
      }
      return this.cacheProxy[prop](...args)
    }
  }
}

const nativeApi = new NativeApi()
const native = new Proxy(nativeApi, new HybridProxy(false, false, nativeApi)) // 第一个false是默认走jsb，true是走纯js， 第二个false是不走osChannel
export default native
