import { NativeDataChangeListener, SyncCacheProxyHandler } from './NativeApiSyncCacheProxy'
import {timeLog} from "./NativeApiLog";
// 同步方法，一次性调用，不支持原生异步回调，所以不用考虑释放的问题
// @ts-ignore
const sync = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true }) || (target => target)
// 异步方法，支持原生一次异步回调
// @ts-ignore
const asyncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true }) || (target => target)
// 异步方法，支持原生多次异步回调
// @ts-ignore
const asyncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false }) || (target => target)

// export let judgeUseAxios = false
export class NativeApi {
  // @ts-ignore
  @(asyncAndNotRelease)
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerNativeListener (listener: NativeDataChangeListener | null): void {
  }

  // @ts-ignore
  @(asyncAndRelease)
  openLocation (options: any): void {

    // return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  chooseLocation (options: any): void {
    return options
  }

  // @ts-ignore
  @(sync)
  getWindowInfo (): any {
    return ''
  }

  // @ts-ignore
  @(sync)
  getDeviceInfo (): any {
    return ''
  }

  // @ts-ignore
  @(sync)
  getSystemInfoSync (): any {
    return ''
  }

  // @ts-ignore
  @(sync)
  getSystemSetting (): any {
    return ''
  }

  // @ts-ignore
  @(sync)
  getAppBaseInfo (): any {
    return ''
  }

  // @ts-ignore
  @(sync)
  getAppAuthorizeSetting (): any {
    return ''
  }

  // @ts-ignore
  @(asyncAndRelease)
  navigateToMiniProgram (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  setNavigationBarColor (options: any): void {
    return options
  }

  // @ts-ignore
  @(sync)
  getMenuButtonBoundingClientRect (): any {
    return ''
  }

  // @ts-ignore
  @(asyncAndRelease)
  request (options: any): void {
    return options
  }

  @(asyncAndRelease)
  saveDataUrlToFile (options: any): void {
    // 以下是原生的示例代码，实际由原生执行
    // 原生的成功回调
    options.success()
    // 原生的失败回调
    options.fail()
  }

  // @ts-ignore
  @(asyncAndRelease)
  copyFileToSandboxCache (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  startAccelerometer (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  stopAccelerometer (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onAccelerometerChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  offAccelerometerChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  startCompass (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  stopCompass (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onCompassChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  offCompassChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  startGyroscope (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  stopGyroscope (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onGyroscopeChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  saveImageToPhotosAlbum (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  chooseMediaAssets (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  chooseMediumAssets (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getVideoInfo (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getImageInfo (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  compressVideo (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getLocation (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  openDocument (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  login (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  setNavigationStyle (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getUserInfo (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  openSetting (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  getSetting (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  setKeepScreenOn (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onUserCaptureScreen (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  offUserCaptureScreen (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onLocationChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  offLocationChange (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  setScreenBrightness (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getScreenBrightness (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndNotRelease)
  onMemoryWarning (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  offMemoryWarning (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  hideKeyboard (options?: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  onKeyboardHeightChange (options?: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  offKeyboardHeightChange (options?: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  makePhoneCall (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getSavedFileList (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  removeSavedFile (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  getSavedFileInfo (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  addPhoneContact (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  scanCode (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  vibrateShort (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  vibrateLong (options: any): void {
    return options
  }

  // NativeUpdateManager
  // @ts-ignore
  @(asyncAndRelease)
  applyUpdate (): void {}

  // @ts-ignore
  @(asyncAndRelease)
  onCheckForUpdate (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  onUpdateFailed (options: any): void {
    return options
  }

  // @ts-ignore
  @(asyncAndRelease)
  onUpdateReady (options: any): void {
    return options
  }

  // NativeAContextApi
  // @ts-ignore
  @(sync)
  createInnerAudioContext (): any {}

  // @ts-ignore
  @(syncAndRelease)
  innerAudioStop (option: any, _: number) {
    return option
  }

  // @ts-ignore
  @(syncAndRelease)
  innerAudioPause (option: any, _: number) {
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
          return { done: true, data: this.cacheMap.get(key), errorMsg: ''}
        } else {
          const status = this.asyncToSyncProxy.getStorageSync({ key })
          if (status.done && status.errorMsg === '') {
            this.cacheMap.set(key, status)
          }
          return status
        }
      }
    }
    if(prop === 'getStorage') {
      return (...args: any[]) => {
        const key = args[0].key
        const fail = args[0].fail
        const success = args[0].success
        if (this.cacheMap.has(key)) {
          success({errMsg:'ok', data: this.cacheMap.get(key)})
        } else {
          this.nativeApi['getStorage']({
            key: key,
            fail: fail,
            success: (res)=> {
              this.cacheMap.set(key, res.data)
              success(res)
            }
          })
        }
      }
    }
    if (prop === 'setStorageSync') {
      return (...args: any[]) => {
        const { key, data } = args[0]
        // 先更新js缓存，同异步原生，TODO 考虑失败的情况
        this.cacheMap.set(key, data)
        this.nativeApi['setStorage']({
          key: key,
          data: data,
          fail: ()=>{},
          success: () => {}
        })
      }
    }
    if(prop === 'setStorage') {
      return (...args: any[]) => {
        const key = args[0].key
        const data = args[0].data
        this.cacheMap.set(key, data)
        // @ts-ignore
        this.nativeApi['setStorage']({key: key, data: data})
      }
    }
    if (prop === 'removeStorageSync') {
      return (...args: any[]) => {
        const { key } = args[0]
        // 先更新缓存，再同步原生
        this.cacheMap.delete(key)
        this.nativeApi['removeStorage']({key: key})
      }
    }
    if (prop === 'removeStorage') {
      return (...args: any[]) => {
        const { key } = args[0]
        // 先更新缓存，再同步原生
        this.cacheMap.delete(key)
        // @ts-ignore
        this.nativeApi['removeStorage']({key: key})
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

let nativeApi = new NativeApi()
nativeApi = timeLog(nativeApi)
const cacheNativeApi = new Proxy(nativeApi, new SyncCacheProxyHandler(nativeApi))
const native = new Proxy(cacheNativeApi, new CacheStorageProxy(cacheNativeApi)) // 第一个false是默认走jsb，true是走纯js， 第二个false是不走osChannel
export default native
