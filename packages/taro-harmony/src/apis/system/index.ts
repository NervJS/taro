import { isNumber, isString, isUndefined, isNull} from '@tarojs/shared'
import { unsupport } from '../utils'
import { IAsyncParams } from '../utils/types'
const network = require('@system.network')
const deviceInfo = require('@ohos.deviceInfo')
const device = require('@system.device')
const display = require('@ohos.display')
const i18n = require('@ohos.i18n')
const brightness = require('@system.brightness')
const call = require('@ohos.telephony.call')
const pasteboard = require('@ohos.pasteboard')
interface IOptionsShape extends IAsyncParams {
  success?: (any) => any;
  fail?: (any) => any;
  complete?: (any) => any;
  value?: any;
  phoneNumber?: any;
  data?: any;
}

/*Obtains the network type*/
function getNetworkType (options:IOptionsShape = {}) {
  
  const { success, fail, complete } = options
  let res: any = {}
  return new Promise((resolve, reject) => {
    network.getType({
      success: function(data) {
        res = {
          errMsg: 'getNetworkType:ok',
          networkType: data.type,
          metered: data.metered
        }
        success && (typeof success == 'function') && success(res)
        resolve(res)
      },
      fail: function(data, code) {
        res = {
          errMsg: `getNetworkType:fail ${data?data:''}`,
          code: code
        }
        fail && (typeof fail == 'function') && fail(res)
        reject(res)
      },
      complete: function(data) {
        complete && (typeof complete == 'function')  && complete(data);
      }
    });
  })
}
function onNetworkStatusChange (options:IOptionsShape = {}){
  
  const { success, fail, complete } = options
  let res: any = {}
  return new Promise((resolve,reject)=>{
    network.subscribe({
      success: function(data) {
        res = {
          isConnected: data.metered,
          networkType: data.type
        }
        if(data.type=='none') res.isConnected = false;
        
        success && (typeof success == 'function') && success(res)
        complete && (typeof complete == 'function')  && complete(data);
        resolve(res)
        console.log('network type change type:' + data.type);
      },
      fail: function(data, code) {
        res = {
          errMsg: `onNetworkStatusChange:fail ${data?data:''}`,
          code: code
        }
        fail && (typeof fail == 'function') && fail(res)
        complete && (typeof complete == 'function')  && complete(data);
        reject(res)
        console.log('fail to subscribe network, code:' + code + ', data:' + data);
      },
    });
  })
}
/* 同步版本 */
function getSystemInfo (options:IOptionsShape = {}){

  const { success, fail, complete } = options
  let res = {};
  return new Promise((resolve, reject) => {
      try {
        res = {
          brand: deviceInfo && deviceInfo.brand,//设备品牌
          model: deviceInfo && deviceInfo.deviceType,//设备型号
          pixelRatio: 'unsupport',//设备像素比	
          screenWidth: display && display.width,//屏幕宽度，单位px
          screenHeight: display && display.height,//屏幕高度，单位px
          windowWidth: device && device.windowWidth,//可使用窗口宽度，单位px
          windowHeight: device && device.windowHeight,//可使用窗口高度，单位px
          statusBarHeight: 'unsupport',//状态栏的高度，单位px
          language: i18n && i18n.getSystemLanguage && i18n.getSystemLanguage(),
          version: deviceInfo && deviceInfo.displayVersion,//版本号
          system: deviceInfo && deviceInfo.osFullName,//操作系统及版本
          platform: 'android',//客户端平台
          fontSizeSetting: 'unsupport',//用户字体大小（单位px）
          SDKVersion: deviceInfo && deviceInfo.sdkApiVersion,//客户端基础库版本
          benchmarkLevel: 'unsupport',//设备性能等级
          albumAuthorized: 'unsupport',//允许微信使用相册的开关（仅 iOS 有效）
          cameraAuthorized: 'unsupport',//允许微信使用摄像头的开关
          locationAuthorized: 'unsupport',//定位的开关
          microphoneAuthorized: 'unsupport',//麦克风的开关
          notificationAuthorized: 'unsupport',//通知的开关
          notificationAlertAuthorized: 'unsupport',//通知带有提醒的开关（仅 iOS 有效）
          notificationBadgeAuthorized: 'unsupport',//通知带有标记的开关（仅 iOS 有效）
          notificationSoundAuthorized: 'unsupport',//通知带有声音的开关（仅 iOS 有效）
          phoneCalendarAuthorized: 'unsupport',//使用日历的开关
          bluetoothEnabled: 'unsupport',//蓝牙的系统开关
          locationEnabled: 'unsupport',//地理位置的系统开关
          wifiEnabled: 'unsupport',//Wi-Fi 的系统开关
          safeArea: 'unsupport',//在竖屏正方向下的安全区域
          locationReducedAccuracy: 'unsupport',//模糊定位精准定位
          theme: 'unsupport',//系统当前主题，取值为light或dark
          host: 'unsupport',//当前小程序运行的宿主环境	
          enableDebug: 'unsupport',//是否已打开调试
          deviceOrientation:`${display && display.rotation==0?'portrait':(display && display.rotation==90?'landscape':'')}`//设备方向
        }
        success && (typeof success == 'function') && success(res)
        resolve(res)
      } catch (error) {
        res = {
          errMsg: `getSystemInfo:fail ${error && error.toString && error.toString()}`,
          error: error
        }
        fail && (typeof fail == 'function') && fail(res)
        reject(res)
      }
      complete && complete(res);
  });

}
/* 同步版本 */
function getSystemInfoSync (options:IOptionsShape = {}){
  getSystemInfo(options);
}
/* 获得屏幕亮度 */
function getScreenBrightness (options:IOptionsShape = {}){
  
  const { success, fail, complete } = options
  let res = {};
  return new Promise((resolve,reject)=>{
    brightness.getValue({
      success: function(data){
        res = {
          errMsg: 'getScreenBrightness:ok',
          value: data.value,
        }
        success && (typeof success == 'function') && success(res);
        resolve(res);
      },
      fail: function(data, code) {
        res = {
          errMsg: `getScreenBrightness:fail ${data?data:''}`,
          code: code
        }
        fail && (typeof fail == 'function') && fail(res);
        reject(res);
      },
      complete: function(data) {
        complete && (typeof complete == 'function')  && complete(data);
      }
    });
  })

}
/* 设置屏幕亮度 */
function setScreenBrightness (options:IOptionsShape = {}){
  const { value, success, fail, complete } = options
  let res = {};
  if(!isNumber(value))return;
  return new Promise((resolve,reject)=>{
    brightness.getValue({
      value: value,
      success: function(){
        res = {
          errMsg: 'setScreenBrightness:ok'
        }
        success && (typeof success == 'function') && success(res)
        resolve(res)
      },
      fail: function(data, code) {
        res = {
          errMsg: `setScreenBrightness:fail ${data?data:''}`,
          code: code
        }
        fail && (typeof fail == 'function') && fail(res)
        reject(res)
      },
      complete: function(data) {
        complete && (typeof complete == 'function')  && complete(data);
      }
    });
  });
}

