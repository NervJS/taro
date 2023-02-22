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
 */

import Taro from '../../index'

declare module '../../index' {
  interface TaroStatic {
    /**
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/env/envObj.html
     */
    env: {
      [key: string]: string | undefined
      /** 框架 */
      FRAMEWORK: 'react' | 'preact' | 'nerv' | 'vue' | 'vue3'
      /** Taro 环境变量 */
      TARO_ENV: 'weapp' | 'h5' | 'rn' | 'swan' | 'alipay' | 'tt' | 'qq' | 'jd' | 'quickapp'
      /** 文件系统中的用户目录路径 (本地路径) */
      USER_DATA_PATH?: string
    }
  }
}
