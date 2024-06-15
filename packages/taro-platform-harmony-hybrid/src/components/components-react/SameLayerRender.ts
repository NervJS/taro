// @ts-ignore
const asyncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false }) || (target => target)

// @ts-ignore 释放JS侧存储的参数对象
export function clearJsObj (object: object) {
  // @ts-ignore
  window.MethodChannel && window.MethodChannel.unRegisterArgStub(object)
}

class SameLayerRender {
  @asyncAndNotRelease
  transferSameLayerArgs (_options: object):void {}
}

const sameLayerRender = new SameLayerRender()
export default sameLayerRender