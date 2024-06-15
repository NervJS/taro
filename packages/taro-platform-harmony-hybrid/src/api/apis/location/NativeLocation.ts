import { asyncAndNotRelease, asyncAndRelease } from '../harmony-native/ApiDecorator'

class NativeLocation {
  @asyncAndRelease
  chooseLocation (_options: any):void {}

  @asyncAndRelease
  openLocation (_options: any):void {}

  @asyncAndRelease
  getFuzzyLocation (_options: any):void {}

  @asyncAndRelease
  getLocation (_options: any):void {}

  @asyncAndNotRelease
  onLocationChange (_options: any):void {}

  @asyncAndRelease
  offLocationChange (_options: any):void {}

  @asyncAndNotRelease
  onLocationChangeError (_options: any):void {}

  @asyncAndRelease
  offLocationChangeError (_options: any):void {}

  @asyncAndRelease
  startLocationUpdate (_options: any):void {}

  @asyncAndRelease
  startLocationUpdateBackground (_options: any):void {}

  @asyncAndRelease
  stopLocationUpdate (_options: any):void {}
}

const nativeLocation = new NativeLocation()

export default nativeLocation