// @ts-ignore
const syncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true }) || (target => target)
// @ts-ignore
const syncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false }) || (target => target)
// @ts-ignore
const asyncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true }) || (target => target)
// @ts-ignore
const asyncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false }) || (target => target)

// export let judgeUseAxios = false
class NativeApi {
  // @ts-ignore
  @(syncAndRelease)
  openLocation (options: any): any {
    return options
  }

  // @ts-ignore
  @(syncAndRelease)
  chooseLocation (options: any): any {
    return options
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
  chooseMediumAssets (options: any): any {
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

// class HybridProxy {
//   // private readonly useAxios: boolean
//   private readonly useOsChannel: boolean
//   private readonly cacheProxy: any
//   // private readonly requestApi = 'request'
//
//   constructor (useOsChannel: boolean, nativeApi: NativeApi) {
//     // this.useAxios = useAxios
//     this.useOsChannel = useOsChannel
//     this.cacheProxy = new Proxy(nativeApi, new CacheStorageProxy(nativeApi))
//   }
//
//   get (_target: any, prop: string) {
//     return (...args: any) => {
//       // if (this.useAxios && prop === this.requestApi) {
//       //   judgeUseAxios = this.useAxios
//       //   // @ts-ignore
//       //   return new RequestTask(...args)
//       // }
//       if (this.useOsChannel && osChannelApi.hasOwnProperty(prop)) {
//         return osChannelApi[prop](...args)
//       }
//       return this.cacheProxy[prop](...args)
//     }
//   }
// }

const nativeApi = new NativeApi()
const native = new Proxy(nativeApi, new CacheStorageProxy(nativeApi)) // 第一个false是默认走jsb，true是走纯js， 第二个false是不走osChannel
export default native
