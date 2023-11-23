import Taro from '@tarojs/taro'

/**
 * 创建激励视频广告组件
 * 
 * @canNotUse createRewardedVideoAd
 */
export { createRewardedVideoAd } from '@tarojs/taro-h5'

/**
 * 激励视频广告组件类
 * -
 * @canNotUse RewardedVideoAd
 */

/**
 * 创建插屏广告组件
 * 
 * @canUse createInterstitialAd
 * @null_implementation
 */
export const createInterstitialAd = () => {
  return new InterstitialAd()
}

/**
 * 插屏广告组件类
 * 
 * @canUse InterstitialAd
 * @null_implementation
 */
class InterstitialAd implements Taro.InterstitialAd {
  destroy (): void {

  }

  offClose (_callback: Taro.InterstitialAd.OnCloseCallback): void {

  }

  offError (_callback: Taro.InterstitialAd.OnErrorCallback): void {

  }

  offLoad (_callback: Taro.InterstitialAd.OnLoadCallback): void {

  }

  onClose (_callback: Taro.InterstitialAd.OnCloseCallback): void {

  }

  onError (_callback: Taro.InterstitialAd.OnErrorCallback): void {

  }

  onLoad (_callback: Taro.InterstitialAd.OnLoadCallback): void {

  }

  load (): Promise<any> {
    return Promise.resolve()
  }
  
  show (): Promise<any> {
    return Promise.resolve()
  }
}