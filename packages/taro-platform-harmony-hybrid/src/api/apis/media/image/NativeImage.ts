import { asyncAndRelease } from '../../harmony-native/ApiDecorator'

class NativeImage {
  @asyncAndRelease
  previewImage (_options: any):void {}
}

const nativeImage = new NativeImage()

export default nativeImage