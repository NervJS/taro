let http
let display
let wifiManager
let call
let bluetooth
let inputMethod
let bundleManager
let abilityAccessCtrl
let geoLocationManager

try {
  // @ts-ignore
  http = requireNapi('net.http')
  // @ts-ignore
  display = requireNapi('display')
  // @ts-ignore
  wifiManager = requireNapi('wifi')
  // @ts-ignore
  call = requireNapi('telephony.call')
  // @ts-ignore
  bluetooth = requireNapi('bluetooth')
  // @ts-ignore
  inputMethod = requireNapi('inputMethod')
  // @ts-ignore
  bundleManager = requireNapi('bundle.bundleManager')
  // @ts-ignore
  abilityAccessCtrl = requireNapi('abilityAccessCtrl')
  // @ts-ignore
  geoLocationManager = requireNapi('geoLocationManager')
} catch (error) {}

let bundleInfoForSelf = null

try {
  // @ts-ignore
  bundleManager
    .getBundleInfoForSelf(
      bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO |
        bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION
    )
    .then((bundleInfoFor) => {
      bundleInfoForSelf = bundleInfoFor
    })
} catch (e) {}

const errMsgMap = new Map([
  [401, 'Parameter error'],
  [201, 'Permission denied'],
  [3, 'URL using bad/illegal format or missing URL'],
  [7, "Couldn't connect to server"],
  [23, 'Failed writing received data to disk/application'],
  [25, 'Upload failed'],
  [26, 'Failed to open/read local data from file/application'],
  [28, 'Timeout was reached'],
  [73, 'Remote file already exists'],
  [78, 'Remote file not found'],
  [999, 'Unknown Other Error'],
])

const ErrorCode = {
  PARAMETER_ERROR: 202,
}

class RequestTask {
  private abortFlag: boolean
  private readonly fail: (arg0: any) => any
  private readonly complete: (arg0: any) => any
  private readonly httpRequest: any
  private headersCallback: Map<any, any>
  private result: { data?: any, statusCode?: any, header?: any, cookies?: any, errMsg: string | undefined }
  private res: { errMsg: string }

