import { temporarilyNotSupport } from '../../utils'

// 广告
export const createRewardedVideoAd = /* @__PURE__ */ temporarilyNotSupport('createRewardedVideoAd')

// null-implementation
export const createInterstitialAd = () => {
  return {
    show: () => Promise.resolve(),
    load: () => Promise.resolve(),
    destroy: () => {},
    onLoad: () => {},
    onClose: () => {},
    onError: () => {},
    offLoad: () => {},
    offError: () => {},
    offClose: () => {},
  }
}