function onMemoryWarning (options:IOptionsShape = {}){
  const { success, fail, complete } = options
  let res = {
    errMsg: 'onMemoryWarning:fail',
    message: 'Not supported yet'
  }
  success && (typeof success == 'function')  && success(res);
  fail && (typeof fail == 'function')  && fail(res);
  complete && (typeof complete == 'function')  && complete(res);
  unsupport('onMemoryWarning')
}

function offMemoryWarning (options:IOptionsShape = {}){
  const { success, fail, complete } = options
  let res = {
    errMsg: 'offMemoryWarning:fail',
    message: 'Not supported yet'
  }
  success && (typeof success == 'function')  && success(res);
  fail && (typeof fail == 'function')  && fail(res);
  complete && (typeof complete == 'function')  && complete(res);
  unsupport('offMemoryWarning')
}

function makePhoneCall (options:IOptionsShape = {}){
  
  const { phoneNumber, success, fail, complete } = options;
  if(!isString(phoneNumber) || isUndefined(phoneNumber) || isNull(phoneNumber))return;
  return new Promise((resolve,reject)=>{
    let res = {};
    call.makeCall(phoneNumber, err => {
      if(err){
          console.error('Failed to makePhoneCall. Cause: ' + JSON.stringify(err));
          res = {
            errMsg: `makePhoneCall:fail ${JSON.stringify(err)}`,
            error: err
          }
          fail && (typeof fail == 'function') && fail(res)
          complete && (typeof complete == 'function') && complete({})
          reject(err);
          return;
      }
      success && (typeof success == 'function') && success(err)
      complete && (typeof complete == 'function') && complete({})
      resolve(err)
      console.log(`makePhoneCall callback: err->${JSON.stringify(err)}`);
    });
  });
}
function setClipboardData (options:IOptionsShape = {}){
  const { data, success, fail, complete } = options;
  let res = {};
  if(!isString(data) || isUndefined(data) || isNull(data))return;
  return new Promise((resolve,reject)=>{
    var systemPasteboard = pasteboard.getSystemPasteboard();
    var pasteData = pasteboard.createPlainTextData(data);
    systemPasteboard.setPasteData(pasteData, (error, data) => { // callback形式调用异步接口  
        if (error) {
            console.error('Failed to set PasteData. Cause: ' + JSON.stringify(error));
            res = {
              errMsg: `setClipboardData:fail ${ JSON.stringify(error) }`,
              error: error
            }
            fail && (typeof fail == 'function') && fail(res)
            complete && (typeof complete == 'function') && complete({})
            reject(res)
            return;
        }
        res = {
          errMsg: 'setClipboardData:ok',
          data: data
        }
        success && (typeof success == 'function') && success(res)
        complete && (typeof complete == 'function') && complete({})
        resolve(res)
        console.info('PasteData set successfully. ' + data);
    });
  })
}
function getClipboardData (options:IOptionsShape = {}){
  const { success, fail, complete } = options;
  return new Promise((resolve,reject)=>{
    let res = {};
    var systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.getPasteData((error, pasteData) => { // callback形式调用异步接口  
        if (error) {
            console.error('Failed to obtain PasteData. Cause: ' + JSON.stringify(error));
            res = {
              errMsg: `getClipboardData:fail ${JSON.stringify(error)}`,
              error: error
            }
            fail && (typeof fail == 'function') && fail(res)
            complete && (typeof complete == 'function') && complete({})
            reject(res)
            return;
        }
        var text = pasteData.getPrimaryText();
        res = {
          data: text
        }
        success && (typeof success == 'function') && success(res)
        complete && (typeof complete == 'function') && complete({})
        resolve(res);
    });
  })
}
export {
    getNetworkType,
    onNetworkStatusChange,
    getSystemInfo,
    getSystemInfoSync,
    getScreenBrightness,
    setScreenBrightness,
    onMemoryWarning,
    offMemoryWarning,
    makePhoneCall,
    setClipboardData,
    getClipboardData
}
