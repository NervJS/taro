import Taro from '@tarojs/api'


let abilityAccessCtrl

try {
  // @ts-ignore
  abilityAccessCtrl = requireNapi('abilityAccessCtrl')
} catch (error) {
}

// @ts-ignore
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = () => {
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
  } catch (e) {
  }
  let bluetoothAuthorized = 'not determined'
  try {
    bluetoothAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.bluetooth)
    bluetoothAuthorized = grantStatus(bluetoothAuthorized)
  } catch (e) {
  }
  let cameraAuthorized = 'not determined'
  try {
    cameraAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.camera)
    cameraAuthorized = grantStatus(cameraAuthorized)
  } catch (e) {
  }
  let locationAuthorized = 'not determined'
  try {
    locationAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.location)
    locationAuthorized = grantStatus(locationAuthorized)
  } catch (e) {
  }
  let locationAccuracy = 'not determined'
  try {
    locationAccuracy =
      atManager.checkAccessTokenSync(tokenID, permissionsList.locationAccuracy) === 0 ? 'full' : 'reduced'
  } catch (e) {
  }
  let microphoneAuthorized = 'not determined'
  try {
    microphoneAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.microphone)
    microphoneAuthorized = grantStatus(microphoneAuthorized)
  } catch (e) {
  }
  let notificationAuthorized = 'not determined'
  try {
    notificationAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.notification)
    notificationAuthorized = grantStatus(notificationAuthorized)
  } catch (e) {
  }
  let phoneCalendarAuthorized = 'not determined'
  try {
    phoneCalendarAuthorized = atManager.checkAccessTokenSync(tokenID, permissionsList.phoneCalendar)
    phoneCalendarAuthorized = grantStatus(phoneCalendarAuthorized)
  } catch (e) {
  }
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
