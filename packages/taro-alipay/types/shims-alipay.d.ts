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

import '@tarojs/components/types/Input'
import '@tarojs/components/types/Textarea'
import '@tarojs/components/types/Video'

declare module '@tarojs/components/types/input' {
  interface InputProps {
    /** 使用原生键盘
     * @default true
     * @supported alipay
     */
    enableNative?: boolean
  }
}

declare module '@tarojs/components/types/textarea' {
  interface TextareaProps {
    /** 使用原生键盘
     * @default false
     * @supported alipay
     */
    enableNative?: boolean
  }
}

declare module '@tarojs/components/types/video' {
  interface VideoProps {
    /** 使用原生
     * @default true
     * @supported alipay
     */
    enableNative?: boolean
  }
}
