/**
 * 百度智能小程序可接入百度搜索和百度 App，setPageInfo 负责为小程序设置各类页面基础信息，包括标题、关键字、页面描述以及图片信息、视频信息等。
 * 
 * @canNotUse setPageInfo
 */
export { setPageInfo } from '@tarojs/taro-h5'

// 百度小程序 AI 相关
export { ocrIdCard } from '@tarojs/taro-h5'
export { ocrBankCard } from '@tarojs/taro-h5'
export { ocrDrivingLicense } from '@tarojs/taro-h5'
export { ocrVehicleLicense } from '@tarojs/taro-h5'
export { textReview } from '@tarojs/taro-h5'
export { textToAudio } from '@tarojs/taro-h5'
export { imageAudit } from '@tarojs/taro-h5'
export { advancedGeneralIdentify } from '@tarojs/taro-h5'
export { objectDetectIdentify } from '@tarojs/taro-h5'
export { dishClassify } from '@tarojs/taro-h5'
export { logoClassify } from '@tarojs/taro-h5'
export { animalClassify } from '@tarojs/taro-h5'
export { plantClassify } from '@tarojs/taro-h5'

// 用户信息
export { getSwanId } from '@tarojs/taro-h5'

// 百度收银台支付
export { requestPolymerPayment } from '@tarojs/taro-h5'

// 打开小程序
export { navigateToSmartGameProgram } from '@tarojs/taro-h5'
export { navigateToSmartProgram } from '@tarojs/taro-h5'
export { navigateBackSmartProgram } from '@tarojs/taro-h5'
export { preloadSubPackage } from '@tarojs/taro-h5'
