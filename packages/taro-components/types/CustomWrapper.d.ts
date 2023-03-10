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
import { StandardProps } from './common'

interface CustomWrapperProps extends StandardProps {
}

/** custom-wrapper 自定义组件包裹器
 * 当数据更新层级较深时，可用此组件将需要更新的区域包裹起来，这样更新层级将大大减少
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, jd, qq, h5
 * @example
 * ```tsx
 * import { Component } from 'react'
 * import { CustomWrapper, View, Text } from '@tarojs/components'
 *
 * export default class C extends Component {
 *   render () {
 *     return (
 *       <View>
 *         <CustomWrapper>
 *            <Text>Hello, world!</Text>
 *         </CustomWrapper>
 *       </View>
 *     )
 *   }
 * }
 * ```
 */
declare const CustomWrapper: ComponentType<CustomWrapperProps>

export { CustomWrapper, CustomWrapperProps }