  constructor (object: any) {
    const { url, header, method = 'GET', timeout, responseType, enableCache } = object || {}
    let { data } = object || {}
    const { success, fail, complete } = object || {}
    this.abortFlag = false
    this.fail = fail
    this.complete = complete
    this.httpRequest = http.createHttp()
    this.headersCallback = new Map()
    if (!object) {
      console.error('[OsChannel] request error: params illegal')
      return
    }
    let isFormUrlEncoded = false
    for (const key in header) {
      if (key.toLowerCase() === 'content-type') {
        if (header[key].toLowerCase().includes('application/x-www-form-urlencoded')) {
          isFormUrlEncoded = true
        }
        break
      }
    }

    // data为Object类型时，属性的值类型如果是number, request请求时信息会丢失. 故将data转成string类型进行规避
    if (data && (isFormUrlEncoded || ['GET', 'OPTIONS', 'DELETE', 'TRACE', 'CONNECT'].includes(method))) {
      const dataArray = []
      for (const key in data) {
        // @ts-ignore
        dataArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
      data = dataArray.join('&')
    }
    // header的属性的值类型如果是number, request请求时信息会丢失. 故将各个属性转成string类型
    if (header) {
      for (const key in header) {
        header[key] = `${header[key]}`
      }
    }
    const httpRequestOptions = {
      method: method,
      extraData: data || {},
      header: header,
      connectTimeout: timeout,
      expectDataType:
        responseType && responseType === 'arraybuffer' ? http.HttpDataType.ARRAY_BUFFER : http.HttpDataType.STRING,
      usingCache: enableCache || false,
    }
    this.httpRequest
      .request(typeof url === 'string' ? url : '', httpRequestOptions)
      .then((data) => {
        if (success && !this.abortFlag) {
          let result = data.result
          const { dataType } = object || {}
          if (dataType && dataType !== 'json') {
            if (typeof data.result === 'object') {
              result = JSON.stringify(data.result)
            }
          } else if (typeof data.result === 'string') {
            try {
              result = JSON.parse(result)
            } catch (err) {
              /* empty */
            }
          }
          const res = {
            data: result,
            statusCode: data.responseCode,
            header: data.header,
            cookies: typeof data.cookies === 'string' ? (data.cookies ? [data.cookies] : []) : data.cookies,
            errMsg: 'request:ok',
          }
          this.result = res
          success(res)
        }
      })
      .catch((err: any) => {
        console.error('[OsChannel] request error: ' + JSON.stringify(err))
        if (fail && !this.abortFlag) {
          const res = {
            errMsg: errMsgMap.has(err.code) ? errMsgMap.get(err.code) : 'Unknown Error',
          }
          this.result = res
          fail(res)
        }
      })
      .finally(() => {
        if (complete && !this.abortFlag) {
          complete(this.result)
        }
      })
  }

  /**
   * interrupt request task
   */
  abort () {
    this.httpRequest.destroy()
    this.abortFlag = true
    this.res = {
      errMsg: 'request:fail abort',
    }
    this.fail && this.fail(this.res)
    this.complete && this.complete(this.res)
  }

  /**
   * subscribe HTTP Response Header event
   * @callback params header {Object}: HTTP Response Header
   */
  onHeadersReceived (callback: any) {
    const taskCallback = (header: any) => {
      !this.abortFlag &&
        callback({
          header,
        })
    }
    if (!callback) {
      console.error('[OsChannel] Invalid, callback is null')
      return
    }
    if (!this.headersCallback.has(callback)) {
      this.headersCallback.set(callback, taskCallback)
      if (this.httpRequest) {
        this.httpRequest.on('headersReceive', taskCallback)
      }
    }
  }

  /**
   * unsubscribe HTTP Response Header event
   * remove all if callback is null, otherwise remove the specialized callback
   */
  offHeadersReceived (callback: any) {
    if (!callback) {
      this.headersCallback.clear()
      if (this.httpRequest) {
        this.httpRequest.off('headersReceive')
      }
    } else if (this.headersCallback.has(callback)) {
      if (this.httpRequest) {
        this.httpRequest.off('headersReceive', this.headersCallback.get(callback))
      }
      this.headersCallback.delete(callback)
    } else {
      /* empty */
    }
  }
}

const hideKeyboard = () => {
  return new Promise((resolve, reject) => {
    try {
      const inputMethodController = inputMethod.getController()
      inputMethodController
        .hideTextInput()
        .then(() => {
          resolve({ errMsg: 'ok' })
        })
        .catch((err: any) => {
          console.error('[OsChannel] Failed to hideSoftKeyboard: ' + JSON.stringify(err))
          reject(err)
        })
    } catch (exception) {
      console.error('[OsChannel] Failed to get inputMethod Controller. Cause: ' + JSON.stringify(exception))
      reject(exception)
    }
  })
}

const makePhoneCall = (options) => {
  const { phoneNumber, success, fail } = options
  if (!phoneNumber) {
    return new Promise((_resolve, reject) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(['param is invalid.', ErrorCode.PARAMETER_ERROR])
    })
  }
  return call.makeCall(phoneNumber).then(
    () => {
      // @ts-ignore
      success({ errMsg: 'ok' })
    },
    (err: any) => {
      console.error(`[OsChannel] start makePhoneCall fail`)
      // @ts-ignore
      fail({ errMsg: JSON.stringify(err) })
    }
  )
}

