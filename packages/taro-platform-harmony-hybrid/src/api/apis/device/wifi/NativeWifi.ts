import { asyncAndNotRelease, asyncAndRelease } from '../../harmony-native/ApiDecorator'

class NativeWifi {
  @asyncAndRelease
  connectWifi (_options: any):void {}

  @asyncAndRelease
  getConnectedWifi (_options: any):void {}

  @asyncAndRelease
  getWifiList (_options: any):void {}

  @asyncAndRelease
  offGetWifiList (_options: any):void {}

  @asyncAndRelease
  offWifiConnected (_options: any):void {}

  @asyncAndRelease
  offWifiConnectedWithPartialInfo (_options: any):void {}

  @asyncAndNotRelease
  onGetWifiList (_options: any):void {}

  @asyncAndNotRelease
  onWifiConnected (_options: any):void {}

  @asyncAndNotRelease
  onWifiConnectedWithPartialInfo (_options: any):void {}

  @asyncAndRelease
  startWifi (_options: any):void {}

  @asyncAndRelease
  stopWifi (_options: any):void {}
}

const nativeWifi = new NativeWifi()

export default nativeWifi