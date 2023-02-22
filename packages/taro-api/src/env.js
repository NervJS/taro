/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

export const ENV_TYPE = {
  WEAPP: 'WEAPP',
  WEB: 'WEB',
  RN: 'RN',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD'
}

export function getEnv () {
  if (process.env.TARO_ENV === 'weapp') {
    return ENV_TYPE.WEAPP
  } else if (process.env.TARO_ENV === 'alipay') {
    return ENV_TYPE.ALIPAY
  } else if (process.env.TARO_ENV === 'swan') {
    return ENV_TYPE.SWAN
  } else if (process.env.TARO_ENV === 'tt') {
    return ENV_TYPE.TT
  } else if (process.env.TARO_ENV === 'jd') {
    return ENV_TYPE.JD
  } else if (process.env.TARO_ENV === 'qq') {
    return ENV_TYPE.QQ
  } else if (process.env.TARO_ENV === 'h5') {
    return ENV_TYPE.WEB
  } else if (process.env.TARO_ENV === 'rn') {
    return ENV_TYPE.RN
  } else {
    return process.env.TARO_ENV || 'Unknown'
  }
}