const getSystemSetting = () => {
  let bluetoothEnabled: number | boolean = false
  let locationEnabled = false
  let wifiEnabled = false
  let bluetoothError = ''
  let locationError = ''
  try {
    bluetoothEnabled = bluetooth.getState()
    bluetoothEnabled = bluetoothEnabled === 2 || bluetoothEnabled === 5
  } catch (err) {
    console.error('errCode:' + err.code + ',errMessage:' + err.message)
    bluetoothError = err.message
  }
  try {
    locationEnabled = geoLocationManager.isLocationEnabled()
  } catch (err) {
    console.error('errCode:' + err.code + ',errMessage:' + err.message)
    locationError = err.message
  }
  try {
    wifiEnabled = wifiManager.isWifiActive()
  } catch (err) {
    console.error('errCode:' + err.code + ',errMessage:' + err.message)
  }
  // @ts-ignore
  const { rotation } = display.getDefaultDisplaySync()
  const deviceOrientation = rotation === 1 || rotation === 3 ? 'landscape' : 'portrait'
  return {
    bluetoothEnabled,
    bluetoothError,
    locationEnabled,
    locationError,
    wifiEnabled,
    deviceOrientation,
  }
}

const getAppAuthorizeSetting = () => {
  const permissionsList = {
    album: 'ohos.permission.WRITE_IMAGEVIDEO',
    bluetooth: 'ohos.permission.USE_BLUETOOTH',
    camera: 'ohos.permission.CAMERA',
    location: 'ohos.permission.LOCATION',
    locationAccuracy: 'ohos.permission.APPROXIMATELY_LOCATION',
    microphone: 'ohos.permission.MICROPHONE',
    notification: 'ohos.permission.NOTIFICATION_CONTROLLER',
    phoneCalendar: 'ohos.permission.READ_CALENDAR',
  }
  const atManager = abilityAccessCtrl.createAtManager()
  // @ts-ignore
  const tokenID = bundleInfoForSelf.appInfo.accessTokenId
  const grantStatus = (flag) => {
    if (flag === -1) {
      return 'denied'
    } else if (flag === 0) {
      return 'authorized'
    }
    return 'config error'
  }
  let albumAuthorized = 'not determined'
  try {
    albumAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.album)
    albumAuthorized = grantStatus(albumAuthorized)
  } catch (e) {}
  let bluetoothAuthorized = 'not determined'
  try {
    bluetoothAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.bluetooth)
    bluetoothAuthorized = grantStatus(bluetoothAuthorized)
  } catch (e) {}
  let cameraAuthorized = 'not determined'
  try {
    cameraAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.camera)
    cameraAuthorized = grantStatus(cameraAuthorized)
  } catch (e) {}
  let locationAuthorized = 'not determined'
  try {
    locationAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.location)
    locationAuthorized = grantStatus(locationAuthorized)
  } catch (e) {}
  let locationAccuracy = 'not determined'
  try {
    locationAccuracy =
      atManager.checkAccessTokenSync(tokenID, permissionsList.locationAccuracy) === 0 ? 'full' : 'reduced'
  } catch (e) {}
  let microphoneAuthorized = 'not determined'
  try {
    microphoneAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.microphone)
    microphoneAuthorized = grantStatus(microphoneAuthorized)
  } catch (e) {}
  let notificationAuthorized = 'not determined'
  try {
    notificationAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.notification)
    notificationAuthorized = grantStatus(notificationAuthorized)
  } catch (e) {}
  let phoneCalendarAuthorized = 'not determined'
  try {
    phoneCalendarAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.phoneCalendar)
    phoneCalendarAuthorized = grantStatus(phoneCalendarAuthorized)
  } catch (e) {}
  const result = {
    albumAuthorized,
    bluetoothAuthorized,
    cameraAuthorized,
    locationAuthorized,
    locationAccuracy,
    microphoneAuthorized,
    notificationAuthorized,
    phoneCalendarAuthorized,
  }
  return result
}

const request = (options: any) => {
  const { success, fail, complete } = options
  const task = new RequestTask(options)
  // if success / fail / complete, return requestTask otherwise return Promise<requestTask>
  if (options && !success && !fail && !complete) {
    success(task)
    return
  }
  if (!options) {
    fail(['illegal params', -1])
  }
  return task
}

const osChannelApi = {
  getSystemSetting,
  hideKeyboard,
  makePhoneCall,
  getAppAuthorizeSetting,
  request,
}

export default osChannelApi
