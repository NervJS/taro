/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { ComponentType } from 'react'

interface NativeSlotProps {
  /** 指定插入的 slot 位置
   * @default none
   * @supported weapp, swan, alipay, tt, jd, qq
   */
  name?: string
}

/** 编译的原生组件支持使用 slot 插槽
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, jd, qq
 * @version 3.5.7+
 * @example
 * ```tsx
 * import { NativeSlot, View } from '@tarojs/components'
 *
 * export default function () {
 *   render () {
 *     return (
 *       <View>
 *         <NativeSlot />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://github.com/NervJS/taro/pull/12627
 */
declare const NativeSlot: ComponentType<NativeSlotProps>

export { NativeSlot, NativeSlotProps }
